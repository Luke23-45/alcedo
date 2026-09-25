import { Injectable, Logger, Optional } from '@nestjs/common';
import { AiConfigService } from './ai-config.service';

/** What the client sends with each turn. */
export interface LiteLlmMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/** Token usage as reported by the upstream — cost is only ever read, never invented. */
export interface LiteLlmUsage {
  promptTokens?: number;
  completionTokens?: number;
  /** Parsed from the upstream `x-litellm-cost` response header; null when absent. */
  costUsd?: number | null;
}

export interface ChatResult {
  content: string;
  /** Tool calls the model made (non-streaming only); arguments arrive as raw JSON text. */
  toolCalls: ChatToolCall[];
  usage: LiteLlmUsage;
  model?: string;
}

/** One model tool call in a non-streaming response. */
export interface ChatToolCall {
  id: string;
  name: string;
  arguments: string;
}

/** OpenAI-compatible tool definition, as served to the model via LiteLLM. */
export interface LiteLlmTool {
  type: 'function';
  function: {
    name: string;
    description?: string;
    parameters?: unknown;
  };
}

/** One streamed tool-call delta: the start carries id/name, later chunks carry argument text. */
export interface ToolCallDelta {
  index: number;
  id?: string;
  name?: string;
  argumentsDelta?: string;
}

/** Yielded by streamChat: text deltas, tool-call deltas, then one final usage payload. */
export interface StreamYield {
  content?: string;
  toolCall?: ToolCallDelta;
  usage?: LiteLlmUsage;
}

export interface ChatCallOptions {
  /** Caller abort (e.g. client disconnect) — aborts the upstream request. */
  signal?: AbortSignal;
  temperature?: number;
  maxTokens?: number;
  /** Tools the model may call; when present the request uses tool_choice auto unless overridden. */
  tools?: LiteLlmTool[];
  toolChoice?: 'auto' | 'none';
}

/** Transport/upstream failure. Callers map this to a coded API error. */
export class LiteLLMError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = 'LiteLLMError';
  }
}

const MAX_RETRIES = 3;
const BACKOFF_BASE_MS = 500;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Parses the upstream cost header; null when missing or unparseable — never invented. */
function parseCostHeader(header: string | null): number | null {
  if (!header) return null;
  const n = Number(header);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/**
 * Thin client over the self-hosted LiteLLM proxy (OpenAI-compatible).
 * The backend always calls the stable alias (default "coach-primary")
 * configured in litellm.yaml — providers switch there, never in the app.
 *
 * Admin overrides: the website admin panel can set the LiteLLM base URL,
 * API key, and model alias in the database. This client checks those
 * overrides (cached for 60s) on every request and falls back to the
 * constructor env values when unset.
 *
 * Resilience policy: every request races LITELLM_TIMEOUT_MS via an internal
 * AbortController that also forwards the caller's signal. Failed requests
 * retry with exponential backoff (500ms x2, up to 3 retries) ONLY on 429
 * and 5xx — 4xx is a client error and is never retried.
 */
@Injectable()
export class LiteLLMClient {
  private readonly logger = new Logger(LiteLLMClient.name);
  private cachedConfig: { apiKey: string | undefined; baseUrl: string; modelAlias: string } | null =
    null;
  private cachedAt = 0;
  private static readonly CONFIG_TTL_MS = 60_000;

  constructor(
    private readonly baseUrl: string,
    private readonly apiKey: string | undefined,
    private readonly modelAlias: string,
    private readonly timeoutMs = 60000,
    @Optional() private readonly aiConfig?: AiConfigService,
  ) {}

  /**
   * Effective connection config: admin DB overrides win, env values are the
   * fallback. Cached for 60s so config reads don't hit Mongo on every token.
   */
  private async effectiveConfig(): Promise<{
    apiKey: string | undefined;
    baseUrl: string;
    modelAlias: string;
  }> {
    const now = Date.now();
    if (this.cachedConfig && now - this.cachedAt < LiteLLMClient.CONFIG_TTL_MS) {
      return this.cachedConfig;
    }
    let baseUrl = this.baseUrl;
    let apiKey = this.apiKey;
    let modelAlias = this.modelAlias;
    if (this.aiConfig) {
      const [overrideUrl, overrideKey, overrideModel] = await Promise.all([
        this.aiConfig.getLiteLlmBaseUrl().catch(() => null),
        this.aiConfig.getLiteLlmApiKey().catch(() => null),
        this.aiConfig.getModelAlias().catch(() => null),
      ]);
      if (overrideUrl) baseUrl = overrideUrl;
      if (overrideKey) apiKey = overrideKey;
      if (overrideModel) modelAlias = overrideModel;
    }
    this.cachedConfig = { apiKey, baseUrl, modelAlias };
    this.cachedAt = now;
    return this.cachedConfig;
  }

  private headers(
    apiKey: string | undefined,
    extra: Record<string, string> = {},
  ): Record<string, string> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json', ...extra };
    if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
    return headers;
  }

  /** Single place where request bodies are built — chat() and streamChat() share it. */
  private buildBody(
    modelAlias: string,
    messages: LiteLlmMessage[],
    stream: boolean,
    opts: ChatCallOptions = {},
  ): string {
    return JSON.stringify({
      max_tokens: opts.maxTokens ?? 1024,
      messages,
      model: modelAlias,
      stream,
      temperature: opts.temperature ?? 0.7,
      ...(opts.tools && opts.tools.length > 0
        ? { tool_choice: opts.toolChoice ?? 'auto', tools: opts.tools }
        : {}),
    });
  }

  /**
   * Races the request against LITELLM_TIMEOUT_MS and the caller's signal.
   * Caller aborts propagate as the caller's own reason; timeouts and network
   * failures surface as LiteLLMError so the service can map them to 502.
   */
  private async fetchWithTimeout(
    url: string,
    init: RequestInit,
    signal?: AbortSignal,
  ): Promise<Response> {
    signal?.throwIfAborted();
    const ctrl = new AbortController();
    const timer = setTimeout(() => {
      ctrl.abort(new DOMException(`LiteLLM request timed out after ${this.timeoutMs}ms`, 'TimeoutError'));
    }, this.timeoutMs);
    const forwardAbort = (): void => ctrl.abort(signal?.reason);
    signal?.addEventListener('abort', forwardAbort, { once: true });
    try {
      return await fetch(url, { ...init, signal: ctrl.signal });
    } catch (err) {
      if (signal?.aborted) throw signal.reason instanceof Error ? signal.reason : err;
      if (err instanceof LiteLLMError) throw err;
      throw new LiteLLMError(`LiteLLM request failed: ${(err as Error)?.message ?? String(err)}`);
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener('abort', forwardAbort);
    }
  }

  private async post(
    path: string,
    body: string,
    opts: ChatCallOptions & { sse?: boolean },
  ): Promise<Response> {
    const { apiKey, baseUrl } = await this.effectiveConfig();
    const url = `${baseUrl}${path}`;
    const headers = this.headers(apiKey, opts.sse ? { Accept: 'text/event-stream' } : {});
    for (let attempt = 0; ; attempt++) {
      opts.signal?.throwIfAborted();
      const res = await this.fetchWithTimeout(
        url,
        { body, headers, method: 'POST' },
        opts.signal,
      );
      if (res.ok) return res;
      const retryable = res.status === 429 || res.status >= 500;
      if (!retryable || attempt >= MAX_RETRIES) {
        const detail = await res.text().catch(() => '');
        throw new LiteLLMError(
          `LiteLLM ${path} failed with ${res.status}${detail ? `: ${detail.slice(0, 300)}` : ''}`,
          res.status,
        );
      }
      const backoff = BACKOFF_BASE_MS * 2 ** attempt;
      this.logger.debug(`LiteLLM ${path} -> ${res.status}; retry ${attempt + 1}/${MAX_RETRIES} in ${backoff}ms`);
      await sleep(backoff);
    }
  }

  async chat(messages: LiteLlmMessage[], opts: ChatCallOptions = {}): Promise<ChatResult> {
    const { modelAlias } = await this.effectiveConfig();
    const res = await this.post(
      '/v1/chat/completions',
      this.buildBody(modelAlias, messages, false, opts),
      opts,
    );
    const json = (await res.json()) as {
      choices?: Array<{
        message?: {
          content?: string | null;
          tool_calls?: Array<{
            id?: string;
            function?: { name?: string; arguments?: string };
            type?: string;
          }>;
        };
      }>;
      model?: string;
      usage?: { completion_tokens?: number; prompt_tokens?: number };
    };
    const message = json.choices?.[0]?.message;
    const toolCalls: ChatToolCall[] = (message?.tool_calls ?? [])
      .filter((tc) => typeof tc.function?.name === 'string')
      .map((tc) => ({
        arguments: typeof tc.function?.arguments === 'string' ? tc.function.arguments : '',
        id: typeof tc.id === 'string' ? tc.id : '',
        name: tc.function!.name as string,
      }));
    return {
      content: message?.content ?? '',
      model: json.model,
      toolCalls,
      usage: {
        completionTokens: json.usage?.completion_tokens,
        costUsd: parseCostHeader(res.headers.get('x-litellm-cost')),
        promptTokens: json.usage?.prompt_tokens,
      },
    };
  }

  /**
   * Streams the completion as Server-Sent Events. Lines are split on '\n';
   * only `data: ` lines are parsed, `data: [DONE]` ends the stream, and
   * malformed lines are skipped (and counted) without killing the stream.
   * Emits content deltas and tool-call deltas, then one final usage payload.
   */
  async *streamChat(
    messages: LiteLlmMessage[],
    opts: ChatCallOptions = {},
  ): AsyncGenerator<StreamYield> {
    const { modelAlias } = await this.effectiveConfig();
    const res = await this.post(
      '/v1/chat/completions',
      this.buildBody(modelAlias, messages, true, opts),
      { ...opts, sse: true },
    );
    if (!res.body) throw new LiteLLMError('LiteLLM stream response had no body');
    const usage: LiteLlmUsage = { costUsd: parseCostHeader(res.headers.get('x-litellm-cost')) };
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let malformed = 0;
    try {
      outer: for (;;) {
        opts.signal?.throwIfAborted();
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const payload = trimmed.slice('data:'.length).trim();
          if (payload === '[DONE]') break outer;
          let json: {
            choices?: Array<{
              delta?: {
                content?: string | null;
                tool_calls?: Array<{
                  id?: string;
                  index?: number;
                  function?: { name?: string; arguments?: string };
                }>;
              };
            }>;
            usage?: { completion_tokens?: number; prompt_tokens?: number };
          };
          try {
            json = JSON.parse(payload) as typeof json;
          } catch {
            malformed += 1;
            continue;
          }
          const delta = json.choices?.[0]?.delta;
          const text = delta?.content;
          if (typeof text === 'string' && text.length > 0) yield { content: text };
          for (const tc of delta?.tool_calls ?? []) {
            const index = typeof tc.index === 'number' ? tc.index : 0;
            const toolCall: ToolCallDelta = { index };
            if (typeof tc.id === 'string') toolCall.id = tc.id;
            if (typeof tc.function?.name === 'string') toolCall.name = tc.function.name;
            if (typeof tc.function?.arguments === 'string' && tc.function.arguments.length > 0) {
              toolCall.argumentsDelta = tc.function.arguments;
            }
            // Skip chunks that carry nothing (some proxies emit empty tool_calls entries).
            if (toolCall.id !== undefined || toolCall.name !== undefined || toolCall.argumentsDelta !== undefined) {
              yield { toolCall };
            }
          }
          const u = json.usage;
          if (u) {
            if (typeof u.prompt_tokens === 'number') usage.promptTokens = u.prompt_tokens;
            if (typeof u.completion_tokens === 'number') usage.completionTokens = u.completion_tokens;
          }
        }
      }
      if (malformed > 0) this.logger.debug(`Skipped ${malformed} malformed SSE line(s)`);
    } finally {
      try {
        await reader.cancel();
      } catch {
        // Stream already closed — nothing to cancel.
      }
      reader.releaseLock();
    }
    yield { usage };
  }

  /** OpenAI-compatible moderation endpoint. Transport failures reject. */
  async moderate(
    text: string,
    opts: ChatCallOptions = {},
  ): Promise<{ flagged: boolean; categories: string[] }> {
    const res = await this.post('/v1/moderations', JSON.stringify({ input: text }), opts);
    const json = (await res.json()) as {
      results?: Array<{ categories?: Record<string, boolean>; flagged?: boolean }>;
    };
    const result = json.results?.[0];
    const categories = Object.entries(result?.categories ?? {})
      .filter(([, v]) => v === true)
      .map(([k]) => k);
    return { categories, flagged: result?.flagged === true };
  }
}

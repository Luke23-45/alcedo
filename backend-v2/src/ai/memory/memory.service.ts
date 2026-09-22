import { Injectable, Logger, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiConfigService } from '../ai-config.service';
import { MemoryMessage, MemoryService } from './memory.interface';

const DEFAULT_MEM0_URL = 'https://api.mem0.ai/v1';
const RECALL_LIMIT = 5;

/**
 * Real Mem0 adapter over plain REST (Node 24 global fetch — no SDK
 * dependency). All network failures degrade gracefully: remember() resolves
 * silently and recall() returns [], so a Mem0 outage never breaks the chat.
 * Without MEM0_API_KEY the service logs a warning once and every call is a
 * no-op. There is deliberately no in-memory fake — a fake memory would let
 * callers believe facts persist when they do not.
 */
@Injectable()
export class Mem0MemoryService extends MemoryService {
  private readonly logger = new Logger(Mem0MemoryService.name);
  private readonly apiKey: string | undefined;
  private readonly envBaseUrl: string;
  private readonly timeoutMs: number;
  private cachedApiKey: string | undefined | null = null;
  private cachedBaseUrl: string | null = null;
  private cachedAt = 0;
  private static readonly KEY_TTL_MS = 60_000;

  constructor(
    private readonly config: ConfigService,
    @Optional() private readonly aiConfig?: AiConfigService,
  ) {
    super();
    this.apiKey = config.get<string>('MEM0_API_KEY');
    this.envBaseUrl = config.get<string>('MEM0_URL') ?? DEFAULT_MEM0_URL;
    this.timeoutMs = config.get<number>('MEM0_TIMEOUT_MS', 10000);
    if (!this.apiKey) {
      this.logger.warn(
        'MEM0_API_KEY is not set — long-term memory is disabled (recall returns [], remember is a no-op).',
      );
    }
  }

  /**
   * Effective Mem0 API key: admin DB override wins, env value is the
   * fallback. Cached for 60s so config reads don't hit Mongo on every call.
   */
  private async effectiveApiKey(): Promise<string | undefined> {
    const now = Date.now();
    if (this.cachedApiKey !== null && now - this.cachedAt < Mem0MemoryService.KEY_TTL_MS) {
      return this.cachedApiKey;
    }
    let key = this.apiKey;
    if (this.aiConfig) {
      const override = await this.aiConfig.getMem0ApiKey().catch(() => null);
      if (override) key = override;
    }
    this.cachedApiKey = key;
    this.cachedAt = now;
    return key;
  }

  /**
   * Effective Mem0 base URL: admin DB override wins, env value is the
   * fallback. Cached alongside the API key.
   */
  private async effectiveBaseUrl(): Promise<string> {
    const now = Date.now();
    if (this.cachedBaseUrl !== null && now - this.cachedAt < Mem0MemoryService.KEY_TTL_MS) {
      return this.cachedBaseUrl;
    }
    let url = this.envBaseUrl;
    if (this.aiConfig) {
      const override = await this.aiConfig.getMem0BaseUrl().catch(() => null);
      if (override) url = override;
    }
    this.cachedBaseUrl = url;
    this.cachedAt = now;
    return url;
  }

  async remember(userId: string, messages: MemoryMessage[]): Promise<void> {
    const apiKey = await this.effectiveApiKey();
    if (!apiKey || messages.length === 0) return;
    try {
      const baseUrl = await this.effectiveBaseUrl();
      const res = await this.fetchWithTimeout(`${baseUrl}/memories/`, {
        body: JSON.stringify({ messages, user_id: userId, version: 'v2' }),
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
      if (!res.ok) this.logger.warn(`Mem0 remember failed: HTTP ${res.status}`);
    } catch (err) {
      this.logger.warn(`Mem0 remember failed: ${(err as Error)?.message ?? err}`);
    }
  }

  async recall(userId: string, query: string): Promise<string[]> {
    const apiKey = await this.effectiveApiKey();
    if (!apiKey) return [];
    try {
      const baseUrl = await this.effectiveBaseUrl();
      const url =
        `${baseUrl}/memories/` +
        `?user_id=${encodeURIComponent(userId)}` +
        `&query=${encodeURIComponent(query)}` +
        `&limit=${RECALL_LIMIT}`;
      const res = await this.fetchWithTimeout(url, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (!res.ok) {
        this.logger.warn(`Mem0 recall failed: HTTP ${res.status}`);
        return [];
      }
      const json = (await res.json()) as { results?: Array<{ memory?: unknown }> };
      const results = Array.isArray(json.results) ? json.results : [];
      return results
        .map((r) => r.memory)
        .filter((m): m is string => typeof m === 'string' && m.length > 0);
    } catch (err) {
      this.logger.warn(`Mem0 recall failed: ${(err as Error)?.message ?? err}`);
      return [];
    }
  }

  private async fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), this.timeoutMs);
    try {
      return await fetch(url, { ...init, signal: ctrl.signal });
    } finally {
      clearTimeout(timer);
    }
  }
}

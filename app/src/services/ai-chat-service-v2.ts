import type { AiChatResponseV2 } from '@/models/ai-models';
import { aiPlanFromJSON } from '@/models/ai-models';
import { aiPlanMigrations } from '@/models/storage/versions/migrations';
import { authenticatedFetch } from '@/services/authenticated-fetch';
import { AuthError } from '@/services/auth-service';
import { isGreeting, offlineCoachScript } from '@/services/ai-chat-offline-script';

/** v2 `PostMessageDto` rejects content longer than this — trim before sending. */
const MAX_MESSAGE_LENGTH = 4000;

const SIGNED_OUT_MESSAGE = 'You\u2019re signed out \u2014 sign in to chat with your Alcedo coach.';
const OFFLINE_MESSAGE = 'I can\u2019t reach the coach right now. Check your connection and try again.';
const FALLBACK_MESSAGE = 'Something went wrong reaching the coach. Try again in a moment.';

interface SseEvent {
  event: string;
  data: unknown;
}

/** A non-2xx from the coach API, carrying the server's coded error when present. */
class CoachHttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: string | undefined,
    readonly serverMessage: string | undefined,
  ) {
    super(serverMessage ?? `Coach request failed with status ${status}.`);
    this.name = 'CoachHttpError';
  }
}

/**
 * AI chat service for backend-v2's REST + SSE conversations API
 * (`POST /api/ai/conversations/:id/messages/stream`).
 *
 * This replaces the old SignalR hub transport: no persistent connection, no
 * hub negotiation — each message is a plain HTTPS request, and the reply
 * streams back as Server-Sent Events. The public interface is unchanged, so
 * the chat UI and store effects are untouched.
 *
 * Auth, entitlement and quota are the server's job: the service sends the
 * user's v2 access token (via {@link authenticatedFetch}) and surfaces what
 * the server decides — 402 becomes the Pro upsell, 429/400 become the
 * server's message. There is no client-side pro gate to drift out of sync.
 */
export class AiChatServiceV2 {
  /** The v2 conversation backing this chat; created lazily, dropped on restart. */
  private conversationId: string | undefined;
  /** Aborts the in-flight SSE stream when the user stops generation. */
  private streamAborter: AbortController | undefined;

  async *introduce(): AsyncIterableIterator<AiChatResponseV2> {
    yield {
      type: 'messageResponse',
      message: "Hey \u2014 I'm your Alcedo coach. Ask me about training, programming, nutrition, or recovery.",
    };
  }

  async *sendMessage(message: string): AsyncIterableIterator<AiChatResponseV2> {
    try {
      yield* this.streamFromServer(message);
    } catch (e) {
      if (e instanceof AuthError && (e.code === 'session-expired' || e.code === 'network')) {
        // A greeting the coach can't answer gets the deterministic local
        // script; anything else gets the honest one-liner.
        if (isGreeting(message)) {
          yield* offlineCoachScript(e.code);
          return;
        }
        yield {
          type: 'messageResponse',
          message: e.code === 'session-expired' ? SIGNED_OUT_MESSAGE : OFFLINE_MESSAGE,
        };
        return;
      }
      if (e instanceof CoachHttpError) {
        // The server gates live streaming behind Premium when configured so.
        if (e.status === 402) {
          yield { type: 'purchasePro' };
          return;
        }
        yield { type: 'messageResponse', message: e.serverMessage ?? FALLBACK_MESSAGE };
        return;
      }
      yield { type: 'messageResponse', message: FALLBACK_MESSAGE };
    }
  }

  async stopInProgress(): Promise<void> {
    this.streamAborter?.abort();
    this.streamAborter = undefined;
  }

  async restartChat(): Promise<void> {
    await this.stopInProgress();
    // The next message opens a fresh server-side conversation, mirroring the
    // old hub's RestartChat. The local transcript is cleared by the store.
    this.conversationId = undefined;
  }

  private async *streamFromServer(message: string, retried = false): AsyncIterableIterator<AiChatResponseV2> {
    const conversationId = await this.ensureConversation();
    const aborter = new AbortController();
    this.streamAborter = aborter;
    let response: Response;
    try {
      response = await authenticatedFetch(`/ai/conversations/${conversationId}/messages/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: message.slice(0, MAX_MESSAGE_LENGTH),
          // Lets the server tell us to update instead of sending plans this
          // app version cannot render.
          clientAiPlanVersion: aiPlanMigrations.latestVersion,
        }),
        signal: aborter.signal,
      });
    } catch (e) {
      if (this.streamAborter === aborter) {
        this.streamAborter = undefined;
      }
      throw e;
    }
    if (!response.ok) {
      if (this.streamAborter === aborter) {
        this.streamAborter = undefined;
      }
      const error = await toCoachHttpError(response);
      if (error.status === 404 && error.code === 'AI_CONVERSATION_NOT_FOUND' && !retried) {
        // The conversation died server-side (or belongs to another signed-in
        // user) — start fresh once and replay the message.
        this.conversationId = undefined;
        yield* this.streamFromServer(message, true);
        return;
      }
      throw error;
    }
    try {
      let text = '';
      let sawEvent = false;
      for await (const event of readSseEvents(response)) {
        sawEvent = true;
        if (event.event === 'token') {
          const rawDelta = (event.data as { delta?: unknown }).delta;
          const delta = typeof rawDelta === 'string' ? rawDelta : '';
          text += delta;
          // Each yield carries the full text so far: the store replaces the
          // in-flight bubble with the latest payload.
          yield { type: 'messageResponse', message: text };
        } else if (event.event === 'plan') {
          // Plans stream progressively — each event refines the last; the
          // store replaces the in-flight bubble with the latest plan.
          const plan = toAiPlan(event.data);
          if (plan) {
            yield { type: 'chatPlan', plan };
          }
        } else if (event.event === 'updateRequired') {
          const requiredVersion =
            typeof event.data === 'object' && event.data !== null
              ? (event.data as { requiredVersion?: unknown }).requiredVersion
              : undefined;
          if (typeof requiredVersion === 'number') {
            yield { type: 'updateRequired', requiredVersion };
          }
          return;
        } else if (event.event === 'error') {
          const serverMessage =
            typeof event.data === 'object' && event.data !== null
              ? (event.data as { message?: unknown }).message
              : undefined;
          yield {
            type: 'messageResponse',
            message: typeof serverMessage === 'string' && serverMessage ? serverMessage : FALLBACK_MESSAGE,
          };
          return;
        } else if (event.event === 'done') {
          return;
        }
        // 'start' and unknown events carry no displayable content.
      }
      if (!sawEvent) {
        yield { type: 'messageResponse', message: 'The coach went quiet. Try again in a moment.' };
      }
    } catch (e) {
      // The user stopped generation — end quietly, not with an error bubble.
      if (aborter.signal.aborted) {
        return;
      }
      throw e;
    } finally {
      if (this.streamAborter === aborter) {
        this.streamAborter = undefined;
      }
    }
  }

  private async ensureConversation(): Promise<string> {
    if (this.conversationId) {
      return this.conversationId;
    }
    const response = await authenticatedFetch('/ai/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    });
    if (!response.ok) {
      throw await toCoachHttpError(response);
    }
    const created = (await response.json().catch(() => undefined)) as { id?: unknown } | undefined;
    if (!created || typeof created.id !== 'string' || !created.id) {
      throw new Error('Coach conversation creation returned no id.');
    }
    this.conversationId = created.id;
    return created.id;
  }
}

async function toCoachHttpError(response: Response): Promise<CoachHttpError> {
  const body = (await response.json().catch(() => undefined)) as
    | { error?: { code?: unknown; message?: unknown } }
    | undefined;
  const code = typeof body?.error?.code === 'string' ? body.error.code : undefined;
  const serverMessage = typeof body?.error?.message === 'string' ? body.error.message : undefined;
  return new CoachHttpError(response.status, code, serverMessage);
}

/**
 * Converts an SSE `plan` event payload into a ProgramBlueprint. Returns
 * undefined for malformed payloads instead of throwing — a bad plan frame
 * must not kill the text reply streaming alongside it.
 */
function toAiPlan(data: unknown): ReturnType<typeof aiPlanFromJSON> | undefined {
  if (typeof data !== 'object' || data === null || !('version' in data)) {
    return undefined;
  }
  try {
    return aiPlanFromJSON(data as Parameters<typeof aiPlanFromJSON>[0]);
  } catch {
    return undefined;
  }
}

/**
 * Reads SSE frames from a fetch response. Prefers incremental streaming via
 * the body reader; when the runtime has no streaming body (some React Native
 * fetch implementations buffer the whole response), falls back to parsing the
 * buffered text — the events are identical, the reply just appears at once
 * instead of token by token.
 */
async function* readSseEvents(response: Response): AsyncGenerator<SseEvent> {
  const body = response.body;
  if (!body || typeof body.getReader !== 'function') {
    yield* parseSseEvents(await response.text());
    return;
  }
  const reader: ReadableStreamDefaultReader<Uint8Array> = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      buffer += decoder.decode(value, { stream: true });
      const extracted = extractSseEvents(buffer);
      buffer = extracted.rest;
      yield* extracted.events;
    }
    buffer += decoder.decode();
    yield* parseSseEvents(buffer);
  } finally {
    reader.releaseLock();
  }
}

/** Splits complete `event:`/`data:` frames off the buffer, keeping the tail. */
function extractSseEvents(buffer: string): { events: SseEvent[]; rest: string } {
  const events: SseEvent[] = [];
  const parts = buffer.split(/\r?\n\r?\n/);
  const rest = parts.pop() ?? '';
  for (const part of parts) {
    let event = 'message';
    const dataLines: string[] = [];
    for (const line of part.split(/\r?\n/)) {
      if (line.startsWith('event:')) {
        event = line.slice('event:'.length).trim();
      } else if (line.startsWith('data:')) {
        // The spec strips a single leading space after the colon.
        dataLines.push(line.slice('data:'.length).replace(/^ /, ''));
      }
    }
    const raw = dataLines.join('\n');
    let data: unknown = raw;
    try {
      data = JSON.parse(raw);
    } catch {
      // Non-JSON payloads pass through as raw text.
    }
    events.push({ event, data });
  }
  return { events, rest };
}

function* parseSseEvents(text: string): Generator<SseEvent> {
  yield* extractSseEvents(text).events;
}

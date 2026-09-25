import type { AiChatResponseV2 } from '@/models/ai-models';
import { aiPlanMigrations } from '@/models/storage/versions/migrations';
import { AiChatServiceV2 } from '@/services/ai-chat-service-v2';
import { authenticatedFetch } from '@/services/authenticated-fetch';
import { AuthError } from '@/services/auth-service';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/services/authenticated-fetch', () => ({ authenticatedFetch: vi.fn() }));
// auth-service is only imported for AuthError, but its top-level imports need
// native-module stand-ins under vitest.
vi.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: { configure: vi.fn(), hasPlayServices: vi.fn(), signIn: vi.fn(), signOut: vi.fn() },
  statusCodes: {},
}));
vi.mock('expo-secure-store', () => ({
  getItemAsync: vi.fn(async () => null),
  setItemAsync: vi.fn(async () => {}),
  deleteItemAsync: vi.fn(async () => {}),
}));
vi.mock('@/services/auth-config', () => ({
  googleAuthConfig: {},
  isGoogleAuthConfigured: () => false,
}));
vi.mock('@/services/api-consts', () => ({
  alcedoApiBaseUrl: 'https://backend-v2.test/api',
}));

const fetchMock = vi.mocked(authenticatedFetch);

function sseBody(frames: Array<{ event: string; data: unknown }>): string {
  return frames.map((f) => `event: ${f.event}\ndata: ${JSON.stringify(f.data)}\n\n`).join('');
}

const okJson = (value: unknown) =>
  new Response(JSON.stringify(value), { status: 200, headers: { 'Content-Type': 'application/json' } });
const okSse = (frames: Array<{ event: string; data: unknown }>) => new Response(sseBody(frames), { status: 200 });
const errJson = (status: number, code: string, message: string) =>
  new Response(JSON.stringify({ error: { code, message } }), { status });

function mockConversation(id: string): void {
  fetchMock.mockResolvedValueOnce(okJson({ id }));
}

function mockStream(frames: Array<{ event: string; data: unknown }>): void {
  fetchMock.mockResolvedValueOnce(okSse(frames));
}

async function drain(service: AiChatServiceV2, message: string): Promise<AiChatResponseV2[]> {
  const out: AiChatResponseV2[] = [];
  for await (const response of service.sendMessage(message)) {
    out.push(response);
  }
  return out;
}

const messages = (responses: AiChatResponseV2[]): string[] =>
  responses.filter((r) => r.type === 'messageResponse').map((r) => (r as { message: string }).message);

let service: AiChatServiceV2;

beforeEach(() => {
  fetchMock.mockReset();
  service = new AiChatServiceV2();
});

describe('AiChatServiceV2', () => {
  it('greets locally on introduce without touching the network', async () => {
    const out: AiChatResponseV2[] = [];
    for await (const response of service.introduce()) {
      out.push(response);
    }

    expect(out).toHaveLength(1);
    expect(out[0]?.type).toBe('messageResponse');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('creates one conversation and streams tokens as accumulating messages', async () => {
    mockConversation('conv-1');
    mockStream([
      { event: 'start', data: { conversationId: 'conv-1', messageId: 'm-1' } },
      { event: 'token', data: { delta: 'Hello' } },
      { event: 'token', data: { delta: ' there' } },
      { event: 'done', data: { replyMessageId: 'r-1' } },
    ]);

    const out = await drain(service, 'how do I squat?');

    expect(messages(out)).toEqual(['Hello', 'Hello there']);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const [createPath] = fetchMock.mock.calls[0] ?? [];
    expect(createPath).toBe('/ai/conversations');
    const [streamPath, streamInit] = fetchMock.mock.calls[1] ?? [];
    expect(streamPath).toBe('/ai/conversations/conv-1/messages/stream');
    expect(streamInit?.method).toBe('POST');
    expect((streamInit?.headers as Record<string, string> | undefined)?.['Content-Type']).toBe('application/json');
    expect(JSON.parse((streamInit?.body as string) ?? '')).toEqual({
      clientAiPlanVersion: aiPlanMigrations.latestVersion,
      content: 'how do I squat?',
    });
  });

  it('reuses the conversation across messages', async () => {
    mockConversation('conv-1');
    mockStream([{ event: 'done', data: {} }]);
    mockStream([{ event: 'done', data: {} }]);

    await drain(service, 'one');
    await drain(service, 'two');

    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls.filter((c) => c[0] === '/ai/conversations')).toHaveLength(1);
  });

  it('opens a fresh conversation after restartChat', async () => {
    mockConversation('conv-1');
    mockStream([{ event: 'done', data: {} }]);
    mockConversation('conv-2');
    mockStream([{ event: 'done', data: {} }]);

    await drain(service, 'one');
    await service.restartChat();
    await drain(service, 'two');

    const creates = fetchMock.mock.calls.filter((c) => c[0] === '/ai/conversations');
    expect(creates).toHaveLength(2);
    expect(fetchMock.mock.calls[3]?.[0]).toBe('/ai/conversations/conv-2/messages/stream');
  });

  it('recreates the conversation once when the server reports it gone', async () => {
    mockConversation('conv-1');
    fetchMock.mockResolvedValueOnce(errJson(404, 'AI_CONVERSATION_NOT_FOUND', 'Conversation not found.'));
    mockConversation('conv-2');
    mockStream([
      { event: 'token', data: { delta: 'fresh start' } },
      { event: 'done', data: {} },
    ]);

    const out = await drain(service, 'hello again');

    expect(messages(out)).toEqual(['fresh start']);
    expect(fetchMock.mock.calls[3]?.[0]).toBe('/ai/conversations/conv-2/messages/stream');
  });

  it('yields purchasePro when the server gates streaming behind Premium', async () => {
    mockConversation('conv-1');
    fetchMock.mockResolvedValueOnce(errJson(402, 'AI_STREAM_PREMIUM_ONLY', 'Streaming is Premium.'));

    expect(await drain(service, 'coach me')).toEqual([{ type: 'purchasePro' }]);
  });

  it('surfaces the server message on quota and moderation failures', async () => {
    mockConversation('conv-1');
    fetchMock.mockResolvedValueOnce(errJson(429, 'AI_QUOTA_EXCEEDED', 'Daily AI limit reached.'));

    expect(messages(await drain(service, 'coach me'))).toEqual(['Daily AI limit reached.']);
  });

  it('surfaces in-stream error events as messages', async () => {
    mockConversation('conv-1');
    mockStream([
      { event: 'token', data: { delta: 'partial' } },
      { event: 'error', data: { code: 'AI_MODEL_UNAVAILABLE', message: 'The AI coach is temporarily unavailable.' } },
    ]);

    expect(messages(await drain(service, 'coach me'))).toEqual(['partial', 'The AI coach is temporarily unavailable.']);
  });

  it('falls back to a generic message when the error body is not JSON', async () => {
    mockConversation('conv-1');
    fetchMock.mockResolvedValueOnce(new Response('<html>bad gateway</html>', { status: 502 }));

    expect(messages(await drain(service, 'coach me'))).toEqual([
      'Something went wrong reaching the coach. Try again in a moment.',
    ]);
  });

  it('answers a greeting locally when signed out', async () => {
    fetchMock.mockRejectedValueOnce(new AuthError('session-expired', 'No signed-in session.'));

    const out = await drain(service, 'hi');

    expect(out).toHaveLength(2);
    expect(out[0]).toEqual({ type: 'messageResponse', message: 'Hey — good to see you.' });
    expect(out[1]).toMatchObject({ type: 'messageResponse', appendAsNew: true });
    expect(String((out[1] as { message: string }).message)).toContain('signed out');
  });

  it('tells non-greetings to sign in when the session expired', async () => {
    fetchMock.mockRejectedValueOnce(new AuthError('session-expired', 'No signed-in session.'));

    expect(messages(await drain(service, 'build me a plan'))).toEqual([
      'You’re signed out — sign in to chat with your Alcedo coach.',
    ]);
  });

  it('reports unreachability for non-greetings when offline', async () => {
    fetchMock.mockRejectedValueOnce(new AuthError('network', 'Unreachable.'));

    expect(messages(await drain(service, 'build me a plan'))).toEqual([
      'I can’t reach the coach right now. Check your connection and try again.',
    ]);
  });

  it('trims messages to the server limit before sending', async () => {
    mockConversation('conv-1');
    mockStream([{ event: 'done', data: {} }]);

    await drain(service, 'x'.repeat(5000));

    const body = JSON.parse(fetchMock.mock.calls[1]?.[1]?.body as string) as { content: string };
    expect(body.content).toHaveLength(4000);
  });

  it('stopInProgress ends the stream silently', async () => {
    mockConversation('conv-1');
    // A hanging stream: read() never resolves until the request's signal aborts.
    fetchMock.mockImplementationOnce(
      (_path, init) =>
        new Promise<Response>((resolve) => {
          let rejectRead: ((reason: unknown) => void) | undefined;
          const abortError = () => rejectRead?.(new DOMException('Aborted', 'AbortError'));
          const reader = {
            read: () =>
              new Promise<{ done: boolean; value?: Uint8Array }>((_, reject) => {
                if (init?.signal?.aborted) {
                  reject(new DOMException('Aborted', 'AbortError'));
                } else {
                  rejectRead = reject;
                }
              }),
            releaseLock: () => {},
          };
          init?.signal?.addEventListener('abort', abortError);
          resolve({ ok: true, status: 200, body: { getReader: () => reader } } as unknown as Response);
        }),
    );

    const draining = drain(service, 'tell me a long story');
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    await service.stopInProgress();

    await expect(draining).resolves.toEqual([]);
  });

  it('yields chatPlan responses for plan events', async () => {
    mockConversation('conv-1');
    const planPayload = {
      type: 'chatPlan',
      name: 'Push Day',
      description: 'Chest focus',
      version: 3,
      blueprint: {},
    };
    mockStream([
      { event: 'token', data: { delta: 'On it —' } },
      { event: 'plan', data: planPayload },
      { event: 'done', data: { replyMessageId: 'r-1' } },
    ]);

    const out = await drain(service, 'make me a push day');

    expect(messages(out)).toEqual(['On it —']);
    const plans = out.filter((r) => r.type === 'chatPlan');
    expect(plans).toHaveLength(1);
    const plan = plans[0] as Extract<AiChatResponseV2, { type: 'chatPlan' }>;
    expect(plan.plan.name).toBe('Push Day');
    expect(plan.plan.description).toBe('Chest focus');
  });

  it('skips malformed plan payloads without killing the stream', async () => {
    mockConversation('conv-1');
    mockStream([
      { event: 'plan', data: { type: 'chatPlan', name: 'No version here' } },
      { event: 'token', data: { delta: 'still here' } },
      { event: 'done', data: { replyMessageId: 'r-1' } },
    ]);

    const out = await drain(service, 'make me a plan');

    expect(out.some((r) => r.type === 'chatPlan')).toBe(false);
    expect(messages(out)).toEqual(['still here']);
  });

  it('yields updateRequired when the server says the app is out of date', async () => {
    mockConversation('conv-1');
    mockStream([{ event: 'updateRequired', data: { requiredVersion: 99 } }]);

    const out = await drain(service, 'make me a plan');

    expect(out).toEqual([{ type: 'updateRequired', requiredVersion: 99 }]);
  });
});

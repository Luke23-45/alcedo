import type { AiChatResponseV2 } from '@/models/ai-models';
import { addMessage, aiPlannerReducer, type ChatMessage } from '@/store/ai-planner';
import { applyAiPlannerEffects } from '@/store/ai-planner/effects';
import { backendsReducer } from '@/store/backends';
import { createAddEffectTestBed } from '@/utils/__test__/add-effect-testbed';
import { combineReducers } from '@reduxjs/toolkit';
import { describe, expect, it, vi } from 'vitest';

async function* scriptedResponses(): AsyncIterableIterator<AiChatResponseV2> {
  yield { type: 'messageResponse', message: 'Hey — good to see you.' };
  yield {
    type: 'messageResponse',
    message: "That hello was from me locally, not the coach: I can't connect right now.",
    appendAsNew: true,
  };
}

function makeTestBed() {
  const sendMessage = vi.fn(() => scriptedResponses());
  const testBed = createAddEffectTestBed({
    reducer: combineReducers({ aiPlanner: aiPlannerReducer, backends: backendsReducer }),
    initialState: { aiPlanner: { isHydrated: true, plannerChat: [] } },
    services: { aiChatService: { sendMessage, restartChat: vi.fn(), introduce: vi.fn(() => []) }, db: {} },
  });
  applyAiPlannerEffects(testBed.addEffect);
  return testBed;
}

describe('offline greeting bubbles', () => {
  it('keeps the greeting, the local explanation, and the Pro CTA as separate messages', async () => {
    const testBed = makeTestBed();
    const userMessage: ChatMessage = {
      id: 'user-1',
      from: 'User',
      type: 'messageResponse',
      message: 'hi',
    };

    await testBed.dispatchHandled(addMessage(userMessage));

    const chat = testBed.getState().aiPlanner.plannerChat;
    // Newest first: the local explanation, then the greeting.
    const agentMessages = chat.filter((m) => m.from === 'Agent');
    expect(agentMessages).toHaveLength(2);
    expect(agentMessages[1]).toMatchObject({ type: 'messageResponse', message: 'Hey — good to see you.' });
    expect(agentMessages[0]).toMatchObject({ type: 'messageResponse' });
    expect((agentMessages[0] as { message: string }).message).toContain('locally');
    // Neither bubble is still a loading placeholder.
    for (const bubble of agentMessages) {
      expect(bubble.isLoading).toBe(false);
    }
  });

  it('streams remote responses into a single bubble', async () => {
    async function* streaming(): AsyncIterableIterator<AiChatResponseV2> {
      yield { type: 'messageResponse', message: 'On' };
      yield { type: 'messageResponse', message: 'On it' };
    }
    const testBed = createAddEffectTestBed({
      reducer: combineReducers({ aiPlanner: aiPlannerReducer, backends: backendsReducer }),
      initialState: { aiPlanner: { isHydrated: true, plannerChat: [] } },
      services: {
        aiChatService: { sendMessage: vi.fn(() => streaming()), restartChat: vi.fn(), introduce: vi.fn(() => []) },
        db: {},
      },
    });
    applyAiPlannerEffects(testBed.addEffect);

    await testBed.dispatchHandled(
      addMessage({ id: 'user-2', from: 'User', type: 'messageResponse', message: 'plan my week' }),
    );

    const agentMessages = testBed.getState().aiPlanner.plannerChat.filter((m) => m.from === 'Agent');
    expect(agentMessages).toHaveLength(1);
    expect(agentMessages[0]).toMatchObject({ type: 'messageResponse', message: 'On it', isLoading: false });
  });

  it('stops driving the UI when a newer send supersedes the stream', async () => {
    // The abandoned generator keeps yielding (local scripts never observe the
    // service abort); the listener must notice its own cancellation signal.
    let releaseSecond!: () => void;
    const secondEventGate = new Promise<void>((resolve) => {
      releaseSecond = resolve;
    });
    async function* gatedScript(): AsyncIterableIterator<AiChatResponseV2> {
      yield { type: 'messageResponse', message: 'stale one' };
      await secondEventGate;
      yield { type: 'messageResponse', message: 'stale two' };
    }
    const captured: Array<(action: unknown, api: unknown) => unknown> = [];
    const testBed = createAddEffectTestBed({
      reducer: combineReducers({ aiPlanner: aiPlannerReducer, backends: backendsReducer }),
      initialState: { aiPlanner: { isHydrated: true, plannerChat: [] } },
      services: {
        aiChatService: {
          sendMessage: vi.fn(() => gatedScript()),
          restartChat: vi.fn(),
          introduce: vi.fn(() => []),
        },
        db: {},
      },
    });
    applyAiPlannerEffects(((actionCreator: unknown, effect: unknown) => {
      if ((actionCreator as { type?: string }).type === addMessage.type) {
        captured.push(effect as (action: unknown, api: unknown) => unknown);
      }
      return testBed.addEffect(actionCreator as never, effect as never);
    }) as typeof testBed.addEffect);

    const controller = new AbortController();
    const userMessage: ChatMessage = {
      id: 'user-superseded',
      from: 'User',
      type: 'messageResponse',
      message: 'hi',
    };
    const run = captured[0]!(addMessage(userMessage), {
      dispatch: testBed.dispatch,
      getState: testBed.getState,
      extra: testBed.mockServices,
      signal: controller.signal,
      // Mirrors RTK semantics: cancelling others never aborts the caller's own
      // signal. The supersede is simulated below by aborting `controller`.
      cancelActiveListeners: () => undefined,
      onFail: () => undefined,
      throwIfCancelled: () => undefined,
    });

    // Let the first (stale) event land, then supersede before the second.
    await vi.waitFor(() => {
      const agentMessages = testBed.getState().aiPlanner.plannerChat.filter((m) => m.from === 'Agent');
      expect(agentMessages).toHaveLength(1);
      expect((agentMessages[0] as { message: string }).message).toBe('stale one');
    });
    controller.abort();
    releaseSecond();
    await run;

    const agentMessages = testBed.getState().aiPlanner.plannerChat.filter((m) => m.from === 'Agent');
    expect(agentMessages).toHaveLength(1);
    // The stale second event was never applied; the bubble was finalized.
    expect((agentMessages[0] as { message: string }).message).toBe('stale one');
    expect(agentMessages[0]!.isLoading).toBe(false);
  });
});

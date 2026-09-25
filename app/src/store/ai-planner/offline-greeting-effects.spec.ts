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
});

/**
 * Page 24/24 — AI planner chat simulation (`/settings/ai/planner-chat`).
 *
 * The route file owns the whole chat UI (inverted message list, keyboard-
 * aware composer, restart action). Online-only: every AI turn goes through
 * `aiChatService` (SignalR), and the service answers honestly when there is
 * no backend ("No backend is configured for the AI planner.") or no
 * connection ("Failed to connect to server…"). The transcript is in-memory
 * only — a cold start re-introduces via the server.
 *
 * A. Send gating: whitespace-only input never sends; the send button's
 *    disabled state matches the dispatch guard exactly; the async-effect
 *    window (user message stored, AI placeholder not yet added) blocks a
 *    double send.
 * B. Reducer: prepend order, restart clears, update/remove by id with
 *    unknown-id no-ops, loading selector.
 * C. Effects (listener test bed): initChat keeps an existing transcript /
 *    introduces on an empty chat; a user message grows an Agent placeholder
 *    that streams to a settled answer; Agent messages are ignored;
 *    stopAiGenerator reaches the service.
 * D. i18n completeness over the route file.
 */
import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { combineReducers } from '@reduxjs/toolkit';
import { canSendChatMessage, isChatOutOfDate, sanitizeChatInput } from '@/components/smart/planner-chat-logic';
import {
  addMessage,
  aiPlannerReducer,
  ChatMessage,
  initChat,
  removeMessage,
  restartChat,
  selectIsLoadingAiPlannerMessage,
  stopAiGenerator,
  updateMessage,
} from '@/store/ai-planner';
import { applyAiPlannerEffects } from '@/store/ai-planner/effects';
import { createAddEffectTestBed } from '@/utils/__test__/add-effect-testbed';

const SRC = resolve(__dirname, '..', '..', '..');
const SRC_ROOT = join(SRC, 'src');

const userMsg = (id: string, message = 'Plan my week'): ChatMessage => ({
  id,
  from: 'User',
  type: 'messageResponse',
  message,
});
const agentMsg = (id: string, message = 'Done', isLoading = false): ChatMessage => ({
  id,
  from: 'Agent',
  type: 'messageResponse',
  message,
  isLoading,
});

function makeTestBed(plannerChat: ChatMessage[] = []) {
  const testBed = createAddEffectTestBed({
    reducer: combineReducers({ aiPlanner: aiPlannerReducer }),
    initialState: { aiPlanner: { plannerChat } },
    services: {
      aiChatService: {
        restartChat: vi.fn(),
        stopInProgress: vi.fn(),
        introduce: vi.fn(() => stream({ type: 'messageResponse', message: 'Welcome back' })),
        sendMessage: vi.fn(() => stream({ type: 'messageResponse', message: 'Here is your plan' })),
      },
      db: {},
    },
  });
  applyAiPlannerEffects(testBed.addEffect);
  return testBed;
}

async function* stream<T>(value: T): AsyncGenerator<T> {
  yield value;
}

describe('send gating', () => {
  const openGate = { isLoadingResponse: false, isOutOfDate: false, awaitingAiReply: false };

  it('detects the server out-of-date signal anywhere in the transcript', () => {
    expect(isChatOutOfDate([])).toBe(false);
    expect(isChatOutOfDate([agentMsg('a')])).toBe(false);
    expect(isChatOutOfDate([agentMsg('a'), { ...agentMsg('b'), type: 'updateRequired' } as ChatMessage])).toBe(true);
  });

  it('treats whitespace-only input as empty', () => {
    expect(sanitizeChatInput('  Leg day  ')).toBe('Leg day');
    expect(sanitizeChatInput('   \n\t ')).toBe('');
  });

  it('sends only real text on an idle, up-to-date chat', () => {
    expect(canSendChatMessage(openGate, 'Plan my week')).toBe(true);
    expect(canSendChatMessage(openGate, '')).toBe(false);
    expect(canSendChatMessage(openGate, '   ')).toBe(false);
  });

  it('blocks while the AI is answering, when out of date, or while the placeholder is in flight', () => {
    expect(canSendChatMessage({ ...openGate, isLoadingResponse: true }, 'hi')).toBe(false);
    expect(canSendChatMessage({ ...openGate, isOutOfDate: true }, 'hi')).toBe(false);
    expect(canSendChatMessage({ ...openGate, awaitingAiReply: true }, 'hi')).toBe(false);
  });

  it('wires the trimmed text into the dispatched message (source sweep)', () => {
    const source = readFileSync(join(SRC_ROOT, 'app', '(tabs)', 'settings', 'ai', 'planner-chat.tsx'), 'utf8');
    expect(source).toMatch(/message: trimmed,/);
    expect(source).toMatch(/const canSend = canSendChatMessage\(sendGate, messageText\);/);
    expect(source).toMatch(/disabled={!canSend}/);
  });
});

describe('chat reducer', () => {
  const init = aiPlannerReducer(undefined, { type: '@@init' } as never);

  it('prepends new messages (newest first)', () => {
    const s = aiPlannerReducer(aiPlannerReducer(init, addMessage(userMsg('u1'))), addMessage(agentMsg('a1')));
    expect(s.plannerChat.map((m) => m.id)).toEqual(['a1', 'u1']);
  });

  it('clears the transcript on restart', () => {
    const s = aiPlannerReducer(aiPlannerReducer(init, addMessage(userMsg('u1'))), restartChat());
    expect(s.plannerChat).toEqual([]);
  });

  it('updates by id and ignores unknown ids', () => {
    const s1 = aiPlannerReducer(init, addMessage(agentMsg('a1', '', true)));
    const s2 = aiPlannerReducer(s1, updateMessage(agentMsg('a1', 'Hello', false)));
    expect(s2.plannerChat[0]).toMatchObject({ message: 'Hello', isLoading: false });
    expect(aiPlannerReducer(s2, updateMessage(agentMsg('nope', 'x')))).toBe(s2);
  });

  it('removes by id and ignores unknown ids', () => {
    const s1 = aiPlannerReducer(init, addMessage(userMsg('u1')));
    expect(aiPlannerReducer(s1, removeMessage('u1')).plannerChat).toEqual([]);
    expect(aiPlannerReducer(s1, removeMessage('nope'))).toBe(s1);
  });

  it('reports loading while any message is loading', () => {
    expect(selectIsLoadingAiPlannerMessage({ aiPlanner: init } as never)).toBe(false);
    const s = aiPlannerReducer(init, addMessage(agentMsg('a1', '', true)));
    expect(selectIsLoadingAiPlannerMessage({ aiPlanner: s } as never)).toBe(true);
  });
});

describe('chat effects', () => {
  it('keeps an existing transcript on init', async () => {
    const testBed = makeTestBed([userMsg('u1')]);
    await testBed.dispatchHandled(initChat());
    testBed.expectNotDispatched(restartChat);
    expect(testBed.getState().aiPlanner.plannerChat).toHaveLength(1);
  });

  it('introduces itself on an empty chat', async () => {
    const testBed = makeTestBed();
    // initChat guards on an empty transcript and delegates to restartChat;
    // the test bed runs effects for the dispatched action itself.
    await testBed.dispatchHandled(initChat());
    expect(testBed.dispatchedActions.map((x) => x.type)).toContain(restartChat.type);

    const introBed = makeTestBed();
    await introBed.dispatchHandled(restartChat());
    const chat = introBed.getState().aiPlanner.plannerChat;
    expect(chat).toHaveLength(1);
    expect(chat[0]).toMatchObject({ from: 'Agent', message: 'Welcome back', isLoading: false });
    expect(introBed.mockServices.aiChatService.restartChat).toHaveBeenCalled();
  });

  it('streams a user message from placeholder to settled answer', async () => {
    const testBed = makeTestBed();
    await testBed.dispatchHandled(addMessage(userMsg('u1')));
    const chat = testBed.getState().aiPlanner.plannerChat;
    expect(chat).toHaveLength(2);
    expect(chat[0]).toMatchObject({ from: 'Agent', message: 'Here is your plan', isLoading: false });
    expect(chat[1]).toMatchObject({ from: 'User', id: 'u1' });
  });

  it('ignores agent messages (no echo placeholder)', async () => {
    const testBed = makeTestBed();
    await testBed.dispatchHandled(addMessage(agentMsg('a1', 'Hi')));
    expect(testBed.getState().aiPlanner.plannerChat).toHaveLength(1);
  });

  it('forwards stop to the service', async () => {
    const testBed = makeTestBed();
    await testBed.dispatchHandled(stopAiGenerator());
    expect(testBed.mockServices.aiChatService.stopInProgress).toHaveBeenCalled();
  });
});

describe('planner-chat i18n completeness', () => {
  it('resolves every key used by the route in en.json', () => {
    const en = JSON.parse(readFileSync(join(SRC_ROOT, 'i18n', 'en.json'), 'utf8')) as Record<string, unknown>;
    const source = readFileSync(join(SRC_ROOT, 'app', '(tabs)', 'settings', 'ai', 'planner-chat.tsx'), 'utf8');
    const keys = new Set<string>();
    for (const m of source.matchAll(/(?:(?<![\w$])t)\('([^']+)'/g)) {
      keys.add(m[1]!);
    }
    expect(keys.size).toBeGreaterThan(0);
    const missing = [...keys].filter((k) => !(k in en));
    expect(missing).toEqual([]);
  });
});

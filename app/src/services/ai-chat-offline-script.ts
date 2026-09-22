import type { AiChatResponseV2 } from '@/models/ai-models';
import { selectBackendForFeature } from '@/store/backends';
import type { RootState } from '@/store/store';

/**
 * Deterministic local script for greetings the coach cannot answer.
 *
 * When the AI coach is unreachable — no backend assigned, or the built-in
 * backend without a Pro token — a greeting like "hi" gets a brief natural
 * reply, immediately labeled as a local fallback (it must never pretend a
 * remote AI answered), followed by the honest reason and the real Pro
 * upgrade response. Anything else (non-greetings, or a reachable backend)
 * returns undefined so the existing service paths run untouched.
 */

const GREETINGS = new Set([
  'hi',
  'hello',
  'hey',
  'yo',
  'hiya',
  'howdy',
  'sup',
  'morning',
  'afternoon',
  'evening',
  'good morning',
  'good afternoon',
  'good evening',
]);

export function isGreeting(text: string): boolean {
  const normalized = text
    .trim()
    .toLowerCase()
    .replace(/^[^a-z]+|[^a-z]+$/g, '')
    .replace(/\s+/g, ' ');
  return GREETINGS.has(normalized);
}

export function offlineCoachScript(state: RootState, message: string): AiChatResponseV2[] | undefined {
  if (!isGreeting(message)) {
    return undefined;
  }
  const backend = selectBackendForFeature(state, 'aiPlanner');
  if (backend && !backend.requiresPro) {
    return undefined;
  }
  return [
    { type: 'messageResponse', message: 'Hey — good to see you.' },
    {
      type: 'messageResponse',
      message:
        "That hello was from me locally, not the coach: I can't connect right now. The AI coach needs Pro — upgrading unlocks the built-in coach.",
      appendAsNew: true,
    },
    { type: 'purchasePro', appendAsNew: true },
  ];
}

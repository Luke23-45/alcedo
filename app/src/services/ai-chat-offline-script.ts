import type { AiChatResponseV2 } from '@/models/ai-models';

/**
 * Deterministic local script for greetings the coach cannot answer.
 *
 * When the coach is unreachable — signed out, or the network is down — a
 * greeting like "hi" gets a brief natural reply, immediately labeled as a
 * local fallback (it must never pretend a remote AI answered), followed by
 * the honest reason. Anything the coach *can* answer goes to the server, so
 * this script only fires on the failure paths the service detects.
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

export type OfflineCoachReason = 'session-expired' | 'network';

export function offlineCoachScript(reason: OfflineCoachReason): AiChatResponseV2[] {
  return [
    { type: 'messageResponse', message: 'Hey — good to see you.' },
    {
      type: 'messageResponse',
      message:
        reason === 'session-expired'
          ? "That hello was from me locally, not the coach: you're signed out. Sign in to chat with your Alcedo coach."
          : "That hello was from me locally, not the coach: I can't reach the servers right now. Check your connection and try again.",
      appendAsNew: true,
    },
  ];
}

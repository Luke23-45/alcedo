import type { ChatMessage } from '@/store/ai-planner';

/**
 * Pure send-gating logic for the AI planner chat
 * (`app/src/app/(tabs)/settings/ai/planner-chat.tsx`). RN-free so
 * simulation tests can import it directly.
 */

/** The server told us this app is out of date; input stays blocked until a restart. */
export function isChatOutOfDate(messages: ChatMessage[]): boolean {
  return messages.some((x) => x.type === 'updateRequired');
}

/** Whitespace-only input is not a message. */
export function sanitizeChatInput(message: string): string {
  return message.trim();
}

export interface ChatSendGate {
  isLoadingResponse: boolean;
  isOutOfDate: boolean;
  /**
   * The user's message is in the store but the AI placeholder is not yet:
   * the placeholder is added by an async effect, so the store alone cannot
   * see the in-flight send until it arrives. The newest message being ours
   * covers that window.
   */
  awaitingAiReply: boolean;
}

export function canSendChatMessage(gate: ChatSendGate, message: string): boolean {
  return !gate.isLoadingResponse && !gate.isOutOfDate && !gate.awaitingAiReply && sanitizeChatInput(message).length > 0;
}

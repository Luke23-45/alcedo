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

/** Calendar-day equality on the device clock. */
export function isSameCalendarDay(a: number, b: number): boolean {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth() && da.getDate() === db.getDate()
  );
}

/**
 * Whether the message at `index` (newest-first order, as the inverted list
 * renders) opens a new day group, i.e. a day divider belongs directly above
 * it. The oldest message always opens one; otherwise only when the
 * next-older message falls on a different day. Messages without a timestamp
 * never open one — they belong to the same unknown span as their neighbours.
 */
export function showsDayDivider(messages: ChatMessage[], index: number): boolean {
  const current = messages[index]?.sentAt;
  if (current == null) {
    return false;
  }
  if (index === messages.length - 1) {
    return true;
  }
  const older = messages[index + 1]?.sentAt;
  if (older == null) {
    return false;
  }
  return !isSameCalendarDay(current, older);
}

/**
 * The divider caption for a timestamp: "Today", "Yesterday", or the calendar
 * date in the device locale. The relative labels arrive translated so this
 * stays RN- and i18n-free.
 */
export function dayDividerLabel(
  sentAt: number,
  now: number,
  todayLabel: string,
  yesterdayLabel: string,
  locale?: string,
): string {
  if (isSameCalendarDay(sentAt, now)) {
    return todayLabel;
  }
  // Calendar arithmetic, not a fixed 24h offset: on DST transition days
  // "yesterday" is 23 or 25 hours ago, and a fixed offset lands on the
  // wrong calendar day.
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (isSameCalendarDay(sentAt, yesterday.getTime())) {
    return yesterdayLabel;
  }
  return new Date(sentAt).toLocaleDateString(locale ?? undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

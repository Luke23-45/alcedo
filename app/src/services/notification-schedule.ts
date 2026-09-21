import { DayOfWeek } from '@js-joda/core';

/**
 * Pure scheduling logic for Settings → Notifications (Phase 6, Screen 3).
 *
 * Kept free of expo-notifications so the quiet-hour boundaries and trigger
 * computation stay unit-testable. The scheduler service
 * (`notification-scheduler.ts`) turns these values into real triggers.
 */

/** Minutes after midnight that fall inside quiet hours, wrapping overnight. */
export function isInQuietHours(nowMinutes: number, quietStartMinutes: number, quietEndMinutes: number): boolean {
  const t = ((nowMinutes % 1440) + 1440) % 1440;
  if (quietStartMinutes === quietEndMinutes) {
    return false;
  }
  if (quietStartMinutes < quietEndMinutes) {
    return t >= quietStartMinutes && t < quietEndMinutes;
  }
  return t >= quietStartMinutes || t < quietEndMinutes;
}

/** expo-notifications weekday (1 = Sunday … 7 = Saturday) from ISO DayOfWeek. */
export function toExpoWeekday(day: DayOfWeek): number {
  return (day.value() % 7) + 1;
}

export interface ReminderTrigger {
  /** Deterministic identifier so rescheduling replaces, never duplicates. */
  identifier: string;
  weekday: number;
  hour: number;
  minute: number;
}

const REMINDER_ID_PREFIX = 'alcedo.workout-reminder';
export const WEEKLY_SUMMARY_ID = 'alcedo.weekly-summary';

/**
 * Weekly calendar triggers for the selected training days at the chosen time.
 * Triggers that would fire inside quiet hours are dropped — a reminder that
 * can't be delivered shouldn't be scheduled.
 */
export function computeReminderTriggers(
  days: DayOfWeek[],
  timeMinutes: number,
  quietStartMinutes: number,
  quietEndMinutes: number,
): ReminderTrigger[] {
  const hour = Math.floor(timeMinutes / 60);
  const minute = timeMinutes % 60;
  if (isInQuietHours(timeMinutes, quietStartMinutes, quietEndMinutes)) {
    return [];
  }
  return [...days]
    .sort((a, b) => a.value() - b.value())
    .map((day) => ({
      identifier: `${REMINDER_ID_PREFIX}.${day.name().toLowerCase()}`,
      weekday: toExpoWeekday(day),
      hour,
      minute,
    }));
}

/** The weekly summary fires Sundays at 8:00 AM — outside quiet hours. */
export function weeklySummaryTrigger(): ReminderTrigger {
  return { identifier: WEEKLY_SUMMARY_ID, weekday: 1, hour: 8, minute: 0 };
}

/**
 * Formats minutes-after-midnight as a clock time. Twelve-hour mode always
 * shows AM/PM; 24-hour mode follows the "24-Hour Time" preference.
 */
export function formatMinutesAsTime(timeMinutes: number, use24HourTime: boolean, locale?: string): string {
  const date = new Date(2026, 0, 1, Math.floor(timeMinutes / 60), timeMinutes % 60);
  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: !use24HourTime,
  }).format(date);
}

/** "10 PM – 6 AM" (or "22:00 – 6:00" in 24-hour mode). */
export function formatQuietHours(
  quietStartMinutes: number,
  quietEndMinutes: number,
  use24HourTime: boolean,
  locale?: string,
): string {
  const formatEnd = (minutes: number) => {
    // The spec renders on-the-hour 12-hour times without minutes ("10 PM").
    if (!use24HourTime && minutes % 60 === 0) {
      const date = new Date(2026, 0, 1, Math.floor(minutes / 60), 0);
      return new Intl.DateTimeFormat(locale, { hour: 'numeric', hour12: true }).format(date);
    }
    return formatMinutesAsTime(minutes, use24HourTime, locale);
  };
  return `${formatEnd(quietStartMinutes)} – ${formatEnd(quietEndMinutes)}`;
}

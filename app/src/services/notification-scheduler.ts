import {
  cancelScheduledNotificationAsync,
  getPermissionsAsync,
  requestPermissionsAsync,
  scheduleNotificationAsync,
  SchedulableTriggerInputTypes,
  setBadgeCountAsync,
  setNotificationHandler,
} from 'expo-notifications';
import { DayOfWeek } from '@js-joda/core';
import {
  computeReminderTriggers,
  WEEKLY_SUMMARY_ID,
  weeklySummaryTrigger,
  type ReminderTrigger,
} from './notification-schedule';

/**
 * Real delivery for Settings → Notifications (Phase 6, Screen 3): workout
 * reminders on the selected training days at the chosen time, and the weekly
 * summary on Sunday mornings. Identifiers are deterministic, so rescheduling
 * replaces rather than duplicates.
 *
 * Platform note: these weekly triggers go through expo-notifications on both
 * platforms. Android rejects `calendar` triggers outright ("Trigger of type:
 * calendar is not supported on Android"), while `weekly` is implemented
 * natively there and maps to the same repeating
 * `UNCalendarNotificationTrigger` (weekday + hour + minute, `repeats: true`)
 * on iOS — so one trigger shape covers both. The workout worker still owns the
 * in-session notifications (see notification-service.ts).
 */

export interface ReminderSchedule {
  days: DayOfWeek[];
  timeMinutes: number;
  quietStartMinutes: number;
  quietEndMinutes: number;
  enabled: boolean;
}

async function permissionGranted(): Promise<boolean> {
  const existing = await getPermissionsAsync();
  if (existing.granted) {
    return true;
  }
  const requested = await requestPermissionsAsync();
  return requested.granted;
}

async function scheduleWeeklyTrigger(trigger: ReminderTrigger, title: string, body: string): Promise<void> {
  await scheduleNotificationAsync({
    identifier: trigger.identifier,
    content: { title, body, sound: true },
    trigger: {
      // WEEKLY, not CALENDAR: Android has no calendar trigger, and iOS's weekly
      // trigger is the same repeating weekday/hour/minute date-component match.
      type: SchedulableTriggerInputTypes.WEEKLY,
      weekday: trigger.weekday,
      hour: trigger.hour,
      minute: trigger.minute,
    },
  });
}

/** Cancels every reminder identifier this module owns, then reschedules. */
export async function rescheduleWorkoutReminders(
  schedule: ReminderSchedule,
  strings: { title: string; body: string },
): Promise<boolean> {
  // Cancel all seven owned identifiers — not just the currently selected
  // days — so a deselected day can never leave a stale notification behind.
  for (const day of DayOfWeek.values()) {
    await cancelScheduledNotificationAsync(`alcedo.workout-reminder.${day.name().toLowerCase()}`);
  }
  if (!schedule.enabled) {
    return true;
  }
  const triggers = computeReminderTriggers(
    schedule.days,
    schedule.timeMinutes,
    schedule.quietStartMinutes,
    schedule.quietEndMinutes,
  );
  if (triggers.length === 0) {
    // Nothing can be delivered (the reminder time falls inside quiet hours,
    // or no training day is selected): the toggle must not claim otherwise,
    // and there is no point prompting for OS permission.
    return false;
  }
  if (!(await permissionGranted())) {
    return false;
  }
  for (const trigger of triggers) {
    await scheduleWeeklyTrigger(trigger, strings.title, strings.body);
  }
  return true;
}

export async function rescheduleWeeklySummary(
  enabled: boolean,
  strings: { title: string; body: string },
): Promise<boolean> {
  await cancelScheduledNotificationAsync(WEEKLY_SUMMARY_ID);
  if (!enabled) {
    return true;
  }
  if (!(await permissionGranted())) {
    return false;
  }
  await scheduleWeeklyTrigger(weeklySummaryTrigger(), strings.title, strings.body);
  return true;
}

/** Clears the icon badge; called when Badge App Icon is switched off. */
export async function clearAppIconBadge(): Promise<void> {
  await setBadgeCountAsync(0);
}

/**
 * Re-registers the notification handler with the user's badge preference.
 * Called after hydration and whenever Badge App Icon changes, so the switch
 * genuinely controls whether notifications badge the icon.
 */
export function configureNotificationBadge(badgeEnabled: boolean): void {
  setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: badgeEnabled,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

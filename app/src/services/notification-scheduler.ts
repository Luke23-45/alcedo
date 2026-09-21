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
 * Platform note: the shared expo-notifications scheduler is intentionally
 * inactive on Android (the workout worker owns notifications there — see
 * notification-service.ts). These reminder/summary triggers go through the
 * same service boundary so they inherit that behavior.
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

async function scheduleCalendarTrigger(trigger: ReminderTrigger, title: string, body: string): Promise<void> {
  await scheduleNotificationAsync({
    identifier: trigger.identifier,
    content: { title, body, sound: true },
    trigger: {
      type: SchedulableTriggerInputTypes.CALENDAR,
      weekday: trigger.weekday,
      hour: trigger.hour,
      minute: trigger.minute,
      repeats: true,
    },
  });
}

/** Cancels every reminder identifier this module owns, then reschedules. */
export async function rescheduleWorkoutReminders(
  schedule: ReminderSchedule,
  strings: { title: string; body: string },
): Promise<boolean> {
  for (const day of schedule.days) {
    await cancelScheduledNotificationAsync(`alcedo.workout-reminder.${day.name().toLowerCase()}`);
  }
  if (!schedule.enabled) {
    return true;
  }
  if (!(await permissionGranted())) {
    return false;
  }
  const triggers = computeReminderTriggers(
    schedule.days,
    schedule.timeMinutes,
    schedule.quietStartMinutes,
    schedule.quietEndMinutes,
  );
  for (const trigger of triggers) {
    await scheduleCalendarTrigger(trigger, strings.title, strings.body);
  }
  return true;
}

export async function rescheduleWeeklySummary(enabled: boolean, strings: { title: string; body: string }): Promise<boolean> {
  await cancelScheduledNotificationAsync(WEEKLY_SUMMARY_ID);
  if (!enabled) {
    return true;
  }
  if (!(await permissionGranted())) {
    return false;
  }
  await scheduleCalendarTrigger(weeklySummaryTrigger(), strings.title, strings.body);
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

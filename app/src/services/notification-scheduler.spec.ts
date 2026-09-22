/**
 * Page 15/20 — notification scheduler honesty.
 *
 * Drives the real `notification-scheduler` against a mocked
 * expo-notifications: deterministic identifiers, permission-denied honesty
 * (nothing scheduled, caller told), and the quiet-hours / no-days rule —
 * when nothing can be delivered the toggle must not claim otherwise, and
 * the OS permission prompt must not fire pointlessly.
 */
// oxlint-disable typescript/no-unsafe-assignment typescript/no-unsafe-member-access typescript/no-unsafe-argument
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { DayOfWeek } from '@js-joda/core';

const { getPermissionsAsync, requestPermissionsAsync, scheduleNotificationAsync, cancelScheduledNotificationAsync } =
  vi.hoisted(() => ({
    getPermissionsAsync: vi.fn(),
    requestPermissionsAsync: vi.fn(),
    scheduleNotificationAsync: vi.fn(),
    cancelScheduledNotificationAsync: vi.fn(),
  }));

vi.mock('expo-notifications', () => ({
  getPermissionsAsync,
  requestPermissionsAsync,
  scheduleNotificationAsync,
  cancelScheduledNotificationAsync,
  setBadgeCountAsync: vi.fn(),
  setNotificationHandler: vi.fn(),
  // Android rejects `calendar` triggers outright, so the scheduler asks for the
  // platform-agnostic weekly kind. The mock mirrors the real enum's values.
  SchedulableTriggerInputTypes: { CALENDAR: 'calendar', WEEKLY: 'weekly' },
}));

import { rescheduleWeeklySummary, rescheduleWorkoutReminders, type ReminderSchedule } from './notification-scheduler';

const DAYS = [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY];
const STRINGS = { title: 'Time to train', body: 'Your training session is waiting.' };

function schedule(overrides?: Partial<ReminderSchedule>): ReminderSchedule {
  return {
    days: DAYS,
    timeMinutes: 17 * 60 + 30,
    quietStartMinutes: 22 * 60,
    quietEndMinutes: 6 * 60,
    enabled: true,
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('rescheduleWorkoutReminders', () => {
  it('cancels all seven owned identifiers (incl. deselected days), then schedules one trigger per training day', async () => {
    getPermissionsAsync.mockResolvedValue({ granted: true });
    const ok = await rescheduleWorkoutReminders(schedule(), STRINGS);
    expect(ok).toBe(true);
    expect(cancelScheduledNotificationAsync).toHaveBeenCalledTimes(7);
    expect(cancelScheduledNotificationAsync).toHaveBeenCalledWith('alcedo.workout-reminder.monday');
    // Thursday is not a training day, but its stale notification must still be cancelled.
    expect(cancelScheduledNotificationAsync).toHaveBeenCalledWith('alcedo.workout-reminder.thursday');
    expect(scheduleNotificationAsync).toHaveBeenCalledTimes(5);
    const first = scheduleNotificationAsync.mock.calls[0]![0];
    expect(first.identifier).toBe('alcedo.workout-reminder.monday');
    expect(first.content.title).toBe('Time to train');
    expect(first.trigger).toMatchObject({ type: 'weekly', weekday: 2, hour: 17, minute: 30 });
  });

  it('requests permission once when not yet granted, and schedules on grant', async () => {
    getPermissionsAsync.mockResolvedValue({ granted: false });
    requestPermissionsAsync.mockResolvedValue({ granted: true });
    const ok = await rescheduleWorkoutReminders(schedule(), STRINGS);
    expect(ok).toBe(true);
    expect(requestPermissionsAsync).toHaveBeenCalledOnce();
    expect(scheduleNotificationAsync).toHaveBeenCalledTimes(5);
  });

  it('returns false and schedules nothing when the OS denies permission', async () => {
    getPermissionsAsync.mockResolvedValue({ granted: false });
    requestPermissionsAsync.mockResolvedValue({ granted: false });
    const ok = await rescheduleWorkoutReminders(schedule(), STRINGS);
    expect(ok).toBe(false);
    expect(scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it('returns false without prompting for permission when the reminder time is inside quiet hours', async () => {
    const ok = await rescheduleWorkoutReminders(schedule({ timeMinutes: 23 * 60 }), STRINGS);
    expect(ok).toBe(false);
    expect(getPermissionsAsync).not.toHaveBeenCalled();
    expect(requestPermissionsAsync).not.toHaveBeenCalled();
    expect(scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it('returns false without prompting for permission when no training day is selected', async () => {
    const ok = await rescheduleWorkoutReminders(schedule({ days: [] }), STRINGS);
    expect(ok).toBe(false);
    expect(requestPermissionsAsync).not.toHaveBeenCalled();
    expect(scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it('cancels everything and returns true when disabled, without touching permissions', async () => {
    const ok = await rescheduleWorkoutReminders(schedule({ enabled: false }), STRINGS);
    expect(ok).toBe(true);
    expect(cancelScheduledNotificationAsync).toHaveBeenCalledTimes(7);
    expect(getPermissionsAsync).not.toHaveBeenCalled();
    expect(scheduleNotificationAsync).not.toHaveBeenCalled();
  });
});

describe('rescheduleWeeklySummary', () => {
  it('schedules the Sunday 8:00 AM summary when permitted', async () => {
    getPermissionsAsync.mockResolvedValue({ granted: true });
    const ok = await rescheduleWeeklySummary(true, { title: 'Your week in training', body: 'ready' });
    expect(ok).toBe(true);
    expect(cancelScheduledNotificationAsync).toHaveBeenCalledWith('alcedo.weekly-summary');
    const [call] = scheduleNotificationAsync.mock.calls;
    expect(call![0].identifier).toBe('alcedo.weekly-summary');
    expect(call![0].trigger).toMatchObject({ type: 'weekly', weekday: 1, hour: 8, minute: 0 });
  });

  it('returns false when the OS denies permission', async () => {
    getPermissionsAsync.mockResolvedValue({ granted: false });
    requestPermissionsAsync.mockResolvedValue({ granted: false });
    const ok = await rescheduleWeeklySummary(true, { title: 't', body: 'b' });
    expect(ok).toBe(false);
    expect(scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it('cancels and returns true when disabled', async () => {
    const ok = await rescheduleWeeklySummary(false, { title: 't', body: 'b' });
    expect(ok).toBe(true);
    expect(cancelScheduledNotificationAsync).toHaveBeenCalledWith('alcedo.weekly-summary');
    expect(scheduleNotificationAsync).not.toHaveBeenCalled();
  });
});

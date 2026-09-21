import { DayOfWeek } from '@js-joda/core';
import { describe, expect, it } from 'vitest';
import {
  computeReminderTriggers,
  formatMinutesAsTime,
  formatQuietHours,
  isInQuietHours,
  toExpoWeekday,
  weeklySummaryTrigger,
} from './notification-schedule';

const QUIET_START = 22 * 60; // 10 PM
const QUIET_END = 6 * 60; // 6 AM

describe('isInQuietHours', () => {
  it('covers the overnight window 10 PM – 6 AM', () => {
    expect(isInQuietHours(23 * 60, QUIET_START, QUIET_END)).toBe(true);
    expect(isInQuietHours(0, QUIET_START, QUIET_END)).toBe(true);
    expect(isInQuietHours(5 * 60 + 59, QUIET_START, QUIET_END)).toBe(true);
  });

  it('is open outside the window, with exact boundaries', () => {
    expect(isInQuietHours(21 * 60 + 59, QUIET_START, QUIET_END)).toBe(false);
    expect(isInQuietHours(22 * 60, QUIET_START, QUIET_END)).toBe(true);
    expect(isInQuietHours(6 * 60, QUIET_START, QUIET_END)).toBe(false);
    expect(isInQuietHours(12 * 60, QUIET_START, QUIET_END)).toBe(false);
  });

  it('handles a same-day window without wrapping', () => {
    expect(isInQuietHours(14 * 60, 13 * 60, 15 * 60)).toBe(true);
    expect(isInQuietHours(16 * 60, 13 * 60, 15 * 60)).toBe(false);
  });

  it('treats identical start/end as no quiet hours', () => {
    expect(isInQuietHours(12 * 60, 0, 0)).toBe(false);
  });
});

describe('toExpoWeekday', () => {
  it('maps ISO days to expo-notifications weekdays (1 = Sunday)', () => {
    expect(toExpoWeekday(DayOfWeek.SUNDAY)).toBe(1);
    expect(toExpoWeekday(DayOfWeek.MONDAY)).toBe(2);
    expect(toExpoWeekday(DayOfWeek.FRIDAY)).toBe(6);
    expect(toExpoWeekday(DayOfWeek.SATURDAY)).toBe(7);
  });
});

describe('computeReminderTriggers', () => {
  const days = [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY];

  it('schedules one deterministic trigger per training day at 5:30 PM', () => {
    const triggers = computeReminderTriggers(days, 17 * 60 + 30, QUIET_START, QUIET_END);
    expect(triggers).toHaveLength(5);
    expect(triggers.map((t) => t.weekday)).toEqual([2, 3, 4, 6, 7]);
    for (const t of triggers) {
      expect(t.hour).toBe(17);
      expect(t.minute).toBe(30);
    }
    expect(new Set(triggers.map((t) => t.identifier)).size).toBe(5);
  });

  it('drops every trigger when the reminder time falls in quiet hours', () => {
    expect(computeReminderTriggers(days, 23 * 60, QUIET_START, QUIET_END)).toEqual([]);
  });
});

describe('weeklySummaryTrigger', () => {
  it('fires Sundays at 8:00 AM', () => {
    const trigger = weeklySummaryTrigger();
    expect(trigger.weekday).toBe(1);
    expect(trigger.hour).toBe(8);
    expect(trigger.minute).toBe(0);
    expect(trigger.identifier).toBe('alcedo.weekly-summary');
  });
});

describe('formatMinutesAsTime', () => {
  it('shows AM/PM in 12-hour mode', () => {
    expect(formatMinutesAsTime(17 * 60 + 30, false, 'en-US')).toBe('5:30 PM');
    expect(formatMinutesAsTime(8 * 60, false, 'en-US')).toBe('8:00 AM');
  });

  it('shows 24-hour clocks when the preference is on', () => {
    expect(formatMinutesAsTime(17 * 60 + 30, true, 'en-US')).toBe('17:30');
    expect(formatMinutesAsTime(8 * 60, true, 'en-US')).toBe('08:00');
  });
});

describe('formatQuietHours', () => {
  it('renders the single-line quiet-hours rule', () => {
    expect(formatQuietHours(QUIET_START, QUIET_END, false, 'en-US')).toBe('10 PM – 6 AM');
    expect(formatQuietHours(QUIET_START, QUIET_END, true, 'en-US')).toBe('22:00 – 06:00');
  });
});

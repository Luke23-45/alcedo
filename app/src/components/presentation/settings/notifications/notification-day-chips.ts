import { DayOfWeek } from '@js-joda/core';

/**
 * Day-chip helpers for the workout-reminder editor (settings-dark.md
 * Screen 3). Kept pure (no React, no store) so the chip row's ordering,
 * reference dates, and localization stay unit-testable.
 */

/** Monday-first day order, matching the spec chip row. */
export const CHIP_DAYS: DayOfWeek[] = [
  DayOfWeek.MONDAY,
  DayOfWeek.TUESDAY,
  DayOfWeek.WEDNESDAY,
  DayOfWeek.THURSDAY,
  DayOfWeek.FRIDAY,
  DayOfWeek.SATURDAY,
  DayOfWeek.SUNDAY,
];

/** Date in the reference week (2026-01-05 was a Monday) for a weekday. */
export function referenceDateFor(day: DayOfWeek): Date {
  return new Date(2026, 0, 5 + (day.value() - 1));
}

/** Localized single-letter day mark ("M", "T" …), spec-style. */
export function dayLetter(day: DayOfWeek, locale: string | undefined): string {
  return new Intl.DateTimeFormat(locale, { weekday: 'narrow' }).format(referenceDateFor(day));
}

/** Localized full weekday name for the chip's accessibility label. */
export function dayName(day: DayOfWeek, locale: string | undefined): string {
  return new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(referenceDateFor(day));
}

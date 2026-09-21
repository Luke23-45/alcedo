/**
 * History Screen 1 pixel-spec constants, measured off
 * docs/new_design/history-dark.md (SCREEN 1) and its light-mode delta table.
 * Geometry is identical in both modes; only the listed colors shift.
 *
 * The volume bands are spec-derived defaults (from the contract's level bands
 * L1 <4,000 · L2 4,000–6,500 · L3 6,500–8,500 · L4 >8,500 kg), documented here
 * so they can be revisited against real user data.
 */

export const HISTORY_DESIGN = {
  /** r=19 day ring circumference: 2π·19 = 119.3805. Dash = fraction × this. */
  dayRingCircumference: 2 * Math.PI * 19,
  /** r=23 selected-day outer ring: 2π·23 = 144.5133. */
  selectedRingCircumference: 2 * Math.PI * 23,
  dayRadius: 19,
  selectedOuterRadius: 23,
  /** Arc fill fractions by load level: level ÷ 4. */
  levelFraction: [0, 0.25, 0.5, 0.75, 1] as const,
  /**
   * Spec-derived default volume bands (kg / day). A day's load level is the
   * band its volume falls in; rest days (no volume) keep the track ring only.
   */
  volumeBands: [
    { max: 4000, level: 1 },
    { max: 6500, level: 2 },
    { max: 8500, level: 3 },
    { max: Number.POSITIVE_INFINITY, level: 4 },
  ] as const,
} as const;

import { LocalDate, YearMonth } from '@js-joda/core';

/** Load level (0 = rest) for a day's total volume. */
export function loadLevelForVolume(volumeKg: number): 0 | 1 | 2 | 3 | 4 {
  if (volumeKg <= 0) {
    return 0;
  }
  for (const band of HISTORY_DESIGN.volumeBands) {
    if (volumeKg < band.max) {
      return band.level;
    }
  }
  return 4;
}

/** Colors that shift between modes, per the spec's light-mode delta table. */
export interface HistoryPalette {
  trackRing: string;
  loadArc: string;
  loadArcOpacity: readonly [number, number, number, number];
  outOfMonthNumeral: string;
  outOfMonthRestNumeral: string;
  futureNumeral: string;
  futureOutOfMonthNumeral: string;
  weekendLabel: string;
  legendTrack: string;
}

export function historyPalette(isDark: boolean): HistoryPalette {
  return isDark
    ? {
        trackRing: 'rgba(255,255,255,0.07)',
        loadArc: '#30D158',
        loadArcOpacity: [0.3, 0.5, 0.72, 0.95],
        outOfMonthNumeral: '#6C6C70',
        outOfMonthRestNumeral: '#48484A',
        futureNumeral: '#3A3A3C',
        futureOutOfMonthNumeral: '#2C2C2E',
        weekendLabel: '#48484A',
        legendTrack: 'rgba(255,255,255,0.14)',
      }
    : {
        trackRing: 'rgba(120,120,128,0.18)',
        loadArc: '#248A3D',
        loadArcOpacity: [0.32, 0.52, 0.74, 0.96],
        outOfMonthNumeral: '#AEAEB2',
        outOfMonthRestNumeral: '#AEAEB2',
        futureNumeral: '#D1D1D6',
        futureOutOfMonthNumeral: '#D1D1D6',
        weekendLabel: '#C7C7CC',
        legendTrack: 'rgba(120,120,128,0.18)',
      };
}

/** Brand gradient for selection surfaces (spec: #FFB03A → #FF6A3D → #FF2D55). */
export const BRAND_GRADIENT: readonly [string, string, string] = ['#FFB03A', '#FF6A3D', '#FF2D55'] as const;

/**
 * The 6-week Monday-first date range the calendar renders for a month.
 * Pure, so the screen's day-volume query covers exactly the out-of-month
 * spillover cells.
 */
export function calendarGridRange(yearMonth: YearMonth): {
  start: LocalDate;
  end: LocalDate;
} {
  const firstOfMonth = yearMonth.atDay(1);
  const leadDays = firstOfMonth.dayOfWeek().ordinal() % 7;
  const start = firstOfMonth.minusDays(leadDays);
  return { start, end: start.plusDays(41) };
}

/** Gold is identical in both modes — an earned-celebration moment, not a theme surface. */
export const GOLD = {
  fill: 'rgba(255,214,10,0.16)',
  chipFill: 'rgba(255,214,10,0.18)',
  stroke: 'rgba(255,214,10,0.26)',
  ink: '#FFD84D',
  softInk: '#A08000',
} as const;

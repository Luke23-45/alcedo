/**
 * Page 16/20 — AI Planner (Settings → AI Planner) simulation.
 *
 * The planner screen is presentational (React Native is stubbed out in the
 * repo's test setup), so the simulation runs at the model/logic level the
 * same way the page-13..15 suites did:
 *
 * A. i18n completeness: every settingsKey used in the planner folder
 *    resolves in en.json (a raw key string reaching a user is a defect —
 *    the focus segmented control shipped exactly that).
 * B. Navigation correctness: every router.push target in the planner folder
 *    resolves to a real expo-router route file.
 * C. Locale honesty: the date/RPE helpers take the preferred language
 *    instead of hard-coding English month/day names.
 * D. Availability matrix: the NEXT SESSION preview gates on the master
 *    switch (previously a dead toggle nothing read), the active program,
 *    and the training-day selection — never a silent gap under the header.
 * E. Registry contract: every planner preference key persists through a
 *    codec, so the settings the planner previews from survive restarts.
 */
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { DayOfWeek, LocalDate } from '@js-joda/core';
import {
  formatMonthDay,
  formatRpeValue,
  formatWeekdayMonthDay,
  nextSessionAvailability,
  weekdayShort,
} from './planner-data';
import { preferenceRegistry } from '@/store/settings/registry';

const PLANNER_DIR = __dirname;
const SRC = resolve(PLANNER_DIR, '..', '..', '..', '..');
const ROUTES_DIR = join(SRC, 'app', '(tabs)');

function plannerSources(): string {
  return readdirSync(PLANNER_DIR)
    .filter((f) => f.endsWith('.tsx') && !f.endsWith('.spec.tsx'))
    .map((f) => readFileSync(join(PLANNER_DIR, f), 'utf8'))
    .join('\n');
}

describe('planner i18n completeness', () => {
  it('resolves every settingsKey used by the planner folder in en.json', () => {
    const en = JSON.parse(readFileSync(join(SRC, 'i18n', 'en.json'), 'utf8')) as Record<string, unknown>;
    const sources = plannerSources();
    const keys = new Set<string>();
    for (const m of sources.matchAll(/settingsKey\('([^']+)'\)/g)) {
      keys.add(m[1]!);
    }
    // Dynamic focus keys: settingsKey(`settings.planner.focus.${option}`).
    for (const option of ['strength', 'hypertrophy', 'conditioning']) {
      keys.add(`settings.planner.focus.${option}`);
    }
    const missing = [...keys].filter((k) => !(k in en));
    expect(missing).toEqual([]);
  });
});

describe('planner navigation', () => {
  it('pushes only to real route files', () => {
    const sources = plannerSources();
    const targets = [...sources.matchAll(/push\('([^']+)'\)/g)].map((m) => m[1]!);
    expect(targets.length).toBeGreaterThan(0);
    for (const target of targets) {
      const asFile = join(ROUTES_DIR, `${target}.tsx`);
      const asIndex = join(ROUTES_DIR, target, 'index.tsx');
      expect(existsSync(asFile) || existsSync(asIndex), target).toBe(true);
    }
  });
});

describe('planner locale honesty', () => {
  it('keeps the English contract when the locale is en', () => {
    expect(formatMonthDay(LocalDate.of(2026, 6, 30), 'en')).toBe('Jun 30');
    expect(formatWeekdayMonthDay(LocalDate.of(2026, 6, 10), 'en')).toBe('Wed, Jun 10');
    expect(weekdayShort(DayOfWeek.THURSDAY, 'en')).toBe('Thu');
    expect(formatRpeValue(7.5, 'en')).toBe('7.5');
  });

  it('never throws when the language preference is unset', () => {
    expect(() => formatMonthDay(LocalDate.of(2026, 6, 30), undefined)).not.toThrow();
    expect(() => formatWeekdayMonthDay(LocalDate.of(2026, 6, 10), undefined)).not.toThrow();
    expect(() => weekdayShort(DayOfWeek.MONDAY, undefined)).not.toThrow();
    expect(() => formatRpeValue(7.5, undefined)).not.toThrow();
  });

  it('localizes the decimal separator instead of hard-coding a dot', () => {
    // Full-ICU environments render the German comma; minimal-ICU falls back
    // to English — either way it must not crash and must carry the digits.
    const de = formatRpeValue(7.5, 'de');
    expect(de).toMatch(/7[.,]5/);
  });
});

describe('next-session availability matrix', () => {
  it('is ready when the planner is on, a program exists, and days are selected', () => {
    expect(nextSessionAvailability(true, true, 5)).toBe('ready');
  });

  it('the master switch being off takes precedence over everything else', () => {
    expect(nextSessionAvailability(false, true, 5)).toBe('planner-off');
    expect(nextSessionAvailability(false, false, 0)).toBe('planner-off');
  });

  it('reports no-program when the active program was deleted', () => {
    expect(nextSessionAvailability(true, false, 5)).toBe('no-program');
  });

  it('reports no-training-days when every day was deselected', () => {
    expect(nextSessionAvailability(true, true, 0)).toBe('no-training-days');
  });
});

describe('planner preference persistence contract', () => {
  it('registers every planner key with a persisting codec', () => {
    for (const key of [
      'plannerEnabled',
      'plannerFocus',
      'plannerTrainingDays',
      'plannerTargetSessionMinutes',
      'plannerTargetRpe',
      'plannerWeeklyOverloadKg',
      'plannerAutoDeload',
      'plannerDeloadWeek',
    ] as const) {
      expect(preferenceRegistry[key].codec, key).toBeDefined();
      expect(preferenceRegistry[key].persist ?? true, key).toBe(true);
    }
  });
});

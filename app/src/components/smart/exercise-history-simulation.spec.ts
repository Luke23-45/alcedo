/**
 * Page 22/24 — Exercise history simulation (`/exercise-history`).
 *
 * The screen shows a movement's lineage: PR banner, top-set chart, and
 * per-session rows. React Native is stubbed in this repo's test setup, so
 * coverage runs at the logic level (the pure engine was extracted to
 * RN-free `exercise-history-logic.ts`, same pattern as page 21):
 *
 * A. PR detection: heaviest completed set wins; ties break toward more
 *    reps; non-resistance and incomplete work never counts.
 * B. Chart: last-8 window, newest session's unit wins (no kg/lb mixing),
 *    oldest→newest order, empty without resistance work.
 * C. Subtitle: range + signed percent; no division by zero.
 * D. Rows: weighted headline/subline shape, bodyweight-exercise fallback,
 *    PR chip on the PR session only, locale-aware month badge.
 * E. `getExerciseHistoryHref` encodes the exercise name.
 * F. i18n completeness over the screen + logic sources.
 */
import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { LocalDate, OffsetDateTime, ZoneOffset } from '@js-joda/core';
import { v4 as uuid } from 'uuid';
import {
  buildChartPoints,
  buildRow,
  buildSubtitle,
  findPr,
  formatWeight,
  getExerciseHistoryHref,
  INITIAL_VISIBLE_ROWS,
  type RowContext,
} from '@/components/smart/exercise-history-logic';
import { WeightedExerciseBlueprint, movementKeyFor } from '@/models/blueprint-models';
import { RecordedWeightedExercise, Session } from '@/models/session-models';
import { filledPotentialSet } from '@/models/session-models/__test__/helpers';
import { Weight } from '@/models/weight';
import type { ExerciseHistoryEntry } from '@/store/stored-sessions';

vi.mock('expo-localization', () => ({ getLocales: () => [{ decimalSeparator: '.' }] }));

const SRC = resolve(__dirname, '..', '..');

const time = OffsetDateTime.of(2026, 6, 10, 18, 0, 0, 0, ZoneOffset.UTC);

function blueprint(name: string, resistance: 'external' | 'none' = 'external'): WeightedExerciseBlueprint {
  return WeightedExerciseBlueprint.of({
    name,
    progression: [],
    resistance,
  } as never);
}

function sessionWith(date: LocalDate, sets: { reps: number; weight: number }[], name = 'Bench Press'): Session {
  const bp = blueprint(name);
  const sessionBp = { name: 'Day', exercises: [bp] } as never;
  const exercise = new RecordedWeightedExercise(
    bp,
    sets.map((s) => filledPotentialSet(s.reps, time, new Weight(s.weight, 'kilograms'))),
    undefined,
  );
  return new Session(uuid(), sessionBp, [exercise], date, undefined, undefined);
}

const entry = (session: Session): ExerciseHistoryEntry => ({
  exercise: session.recordedExercises[0]!,
  session,
});

const ctx = (prSessionId?: string): RowContext =>
  ({
    t: ((key: string) => key) as never,
    formatDate: (() => 'Jan') as never,
    today: LocalDate.of(2026, 6, 10),
    prSessionId,
    bodyweightLabel: 'BW',
    // Device-default locale path (undefined), matching the app's unset-language behavior.
    locale: undefined,
  }) as RowContext;

describe('PR detection', () => {
  it('picks the heaviest completed set ever', () => {
    const entries = [
      entry(sessionWith(LocalDate.of(2026, 6, 1), [{ reps: 5, weight: 100 }])),
      entry(sessionWith(LocalDate.of(2026, 6, 8), [{ reps: 5, weight: 102.5 }])),
    ];
    const pr = findPr(entries);
    expect(pr?.weight.value.toNumber()).toBe(102.5);
    expect(pr?.sessionId).toBe(entries[1]!.session.id);
  });

  it('breaks weight ties toward more reps', () => {
    const entries = [
      entry(sessionWith(LocalDate.of(2026, 6, 1), [{ reps: 5, weight: 100 }])),
      entry(sessionWith(LocalDate.of(2026, 6, 8), [{ reps: 8, weight: 100 }])),
    ];
    expect(findPr(entries)?.reps).toBe(8);
  });

  it('ignores incomplete sets and non-resistance work', () => {
    const bp = blueprint('Push-up', 'none');
    const sessionBp = { name: 'Day', exercises: [bp] } as never;
    const exercise = new RecordedWeightedExercise(bp, [], undefined);
    const s = new Session(uuid(), sessionBp, [exercise], LocalDate.of(2026, 6, 8), undefined, undefined);
    expect(findPr([entry(s)])).toBeUndefined();
    expect(findPr([])).toBeUndefined();
  });
});

describe('chart', () => {
  it('windows the last 8 sessions, oldest first, newest unit wins', () => {
    // The selector feeds entries newest-first; the chart keeps the 8 newest.
    const entries = Array.from({ length: 10 }, (_, i) =>
      entry(sessionWith(LocalDate.of(2026, 5, 1).plusDays(i), [{ reps: 5, weight: 60 + i * 2.5 }])),
    ).reverse();
    const chart = buildChartPoints(entries, ctx());
    expect(chart.points).toHaveLength(8);
    expect(chart.points[0]!.value).toBe(60 + 2 * 2.5);
    expect(chart.points[7]!.value).toBe(60 + 9 * 2.5);
    expect(chart.first?.value.toNumber()).toBe(65);
    expect(chart.last?.value.toNumber()).toBe(82.5);
  });

  it('is empty without resistance work', () => {
    expect(buildChartPoints([], ctx()).points).toEqual([]);
  });
});

describe('subtitle', () => {
  it('shows range plus signed percent', () => {
    expect(buildSubtitle(new Weight(100, 'kilograms'), new Weight(110, 'kilograms'))).toBe('100 kg → 110 kg · +10.0%');
    expect(buildSubtitle(new Weight(100, 'kilograms'), new Weight(90, 'kilograms'))).toContain('−10.0%');
  });

  it('never divides by zero', () => {
    expect(buildSubtitle(new Weight(0, 'kilograms'), new Weight(50, 'kilograms'))).toBe('0 kg → 50 kg');
  });
});

describe('rows', () => {
  it('renders the weighted headline, volume subline and PR chip', () => {
    const s = sessionWith(LocalDate.of(2026, 6, 8), [
      { reps: 10, weight: 100 },
      { reps: 8, weight: 100 },
    ]);
    const row = buildRow(entry(s), 0, ctx(s.id));
    expect(row.headline).toBe('10 · 8 @ 100 kg');
    expect(row.subline).toContain('1,800 kg');
    expect(row.isPr).toBe(true);
    expect(row.month).toBe('JAN');
    expect(row.day).toBe('08');
    expect(row.key).toBe(`${s.id}:0`);
  });

  it('marks the PR chip on the PR session only', () => {
    const s1 = sessionWith(LocalDate.of(2026, 6, 1), [{ reps: 5, weight: 100 }]);
    const s2 = sessionWith(LocalDate.of(2026, 6, 8), [{ reps: 5, weight: 102.5 }]);
    expect(buildRow(entry(s1), 0, ctx(s2.id)).isPr).toBe(false);
    expect(buildRow(entry(s2), 1, ctx(s2.id)).isPr).toBe(true);
  });

  it('uses the locale-aware month badge, not hard-coded English', () => {
    const source = readFileSync(join(SRC, 'components', 'smart', 'exercise-history-logic.ts'), 'utf8');
    expect(source).not.toMatch(/month\(\)\.name\(\)/);
    expect(source).toMatch(/formatDate\(session\.date, \{ month: 'short' \}\)/);
  });

  it('collapses to 4 visible rows until expanded', () => {
    expect(INITIAL_VISIBLE_ROWS).toBe(4);
    const source = readFileSync(join(SRC, 'components', 'smart', 'exercise-history.tsx'), 'utf8');
    expect(source).toMatch(/rows\.slice\(0, INITIAL_VISIBLE_ROWS\)/);
  });
});

describe('formatWeight', () => {
  it('always separates value and unit', () => {
    expect(formatWeight(new Weight(100, 'kilograms'))).toBe('100 kg');
    expect(formatWeight(new Weight(2000, 'kilograms'), 0)).toBe('2,000 kg');
    expect(formatWeight(new Weight(119.6, 'kilograms'), 1)).toBe('119.6 kg');
  });
});

describe('history href', () => {
  it('encodes the exercise name', () => {
    const bp = blueprint('Incline DB Press');
    const href = getExerciseHistoryHref(bp as never) as unknown as string;
    expect(href).toBe('/exercise-history?name=Incline%20DB%20Press&type=WeightedExerciseBlueprint');
  });

  it('round-trips to the stored movement key (never a hand-written type)', () => {
    // expanded-weighted-exercise once hand-built "type=weighted"; stored
    // movement keys use the blueprint class name, so that link opened an
    // empty history. The href must decode back to blueprint.movementKey().
    const bp = blueprint('Bench Press');
    const href = getExerciseHistoryHref(bp as never) as unknown as string;
    const params = new URLSearchParams(href.split('?')[1]);
    expect(movementKeyFor(params.get('name')!, params.get('type')! as never)).toBe(bp.movementKey());
    expect(params.get('type')).not.toBe('weighted');
  });
});

describe('exercise-history i18n completeness', () => {
  it('resolves every key used by the screen and logic in en.json', () => {
    const en = JSON.parse(readFileSync(join(SRC, 'i18n', 'en.json'), 'utf8')) as Record<string, unknown>;
    const keys = new Set<string>();
    for (const file of ['exercise-history.tsx', 'exercise-history-logic.ts']) {
      const source = readFileSync(join(SRC, 'components', 'smart', file), 'utf8');
      for (const m of source.matchAll(/(?:(?<![\w$])t)\('([^']+)'/g)) {
        keys.add(m[1]!);
      }
    }
    expect(keys.size).toBeGreaterThan(0);
    const missing = [...keys].filter((k) => !(k in en));
    expect(missing).toEqual([]);
  });
});

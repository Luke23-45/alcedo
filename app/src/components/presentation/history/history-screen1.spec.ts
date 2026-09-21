import { makeSession, makeWeightedBlueprint, tickAt } from '@/models/session-models/__test__/helpers';
import {
  PotentialSet,
  RecordedSet,
  RecordedWeightedExercise,
} from '@/models/session-models/recorded-weighted-exercise';
import { Session } from '@/models/session-models/session';
import { Weight } from '@/models/weight';
import { Duration, LocalDate, YearMonth } from '@js-joda/core';
import { describe, expect, it, vi } from 'vitest';

/**
 * trends-overview-data cannot load under vitest (a transitive import uses
 * syntax the test transform rejects — pre-existing, unrelated to history).
 * history-stats delegates volume to it in production; here we stub the same
 * contract (effectiveWeight × completed reps, zero weights skipped) so the
 * aggregation wiring is still tested.
 */
vi.mock('@/components/presentation/stats/trends/overview/trends-overview-data', () => ({
  sessionVolumeKg: (session: {
    bodyweight: unknown;
    recordedExercises: Array<{
      potentialSets?: Array<{ set?: { repsCompleted?: number } | undefined }>;
      effectiveWeight?: (
        ps: { set?: { repsCompleted?: number } | undefined },
        bodyweight: unknown,
      ) => { value: { isZero(): boolean }; multipliedBy(n: number): unknown };
    }>;
  }) => {
    let total = 0;
    for (const exercise of session.recordedExercises) {
      if (typeof exercise.effectiveWeight !== 'function' || !exercise.potentialSets) {
        continue;
      }
      for (const ps of exercise.potentialSets) {
        if (!ps.set?.repsCompleted) {
          continue;
        }
        const weight = exercise.effectiveWeight(ps, session.bodyweight) as {
          value: { isZero(): boolean; toNumber(): number };
          multipliedBy(n: number): {
            convertTo(unit: string): { value: { toNumber(): number } };
          };
        };
        if (weight.value.isZero()) {
          continue;
        }
        total += weight.multipliedBy(ps.set.repsCompleted).convertTo('kilograms').value.toNumber();
      }
    }
    return total;
  },
}));
import { calendarGridRange } from './history-design';
import { EMPTY_FILTERS, isFilterActive, sessionMatchesFilters } from './filter-sheet/filter-logic';
import { HISTORY_DESIGN, loadLevelForVolume } from './history-design';
import {
  estimateSessionKcal,
  formatClockDuration,
  formatCount,
  sessionTotalReps,
  sessionTotalSets,
  sessionVolumeKg,
} from './history-stats';

type SetEntry = { weight: number; reps: number; hour: number; minute: number };

function completedExercise(name: string, entries: SetEntry[]): RecordedWeightedExercise {
  const blueprint = makeWeightedBlueprint({ name });
  let exercise = RecordedWeightedExercise.empty(blueprint, 'kilograms');
  entries.forEach(({ weight, reps, hour, minute }, index) => {
    exercise = exercise.withSet(index, (ps: PotentialSet) =>
      ps.with({
        set: RecordedSet.of({
          repsCompleted: reps,
          completionDateTime: tickAt(hour, minute),
        }),
        weight: new Weight(weight, 'kilograms'),
      }),
    );
  });
  return exercise;
}

/**
 * Deterministic session: 4 completed sets across 40 minutes.
 * Volume = 60×10 + 60×10 + 100×5 + 80×8 = 2,340 kg.
 */
function trainingSession(): Session {
  const squat = completedExercise('Squat', [
    { weight: 60, reps: 10, hour: 9, minute: 0 },
    { weight: 60, reps: 10, hour: 9, minute: 5 },
    { weight: 100, reps: 5, hour: 9, minute: 10 },
  ]);
  const bench = completedExercise('Bench Press', [{ weight: 80, reps: 8, hour: 9, minute: 40 }]);
  return makeSession([]).with({ recordedExercises: [squat, bench] });
}

describe('history screen 1 stats', () => {
  it('sums volume in kg across weighted sets', () => {
    expect(sessionVolumeKg(trainingSession())).toBeCloseTo(2340, 6);
  });

  it('counts only sets with completed reps', () => {
    expect(sessionTotalSets(trainingSession())).toBe(4);
    expect(sessionTotalSets(makeSession([]))).toBe(0);
  });

  it('sums completed reps', () => {
    expect(sessionTotalReps(trainingSession())).toBe(33);
  });

  it('estimates kcal from duration and volume', () => {
    // 3.5 × 40 min + 0.028 × 2340 kg = 205.52 → 206
    expect(estimateSessionKcal(trainingSession())).toBe(206);
  });

  it('formats clock durations', () => {
    expect(formatClockDuration(Duration.ofMinutes(45).plusSeconds(12))).toBe('45:12');
    expect(formatClockDuration(Duration.ofHours(4).plusMinutes(39).plusSeconds(2))).toBe('4:39:02');
  });

  it('never renders a fake zero duration', () => {
    expect(formatClockDuration(undefined)).toBe('—');
    expect(formatClockDuration(Duration.ZERO)).toBe('—');
  });

  it('formats counts with thousands separators', () => {
    expect(formatCount(8420)).toBe('8,420');
  });
});

describe('calendar load levels', () => {
  it.each([
    [0, 0],
    [0.5, 1],
    [3999.99, 1],
    [4000, 2],
    [6499, 2],
    [6500, 3],
    [8499, 3],
    [8500, 4],
    [20000, 4],
  ] as Array<[number, 0 | 1 | 2 | 3 | 4]>)('volume %s kg → level %s', (volume, level) => {
    expect(loadLevelForVolume(volume)).toBe(level);
  });

  it('uses the exact spec ring geometry', () => {
    expect(HISTORY_DESIGN.dayRingCircumference).toBeCloseTo(2 * Math.PI * 19, 10);
    expect(HISTORY_DESIGN.selectedRingCircumference).toBeCloseTo(2 * Math.PI * 23, 10);
    expect(HISTORY_DESIGN.levelFraction).toEqual([0, 0.25, 0.5, 0.75, 1]);
  });

  it('renders a Monday-first six-week grid', () => {
    // June 2026 opens on a Monday: no lead days, 42 cells ending 2026-07-12.
    const { start, end } = calendarGridRange(YearMonth.of(2026, 6));
    expect(start).toEqual(LocalDate.of(2026, 6, 1));
    expect(end).toEqual(LocalDate.of(2026, 7, 12));
  });
});

describe('history filters', () => {
  it('is inactive with empty filters', () => {
    expect(isFilterActive(EMPTY_FILTERS)).toBe(false);
    expect(isFilterActive({ ...EMPTY_FILTERS, query: 'bench' })).toBe(true);
    expect(isFilterActive({ ...EMPTY_FILTERS, types: ['Push Day'] })).toBe(true);
    expect(isFilterActive({ ...EMPTY_FILTERS, prsOnly: true })).toBe(true);
  });

  it('matches empty filters for any session', () => {
    expect(sessionMatchesFilters('Push Day', ['Bench Press'], false, EMPTY_FILTERS)).toBe(true);
  });

  it('searches session and exercise names case-insensitively', () => {
    const filters = { ...EMPTY_FILTERS, query: 'BENCH' };
    expect(sessionMatchesFilters('Push Day', ['Bench Press'], false, filters)).toBe(true);
    expect(sessionMatchesFilters('Pull Day', ['Row'], false, filters)).toBe(false);
  });

  it('filters by workout-type chip', () => {
    const filters = { ...EMPTY_FILTERS, types: ['Push Day'] };
    expect(sessionMatchesFilters('Push Day', [], false, filters)).toBe(true);
    expect(sessionMatchesFilters('Pull Day', [], false, filters)).toBe(false);
  });

  it('filters to PR sessions only', () => {
    const filters = { ...EMPTY_FILTERS, prsOnly: true };
    expect(sessionMatchesFilters('Push Day', [], true, filters)).toBe(true);
    expect(sessionMatchesFilters('Push Day', [], false, filters)).toBe(false);
  });

  it('combines filters with AND semantics', () => {
    const filters = { ...EMPTY_FILTERS, query: 'bench', prsOnly: true };
    expect(sessionMatchesFilters('Push Day', ['Bench Press'], true, filters)).toBe(true);
    expect(sessionMatchesFilters('Push Day', ['Bench Press'], false, filters)).toBe(false);
    expect(sessionMatchesFilters('Pull Day', ['Barbell Row'], true, filters)).toBe(false);
  });
});

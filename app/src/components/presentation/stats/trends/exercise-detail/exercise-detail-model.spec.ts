import { LocalDate } from '@js-joda/core';
import { describe, expect, it, vi } from 'vitest';

vi.mock('expo-localization', () => ({ getLocales: () => [{ decimalSeparator: '.' }] }));
import { SessionBlueprint } from '@/models/blueprint-models';
import type { ExerciseDescriptor } from '@/models/exercise-models';
import { Session } from '@/models/session-models';
import {
  makeRecordedExercise,
  makeSession,
  makeWeightedBlueprint,
  tickAt,
} from '@/models/session-models/__test__/helpers';
import { Weight } from '@/models/weight';
import type { RootState } from '@/store';
import {
  buildLogSession,
  formatBare,
  formatDeltaPercent,
  formatWeeklyRate,
  selectExerciseDetail,
  type ExerciseDetailData,
} from './exercise-detail-model';

const MINUS = '−'; // U+2212, the reference's minus

describe('formatDeltaPercent', () => {
  it('signs gains with +', () => {
    expect(formatDeltaPercent(100, 111.111, 'en-US')).toBe('+11.1%');
  });

  it('uses U+2212 for losses, matching the reference typography', () => {
    expect(formatDeltaPercent(100, 90, 'en-US')).toBe(`${MINUS}10.0%`);
  });

  it('reports a flat delta as 0.0%', () => {
    expect(formatDeltaPercent(100, 100, 'en-US')).toBe('0.0%');
  });

  it('uses the locale decimal separator', () => {
    expect(formatDeltaPercent(100, 111.111, 'de-DE')).toBe('+11,1%');
  });

  it('returns null when the baseline is zero or negative', () => {
    expect(formatDeltaPercent(0, 50, 'en-US')).toBeNull();
    expect(formatDeltaPercent(-10, 50, 'en-US')).toBeNull();
  });
});

describe('formatBare', () => {
  it('keeps one decimal for fractional values', () => {
    expect(formatBare(102.5)).toBe('102.5');
  });

  it('groups thousands for whole values', () => {
    expect(formatBare(2000)).toBe('2,000');
  });

  it('renders small whole values bare', () => {
    expect(formatBare(34)).toBe('34');
  });
});

describe('formatWeeklyRate', () => {
  it('renders near-integers without decimals', () => {
    expect(formatWeeklyRate(1, 'en-US')).toBe('1');
    expect(formatWeeklyRate(1.04, 'en-US')).toBe('1');
  });

  it('keeps one decimal otherwise', () => {
    expect(formatWeeklyRate(1.5, 'en-US')).toBe('1.5');
  });

  it('uses the locale decimal separator', () => {
    expect(formatWeeklyRate(1.5, 'de-DE')).toBe('1,5');
  });
});

function benchDescriptor(): ExerciseDescriptor {
  return {
    name: 'Barbell Bench Press',
    force: null,
    level: 'beginner',
    mechanic: 'compound',
    equipment: 'barbell',
    muscles: ['chest', 'triceps', 'shoulders'],
    instructions: '',
    category: 'strength',
  };
}

function benchSession(date: LocalDate, weightKg: number, reps: number[]): Session {
  const blueprint = makeWeightedBlueprint({ name: 'Barbell Bench Press' });
  const recorded = makeRecordedExercise(blueprint, reps, new Weight(weightKg, 'kilograms'), (i) => tickAt(10, i));
  return new Session(
    `session-${date.toString()}-${weightKg}`,
    new SessionBlueprint('Push Day', [blueprint], ''),
    [recorded],
    date,
    undefined,
    undefined,
  );
}

function stateWith(sessions: Session[], exercises: Record<string, ExerciseDescriptor>): RootState {
  return {
    storedSessions: {
      sessions: Object.fromEntries(sessions.map((s) => [s.id, s])),
      activeSessionId: undefined,
      builtInExercises: exercises,
      savedExercises: {},
      hiddenBuiltInIds: [],
    },
    settings: { useImperialUnits: false },
  } as unknown as RootState;
}

describe('selectExerciseDetail', () => {
  it('returns undefined when nothing was ever recorded', () => {
    const state = stateWith([], { bench: benchDescriptor() });
    expect(selectExerciseDetail(state, 'Barbell Bench Press')).toBeUndefined();
  });

  it('returns undefined for an unknown exercise name', () => {
    const state = stateWith([benchSession(LocalDate.now(), 100, [10, 10, 10])], {
      bench: benchDescriptor(),
    });
    expect(selectExerciseDetail(state, 'Nonexistent Lift')).toBeUndefined();
  });

  it('derives the all-time detail from finished sessions', () => {
    const today = LocalDate.now();
    const state = stateWith([benchSession(today, 100, [10, 10, 10]), benchSession(today.minusDays(10), 90, [8, 8])], {
      bench: benchDescriptor(),
    });
    const detail = selectExerciseDetail(state, 'Barbell Bench Press');
    expect(detail).toBeDefined();
    expect(detail!.sessionCount).toBe(2);
    expect(detail!.bestTopSet).toBe(100);
    // Newest first.
    expect(detail!.sessions[0]!.topSet).toBe(100);
    expect(detail!.sessions[1]!.topSet).toBe(90);
    // The earliest session that hit the all-time best owns the PR flag.
    expect(detail!.sessions[0]!.holdsWeightPr).toBe(true);
    expect(detail!.sessions[1]!.holdsWeightPr).toBe(false);
    // Only the session inside the trailing 7 days counts toward this week.
    expect(detail!.trailing7dVolume).toBe(100 * 30);
    expect(detail!.weeklyFrequency).toBe(1);
    // Equipment prefix stripped case-insensitively for the short name.
    expect(detail!.shortName).toBe('Bench Press');
    expect(detail!.equipment).toBe('barbell');
    expect(detail!.muscles).toEqual(['chest', 'triceps', 'shoulders']);
  });

  it('matches exercise names case-insensitively', () => {
    const state = stateWith([benchSession(LocalDate.now(), 100, [10])], {
      bench: benchDescriptor(),
    });
    expect(selectExerciseDetail(state, 'barbell bench press')).toBeDefined();
  });

  it('converts to imperial when the setting is on', () => {
    const state = stateWith([benchSession(LocalDate.now(), 100, [10])], {
      bench: benchDescriptor(),
    });
    (state as { settings: { useImperialUnits: boolean } }).settings.useImperialUnits = true;
    const detail = selectExerciseDetail(state, 'Barbell Bench Press');
    expect(detail!.unitLabel).toBe('lb');
    // 100 kg ≈ 220.5 lb.
    expect(detail!.bestTopSet).toBeGreaterThan(220);
  });

  it('keeps a single session honest: one node, no trend implied', () => {
    const state = stateWith([benchSession(LocalDate.now(), 100, [10])], {
      bench: benchDescriptor(),
    });
    const detail = selectExerciseDetail(state, 'Barbell Bench Press');
    expect(detail!.sessions).toHaveLength(1);
    expect(detail!.bestTopSet).toBe(detail!.sessions[0]!.topSet);
  });

  it('ignores sessions whose exercise was never started', () => {
    const blueprint = makeWeightedBlueprint({ name: 'Barbell Bench Press' });
    const empty = makeSession([blueprint], LocalDate.now());
    const state = stateWith([empty], { bench: benchDescriptor() });
    expect(selectExerciseDetail(state, 'Barbell Bench Press')).toBeUndefined();
  });
});

describe('buildLogSession', () => {
  const base: ExerciseDetailData = {
    exerciseName: 'Barbell Bench Press',
    shortName: 'Bench Press',
    equipment: 'barbell',
    muscles: ['chest'],
    mechanic: 'compound',
    unitLabel: 'kg',
    sessions: [],
    bestTopSet: 100,
    bestE1rm: 110,
    sessionCount: 1,
    trailing7dVolume: 3000,
    weeklyFrequency: 1,
    latestBodyweight: null,
    logBlueprint: null,
  };

  it('returns null when no blueprint was recorded', () => {
    expect(buildLogSession(base, false)).toBeNull();
  });

  it('builds a fresh freeform session preloaded with the latest blueprint', () => {
    const blueprint = makeWeightedBlueprint({ name: 'Barbell Bench Press' });
    const session = buildLogSession({ ...base, logBlueprint: blueprint }, false);
    expect(session).not.toBeNull();
    expect(session!.recordedExercises).toHaveLength(1);
  });
});

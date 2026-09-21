import { Duration } from '@js-joda/core';
import { describe, expect, it, vi } from 'vitest';
import { v4 as uuid } from 'uuid';
import { LocalDate } from '@js-joda/core';
import { SessionBlueprint, WeightedExerciseBlueprint, CardioExerciseSetBlueprint } from '@/models/blueprint-models';
import { RecordedWeightedExercise, Session } from '@/models/session-models';
import { Weight } from '@/models/weight';
import {
  filledPotentialSet,
  makeCardioBlueprint,
  makeRecordedExercise,
  makeSession,
  makeWeightedBlueprint,
  tick,
} from '@/models/session-models/__test__/helpers';
import {
  countPlanSets,
  estimatePlanMinutes,
  estimatePlanVolumeKg,
  formatRowSummary,
  heaviestRecordedWeightKg,
} from './plan-estimates';

vi.mock('expo-localization', () => ({ getLocales: () => [{ decimalSeparator: '.' }] }));

const restOf = (seconds: number) => ({
  minRest: Duration.ofSeconds(seconds),
  maxRest: Duration.ofSeconds(seconds * 2),
  failureRest: Duration.ofSeconds(seconds * 3),
});

/**
 * The spec's reference Push Day: 6 exercises, 19 sets, rests per the mock.
 * History is seeded with one logged session at the listed weights.
 */
function pushDaySession(): Session {
  const specs = [
    { name: 'Bench Press', sets: 4, reps: 5, weight: 100, rest: 90 },
    { name: 'Incline Dumbbell Press', sets: 3, reps: 8, weight: 34, rest: 60 },
    { name: 'Overhead Press', sets: 3, reps: 10, weight: 60, rest: 90 },
    { name: 'Cable Crossover', sets: 3, reps: 12, weight: 25, rest: 60 },
    { name: 'Triceps Pushdown', sets: 3, reps: 15, weight: 20, rest: 60 },
    { name: 'Pec Deck', sets: 3, reps: 12, weight: 33, rest: 60 },
  ];
  const blueprints = specs.map((s) =>
    makeWeightedBlueprint({
      name: s.name,
      sets: s.sets,
      repsConfig: { type: 'fixed', reps: s.reps },
      restBetweenSets: restOf(s.rest),
    }),
  );
  const recorded = specs.map((s, index) =>
    makeRecordedExercise(
      blueprints[index]!,
      Array.from({ length: s.sets }, () => s.reps),
      new Weight(s.weight, 'kilograms'),
    ),
  );
  return new Session(
    uuid(),
    new SessionBlueprint('Push Day', blueprints, ''),
    recorded,
    LocalDate.of(2025, 4, 5),
    undefined,
    undefined,
  );
}

describe('countPlanSets', () => {
  it('counts every planned set across the reference Push Day', () => {
    expect(countPlanSets(pushDaySession())).toBe(19);
  });

  it('is zero for an empty plan', () => {
    expect(countPlanSets(makeSession([]))).toBe(0);
  });
});

describe('estimatePlanMinutes', () => {
  it('matches the audited formula on the reference Push Day: 35 minutes', () => {
    // 19×45s work + rests (3×90 + 2×60 + 2×90 + 2×60 + 2×60 + 2×60) + 5×60s transitions
    // = 2085s → 35 min
    expect(estimatePlanMinutes(pushDaySession())).toBe(35);
  });

  it('is undefined for an empty plan so the UI shows "–" instead of 0', () => {
    expect(estimatePlanMinutes(makeSession([]))).toBeUndefined();
  });

  it('uses the 120s fallback for distance cardio', () => {
    const blueprint = makeCardioBlueprint(3);
    const session = makeSession([blueprint]);
    // Default cardio target is distance-based: 3 × 120s fallback + no transitions = 6 min
    expect(estimatePlanMinutes(session)).toBe(6);
  });

  it('uses actual time targets for time-based cardio', () => {
    const timeSet = new CardioExerciseSetBlueprint(
      { type: 'time', value: Duration.ofMinutes(20) },
      true,
      false,
      false,
      false,
      false,
      false,
      undefined,
    );
    const blueprint = makeCardioBlueprint(3).with({ sets: [timeSet, timeSet, timeSet] });
    const session = makeSession([blueprint]);
    // 3 × 20:00 time targets + no transitions = 60 min
    expect(estimatePlanMinutes(session)).toBe(60);
  });
});

describe('estimatePlanVolumeKg', () => {
  it('computes Σ(heaviest recorded weight × reps × sets) on the reference Push Day', () => {
    // 100×5×4 + 34×8×3 + 60×10×3 + 25×12×3 + 20×15×3 + 33×12×3 = 7,604
    expect(estimatePlanVolumeKg(pushDaySession())).toBe(7604);
  });

  it('is undefined for an empty plan so the UI shows "–" instead of 0', () => {
    expect(estimatePlanVolumeKg(makeSession([]))).toBeUndefined();
  });

  it('excludes exercises with no logged history', () => {
    const session = pushDaySession();
    const unlogged = new RecordedWeightedExercise(
      session.blueprint.exercises[0]! as WeightedExerciseBlueprint,
      [],
      undefined,
    );
    const edited = session.with({ recordedExercises: [unlogged, ...session.recordedExercises.slice(1)] });
    // Bench's 2,000 kg drops out
    expect(estimatePlanVolumeKg(edited)).toBe(7604 - 2000);
  });

  it('uses the heaviest set ever logged, not the average', () => {
    const blueprint = makeWeightedBlueprint({ sets: 3, repsConfig: { type: 'fixed', reps: 10 } });
    const recorded = new RecordedWeightedExercise(
      blueprint,
      [
        filledPotentialSet(10, tick(), new Weight(80, 'kilograms')),
        filledPotentialSet(10, tick(), new Weight(100, 'kilograms')),
        filledPotentialSet(10, tick(), new Weight(90, 'kilograms')),
      ],
      undefined,
    );
    const session = new Session(
      uuid(),
      new SessionBlueprint('Test', [blueprint], ''),
      [recorded],
      LocalDate.of(2025, 4, 5),
      undefined,
      undefined,
    );
    expect(estimatePlanVolumeKg(session)).toBe(100 * 10 * 3);
  });

  it('includes bodyweight in the effective weight for bodyweight moves', () => {
    const blueprint = makeWeightedBlueprint({
      name: 'Pull-Up',
      sets: 3,
      repsConfig: { type: 'fixed', reps: 8 },
      resistance: 'bodyweight',
    });
    const recorded = new RecordedWeightedExercise(
      blueprint,
      Array.from({ length: 3 }, () => filledPotentialSet(8, tick(), new Weight(10, 'kilograms'))),
      undefined,
    );
    const session = new Session(
      uuid(),
      new SessionBlueprint('Test', [blueprint], ''),
      [recorded],
      LocalDate.of(2025, 4, 5),
      new Weight(80, 'kilograms'),
      undefined,
    );
    // (80 bodyweight + 10 added) × 8 × 3
    expect(estimatePlanVolumeKg(session)).toBe(90 * 8 * 3);
  });

  it('converts imperial history into kilograms', () => {
    const blueprint = makeWeightedBlueprint({ sets: 2, repsConfig: { type: 'fixed', reps: 5 } });
    const recorded = makeRecordedExercise(
      blueprint,
      [5, 5],
      new Weight(220.462, 'pounds'), // ≈ 100 kg
    );
    const session = new Session(
      uuid(),
      new SessionBlueprint('Test', [blueprint], ''),
      [recorded],
      LocalDate.of(2025, 4, 5),
      undefined,
      undefined,
    );
    expect(estimatePlanVolumeKg(session)).toBeCloseTo(100 * 5 * 2, 0);
  });
});

describe('formatRowSummary', () => {
  const formatWeight = (kg: number) => `${kg} kg`;

  it('shows the history-derived weight for a logged exercise', () => {
    const session = pushDaySession();
    const blueprint = session.blueprint.exercises[0] as WeightedExerciseBlueprint;
    expect(formatRowSummary(blueprint, session.recordedExercises[0], undefined, formatWeight, 'Bodyweight')).toBe(
      '4 × 5  ·  100 kg  ·  90s rest',
    );
  });

  it('omits the weight segment when nothing was ever logged', () => {
    const blueprint = makeWeightedBlueprint({ name: 'Squat', sets: 3, repsConfig: { type: 'fixed', reps: 10 } });
    expect(formatRowSummary(blueprint, undefined, undefined, formatWeight, 'Bodyweight')).toBe('3 × 10  ·  90s rest');
  });

  it('labels bodyweight moves instead of showing a number', () => {
    const blueprint = makeWeightedBlueprint({
      name: 'Pull-Up',
      sets: 3,
      repsConfig: { type: 'fixed', reps: 8 },
      resistance: 'bodyweight',
    });
    const recorded = makeRecordedExercise(blueprint, [8, 8, 8]);
    expect(formatRowSummary(blueprint, recorded, new Weight(80, 'kilograms'), formatWeight, 'Bodyweight')).toBe(
      '3 × 8  ·  Bodyweight  ·  90s rest',
    );
  });

  it('formats cardio as sets × target', () => {
    const timeSet = new CardioExerciseSetBlueprint(
      { type: 'time', value: Duration.ofMinutes(20) },
      true,
      false,
      false,
      false,
      false,
      false,
      undefined,
    );
    const session = makeSession([makeCardioBlueprint(2).with({ sets: [timeSet, timeSet] })]);
    const blueprint = session.blueprint.exercises[0]!;
    expect(formatRowSummary(blueprint, session.recordedExercises[0], undefined, formatWeight, 'Bodyweight')).toBe(
      '2 × 20:00',
    );
  });
});

describe('heaviestRecordedWeightKg', () => {
  it('is undefined for a never-logged exercise', () => {
    expect(heaviestRecordedWeightKg(undefined, undefined)).toBeUndefined();
  });

  it('ignores zero-weight sets', () => {
    const blueprint = makeWeightedBlueprint({ sets: 2 });
    const recorded = new RecordedWeightedExercise(
      blueprint,
      [
        filledPotentialSet(10, tick(), new Weight(0, 'kilograms')),
        filledPotentialSet(10, tick(), new Weight(50, 'kilograms')),
      ],
      undefined,
    );
    expect(heaviestRecordedWeightKg(recorded, undefined)).toBe(50);
  });
});

import { describe, expect, it } from 'vitest';
import { matchExerciseName, parsePlanText, parsedPlanToBlueprint, restForSeconds } from './plan-parser';
import { Rest, WeightedExerciseBlueprint } from '@/models/blueprint-models';
import type { ExerciseDescriptor } from '@/models/exercise-models';

const DESCRIPTORS: Record<string, ExerciseDescriptor> = {
  a: { name: 'Barbell Bench Press' } as ExerciseDescriptor,
  b: { name: 'Incline DB Press' } as ExerciseDescriptor,
  c: { name: 'Seated Shoulder Press' } as ExerciseDescriptor,
  d: { name: 'Deadlift' } as ExerciseDescriptor,
  e: { name: 'Barbell Row' } as ExerciseDescriptor,
  f: { name: 'Pull-Up' } as ExerciseDescriptor,
};

const SAMPLE = `PUSH / PULL / LEGS — 6 DAY
Day 1 · Push
Bench Press      4x5   90s
Incline DB Press   3x8   90s
Shoulder Press     3x10  75s
Day 2 · Pull
Deadlift           3x5   120s
Barbell Row        4x8   90s
Pull-Up            3xAMRAP 90s`;

describe('parsePlanText', () => {
  it('parses the spec sample: title, two days, six exercises', () => {
    const plan = parsePlanText(SAMPLE, DESCRIPTORS);
    expect(plan.title).toBe('PUSH / PULL / LEGS — 6 DAY');
    expect(plan.days.map((d) => d.name)).toEqual(['Push', 'Pull']);
    expect(plan.total).toBe(6);
    expect(plan.recognized).toBe(6);
  });

  it('matches names fuzzily and flags renames', () => {
    const plan = parsePlanText(SAMPLE, DESCRIPTORS);
    const push = plan.days[0]!.exercises;
    expect(push[0]).toMatchObject({ name: 'Barbell Bench Press', matched: true, renamed: true });
    expect(push[1]).toMatchObject({ name: 'Incline DB Press', matched: true, renamed: false });
    expect(push[2]).toMatchObject({ name: 'Seated Shoulder Press', matched: true, renamed: true });
    expect(push[0]).toMatchObject({ sets: 4, reps: 5, restSeconds: 90 });
    expect(push[2]).toMatchObject({ sets: 3, reps: 10, restSeconds: 75 });
  });

  it('parses AMRAP and missing rest', () => {
    const plan = parsePlanText('Day 1\nPull-Up 3xAMRAP', DESCRIPTORS);
    expect(plan.days[0]!.exercises[0]).toMatchObject({ reps: 'amrap', restSeconds: undefined });
  });

  it('keeps unrecognized exercises with their pasted name', () => {
    const plan = parsePlanText('Day 1\nWobble Board Fling 3x12 60s', DESCRIPTORS);
    const exercise = plan.days[0]!.exercises[0]!;
    expect(exercise).toMatchObject({ matched: false, renamed: false, name: 'Wobble Board Fling' });
    expect(plan.recognized).toBe(0);
    expect(plan.total).toBe(1);
  });

  it('starts an implicit Day 1 when exercises precede any header', () => {
    const plan = parsePlanText('Bench Press 4x5 90s', DESCRIPTORS);
    expect(plan.days.map((d) => d.name)).toEqual(['Day 1']);
  });

  it('accepts "Day 2 - Pull" and bare "Day 3" headers', () => {
    const plan = parsePlanText('Day 2 - Pull\nDay 3', DESCRIPTORS);
    expect(plan.days.map((d) => d.name)).toEqual(['Pull', 'Day 3']);
  });
});

describe('matchExerciseName', () => {
  it('prefers the shortest containing descriptor', () => {
    expect(matchExerciseName('Shoulder Press', DESCRIPTORS)?.name).toBe('Seated Shoulder Press');
  });

  it('matches exact names regardless of case', () => {
    expect(matchExerciseName('deadlift', DESCRIPTORS)?.name).toBe('Deadlift');
  });

  it('returns undefined when nothing is close', () => {
    expect(matchExerciseName('Underwater Basket Weaving', DESCRIPTORS)).toBeUndefined();
  });
});

describe('restForSeconds', () => {
  it('maps rest seconds onto the planner presets', () => {
    expect(restForSeconds(undefined)).toBe(Rest.medium);
    expect(restForSeconds(60)).toBe(Rest.short);
    expect(restForSeconds(90)).toBe(Rest.medium);
    expect(restForSeconds(120)).toBe(Rest.medium);
    expect(restForSeconds(180)).toBe(Rest.long);
  });
});

describe('parsedPlanToBlueprint', () => {
  it('builds a real blueprint with sessions, sets, reps, and rest', () => {
    const plan = parsePlanText(SAMPLE, DESCRIPTORS);
    const blueprint = parsedPlanToBlueprint(plan);
    expect(blueprint.name).toBe('PUSH / PULL / LEGS — 6 DAY');
    expect(blueprint.sessions.map((s) => s.name)).toEqual(['Push', 'Pull']);
    const push = blueprint.sessions[0]!.exercises;
    expect(push).toHaveLength(3);
    const bench = push[0] as WeightedExerciseBlueprint;
    expect(bench).toMatchObject({ name: 'Barbell Bench Press' });
    expect(bench.plannedSets).toHaveLength(4);
    // AMRAP becomes an open-ended rep range.
    const pullUp = blueprint.sessions[1]!.exercises[2] as WeightedExerciseBlueprint;
    expect(pullUp.plannedSets[0]).toMatchObject({ reps: { min: 1, max: 30 } });
  });

  it('falls back to "Imported plan" for an empty title', () => {
    const blueprint = parsedPlanToBlueprint({ title: '', days: [], recognized: 0, total: 0 });
    expect(blueprint.name).toBe('Imported plan');
  });
});

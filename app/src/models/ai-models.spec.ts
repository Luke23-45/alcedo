import { describe, expect, it } from 'vitest';
import { Duration, LocalDate } from '@js-joda/core';
import BigNumber from 'bignumber.js';
import { aiPlanFromJSON } from '@/models/ai-models';
import {
  CardioExerciseBlueprint,
  CardioExerciseSetBlueprint,
  ProgramBlueprint,
  ProgressionRule,
  Rest,
  SessionBlueprint,
  WeightedExerciseBlueprint,
} from '@/models/blueprint-models';
import { AnyVersionAiPlanJSON } from '@/models/storage/versions/any';
import { toBigNumberJSON, toDurationJSON, toLocalDateJSON } from '@/models/storage/versions/libs';
import { DeepPartial } from '@/utils/types';
import { makeWeightedBlueprint } from '@/models/session-models/__test__/helpers';

function parse(json: DeepPartial<AnyVersionAiPlanJSON>) {
  return aiPlanFromJSON(json);
}

function firstSession(json: DeepPartial<AnyVersionAiPlanJSON>) {
  return parse(json).blueprint.sessions[0]!;
}

function firstExercise(json: DeepPartial<AnyVersionAiPlanJSON>) {
  return firstSession(json).exercises[0]!;
}

describe('aiPlanFromJSON', () => {
  it('throws when the wire plan has no version', () => {
    expect(() => parse({})).toThrow();
  });

  it('passes a complete plan through untouched (only re-stamping lastEdited)', () => {
    const weighted = makeWeightedBlueprint({
      name: 'Squat',
      sets: 5,
      repsConfig: { type: 'fixed', reps: 5 },
      progression: [ProgressionRule.load(new BigNumber(2.5), { type: 'lowestSets', pick: 'middle' })],
      restBetweenSets: Rest.long,
      supersetWithNext: true,
      notes: 'Brace hard',
      link: 'https://example.com/squat',
    });
    const cardio = new CardioExerciseBlueprint(
      'Row',
      [
        new CardioExerciseSetBlueprint(
          {
            type: 'distance',
            value: { value: new BigNumber(2), unit: 'mile' },
          },
          true,
          true,
          true,
          true,
          true,
          true,
          undefined,
        ),
      ],
      'Steady pace',
      'https://example.com/row',
    );
    const blueprint = new ProgramBlueprint(
      'My Program',
      [new SessionBlueprint('Day 1', [weighted, cardio], 'Heavy day')],
      LocalDate.of(2020, 1, 1),
    );

    const result = parse({
      version: 3,
      name: 'Strength',
      description: 'A complete plan',
      blueprint: blueprint.toJSON(),
    });

    expect(result.name).toBe('Strength');
    expect(result.description).toBe('A complete plan');
    expect(result.blueprint.toJSON()).toEqual({
      ...blueprint.toJSON(),
      lastEdited: toLocalDateJSON(LocalDate.now()),
    });
  });

  describe('top-level fields', () => {
    it('fills empty description and blueprint when only a name streamed in', () => {
      const plan = parse({ version: 3, name: 'here' });

      expect(plan.name).toBe('here');
      expect(plan.description).toBe('');
      expect(plan.blueprint.name).toBe('');
      expect(plan.blueprint.sessions).toEqual([]);
    });

    it('always stamps the blueprint as last edited today', () => {
      const plan = parse({ version: 3, name: 'here' });

      expect(plan.blueprint.lastEdited.equals(LocalDate.now())).toBe(true);
    });

    it('keeps the provided name and description', () => {
      const plan = parse({
        version: 3,
        name: 'PPL',
        description: 'Push pull legs',
      });

      expect(plan.name).toBe('PPL');
      expect(plan.description).toBe('Push pull legs');
    });
  });

  describe('sessions', () => {
    it('fills missing exercises and notes on a session', () => {
      const session = firstSession({
        version: 3,
        name: 'PPL',
        blueprint: { sessions: [{ name: 'Day 1' }] },
      });

      expect(session.name).toBe('Day 1');
      expect(session.exercises).toEqual([]);
      expect(session.notes).toBe('');
    });

    it('fills every session in the array', () => {
      const plan = parse({
        version: 3,
        name: 'PPL',
        blueprint: { sessions: [{ name: 'Day 1' }, { name: 'Day 2' }] },
      });

      expect(plan.blueprint.sessions.map((s) => s.name)).toEqual(['Day 1', 'Day 2']);
    });
  });

  describe('weighted exercises', () => {
    it('defaults an exercise with no type to a weighted exercise', () => {
      const exercise = firstExercise({
        version: 3,
        name: 'PPL',
        blueprint: { sessions: [{ exercises: [{ name: 'Bench' }] }] },
      });

      expect(exercise).toBeInstanceOf(WeightedExerciseBlueprint);
    });

    it('falls back to the empty weighted defaults for absent fields', () => {
      const exercise = firstExercise({
        version: 3,
        name: 'PPL',
        blueprint: { sessions: [{ exercises: [{ name: 'Bench' }] }] },
      }) as WeightedExerciseBlueprint;

      const empty = WeightedExerciseBlueprint.empty();
      expect(exercise.name).toBe('Bench');
      expect(exercise.plannedSets).toEqual(empty.plannedSets);
      expect(exercise.supersetWithNext).toBe(false);
      expect(exercise.notes).toBe('');
      expect(exercise.link).toBe('');
      expect(exercise.progression).toEqual([]);
      expect(exercise.restBetweenSets.minRest.equals(Rest.medium.minRest)).toBe(true);
    });

    it('fills only the missing parts of rest', () => {
      const exercise = firstExercise({
        version: 3,
        name: 'PPL',
        blueprint: {
          sessions: [
            {
              exercises: [
                {
                  type: 'WeightedExerciseBlueprint',
                  restBetweenSets: {
                    minRest: toDurationJSON(Duration.ofSeconds(45)),
                  },
                },
              ],
            },
          ],
        },
      }) as WeightedExerciseBlueprint;

      expect(exercise.restBetweenSets.minRest.equals(Duration.ofSeconds(45))).toBe(true);
      expect(exercise.restBetweenSets.maxRest.equals(Rest.medium.maxRest)).toBe(true);
      expect(exercise.restBetweenSets.failureRest.equals(Rest.medium.failureRest)).toBe(true);
    });

    it('keeps every field of a fully specified weighted exercise', () => {
      const exercise = firstExercise({
        version: 3,
        name: 'PPL',
        blueprint: {
          sessions: [
            {
              exercises: [
                {
                  type: 'WeightedExerciseBlueprint',
                  name: 'Squat',
                  plannedSets: Array.from({ length: 5 }, () => ({ reps: { min: 5, max: 5 } })),
                  supersetWithNext: true,
                  notes: 'Go deep',
                  link: 'https://example.com',
                  restBetweenSets: {
                    minRest: toDurationJSON(Duration.ofSeconds(120)),
                    maxRest: toDurationJSON(Duration.ofSeconds(180)),
                    failureRest: toDurationJSON(Duration.ofSeconds(300)),
                  },
                  progression: [
                    {
                      axis: 'load',
                      step: toBigNumberJSON(new BigNumber(5)),
                      scope: { type: 'allSets' },
                      trigger: 'allSetsMetTarget',
                    },
                  ],
                },
              ],
            },
          ],
        },
      }) as WeightedExerciseBlueprint;

      expect(exercise.name).toBe('Squat');
      expect(exercise.plannedSets).toEqual(Array.from({ length: 5 }, () => ({ reps: { min: 5, max: 5 } })));
      expect(exercise.supersetWithNext).toBe(true);
      expect(exercise.notes).toBe('Go deep');
      expect(exercise.link).toBe('https://example.com');
      expect(exercise.progression).toHaveLength(1);
      expect(exercise.progression[0]!.step.toNumber()).toBe(5);
      expect(exercise.progression[0]!.scope).toEqual({ type: 'allSets' });
    });
  });

  describe('progression rules', () => {
    function exerciseWithProgression(progression: unknown) {
      return firstExercise({
        version: 3,
        name: 'PPL',
        blueprint: {
          sessions: [{ exercises: [{ type: 'WeightedExerciseBlueprint', progression }] }],
        },
      } as DeepPartial<AnyVersionAiPlanJSON>) as WeightedExerciseBlueprint;
    }

    it('defaults the step when only the axis streamed in', () => {
      const exercise = exerciseWithProgression([{ axis: 'load' }]);

      expect(exercise.progression).toHaveLength(1);
      expect(exercise.progression[0]!.step.toNumber()).toBe(2.5);
      expect(exercise.progression[0]!.scope).toEqual({ type: 'allSets' });
      expect(exercise.progression[0]!.trigger).toBe('allSetsMetTarget');
    });

    it('defaults the pick of a lowest-sets scope', () => {
      const exercise = exerciseWithProgression([{ axis: 'load', scope: { type: 'lowestSets' } }]);

      expect(exercise.progression[0]!.scope).toEqual({ type: 'lowestSets', pick: 'all' });
    });

    it('defaults a rule with nothing at all to a load rule', () => {
      const exercise = exerciseWithProgression([{}]);

      expect(exercise.progression[0]!.axis).toBe('load');
    });

    it('leaves an absent list empty rather than inventing a rule', () => {
      expect(exerciseWithProgression(undefined).progression).toEqual([]);
    });

    it('keeps the order the model emitted', () => {
      const exercise = exerciseWithProgression([{ axis: 'reps', step: '1' }, { axis: 'load' }]);

      expect(exercise.progression.map((rule) => rule.axis)).toEqual(['reps', 'load']);
    });
  });

  describe('cardio exercises', () => {
    it('produces a default time set when none streamed in', () => {
      const exercise = firstExercise({
        version: 3,
        name: 'PPL',
        blueprint: {
          sessions: [
            {
              exercises: [{ type: 'CardioExerciseBlueprint', name: 'Run' }],
            },
          ],
        },
      }) as CardioExerciseBlueprint;

      expect(exercise).toBeInstanceOf(CardioExerciseBlueprint);
      expect(exercise.name).toBe('Run');
      expect(exercise.sets).toHaveLength(1);
      expect(exercise.sets[0]!.target.type).toBe('time');
    });

    it('fills a partial distance target', () => {
      const exercise = firstExercise({
        version: 3,
        name: 'PPL',
        blueprint: {
          sessions: [
            {
              exercises: [
                {
                  type: 'CardioExerciseBlueprint',
                  name: 'Run',
                  sets: [{ target: { type: 'distance' } }],
                },
              ],
            },
          ],
        },
      }) as CardioExerciseBlueprint;

      const target = exercise.sets[0]!.target;
      expect(target.type).toBe('distance');
      if (target.type === 'distance') {
        expect(target.value.unit).toBe('kilometre');
        expect(target.value.value.toNumber()).toBe(0);
      }
    });
  });

  describe('hostile model values', () => {
    // Bypass contextual typing: the whole point is feeding values the schema
    // would never produce, so the literal is cast at the boundary.
    function hostileExercise(exercise: unknown) {
      return firstExercise({
        version: 3,
        name: 'PPL',
        blueprint: {
          sessions: [{ exercises: [exercise] }],
        },
      } as DeepPartial<AnyVersionAiPlanJSON>);
    }

    it('coerces a wrong-typed enum axis to the default instead of casting', () => {
      const exercise = hostileExercise({
        type: 'WeightedExerciseBlueprint',
        name: 'Squat',
        progression: [{ axis: 'sideways', step: '2.5', scope: { type: 'allSets' }, trigger: 'allSetsMetTarget' }],
      }) as WeightedExerciseBlueprint;

      expect(exercise.progression[0]!.axis).toBe('load');
    });

    it('coerces a non-numeric step string to the default', () => {
      const exercise = hostileExercise({
        type: 'WeightedExerciseBlueprint',
        name: 'Squat',
        progression: [{ axis: 'load', step: 'lots', scope: { type: 'allSets' }, trigger: 'allSetsMetTarget' }],
      }) as WeightedExerciseBlueprint;

      expect(exercise.progression[0]!.step.toString()).toBe('2.5');
    });

    it('coerces a bad scope pick to all', () => {
      const exercise = hostileExercise({
        type: 'WeightedExerciseBlueprint',
        name: 'Squat',
        progression: [
          { axis: 'reps', step: '1', scope: { type: 'lowestSets', pick: 'everywhere' }, trigger: 'allSetsMetTarget' },
        ],
      }) as WeightedExerciseBlueprint;

      const scope = exercise.progression[0]!.scope;
      expect(scope.type).toBe('lowestSets');
      if (scope.type === 'lowestSets') {
        expect(scope.pick).toBe('all');
      }
    });

    it('coerces a bad resistance value to the empty-exercise default', () => {
      const exercise = hostileExercise({
        type: 'WeightedExerciseBlueprint',
        name: 'Squat',
        resistance: 'telekinetic',
      }) as WeightedExerciseBlueprint;

      expect(['none', 'external', 'bodyweight']).toContain(exercise.resistance);
    });

    it('coerces a truthy non-boolean superset flag to the default', () => {
      const exercise = hostileExercise({
        type: 'WeightedExerciseBlueprint',
        name: 'Squat',
        supersetWithNext: 'yes',
      }) as WeightedExerciseBlueprint;

      expect(exercise.supersetWithNext).toBe(false);
    });

    it('coerces a bad distance unit to kilometre', () => {
      const exercise = hostileExercise({
        type: 'CardioExerciseBlueprint',
        name: 'Run',
        sets: [{ target: { type: 'distance', value: { value: '5', unit: 'furlongs' } } }],
      }) as CardioExerciseBlueprint;

      const target = exercise.sets[0]!.target;
      if (target.type === 'distance') {
        expect(target.value.unit).toBe('kilometre');
      } else {
        expect.unreachable('expected a distance target');
      }
    });

    it('coerces a malformed duration string to the default', () => {
      const exercise = hostileExercise({
        type: 'WeightedExerciseBlueprint',
        name: 'Squat',
        restBetweenSets: { minRest: 'soon', maxRest: 'later', failureRest: 'PT5M' },
      }) as WeightedExerciseBlueprint;

      expect(exercise.restBetweenSets.minRest.toString()).not.toBe('soon');
      expect(exercise.restBetweenSets.failureRest.toString()).toBe('PT5M');
    });

    it('coerces non-boolean cardio track flags to the defaults', () => {
      const exercise = hostileExercise({
        type: 'CardioExerciseBlueprint',
        name: 'Run',
        sets: [{ target: { type: 'time', value: 'PT30M' }, trackDistance: 1 }],
      }) as CardioExerciseBlueprint;

      expect(typeof exercise.sets[0]!.trackDistance).toBe('boolean');
    });
  });
});

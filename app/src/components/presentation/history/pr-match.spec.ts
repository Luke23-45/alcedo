import { Weight } from '@/models/weight';
import {
  PotentialSet,
  RecordedSet,
  RecordedWeightedExercise,
} from '@/models/session-models/recorded-weighted-exercise';
import { makeSession, makeWeightedBlueprint, tick } from '@/models/session-models/__test__/helpers';
import { Session } from '@/models/session-models/session';
import { calculateOneRepMax } from '@/store/stats/calculate-stats';
import { PersonalRecord } from '@/store/stats/personal-records';
import { describe, expect, it } from 'vitest';
import { matchSessionPrs } from './pr-match';

function completed(bpName: string, sets: Array<{ weight: number; reps: number }>): RecordedWeightedExercise {
  const blueprint = makeWeightedBlueprint({ name: bpName });
  let exercise = RecordedWeightedExercise.empty(blueprint, 'kilograms');
  sets.forEach(({ weight, reps }, index) => {
    exercise = exercise.withSet(index, (ps: PotentialSet) =>
      ps.with({
        set: new RecordedSet(reps, tick()),
        weight: new Weight(weight, 'kilograms'),
      }),
    );
  });
  return exercise;
}

function sessionWith(exercises: RecordedWeightedExercise[]): Session {
  const session = makeSession([]);
  return session.with({ recordedExercises: exercises });
}

describe('matchSessionPrs', () => {
  it('marks the exercise and the record-setting set when the e1RM matches', () => {
    const press = completed('Shoulder Press', [
      { weight: 60, reps: 10 },
      { weight: 60, reps: 10 },
    ]);
    const bench = completed('Bench Press', [{ weight: 100, reps: 5 }]);
    const session = sessionWith([press, bench]);

    // The record is what findPersonalRecords would store: the set's e1RM
    // recomputed through the same formula (BigNumber-exact, not rounded).
    const firstSet = press.potentialSets[0]!;
    const recordE1rm = calculateOneRepMax(firstSet, press.effectiveWeight(firstSet, session.bodyweight));
    const records: PersonalRecord[] = [{ exerciseName: 'Shoulder Press', oneRepMax: recordE1rm }];

    const [pressMatch, benchMatch] = matchSessionPrs(session, records);

    expect(pressMatch!.hasPr).toBe(true);
    expect([...pressMatch!.prSetIndexes]).toEqual([0, 1]);
    expect(pressMatch!.prSet).toMatchObject({ reps: 10 });
    expect(pressMatch!.prSet!.weight.equals(new Weight(60, 'kilograms'))).toBe(true);
    expect(benchMatch!.hasPr).toBe(false);
    expect(benchMatch!.prSetIndexes.size).toBe(0);
    expect(benchMatch!.prSet).toBeUndefined();
  });

  it('ignores records for other sessions and unstarted exercises', () => {
    const session = sessionWith([completed('Squat', [{ weight: 100, reps: 5 }])]);
    const records: PersonalRecord[] = [{ exerciseName: 'Deadlift', oneRepMax: new Weight(200, 'kilograms') }];
    const [match] = matchSessionPrs(session, records);
    expect(match!.hasPr).toBe(false);

    const untouched = sessionWith([
      RecordedWeightedExercise.empty(makeWeightedBlueprint({ name: 'Squat' }), 'kilograms'),
    ]);
    const [untouchedMatch] = matchSessionPrs(untouched, [
      { exerciseName: 'Squat', oneRepMax: new Weight(100, 'kilograms') },
    ]);
    expect(untouchedMatch!.hasPr).toBe(false);
  });

  it('handles missing records without throwing', () => {
    const session = sessionWith([completed('Squat', [{ weight: 100, reps: 5 }])]);
    expect(matchSessionPrs(session, undefined).every((m) => !m.hasPr)).toBe(true);
  });
});

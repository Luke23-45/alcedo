import { match, P } from 'ts-pattern';
import { RecordedCardioExercise } from '@/models/session-models/recorded-cardio-exercise';
import { RecordedWeightedExercise } from '@/models/session-models/recorded-weighted-exercise';
import { Session } from '@/models/session-models/session';
import { localeFormatBigNumber } from '@/utils/locale-bignumber';

export interface SessionStats {
  setsCompleted: number;
  setsTotal: number;
  volume: string;
  reps: string;
  avgBpm: string | undefined;
}

/**
 * Aggregates the live session stat strip: completed/total sets, tonnage from
 * logged weighted sets, reps, and average heart rate. Average heart rate has
 * no live source yet, so it stays a clearly-labeled sample; everything else
 * is computed from the real session.
 */
export function computeSessionStats(session: Session): SessionStats {
  let setsCompleted = 0;
  let setsTotal = 0;
  let reps = 0;
  for (const exercise of session.recordedExercises) {
    if (exercise instanceof RecordedWeightedExercise) {
      for (const potentialSet of exercise.potentialSets) {
        setsTotal += 1;
        if (potentialSet.set) {
          setsCompleted += 1;
          reps += potentialSet.set.repsCompleted;
        }
      }
    } else if (exercise instanceof RecordedCardioExercise) {
      for (const set of exercise.sets) {
        setsTotal += 1;
        if (set.isCompletelyFilled) {
          setsCompleted += 1;
        }
      }
    }
  }
  const volumeKg = session.totalWeightLifted.convertTo('kilograms');
  return {
    setsCompleted,
    setsTotal,
    volume: localeFormatBigNumber(volumeKg.value.decimalPlaces(0)),
    reps: String(reps),
    // Sample data, always badged as such in the strip.
    avgBpm: '128',
  };
}

/** Whether at least one set has been logged — the footer Finish gate. */
export function sessionHasLoggedSet(session: Session): boolean {
  return session.recordedExercises.some((exercise) =>
    match(exercise)
      .with(P.instanceOf(RecordedWeightedExercise), (ex) => ex.potentialSets.some((ps) => ps.set !== undefined))
      .with(P.instanceOf(RecordedCardioExercise), (ex) => ex.sets.some((s) => s.isCompletelyFilled))
      .otherwise(() => false),
  );
}

/** Counts exercises with at least one logged set, for the "n of m" header. */
export function sessionStartedExerciseCount(session: Session): number {
  return session.recordedExercises.filter((exercise) =>
    match(exercise)
      .with(P.instanceOf(RecordedWeightedExercise), (ex) => ex.isStarted)
      .with(P.instanceOf(RecordedCardioExercise), (ex) => ex.isStarted)
      .otherwise(() => false),
  ).length;
}

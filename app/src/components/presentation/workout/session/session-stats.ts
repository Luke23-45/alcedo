import { match, P } from 'ts-pattern';
import { RecordedCardioExercise } from '@/models/session-models/recorded-cardio-exercise';
import { RecordedWeightedExercise } from '@/models/session-models/recorded-weighted-exercise';
import { Session } from '@/models/session-models/session';
import { shortFormatWeightUnit, Weight } from '@/models/weight';
import { localeFormatBigNumber } from '@/utils/locale-bignumber';

export interface SessionStats {
  setsCompleted: number;
  setsTotal: number;
  volume: string;
  reps: string;
  avgBpm: string | undefined;
}

export interface SessionTotals {
  setsCompleted: number;
  setsTotal: number;
  setsRemaining: number;
  volume: string;
  bestSingleSet: string | undefined;
  reps: string;
  avgRepsPerSet: string | undefined;
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

/**
 * Computes the 2×2 totals grid metrics for the session list view:
 * TIME · SETS · VOLUME KG · REPS, along with their respective micro-details.
 */
export function computeSessionTotals(session: Session): SessionTotals {
  let setsCompleted = 0;
  let setsTotal = 0;
  let reps = 0;
  let bestWeight: Weight | undefined = undefined;
  let bestReps = 0;

  for (const exercise of session.recordedExercises) {
    if (exercise instanceof RecordedWeightedExercise) {
      for (const potentialSet of exercise.potentialSets) {
        setsTotal += 1;
        if (potentialSet.set) {
          setsCompleted += 1;
          reps += potentialSet.set.repsCompleted;
          if (
            potentialSet.set.type !== 'warmUp' &&
            (!bestWeight || potentialSet.weight.convertTo('kilograms').isGreaterThan(bestWeight.convertTo('kilograms')))
          ) {
            bestWeight = potentialSet.weight;
            bestReps = potentialSet.set.repsCompleted;
          }
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
  const bestSingleSet = bestWeight
    ? `· ${localeFormatBigNumber(bestWeight.value.decimalPlaces(bestWeight.value.isInteger() ? 0 : 1))} ${shortFormatWeightUnit(bestWeight.unit)} × ${bestReps}`
    : undefined;

  const avgRepsPerSet = setsCompleted > 0 ? `· ${Math.round(reps / setsCompleted)} avg/set` : undefined;

  return {
    setsCompleted,
    setsTotal,
    setsRemaining: Math.max(0, setsTotal - setsCompleted),
    volume: localeFormatBigNumber(volumeKg.value.decimalPlaces(0)),
    bestSingleSet,
    reps: String(reps),
    avgRepsPerSet,
  };
}


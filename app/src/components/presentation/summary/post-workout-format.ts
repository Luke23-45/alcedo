import { RecordedCardioExercise } from '@/models/session-models/recorded-cardio-exercise';
import { RecordedWeightedExercise } from '@/models/session-models/recorded-weighted-exercise';
import { Session } from '@/models/session-models/session';
import { MovementKey } from '@/models/blueprint-models';
import { Weight } from '@/models/weight';
import { localeFormatBigNumber } from '@/utils/locale-bignumber';
import { Duration } from '@js-joda/core';

/** "45:12" / "1:02:05" — the clock the reference renders for a session duration. */
export function formatSessionClock(duration: Duration | undefined): string {
  if (!duration) {
    return '—';
  }
  const totalSeconds = Math.max(0, Math.floor(duration.toMillis() / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const mmss = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  return hours > 0 ? `${hours}:${mmss}` : mmss;
}

/** "+1:52" / "−0:35" — signed delta between two durations. */
export function formatDurationDelta(current: Duration, previous: Duration): string {
  const diffSeconds = Math.round(current.minus(previous).toMillis() / 1000);
  const sign = diffSeconds > 0 ? '+' : diffSeconds < 0 ? '−' : '';
  const abs = Math.abs(diffSeconds);
  return `${sign}${formatSessionClock(Duration.ofSeconds(abs))}`;
}

/** "8,420 kg" / "102.5 kg" / "225 lb" — whole units when integral, one decimal otherwise. */
export function formatWeightShort(weight: Weight): string {
  const decimals = weight.value.isInteger() ? 0 : 1;
  return `${localeFormatBigNumber(weight.value, decimals)} ${weight.unit === 'pounds' ? 'lb' : 'kg'}`;
}

/** Completed sets across weighted and cardio exercises — "19" in the reference. */
export function completedSetCount(session: Session): number {
  let count = 0;
  for (const exercise of session.recordedExercises) {
    if (exercise instanceof RecordedWeightedExercise) {
      count += exercise.potentialSets.filter((ps) => ps.set !== undefined).length;
    } else if (exercise instanceof RecordedCardioExercise) {
      count += exercise.sets.filter((s) => s.isCompletelyFilled).length;
    }
  }
  return count;
}

/**
 * The heaviest recorded set in the session and the exercise it came from —
 * "Top set · Bench" in the vs-previous table. Uses the effective weight so
 * bodyweight movements compare honestly against loaded ones.
 */
export function sessionTopSet(
  session: Session,
): { weight: Weight; exerciseName: string; movementKey: MovementKey } | undefined {
  let best: { weight: Weight; exerciseName: string; movementKey: MovementKey } | undefined;
  for (const exercise of session.recordedExercises) {
    if (!(exercise instanceof RecordedWeightedExercise) || !exercise.tracksResistance) {
      continue;
    }
    const candidate = heaviestRecordedSet(exercise, session);
    if (candidate && (!best || candidate.weight.isGreaterThan(best.weight))) {
      best = {
        weight: candidate.weight,
        exerciseName: exercise.blueprint.name,
        movementKey: exercise.movementKey(),
      };
    }
  }
  return best;
}

/**
 * The heaviest recorded set for a specific movement in a session, so the
 * vs-previous table compares the same exercise across sessions instead of
 * pitting one session's bench against another's squat.
 */
export function sessionBestSetForMovement(
  session: Session,
  movementKey: MovementKey,
): { weight: Weight; exerciseName: string } | undefined {
  for (const exercise of session.recordedExercises) {
    if (!(exercise instanceof RecordedWeightedExercise) || !exercise.tracksResistance) {
      continue;
    }
    if (exercise.movementKey() !== movementKey) {
      continue;
    }
    const candidate = heaviestRecordedSet(exercise, session);
    if (candidate) {
      return { weight: candidate.weight, exerciseName: exercise.blueprint.name };
    }
  }
  return undefined;
}

function heaviestRecordedSet(exercise: RecordedWeightedExercise, session: Session): { weight: Weight } | undefined {
  let best: Weight | undefined;
  for (const ps of exercise.potentialSets) {
    if (!ps.set) {
      continue;
    }
    const weight = exercise.effectiveWeight(ps, session.bodyweight);
    if (!best || weight.isGreaterThan(best)) {
      best = weight;
    }
  }
  return best ? { weight: best } : undefined;
}

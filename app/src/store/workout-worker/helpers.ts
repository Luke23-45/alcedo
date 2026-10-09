import { Rest } from '@/models/blueprint-models';
import { RecordedCardioExercise, RecordedExercise, RecordedWeightedExercise, Session } from '@/models/session-models';
import { toDurationJSON, toInstantJson } from '@/models/storage/versions/latest';
import { CardioTimerInfo, CurrentExerciseDetails, RestTimerInfo } from '@/models/workout-worker-messages';
import { Duration } from '@js-joda/core';

export function workoutUpdatedEvent(session: Session, restTimersEnabled: boolean) {
  return {
    type: 'WorkoutUpdatedEvent',
    workout: session.toJSON(),
    restTimerInfo: restTimersEnabled ? getTimerInfo(session) : undefined,
    cardioTimerInfo: getCardioTimerInfo(session),
    currentExerciseDetails: getCurrentExerciseDetails(session),
    totalWeightLifted: session.totalWeightLifted.toJSON(),
    workoutDuration: toDurationJSON(session.duration ?? Duration.ZERO),
  } as const;
}

export function getCardioTimerInfo(session: Session): CardioTimerInfo | undefined {
  const running = session.runningCardioSet;
  if (!running || session.workoutPhase === 'paused') {
    return undefined;
  }

  const { set, exerciseIndex, setIndex } = running;
  return {
    currentBlockStartTime: toInstantJson(set.currentBlockStartTime?.toInstant()),
    // The notification anchors its clock at `currentBlockStartTime - currentDuration`, so this must
    // be the set's own banked time and not the exercise's running total.
    currentDuration: toDurationJSON(set.duration ?? Duration.ZERO),
    exerciseIndex,
    setIndex,
  };
}

export function getCurrentExerciseDetails(session: Session): CurrentExerciseDetails | undefined {
  return session.nextExercise
    ? {
        exercise: session.nextExercise.toJSON(),
        setIndex: session.nextExercise.currentSetIndex,
      }
    : undefined;
}

export function getTimerInfo(session: Session): RestTimerInfo | undefined {
  if (!session.restTimer || session.restTimer.isPaused || session.workoutPhase === 'paused') {
    return undefined;
  }
  const timerExercise =
    session.restTimer.exerciseIndex !== undefined
      ? session.recordedExercises[session.restTimer.exerciseIndex]
      : session.lastExercise;
  const nextExercise = session.nextExercise;
  if (!timerExercise || !nextExercise) {
    return undefined;
  }

  const rest = getRestWindow(timerExercise);
  if (!rest || rest.partialRest.equals(Duration.ZERO)) {
    return;
  }
  return {
    startedAt: toInstantJson(session.restTimer.startedAt.toInstant()),
    partiallyEndAt: toInstantJson(session.restTimer.startedAt.plus(rest.partialRest).toInstant()),
    endAt: toInstantJson(session.restTimer.startedAt.plus(rest.fullRest).toInstant()),
  };
}

/** Cardio rests per set and has nothing to fail; a weighted exercise rests per exercise. */
function getRestWindow(exercise: RecordedExercise) {
  if (exercise instanceof RecordedCardioExercise) {
    const rest = exercise.lastCompletedSet?.blueprint.restBetweenSets;
    return rest && { partialRest: rest.minRest, fullRest: rest.maxRest };
  }
  if (!(exercise instanceof RecordedWeightedExercise)) {
    return undefined;
  }

  const lastSet = exercise.lastRecordedSet;
  if (!lastSet?.set) {
    return { partialRest: Duration.ZERO, fullRest: Duration.ZERO };
  }

  const isWarmUp = lastSet.set.type === 'warmUp';
  const restConfig = isWarmUp ? Rest.short : exercise.blueprint.restBetweenSets;
  const { minRest, maxRest, failureRest } = restConfig;

  const targetMin = exercise.repsTargetForSet(exercise.potentialSets.indexOf(lastSet)).min;
  return lastSet.set.repsCompleted >= targetMin
    ? { partialRest: minRest, fullRest: maxRest }
    : { partialRest: failureRest, fullRest: failureRest };
}

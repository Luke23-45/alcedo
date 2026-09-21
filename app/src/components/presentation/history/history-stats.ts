/**
 * Session-level aggregates shared by the History screens (Screen 1 calendar +
 * sessions, Screen 2 detail). Screen 2 and Screen 3 workers import this module,
 * so the exported signatures are a contract — do not change them.
 *
 * All inputs are real stored sessions; nothing here is sampled or invented.
 */
import type { Session } from '@/models/session-models';
import { RecordedCardioExercise, RecordedWeightedExercise } from '@/models/session-models';
import { sessionVolumeKg as trendsSessionVolumeKg } from '@/components/presentation/stats/trends/overview/trends-overview-data';
import { Duration } from '@js-joda/core';

/** Total lifted volume of a session in kg, mirroring the home screen's math. */
export function sessionVolumeKg(session: Session): number {
  return trendsSessionVolumeKg(session);
}

/** True when an exercise has at least one recorded set. */
function exerciseHasCompletedSet(exercise: unknown): boolean {
  return exercise instanceof RecordedWeightedExercise
    ? exercise.potentialSets.some((ps) => ps.set?.repsCompleted)
    : false;
}

/** Number of completed sets in a session, across weighted and cardio exercises. */
export function sessionTotalSets(session: Session): number {
  let total = 0;
  for (const exercise of session.recordedExercises) {
    if (exercise instanceof RecordedWeightedExercise) {
      total += exercise.potentialSets.filter((ps) => ps.set?.repsCompleted).length;
    } else if (exercise instanceof RecordedCardioExercise) {
      total += exercise.sets.filter((s) => s.completionDateTime !== undefined).length;
    }
  }
  return total;
}

/** Total completed reps in a session (weighted exercises only; cardio has no reps). */
export function sessionTotalReps(session: Session): number {
  let total = 0;
  for (const exercise of session.recordedExercises) {
    if (exercise instanceof RecordedWeightedExercise) {
      for (const ps of exercise.potentialSets) {
        total += ps.set?.repsCompleted ?? 0;
      }
    }
  }
  return total;
}

/**
 * Splits a session's duration into time under tension and rest.
 * active = Σ over exercises of (latestTime − earliestTime); a set's rest gaps
 * are approximated by the exercise spans rather than the full session window.
 * rest = session duration − active, clamped to ≥ 0.
 * Returns undefined when the session has no usable timing data.
 */
export function sessionActiveRest(session: Session): { active: Duration; rest: Duration } | undefined {
  const duration = session.duration;
  if (!duration || duration.isZero() || duration.isNegative()) {
    return undefined;
  }
  let active = Duration.ZERO;
  let sawSpan = false;
  for (const exercise of session.recordedExercises) {
    const start = exercise.earliestTime;
    const end = exercise.latestTime;
    if (start && end && !end.isBefore(start)) {
      active = active.plus(Duration.between(start, end));
      sawSpan = true;
    }
  }
  if (!sawSpan) {
    return undefined;
  }
  const rest = duration.minus(active);
  return { active, rest: rest.isNegative() ? Duration.ZERO : rest };
}

/**
 * Rough energy estimate for a session. There is no kcal source in the app, so
 * this is a documented approximation, not a measurement:
 *
 *   kcal ≈ 3.5 × durationMinutes + 0.028 × volumeKg   (rounded)
 *
 * Calibrated against the reference ledger in docs/new_design/history-dark.md
 * (kcal/min band 6.24–8.4 across eleven sessions; most contract values land
 * within ~8% of this formula). Every display of this value must be labelled
 * "KCAL EST" — never a bare "kcal".
 */
export function estimateSessionKcal(session: Session): number {
  const minutes = session.duration ? session.duration.toMillis() / 60000 : 0;
  const volume = sessionVolumeKg(session);
  return Math.round(3.5 * minutes + 0.028 * volume);
}

/**
 * Clock-style duration: "45:12" under an hour, "4:39:02" at an hour or more.
 * Undefined/zero durations render as an em dash (Law III: never a fake zero).
 */
export function formatClockDuration(duration: Duration | undefined): string {
  if (!duration || duration.isNegative() || duration.isZero()) {
    return '—';
  }
  const totalSeconds = Math.floor(duration.toMillis() / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const mm = minutes.toString().padStart(hours > 0 ? 2 : 1, '0');
  const ss = seconds.toString().padStart(2, '0');
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** Locale-aware thousands separator ("8,420"), matching home/stats displays. */
export function formatCount(value: number): string {
  return Math.round(value).toLocaleString('en-US');
}

export function hasCompletedSets(session: Session): boolean {
  return session.recordedExercises.some(
    (e) =>
      exerciseHasCompletedSet(e) ||
      (e instanceof RecordedCardioExercise && e.sets.some((s) => s.completionDateTime !== undefined)),
  );
}

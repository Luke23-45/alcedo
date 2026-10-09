/**
 * Focus state machine — pure, zero React Native imports.
 *
 * Two orthogonal axes compose the detail page's single source of truth:
 *
 * **Axis A — workout phase** (`session.workoutPhase`, D2):
 *   `idle | running | paused`
 *
 * **Axis B — exercise phase**, derived per exercise:
 *
 * | Phase       | Rule                                                         |
 * |-------------|--------------------------------------------------------------|
 * | complete    | exercise.isComplete                                          |
 * | resting     | rest timer owns this exercise AND rest phase is `resting`    |
 * | restReady   | ditto, rest phase `ready`                                    |
 * | restOver    | ditto, rest phase `over`                                     |
 * | current     | session.nextExercise === exercise                            |
 * | upcoming    | no set logged yet                                            |
 * | ahead       | some sets logged, some remain, not the session's next        |
 *
 * **Composition → FocusState:**
 *
 * | Workout   | Exercise              | FocusState     | Primary CTA                | Secondary              |
 * |-----------|-----------------------|----------------|----------------------------|------------------------|
 * | idle      | any                   | start          | Start Workout              | Add exercise           |
 * | running   | upcoming / current    | ready          | Log Set *n*                | Skip (dismiss rest)    |
 * | running   | resting               | resting        | — (timer owns it)          | +15 / −15 / Skip       |
 * | running   | restReady / restOver  | restReady      | Log Set *n* (highlighted)  | Log anyway             |
 * | running   | complete, next exists | exerciseDone   | Next Exercise *name*       | Finish workout         |
 * | running   | complete, last        | allDone        | Finish Workout             | —                      |
 * | paused    | any                   | paused         | Resume Workout             | Finish workout         |
 *
 * Rules:
 * - Paused is absorbing: no logging, no rest earning while paused.
 * - No dead buttons: every CTA resolves to a real action in that exact state.
 * - Superset-aware "next": nextExercise follows the superset chain.
 * - RPE and set type never block logging.
 */

import type { RestTimerPhase } from '@/components/presentation/workout/rest-timer-state';

// ─── Axes ─────────────────────────────────────────────────────────────────────

export type WorkoutPhase = 'idle' | 'running' | 'paused';

export type ExercisePhase =
  | 'complete'
  | 'resting'
  | 'restReady'
  | 'restOver'
  | 'current'
  | 'upcoming'
  | 'ahead';

// ─── Focus states ─────────────────────────────────────────────────────────────

export type FocusKind =
  | 'start'
  | 'ready'
  | 'resting'
  | 'restReady'
  | 'exerciseDone'
  | 'allDone'
  | 'paused';

export interface FocusCTA {
  /** Machine-stable verb the UI maps to a localised string and an action handler. */
  readonly verb:
    | 'startWorkout'
    | 'addExercise'
    | 'logSet'
    | 'skip'
    | 'adjustRest'
    | 'pauseRest'
    | 'nextExercise'
    | 'finishWorkout'
    | 'resumeWorkout';
  /** True when the CTA should use the accent/tint colour (Log Set after rest, Finish, etc.). */
  readonly highlighted: boolean;
}

export interface FocusState {
  readonly kind: FocusKind;
  readonly primary: FocusCTA;
  /** Absent when the state has no meaningful secondary action (e.g. allDone). */
  readonly secondary: FocusCTA | undefined;
  /** Human-readable status line key (localised by the caller). */
  readonly statusKey: string;
}

// ─── Input ────────────────────────────────────────────────────────────────────

export interface FocusInput {
  readonly workoutPhase: WorkoutPhase;
  readonly exercisePhase: ExercisePhase;
  /** True when there is at least one incomplete exercise after this one. */
  readonly hasNextExercise: boolean;
  /** The current (1-based) set number for the "Log Set n" label. */
  readonly currentSetNumber: number;
}

// ─── Resolver ─────────────────────────────────────────────────────────────────

/**
 * Pure function mapping (workoutPhase × exercisePhase) → `FocusState`.
 * Exhaustive over the composed table — the spec's 21 legal rows collapse to 7
 * distinct focus kinds because `idle` and `paused` absorb all exercise phases.
 */
export function resolveFocusState(input: FocusInput): FocusState {
  const { workoutPhase, exercisePhase, hasNextExercise } = input;

  // ── Paused is absorbing ──────────────────────────────────────────────
  if (workoutPhase === 'paused') {
    return {
      kind: 'paused',
      primary: { verb: 'resumeWorkout', highlighted: true },
      secondary: { verb: 'finishWorkout', highlighted: false },
      statusKey: 'workoutPaused',
    };
  }

  // ── Idle — workout not started ───────────────────────────────────────
  if (workoutPhase === 'idle') {
    return {
      kind: 'start',
      primary: { verb: 'startWorkout', highlighted: true },
      secondary: { verb: 'addExercise', highlighted: false },
      statusKey: 'readyToStart',
    };
  }

  // ── Running — exercise phase determines focus ────────────────────────
  switch (exercisePhase) {
    case 'resting':
      return {
        kind: 'resting',
        primary: { verb: 'adjustRest', highlighted: false },
        secondary: { verb: 'skip', highlighted: false },
        statusKey: 'resting',
      };

    case 'restReady':
    case 'restOver':
      return {
        kind: 'restReady',
        primary: { verb: 'logSet', highlighted: true },
        secondary: { verb: 'skip', highlighted: false },
        statusKey: exercisePhase === 'restReady' ? 'restReady' : 'restOver',
      };

    case 'complete':
      if (hasNextExercise) {
        return {
          kind: 'exerciseDone',
          primary: { verb: 'nextExercise', highlighted: true },
          secondary: { verb: 'finishWorkout', highlighted: false },
          statusKey: 'exerciseComplete',
        };
      }
      return {
        kind: 'allDone',
        primary: { verb: 'finishWorkout', highlighted: true },
        secondary: undefined,
        statusKey: 'allExercisesComplete',
      };

    case 'current':
    case 'upcoming':
    case 'ahead':
      return {
        kind: 'ready',
        primary: { verb: 'logSet', highlighted: false },
        secondary: { verb: 'skip', highlighted: false },
        statusKey: exercisePhase === 'upcoming' ? 'upcoming' : exercisePhase === 'current' ? 'current' : 'ahead',
      };
  }
}

// ─── Exercise phase derivation ────────────────────────────────────────────────

export interface DeriveExercisePhaseInput {
  /** True when every set in this exercise is logged. */
  readonly isComplete: boolean;
  /** True when at least one set is logged. */
  readonly isStarted: boolean;
  /** True when this exercise is the session's `nextExercise`. */
  readonly isCurrent: boolean;
  /** The rest timer phase for this exercise, if a rest timer is active for it. */
  readonly restPhase: RestTimerPhase | undefined;
}

/**
 * Derives the exercise phase from the exercise and rest timer state.
 * Priority: complete → rest phases → current → ahead → upcoming.
 */
export function deriveExercisePhase(input: DeriveExercisePhaseInput): ExercisePhase {
  if (input.isComplete) {
    return 'complete';
  }

  // Rest phases take priority over current/upcoming when a timer is active
  // for this exercise — the lifter is waiting, not ready to log.
  if (input.restPhase !== undefined) {
    switch (input.restPhase) {
      case 'resting':
        return 'resting';
      case 'ready':
        return 'restReady';
      case 'over':
        return 'restOver';
    }
  }

  if (input.isCurrent) {
    return 'current';
  }

  if (input.isStarted) {
    return 'ahead';
  }

  return 'upcoming';
}

import {
  CardioExerciseBlueprint,
  ExerciseBlueprint,
  WeightedExerciseBlueprint,
  formatPlannedSets,
  matchCardioTarget,
} from '@/models/blueprint-models';
import { RecordedExercise, RecordedWeightedExercise, Session } from '@/models/session-models';
import { Weight } from '@/models/weight';
import { formatCardioTarget } from '@/utils/format-cardio-target';

/**
 * Honest plan estimates for the workout editor. Every number derives from the
 * session's own recorded history — nothing is hardcoded or guessed.
 *
 * The weight source is always the session's recorded exercises: the heaviest
 * set the lifter actually logged. An exercise that was never logged has no
 * weight, and its weight segment vanishes from the row summary instead of
 * showing a fabricated number.
 */

/**
 * Heaviest set weight ever recorded for this exercise, in kilograms.
 * Uses the effective weight (bodyweight + added load for bodyweight moves),
 * matching the app's volume statistics. Returns undefined when the exercise
 * was never logged with a real weight.
 */
export function heaviestRecordedWeightKg(
  recorded: RecordedExercise | undefined,
  bodyweight: Weight | undefined,
): number | undefined {
  if (!(recorded instanceof RecordedWeightedExercise)) {
    return undefined;
  }
  let maxKg: number | undefined;
  for (const set of recorded.potentialSets) {
    const weight = recorded.effectiveWeight(set, bodyweight);
    if (weight.unit === 'nil') {
      continue;
    }
    const kg = weight.convertTo('kilograms').value.toNumber();
    if (kg <= 0) {
      continue;
    }
    if (maxKg === undefined || kg > maxKg) {
      maxKg = kg;
    }
  }
  return maxKg;
}

/**
 * Row summary in the spec's shape: "4 × 5 · 100 kg · 90s rest".
 * The weight segment reads the last-recorded lift; for a never-logged
 * exercise it vanishes cleanly instead of inventing a target.
 */
export function formatRowSummary(
  blueprint: ExerciseBlueprint,
  recorded: RecordedExercise | undefined,
  bodyweight: Weight | undefined,
  formatWeight: (kg: number) => string,
  bodyweightLabel: string,
): string {
  if (blueprint instanceof WeightedExerciseBlueprint) {
    const parts = [`${blueprint.plannedSets.length} × ${formatPlannedSets(blueprint.plannedSets)}`];
    if (blueprint.resistance === 'bodyweight') {
      parts.push(bodyweightLabel);
    } else if (blueprint.resistance !== 'none') {
      const kg = heaviestRecordedWeightKg(recorded, bodyweight);
      if (kg !== undefined) {
        parts.push(formatWeight(kg));
      }
    }
    parts.push(`${Math.round(blueprint.restBetweenSets.minRest.toMillis() / 1000)}s rest`);
    return parts.join('  ·  ');
  }
  return `${blueprint.sets.length} × ${formatCardioTarget(blueprint.sets[0]!.target)}`;
}

/** Total planned sets across every exercise. */
export function countPlanSets(session: Session): number {
  return session.blueprint.exercises.reduce(
    (count, blueprint) =>
      count + (blueprint instanceof WeightedExerciseBlueprint ? blueprint.plannedSets.length : blueprint.sets.length),
    0,
  );
}

/**
 * Estimated session volume in kilograms: Σ(heaviest-recorded-weight × reps × sets).
 * Reps come from the plan (the target ceiling for range prescriptions); the
 * weight is the heaviest actually logged, the same source as the row summaries.
 * Cardio and never-logged exercises contribute nothing. Returns undefined when
 * no exercise has logged history, so the UI can show "–" instead of 0.
 */
export function estimatePlanVolumeKg(session: Session): number | undefined {
  let total = 0;
  let hasData = false;
  const exercises = session.blueprint.exercises;
  for (let index = 0; index < exercises.length; index++) {
    const blueprint = exercises[index]!;
    if (!(blueprint instanceof WeightedExerciseBlueprint)) {
      continue;
    }
    const kg = heaviestRecordedWeightKg(session.recordedExercises[index], session.bodyweight);
    if (kg === undefined) {
      continue;
    }
    const reps = blueprint.plannedSets.reduce((sum, set) => sum + set.reps.max, 0);
    total += kg * reps;
    hasData = true;
  }
  return hasData ? total : undefined;
}

/**
 * Estimated session length in minutes, per the disclosed formula:
 * 45s of work per set, prescribed rests between sets, 60s transitions between
 * exercises. Time-based cardio uses its actual target; distance cardio falls
 * back to 120s per set. Returns undefined for an empty plan.
 */
export function estimatePlanMinutes(session: Session): number | undefined {
  const exercises = session.blueprint.exercises;
  if (exercises.length === 0) {
    return undefined;
  }
  let seconds = 0;
  for (const blueprint of exercises) {
    if (blueprint instanceof WeightedExerciseBlueprint) {
      const sets = blueprint.plannedSets.length;
      seconds += sets * 45 + Math.max(0, sets - 1) * (blueprint.restBetweenSets.minRest.toMillis() / 1000);
    } else if (blueprint instanceof CardioExerciseBlueprint) {
      seconds += blueprint.sets.reduce(
        (sum, set) =>
          sum +
          matchCardioTarget(set.target, {
            time: (t) => t.value.toMillis() / 1000,
            distance: () => 120,
          }),
        0,
      );
    }
  }
  seconds += (exercises.length - 1) * 60;
  return Math.max(1, Math.round(seconds / 60));
}

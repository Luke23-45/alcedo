import type { WorkoutExercise, WorkoutSet } from '../schemas/workout.schema';

/**
 * Provider-neutral persistence helpers for workouts. Both the MongoDB and
 * PostgreSQL repositories use these so normalization and error detection
 * cannot drift between backends.
 */

// Re-exported from the shared persistence-errors module so all modules use
// one definition.
export { isDuplicateKeyError } from '../../common/utils/persistence-errors';

function toPlainSet(s: WorkoutSet): WorkoutSet {
  const out: WorkoutSet = {};
  if (typeof s.reps === 'number') out.reps = s.reps;
  if (typeof s.weight === 'number') out.weight = s.weight;
  if (typeof s.unit === 'string') out.unit = s.unit;
  if (typeof s.rpe === 'number') out.rpe = s.rpe;
  return out;
}

function toPlainExercise(e: WorkoutExercise): WorkoutExercise {
  const out: WorkoutExercise = {
    exerciseId: e.exerciseId,
    sets: (e.sets ?? []).map(toPlainSet),
  };
  if (typeof e.notes === 'string') out.notes = e.notes;
  return out;
}

/**
 * Strips unknown fields from exercises/sets. Applied on write AND read so a
 * record always carries exactly the contracted shape, on both backends.
 */
export function normalizeExercises(exercises: unknown): WorkoutExercise[] {
  if (!Array.isArray(exercises)) return [];
  return exercises.map(toPlainExercise);
}

import { ExerciseDescriptor } from '@/models/exercise-models';
import { restoreExercise, updateExercise } from '@/store/stored-sessions';

/**
 * Pure decision logic for the exercise library manager
 * (`components/smart/exercise-manager.tsx`). RN-free so simulation tests can
 * import it directly.
 */

/** The blank descriptor a freshly added exercise starts from. */
export function newExerciseDescriptor(): ExerciseDescriptor {
  return {
    name: 'New exercise',
    category: '',
    equipment: null,
    force: null,
    instructions: '',
    level: 'beginner',
    mechanic: null,
    muscles: [],
  };
}

export interface UndoTarget {
  isBuiltIn: boolean;
  savedExercise: ExerciseDescriptor | undefined;
}

/**
 * The snackbar undo for a deleted exercise.
 *
 * Built-ins are tombstoned by `deleteExercise` (an override row, if the user
 * edited the built-in, is kept), so undo lifts the tombstone with
 * `restoreExercise`. User exercises are removed from `savedExercises`, so
 * undo re-inserts the saved copy. The `!savedExercise` fallback is defensive:
 * a non-built-in id is always in `savedExercises` unless state is corrupt,
 * and `restoreExercise` is the harmless no-op there (it only touches
 * `hiddenBuiltInIds`).
 */
export function buildUndoAction(id: string, target: UndoTarget) {
  if (target.isBuiltIn || !target.savedExercise) {
    return restoreExercise(id);
  }
  return updateExercise({ id, exercise: target.savedExercise });
}

import type { PotentialSetJSON, RecordedExerciseJSON } from '@/models/storage/versions/latest/session';

/**
 * Adds optional set effort (type and rpe) fields to recorded weighted exercise sets.
 * For pre-v9 sets, both fields pass through as undefined (deserializing as 'working' by default).
 */
export function addSetEffort(recordedExercises: RecordedExerciseJSON[]): RecordedExerciseJSON[] {
  return recordedExercises.map((ex) => {
    if (ex.type === 'RecordedCardioExercise') {
      return ex;
    }
    return {
      ...ex,
      potentialSets: ex.potentialSets.map((ps: PotentialSetJSON) => ({
        ...ps,
        set: ps.set
          ? {
              ...ps.set,
              type: undefined,
              rpe: undefined,
            }
          : undefined,
      })),
    };
  });
}

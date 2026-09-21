import { RecordedCardioExercise, Session } from '@/models/session-models';
import Enumerable from 'linq';

/** Live counts for the plaintext export screen's "will export" preview. */
export interface ExportPreviewCounts {
  sessions: number;
  /** Completed weighted sets — exactly what the CSV exporter includes. */
  completedSets: number;
  /** Distinct exercise names among the completed weighted sets. */
  exercises: number;
}

/**
 * Mirrors ExportedSetCsvRow.fromModel's row filter exactly: completed weighted
 * sets only — cardio dropped, incomplete sets dropped. The counts derive from
 * the same sessions the exporter reads, so the preview can never disagree
 * with the file it describes.
 */
export function computeExportPreviewCounts(sessions: Enumerable.IEnumerable<Session>): ExportPreviewCounts {
  let sessionCount = 0;
  let completedSets = 0;
  const exerciseNames = new Set<string>();
  sessions.forEach((session) => {
    sessionCount++;
    for (const exercise of session.recordedExercises) {
      if (exercise instanceof RecordedCardioExercise) {
        continue;
      }
      const completed = exercise.potentialSets.filter((potentialSet) => potentialSet.set);
      if (completed.length > 0) {
        completedSets += completed.length;
        exerciseNames.add(exercise.blueprint.name);
      }
    }
  });
  return { sessions: sessionCount, completedSets, exercises: exerciseNames.size };
}

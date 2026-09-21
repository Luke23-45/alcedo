import { ExerciseBlueprint } from '@/models/blueprint-models';
import { Session } from '@/models/session-models';

/**
 * What dismissing the exercise editor should persist. Add mode: backing out
 * keeps the placeholder exercise with its defaults — the workout editor names
 * this behavior explicitly, so the editor must not silently drop the exercise.
 * Only an actual draft is committed to the store.
 */
export function exerciseEditorDismissUpdate(
  exerciseIndex: number,
  draft: ExerciseBlueprint | undefined,
  useImperialUnits: boolean,
): ((s: Session) => Session) | undefined {
  if (!draft) {
    return undefined;
  }
  return (s) => (s.recordedExercises[exerciseIndex] ? s.withEditedExercise(exerciseIndex, draft, useImperialUnits) : s);
}

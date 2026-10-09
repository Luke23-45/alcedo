import { ExerciseBlueprint } from '@/models/blueprint-models';
import { Session } from '@/models/session-models';

/**
 * What dismissing the exercise editor should persist.
 * In add mode (isNew): if the user backs out without picking/naming an exercise
 * (draft is undefined or name is blank), cleanly remove the temporary placeholder
 * so no ghost exercise is left in the session.
 */
export function exerciseEditorDismissUpdate(
  exerciseIndex: number,
  draft: ExerciseBlueprint | undefined,
  useImperialUnits: boolean,
  isNew?: boolean,
): ((s: Session) => Session) | undefined {
  if (isNew && (!draft || draft.name.trim() === '')) {
    return (s) => (s.recordedExercises[exerciseIndex] ? s.withRemovedExercise(exerciseIndex) : s);
  }
  if (!draft) {
    return undefined;
  }
  return (s) => (s.recordedExercises[exerciseIndex] ? s.withEditedExercise(exerciseIndex, draft, useImperialUnits) : s);
}

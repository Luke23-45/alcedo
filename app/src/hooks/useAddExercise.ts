import { getSessionExerciseEditorHref } from '@/components/smart/session-exercise-editor';
import { newExercisePlaceholder } from '@/components/presentation/exercise-editor/exercise-editor-logic';
import { useAppSelector, useAppSelectorWithArg } from '@/store';
import { selectSession, updateStoredSession } from '@/store/stored-sessions';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';

export function useAddExercise(sessionId: string | undefined) {
  const session = useAppSelectorWithArg(selectSession, sessionId ?? '');
  const useImperialUnits = useAppSelector((x) => x.settings.useImperialUnits);
  const dispatch = useDispatch();
  const { push } = useRouter();

  return () => {
    if (!sessionId || !session) {
      return;
    }
    const newIndex = session.recordedExercises.length;
    dispatch(
      updateStoredSession({
        sessionId,
        // Matches the workout editor's add flow and the S6 reference: a blank
        // name opens the search-first layout (Done stays disabled until an
        // exercise is picked) and new exercises default to 1 x 8. Backing out
        // keeps the placeholder with its defaults — the workout editor names
        // that behavior explicitly, so it must not be silently dropped here.
        update: (s) => s.withAddedExercise(newExercisePlaceholder(), useImperialUnits),
      }),
    );
    push(getSessionExerciseEditorHref(sessionId, newIndex, { isNew: true }));
  };
}

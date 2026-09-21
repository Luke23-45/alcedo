import { getSessionExerciseEditorHref } from '@/components/smart/session-exercise-editor';
import { EmptyExerciseBlueprint } from '@/models/blueprint-models';
import { useAppSelector, useAppSelectorWithArg } from '@/store';
import { selectSession, updateStoredSession } from '@/store/stored-sessions';
import { useRouter } from 'expo-router';
import { useTranslate } from '@tolgee/react';
import { useDispatch } from 'react-redux';

export function useAddExercise(sessionId: string | undefined) {
  const session = useAppSelectorWithArg(selectSession, sessionId ?? '');
  const useImperialUnits = useAppSelector((x) => x.settings.useImperialUnits);
  const dispatch = useDispatch();
  const { push } = useRouter();
  const { t } = useTranslate();

  return () => {
    if (!sessionId || !session) {
      return;
    }
    const newIndex = session.recordedExercises.length;
    dispatch(
      updateStoredSession({
        sessionId,
        update: (s) =>
          s.withAddedExercise(
            EmptyExerciseBlueprint.with({
              name: t('exercise.new.default_name'),
            }),
            useImperialUnits,
          ),
      }),
    );
    push(getSessionExerciseEditorHref(sessionId, newIndex, { isNew: true }));
  };
}

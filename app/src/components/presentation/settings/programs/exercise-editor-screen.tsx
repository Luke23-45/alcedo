import { Stack } from 'expo-router';
import { useTranslate } from '@tolgee/react';
import FullHeightScrollView from '@/components/layout/full-height-scroll-view';
import { ExerciseEditor } from '@/components/presentation/workout-editor/exercise-editor';
import { SettingsBackground } from '@/components/presentation/settings/shared/settings-background';
import { ExerciseBlueprint } from '@/models/blueprint-models';
import { EditorPage } from './exercise-editor-screen.styles';

/**
 * The per-exercise editor inside a program session. The editor itself is the
 * shared workout-editor component; this file owns the page chrome so the
 * route stays thin.
 */
export function ExerciseEditorScreen({
  exercise,
  updateExercise,
}: {
  exercise: ExerciseBlueprint;
  updateExercise: (exercise: ExerciseBlueprint) => void;
}) {
  const { t } = useTranslate();
  return (
    <FullHeightScrollView avoidKeyboard screenBackground={<SettingsBackground variant="programs" />}>
      <Stack.Screen options={{ title: t('exercise.edit.title') }} />
      <EditorPage>
        <ExerciseEditor exercise={exercise} updateExercise={updateExercise} />
      </EditorPage>
    </FullHeightScrollView>
  );
}

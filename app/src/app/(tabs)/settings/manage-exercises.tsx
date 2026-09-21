import { useTranslate } from '@tolgee/react';
import { Stack } from 'expo-router';
import { ExerciseManagerScreen } from '@/components/presentation/settings/programs/exercise-manager-screen';

/**
 * The exercise library manager. Thin wrapper; the UI lives in
 * components/presentation/settings/programs/.
 */
export default function ExerciseManagerPage() {
  const { t } = useTranslate();
  return (
    <>
      <Stack.Screen options={{ title: t('exercise.manage.title') }} />
      <ExerciseManagerScreen />
    </>
  );
}

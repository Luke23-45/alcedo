import { useTranslate } from '@tolgee/react';
import { HeaderCount, HeaderRow, HeaderTitle } from './exercises-header.styles';

/** "EXERCISES" section header with the started-exercise count ("5 of 6"). */
export function ExercisesHeader({ done, total }: { done: number; total: number }) {
  const { t } = useTranslate();
  return (
    <HeaderRow>
      <HeaderTitle>{t('workout.session.exercises.label').toLocaleUpperCase()}</HeaderTitle>
      <HeaderCount>{t('workout.session.exercises_progress.label', { done, total })}</HeaderCount>
    </HeaderRow>
  );
}

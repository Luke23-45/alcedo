import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { useTranslate } from '@tolgee/react';
import * as S from './session-notes-card.styles';

/**
 * Reference card: 361×116, rx30. "SESSION NOTES" 9/700/+1.3 with an amber
 * Edit affordance (44×44), body 12.5/500. The notes are the session's real
 * blueprint notes; Edit reuses the existing workout-editor flow.
 */
export function SessionNotesCard({ notes, onEdit }: { notes: string; onEdit: () => void }) {
  const { t } = useTranslate();

  return (
    <HomeCard radius={30} pad={20}>
      <S.HeaderRow>
        <S.Label>{t('workout.post_workout.notes.title')}</S.Label>
        <S.EditButton
          onPress={onEdit}
          accessibilityRole="button"
          accessibilityLabel={t('workout.post_workout.notes.edit')}
        >
          <S.EditText>{t('workout.post_workout.notes.edit')}</S.EditText>
        </S.EditButton>
      </S.HeaderRow>
      {notes.trim() ? <S.Body>{notes}</S.Body> : <S.Empty>{t('workout.post_workout.notes.empty')}</S.Empty>}
    </HomeCard>
  );
}

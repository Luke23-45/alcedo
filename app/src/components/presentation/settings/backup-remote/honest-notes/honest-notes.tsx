import { useTranslate } from '@tolgee/react';
import { ReactNode } from 'react';
import { SettingsGroup } from '../../shared/grouped-settings-list';
import * as GS from '../../shared/grouped-settings-list.styles';
import * as S from './honest-notes.styles';

function Note({ primary, children }: { primary?: boolean; children: ReactNode }) {
  return (
    <S.HonestNoteRow>
      <S.HonestNoteDot />
      <S.HonestNoteText $primary={primary}>{children}</S.HonestNoteText>
    </S.HonestNoteRow>
  );
}

/**
 * Honest notes (backup-redesign.md S1): no schedule, no restore-from-server,
 * the built-in backend is ineligible, and deleting an assigned backend
 * silently unassigns it. Static — no press affordance.
 */
export function HonestNotes() {
  const { t } = useTranslate();

  return (
    <SettingsGroup label={t('backup.remote.honest.title')}>
      <GS.RowStatic accessibilityRole="text">
        <S.HonestNotesBody>
          <Note primary>{t('backup.remote.honest.no_schedule')}</Note>
          <Note>{t('backup.remote.honest.no_restore')}</Note>
          <Note>{t('backup.remote.honest.builtin_ineligible')}</Note>
          <Note>{t('backup.remote.honest.unassign')}</Note>
        </S.HonestNotesBody>
      </GS.RowStatic>
    </SettingsGroup>
  );
}

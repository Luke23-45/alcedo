import { useTranslate } from '@tolgee/react';
import { ExportCard, SectionLabel } from './export-card';
import * as S from './not-in-file-card.styles';

/**
 * Screen 6 of S4: the cardio trap, disclosed (backup-redesign.md §4) — two
 * bulleted rows. The cardio lead is primary ink, the continuations secondary.
 */
export function NotInFileCard() {
  const { t } = useTranslate();
  return (
    <S.NotInFileWrap>
      <SectionLabel $tone="danger">{t('backup.plaintext_export.not_in_file.title')}</SectionLabel>
      <ExportCard variant="danger" radius={22}>
        <S.OmissionList>
          <S.OmissionRow accessibilityRole="text">
            <S.OmissionDot />
            <S.OmissionText>
              <S.OmissionLead>{t('backup.plaintext_export.not_in_file.cardio_lead')} </S.OmissionLead>
              <S.OmissionRest>{t('backup.plaintext_export.not_in_file.cardio_rest')}</S.OmissionRest>
            </S.OmissionText>
          </S.OmissionRow>
          <S.OmissionRow accessibilityRole="text">
            <S.OmissionDot />
            <S.OmissionText>
              <S.OmissionRest>{t('backup.plaintext_export.not_in_file.scope')}</S.OmissionRest>
            </S.OmissionText>
          </S.OmissionRow>
        </S.OmissionList>
      </ExportCard>
    </S.NotInFileWrap>
  );
}

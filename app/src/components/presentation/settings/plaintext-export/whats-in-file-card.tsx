import { useTranslate } from '@tolgee/react';
import { ExportCard, SectionLabel } from './export-card';
import * as S from './whats-in-file-card.styles';

/** File-format literals — rendered as-is, never translated. */
const CSV_COLUMNS = [
  'SessionId',
  'Timestamp',
  'Exercise',
  'Weight',
  'WeightUnit',
  'Reps',
  'TargetReps',
  'Notes',
] as const;

/**
 * Screen 4 of S4: the literal CSV column headers in a code well, then the
 * honest caveats about what exported weights mean — one card, per
 * backup-redesign.md §4.
 */
export function WhatsInFileCard() {
  const { t } = useTranslate();
  return (
    <S.WhatsInFileWrap>
      <SectionLabel>{t('backup.plaintext_export.whats_in_file.title')}</SectionLabel>
      <ExportCard>
        <S.InnerLabel>{t('backup.plaintext_export.csv_columns.title')}</S.InnerLabel>
        <S.CodeWell>
          {CSV_COLUMNS.map((column) => (
            <S.ColumnName key={column} selectable>
              {column}
            </S.ColumnName>
          ))}
        </S.CodeWell>
        <S.InnerLabel>{t('backup.plaintext_export.caveats.title')}</S.InnerLabel>
        <S.CaveatLead>{t('backup.plaintext_export.caveats.raw_weight')}</S.CaveatLead>
        <S.CaveatRest>{t('backup.plaintext_export.caveats.bodyweight')}</S.CaveatRest>
      </ExportCard>
    </S.WhatsInFileWrap>
  );
}

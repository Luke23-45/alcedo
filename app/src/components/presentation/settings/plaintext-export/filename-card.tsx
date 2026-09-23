import { PlaintextExportFormat } from '@/store/settings';
import { DateTimeFormatter, LocalDateTime } from '@js-joda/core';
import { useTranslate } from '@tolgee/react';
import { ExportCard, SectionLabel } from './export-card';
import * as S from './filename-card.styles';

/** The exact stamp pattern the export effect uses (export-plaintext-effects.ts). */
function previewStamp(): string {
  return LocalDateTime.now()
    .withNano(0)
    .format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
    .replaceAll(':', '')
    .replaceAll('T', '_')
    .replaceAll('-', '');
}

/** Screen 8 of S4: the filename preview — a preview only, the effect names the real file. */
export function FilenameCard({ format }: { format: PlaintextExportFormat }) {
  const { t } = useTranslate();
  const filename = `alcedo-export.${previewStamp()}.${format === 'CSV' ? 'csv' : 'json'}`;
  return (
    <S.FilenameWrap>
      <SectionLabel>{t('backup.plaintext_export.filename.title')}</SectionLabel>
      <ExportCard radius={16}>
        <S.FilenameText numberOfLines={1} adjustsFontSizeToFit selectable>
          {filename}
        </S.FilenameText>
        <S.FilenameCaption>{t('backup.plaintext_export.filename.caption')}</S.FilenameCaption>
      </ExportCard>
    </S.FilenameWrap>
  );
}

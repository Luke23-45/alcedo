import { PlaintextExportFormat } from '@/store/settings';
import { useTranslate } from '@tolgee/react';
import { ExportCard, SectionLabel } from './export-card';
import * as S from './format-segmented.styles';

/**
 * Screen 2 of S4: the CSV/JSON format switch. Local state only (CSV default,
 * not persisted) — the selection drives the filename preview and the export
 * dispatch.
 */
export function FormatSegmented({
  format,
  onChange,
}: {
  format: PlaintextExportFormat;
  onChange: (format: PlaintextExportFormat) => void;
}) {
  const { t } = useTranslate();
  const options: PlaintextExportFormat[] = ['CSV', 'JSON'];
  return (
    <S.SegmentWrap>
      <SectionLabel>{t('backup.plaintext_export.format.label')}</SectionLabel>
      <ExportCard>
        <S.SegmentTrack accessibilityRole="radiogroup">
          {options.map((option) => (
            <S.SegmentButton
              key={option}
              $selected={format === option}
              onPress={() => onChange(option)}
              accessibilityRole="radio"
              accessibilityState={{ selected: format === option }}
              accessibilityLabel={t(
                option === 'CSV'
                  ? 'backup.plaintext_export.format.csv'
                  : 'backup.plaintext_export.format.json',
              )}
            >
              <S.SegmentLabel $selected={format === option}>
                {t(
                  option === 'CSV'
                    ? 'backup.plaintext_export.format.csv'
                    : 'backup.plaintext_export.format.json',
                )}
              </S.SegmentLabel>
            </S.SegmentButton>
          ))}
        </S.SegmentTrack>
      </ExportCard>
      <S.NotPersistedCaption>
        {t('backup.plaintext_export.format.not_persisted')}
      </S.NotPersistedCaption>
    </S.SegmentWrap>
  );
}

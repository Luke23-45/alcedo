import type { ExternalImportFormat } from '@/store/settings';
import { useTranslate } from '@tolgee/react';
import { Fragment } from 'react';
import { CardShell } from '../backup/card-shell';
import { SectionLabel } from './section-label';
import * as S from './format-radio-list.styles';

const FORMATS = [
  {
    id: 'FitNotes',
    labelKey: 'backup.import_from_other_apps.format.fitnotes',
    subtitleKey: 'backup.import_from_other_apps.format.fitnotes_subtitle',
    dropsKey: 'backup.import_from_other_apps.format.fitnotes_drops',
  },
  {
    id: 'StrongLifts',
    labelKey: 'backup.import_from_other_apps.format.stronglifts',
    subtitleKey: 'backup.import_from_other_apps.format.stronglifts_subtitle',
    dropsKey: 'backup.import_from_other_apps.format.stronglifts_drops',
  },
] as const;

/**
 * S5 §3: the format picker (backup-redesign.md §5). A radio list, not a
 * segmented control — exactly the two real formats, FitNotes by default.
 * Selection is local state only; nothing persists until Import is tapped.
 */
export function FormatRadioList({
  value,
  onChange,
}: {
  value: ExternalImportFormat;
  onChange: (format: ExternalImportFormat) => void;
}) {
  const { t } = useTranslate();

  return (
    <>
      <SectionLabel>{t('backup.import_from_other_apps.format.label')}</SectionLabel>
      <CardShell radius={26}>
        <S.Options accessibilityRole="radiogroup" accessibilityLabel={t('backup.import_from_other_apps.format.label')}>
          {FORMATS.map((format, index) => {
            const selected = value === format.id;
            const label = t(format.labelKey);
            const subtitle = t(format.subtitleKey);
            const drops = t(format.dropsKey);
            return (
              <Fragment key={format.id}>
                {index > 0 && <S.OptionSeparator />}
                <S.OptionButton
                  $selected={selected}
                  onPress={() => onChange(format.id)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  accessibilityLabel={label}
                  accessibilityHint={`${subtitle} ${t('backup.import_from_other_apps.format.drops')}: ${drops}`}
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <S.Radio $selected={selected}>{selected && <S.RadioDot />}</S.Radio>
                  <S.OptionText>
                    <S.OptionTitle>{label}</S.OptionTitle>
                    <S.OptionSubtitle>{subtitle}</S.OptionSubtitle>
                    <S.DropsLabel>
                      {t('backup.import_from_other_apps.format.drops')}
                    </S.DropsLabel>
                    <S.OptionDrops>{drops}</S.OptionDrops>
                  </S.OptionText>
                </S.OptionButton>
              </Fragment>
            );
          })}
        </S.Options>
      </CardShell>
    </>
  );
}

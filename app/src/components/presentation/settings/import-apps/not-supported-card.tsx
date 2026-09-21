import { useTranslate } from '@tolgee/react';
import { CardShell } from '../backup/card-shell';
import { SectionLabel } from './section-label';
import * as S from './not-supported-card.styles';

/** S5 §5: NOT SUPPORTED — the apps whose exports cannot be imported, stated once. */
export function NotSupportedCard() {
  const { t } = useTranslate();
  return (
    <>
      <SectionLabel>{t('backup.import_from_other_apps.not_supported.title')}</SectionLabel>
      <CardShell radius={20}>
        <S.NotSupportedBody>
          <S.NotSupportedText>{t('backup.import_from_other_apps.not_supported.body')}</S.NotSupportedText>
          <S.NotSupportedNote>{t('backup.import_from_other_apps.not_supported.note')}</S.NotSupportedNote>
        </S.NotSupportedBody>
      </CardShell>
    </>
  );
}

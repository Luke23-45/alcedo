import { useTranslate } from '@tolgee/react';
import * as S from './import-apps-header.styles';

/** S5 §1: caption under the nav title — what gets imported, and its scope. */
export function ImportAppsHeader() {
  const { t } = useTranslate();
  return (
    <S.HeaderCaption>
      <S.HeaderLine>{t('backup.import_from_other_apps.explanation')}</S.HeaderLine>
      <S.HeaderScope>{t('backup.import_from_other_apps.caption')}</S.HeaderScope>
    </S.HeaderCaption>
  );
}

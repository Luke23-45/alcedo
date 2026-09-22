import { useTranslate } from '@tolgee/react';
import * as S from './update-prompt.styles';

export function UpdatePrompt() {
  const { t } = useTranslate();
  return (
    <S.UpdateBody>
      <S.UpdateTitle>{t('ai.update_required.title')}</S.UpdateTitle>
      <S.UpdateDescription>{t('ai.update_required.explanation')}</S.UpdateDescription>
    </S.UpdateBody>
  );
}

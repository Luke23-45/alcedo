import { useTranslate } from '@tolgee/react';
import * as S from './export-caption.styles';

/** Screen 1 of S4: the verbatim plaintext-export caption (ALCEDO brand). */
export function ExportCaption() {
  const { t } = useTranslate();
  return (
    <S.CaptionWrap>
      <S.CaptionText>{t('backup.plaintext_export.caption')}</S.CaptionText>
    </S.CaptionWrap>
  );
}

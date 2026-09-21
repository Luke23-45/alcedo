import { useTranslate } from '@tolgee/react';
import * as S from './caption.styles';

/** The verbatim backup caption (Kinetic brand per the design spec). */
export function Caption() {
  const { t } = useTranslate();
  return <S.CaptionText>{t('backup.remote.caption')}</S.CaptionText>;
}

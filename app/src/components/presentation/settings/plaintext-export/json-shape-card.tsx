import { useTranslate } from '@tolgee/react';
import { ExportCard, SectionLabel } from './export-card';
import * as S from './json-shape-card.styles';

/** Screen 7 of S4: what the JSON export looks like. */
export function JsonShapeCard() {
  const { t } = useTranslate();
  return (
    <S.JsonShapeWrap>
      <SectionLabel>{t('backup.plaintext_export.json_shape.title')}</SectionLabel>
      <ExportCard radius={22}>
        <S.JsonShapeText>{t('backup.plaintext_export.json_shape.body')}</S.JsonShapeText>
      </ExportCard>
    </S.JsonShapeWrap>
  );
}

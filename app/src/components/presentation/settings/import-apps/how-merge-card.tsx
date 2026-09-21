import { useTranslate } from '@tolgee/react';
import { CardShell } from '../backup/card-shell';
import { SectionLabel } from './section-label';
import * as S from './how-merge-card.styles';

const BULLET_KEYS = [
  'backup.import_from_other_apps.how_merge.b1',
  'backup.import_from_other_apps.how_merge.b2',
  'backup.import_from_other_apps.how_merge.b3',
  'backup.import_from_other_apps.how_merge.b4',
] as const;

/**
 * S5 §4: HOW MERGE WORKS (backup-redesign.md §5) — the honest merge contract
 * as four bulleted rows: the lead row in primary ink, the rest secondary.
 */
export function HowMergeCard() {
  const { t } = useTranslate();
  return (
    <>
      <SectionLabel>{t('backup.import_from_other_apps.how_merge.title')}</SectionLabel>
      <CardShell radius={24}>
        <S.MergeBody>
          {BULLET_KEYS.map((key, index) => (
            <S.MergeRow key={key} accessibilityRole="text">
              <S.MergeBullet />
              {index === 0 ? (
                <S.MergeTextLead>{t(key)}</S.MergeTextLead>
              ) : (
                <S.MergeText>{t(key)}</S.MergeText>
              )}
            </S.MergeRow>
          ))}
        </S.MergeBody>
      </CardShell>
    </>
  );
}

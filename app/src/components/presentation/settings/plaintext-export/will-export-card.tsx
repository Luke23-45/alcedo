import { ExportPreviewCounts } from '@/store/settings';
import { useTranslate } from '@tolgee/react';
import { Fragment } from 'react';
import { ExportCard, SectionLabel } from './export-card';
import * as S from './will-export-card.styles';

/**
 * Screen 3 of S4: the live export preview (backup-redesign.md §4) — real
 * session / completed-set / exercise counts from the database, refreshed on
 * every screen focus. Each column is a number (16/700) over a micro-label
 * (7.5/700, tracking +0.8), divided by hairlines; the scope note sits below.
 * Before the preview loads the values render as an em dash rather than a
 * zero, so the card never claims an empty history it hasn't measured yet.
 */
export function WillExportCard({ preview }: { preview: ExportPreviewCounts | undefined }) {
  const { t } = useTranslate();
  const stats = [
    { key: 'backup.plaintext_export.will_export.sessions_label' as const, count: preview?.sessions },
    { key: 'backup.plaintext_export.will_export.sets_label' as const, count: preview?.completedSets },
    { key: 'backup.plaintext_export.will_export.exercises_label' as const, count: preview?.exercises },
  ];
  return (
    <S.WillExportWrap>
      <SectionLabel>{t('backup.plaintext_export.will_export.title')}</SectionLabel>
      <ExportCard radius={22}>
        <S.StatsRow>
          {stats.map((stat, index) => (
            <Fragment key={stat.key}>
              {index > 0 ? <S.StatDivider /> : undefined}
              <S.StatCell>
                <S.StatValue>
                  {stat.count === undefined ? '—' : stat.count.toLocaleString()}
                </S.StatValue>
                <S.StatLabel>{t(stat.key)}</S.StatLabel>
              </S.StatCell>
            </Fragment>
          ))}
        </S.StatsRow>
        <S.ScopeNote>{t('backup.plaintext_export.will_export.note')}</S.ScopeNote>
      </ExportCard>
    </S.WillExportWrap>
  );
}

import { useTranslate } from '@tolgee/react';
import type { TranslationKey } from '@tolgee/web';
import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { formatBare } from '../exercise-detail-model';
import * as S from './stat-strip.styles';

export interface StatStripValues {
  bestTopSet: number;
  bestE1rm: number;
  sessionCount: number;
  trailing7dVolume: number;
}

const COLUMNS: { key: keyof StatStripValues; labelKey: TranslationKey; labelParams?: (unitLabel: string) => Record<string, string> }[] = [
  { key: 'bestTopSet', labelKey: 'stats.exercise_detail.strip.best_top_set' },
  { key: 'bestE1rm', labelKey: 'stats.exercise_detail.strip.best_e1rm' },
  { key: 'sessionCount', labelKey: 'stats.exercise_detail.strip.sessions' },
  {
    key: 'trailing7dVolume',
    labelKey: 'stats.exercise_detail.strip.this_week',
    labelParams: (unitLabel) => ({ unit: unitLabel.toLocaleUpperCase() }),
  },
];

/**
 * 361×68 rx24 strip: best top set and best Epley e1RM are the all-time bests
 * (personal-records running-best semantics), session count and trailing-7-day
 * volume come from the recorded sessions.
 */
export function StatStrip({ values, unitLabel }: { values: StatStripValues; unitLabel: string }) {
  const { t } = useTranslate();
  return (
    <HomeCard radius={24} pad={0}>
      <S.StripInner>
        {COLUMNS.map((col, i) => (
          <S.Column key={col.key}>
            <S.Value numberOfLines={1}>{formatBare(values[col.key])}</S.Value>
            <S.Label numberOfLines={1}>{t(col.labelKey, col.labelParams?.(unitLabel))}</S.Label>
            {i < COLUMNS.length - 1 ? <S.Divider /> : null}
          </S.Column>
        ))}
      </S.StripInner>
    </HomeCard>
  );
}

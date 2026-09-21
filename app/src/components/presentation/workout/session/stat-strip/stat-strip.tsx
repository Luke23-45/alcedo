import { useTranslate } from '@tolgee/react';
import { Fragment } from 'react';
import { HomeCard } from '../../../home/shared/home-card';
import { SampleBadge } from '../../../home/shared/sample-badge';
import type { SessionStats } from '../session-stats';
import { Column, DividerLine, Label, LabelRow, StripRow, StripWrap, Value, ValueSuffix } from './stat-strip.styles';

export type { SessionStats };

/**
 * Four-column session stat strip: Sets, Volume kg, Reps, Avg bpm.
 * AVG BPM is sample data, so it carries the shared SampleBadge.
 * In the empty state every value renders dimmed (`00:00`-style placeholders).
 */
export function StatStrip({ stats, dimmed }: { stats: SessionStats; dimmed?: boolean }) {
  const { t } = useTranslate();
  const dim = dimmed ?? false;

  const columns: { value: React.ReactNode; label: string; sample?: boolean }[] = [
    {
      value: (
        <Value $dimmed={dim}>
          {String(stats.setsCompleted)}
          {!dim && stats.setsTotal > 0 && <ValueSuffix $dimmed={dim}>/{stats.setsTotal}</ValueSuffix>}
        </Value>
      ),
      label: t('workout.session.sets.label'),
    },
    {
      value: <Value $dimmed={dim}>{stats.volume}</Value>,
      label: t('workout.session.volume_kg.label'),
    },
    {
      value: <Value $dimmed={dim}>{stats.reps}</Value>,
      label: t('workout.session.reps.label'),
    },
    {
      value: <Value $dimmed={dim}>{dim ? '—' : (stats.avgBpm ?? '—')}</Value>,
      label: t('workout.session.avg_bpm.label'),
      sample: !dim,
    },
  ];

  return (
    <StripWrap>
      <HomeCard radius={24} pad={0} style={{ flex: 1 }}>
        <StripRow>
          {columns.map((col, i) => (
            <Fragment key={col.label}>
              {i > 0 && <DividerLine />}
              <Column>
                {col.value}
                <LabelRow>
                  <Label $dimmed={dim}>{col.label}</Label>
                  {col.sample && <SampleBadge compact />}
                </LabelRow>
              </Column>
            </Fragment>
          ))}
        </StripRow>
      </HomeCard>
    </StripWrap>
  );
}

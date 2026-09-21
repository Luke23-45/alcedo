import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { HomeText } from '@/components/presentation/home/shared/home-text';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useFormatDate } from '@/hooks/useFormatDate';
import { fontWeight } from '@/styles/theme';
import type { Session } from '@/models/session-models';
import { Duration, LocalDate, YearMonth } from '@js-joda/core';
import { useHistoryTranslate } from '../history-i18n';
import {
  estimateSessionKcal,
  formatClockDuration,
  formatCount,
  sessionTotalSets,
  sessionVolumeKg,
} from '../history-stats';
import {
  DaysBadge,
  Divider,
  Footer,
  MonthSection,
  SectionLabel,
  StatCell,
  StatRow,
  SummaryBody,
  TitleRow,
} from './month-summary.styles';

export function MonthSummary({
  yearMonth,
  today,
  sessions,
}: {
  yearMonth: YearMonth;
  /** Sessions actually in this month, real store data. */
  sessions: Session[];
  today: LocalDate;
}) {
  const theme = useAppTheme();
  const t = useHistoryTranslate();
  const formatDate = useFormatDate();

  const firstOfMonth = yearMonth.atDay(1);
  const lastOfMonth = yearMonth.atEndOfMonth();
  // Days that could have training so far: rest days are gaps, not zeros, so the
  // denominator is elapsed days, never the whole month when viewing the past.
  const elapsedEnd = today.isBefore(lastOfMonth) ? today : lastOfMonth;
  const elapsedDays = Math.max(0, elapsedEnd.toEpochDay() - firstOfMonth.toEpochDay() + 1);
  const trainedDays = new Set(sessions.map((s) => s.date.toString())).size;

  const volume = sessions.reduce((sum, s) => sum + sessionVolumeKg(s), 0);
  const kcal = sessions.reduce((sum, s) => sum + estimateSessionKcal(s), 0);
  const sets = sessions.reduce((sum, s) => sum + sessionTotalSets(s), 0);
  const time = sessions.reduce<Duration>((acc, s) => (s.duration ? acc.plus(s.duration) : acc), Duration.ZERO);
  const pct = elapsedDays > 0 ? Math.round((trainedDays / elapsedDays) * 100) : 0;

  const cells: { value: string; label: string }[] = [
    {
      value: sessions.length.toString(),
      label: t('history.v2.month.aggregate.sessions'),
    },
    {
      value: formatCount(volume),
      label: t('history.v2.month.aggregate.volume_kg'),
    },
    {
      value: formatClockDuration(time),
      label: t('history.v2.month.aggregate.time_under_bar'),
    },
    {
      value: formatCount(kcal),
      label: t('history.v2.month.aggregate.kcal_est'),
    },
  ];

  return (
    <MonthSection>
      <SectionLabel>
        <HomeText
          weight={fontWeight.bold}
          tracking={1.35}
          micro
          style={{
            fontSize: 10,
            lineHeight: 13,
            color: theme.color.content.secondary,
          }}
        >
          {t('history.v2.month.title', {
            month: formatDate(firstOfMonth, { month: 'long' }),
          })}
        </HomeText>
      </SectionLabel>
      <HomeCard radius={30}>
        <SummaryBody>
          <TitleRow>
            <HomeText
              weight={fontWeight.semibold}
              tracking={-0.3}
              style={{
                fontSize: 15.5,
                lineHeight: 20,
                color: theme.color.content.primary,
              }}
            >
              {t('history.v2.month.card_title')}
            </HomeText>
            <DaysBadge>
              <HomeText
                weight={fontWeight.bold}
                tracking={0.8}
                micro
                style={{ fontSize: 8.5, lineHeight: 11, color: '#98989F' }}
              >
                {t('history.v2.month.days_badge', {
                  trained: trainedDays.toString(),
                  elapsed: elapsedDays.toString(),
                })}
              </HomeText>
            </DaysBadge>
          </TitleRow>
          <Divider />
          <StatRow>
            {cells.map((cell, i) => (
              <StatCell key={cell.label} $first={i === 0}>
                <HomeText
                  weight={fontWeight.bold}
                  tracking={-0.45}
                  tabular
                  style={{
                    fontSize: 16,
                    lineHeight: 20,
                    color: theme.color.content.primary,
                  }}
                >
                  {cell.value}
                </HomeText>
                <HomeText
                  weight={fontWeight.bold}
                  tracking={0.7}
                  style={{
                    fontSize: 7.5,
                    lineHeight: 10,
                    marginTop: 4,
                    color: theme.color.content.secondary,
                  }}
                >
                  {cell.label}
                </HomeText>
              </StatCell>
            ))}
          </StatRow>
          <Footer>
            <HomeText weight={fontWeight.medium} style={{ fontSize: 10.5, lineHeight: 14, color: '#6C6C70' }}>
              {t('history.v2.month.footer', {
                sets: sets.toString(),
                pct: pct.toString(),
              })}
            </HomeText>
          </Footer>
        </SummaryBody>
      </HomeCard>
    </MonthSection>
  );
}

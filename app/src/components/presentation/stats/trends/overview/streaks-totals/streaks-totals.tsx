import { LocalDate } from '@js-joda/core';
import {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop,
  Svg,
} from 'react-native-svg';
import { useTranslate } from '@tolgee/react';
import { fontWeight } from '@/styles/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { HomeText } from '@/components/presentation/home/shared/home-text';
import { SampleBadge } from '@/components/presentation/home/shared/sample-badge';
import { TrendsSectionHeader } from '../shared/trends-section-header';
import { CardAura } from '../shared/card-aura';
import { formatInt } from '../trends-overview-data';
import { trendsPalette } from '../trends-colors';
import { useAppSelector } from '@/store';
import {
  CardInner,
  Divider,
  Medallion,
  StatCol,
  StatDivider,
  StatsRow,
  StreakText,
  TodayPill,
  TopRow,
} from './streaks-totals.styles';

/**
 * Streaks & Totals: flame medallion with the current streak, longest-streak
 * line, a "+1 TODAY" pill when today is trained, and three totals —
 * all-time sessions, sessions this year, average per week.
 */
export function StreaksTotals({
  currentStreak,
  longestStreakLabel,
  totalSessions,
  sessionsThisYear,
  avgPerWeek,
  trainedToday,
  sampled,
}: {
  currentStreak: number;
  longestStreakLabel: string;
  totalSessions: number;
  sessionsThisYear: number;
  avgPerWeek: string;
  trainedToday: boolean;
  sampled: boolean;
}) {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const dark = theme.isDark;
  const palette = trendsPalette(dark);
  const year = LocalDate.now().year();
  const locale = useAppSelector((x) => x.settings.preferredLanguage);

  const stats: { value: string; label: string }[] = [
    { value: formatInt(totalSessions, locale), label: t('trends.streaks.total_label') },
    {
      value: formatInt(sessionsThisYear, locale),
      label: t('trends.streaks.year_label', { year }),
    },
    { value: avgPerWeek, label: t('trends.streaks.avg_label') },
  ];

  return (
    <>
      <TrendsSectionHeader
        label={t('trends.streaks.title')}
        badge={sampled ? <SampleBadge compact /> : undefined}
      />
      <HomeCard hero pad={0}>
        <CardInner>
          <CardAura
            width={361}
            height={152}
            stops={[
              { cx: 330, cy: 28, r: 150, color: '#FF9F0A', opacity: 0.2 },
            ]}
          />
          <TopRow>
            <Medallion>
              <Svg width={48} height={48} viewBox="0 0 48 48">
                <Defs>
                  <LinearGradient
                    id="streakFlame"
                    x1="0.2"
                    y1="0"
                    x2="0.8"
                    y2="1"
                  >
                    <Stop offset="0" stopColor="#FFC24A" />
                    <Stop offset="1" stopColor="#FF6A2D" />
                  </LinearGradient>
                </Defs>
                <Circle cx={24} cy={24} r={24} fill="url(#streakFlame)" />
                <Circle
                  cx={24}
                  cy={24}
                  r={23.5}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeOpacity={0.32}
                  strokeWidth={1}
                />
                <Path
                  d="M0 -8.2 C2.9 -4.6 5.9 -1.7 5.9 1.9 C5.9 5.4 3.3 7.9 0 7.9 C-3.3 7.9 -5.9 5.4 -5.9 1.9 C-5.9 -.2 -4.6 -1.9 -3.3 -3.4 C-3.2 -1.7 -2.4 -.9 -1.3 -.7 C-1.7 -3.5 -1.1 -5.9 0 -8.2 Z"
                  fill="#FFFFFF"
                  transform="translate(24,24) scale(1.05)"
                />
              </Svg>
            </Medallion>
            <StreakText>
              <HomeText
                weight={fontWeight.semibold}
                tracking={-0.35}
                style={{ fontSize: 16, lineHeight: 20, color: palette.primary }}
              >
                {t('trends.streaks.current', { days: currentStreak })}
              </HomeText>
              <HomeText
                weight={fontWeight.medium}
                style={{
                  fontSize: 11,
                  lineHeight: 14,
                  marginTop: 4,
                  color: palette.secondary,
                }}
              >
                {longestStreakLabel}
              </HomeText>
            </StreakText>
            {trainedToday ? (
              <TodayPill
                $bg={dark ? 'rgba(48,209,88,0.16)' : 'rgba(36,138,61,0.14)'}
              >
                <HomeText
                  weight={fontWeight.bold}
                  micro
                  tracking={0.6}
                  style={{
                    fontSize: 8.5,
                    lineHeight: 11,
                    color: palette.deltaUp,
                  }}
                >
                  {t('trends.streaks.today_pill')}
                </HomeText>
              </TodayPill>
            ) : null}
          </TopRow>

          <Divider $dark={dark} />

          <StatsRow>
            <StatDivider $dark={dark} $pct={33.333} />
            <StatDivider $dark={dark} $pct={66.667} />
            {stats.map((stat) => (
              <StatCol key={stat.label}>
                <HomeText
                  weight={fontWeight.bold}
                  tracking={-0.6}
                  tabular
                  style={{
                    fontSize: 19,
                    lineHeight: 23,
                    color: palette.primary,
                  }}
                >
                  {stat.value}
                </HomeText>
                <HomeText
                  weight={fontWeight.bold}
                  micro
                  tracking={0.8}
                  style={{
                    fontSize: 8,
                    lineHeight: 10,
                    marginTop: 6,
                    color: palette.secondary,
                  }}
                >
                  {stat.label}
                </HomeText>
              </StatCol>
            ))}
          </StatsRow>
        </CardInner>
      </HomeCard>
    </>
  );
}

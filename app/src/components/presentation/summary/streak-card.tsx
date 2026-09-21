import { SurfaceText } from '@/components/presentation/foundation/surface-text';
import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { spacing, useAppTheme } from '@/hooks/useAppTheme';
import { StreakStats } from '@/store/activity';
import { useTranslate } from '@tolgee/react';
import { LocalDate } from '@js-joda/core';
import { View } from 'react-native';
import { Card, Icon } from 'react-native-paper';
import Svg, { Circle, Defs, LinearGradient, LinearGradient as SvgGradient, Path, Stop } from 'react-native-svg';
import * as S from './streak-card.styles';

interface StreakCardProps {
  stats: StreakStats;
}

export function StreakCard({ stats }: StreakCardProps) {
  const { t } = useTranslate();
  const { colors } = useAppTheme();

  const hasHistory = stats.workoutsLast7Days > 0 || stats.weeks > 0 || stats.currentWeekCount > 0;
  if (!hasHistory) {
    return null;
  }

  // The current week counts towards the run only once it's actually met the target.
  const streakWeeks = stats.weeks + (stats.state === 'secured' ? 1 : 0);

  const streakLabel =
    streakWeeks === 1 ? t('stats.streak.weeks.one') : t('stats.streak.weeks.other', { weeks: streakWeeks.toString() });

  return (
    <Card mode="contained">
      <Card.Content style={{ gap: spacing[2] }}>
        {stats.state !== 'none' && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
            <Icon source="localFireDepartment" size={24} color={colors.primary} />
            <SurfaceText font="text-lg" weight="bold">
              {streakLabel}
            </SurfaceText>
          </View>
        )}

        {stats.state === 'in_progress' && (
          <SurfaceText color="onSurfaceVariant">
            {stats.remainingThisWeek === 1
              ? t('stats.streak.keep_going.one', { weeks: stats.weeks.toString() })
              : t('stats.streak.keep_going.other', {
                  remaining: stats.remainingThisWeek.toString(),
                  weeks: stats.weeks.toString(),
                })}
          </SurfaceText>
        )}

        {stats.state === 'secured' && (
          <SurfaceText color="onSurfaceVariant">{t('stats.streak.secured.message')}</SurfaceText>
        )}

        <SurfaceText color="onSurfaceVariant">
          {stats.workoutsLast7Days === 1
            ? t('stats.last_7_days.one')
            : t('stats.last_7_days.other', { count: stats.workoutsLast7Days.toString() })}
        </SurfaceText>
      </Card.Content>
    </Card>
  );
}

export interface StreakWeekDay {
  date: LocalDate;
  trained: boolean;
  isCurrent: boolean;
}

function FlameIcon() {
  return (
    <Svg width={52} height={52} viewBox="-26 -26 52 52">
      <Defs>
        <LinearGradient id="pwsAmber" x1="0.2" y1="0" x2="0.8" y2="1">
          <Stop offset="0" stopColor="#FFC24A" />
          <Stop offset="1" stopColor="#FF6A2D" />
        </LinearGradient>
      </Defs>
      <Circle r={26} fill="url(#pwsAmber)" stroke="#FFF" strokeOpacity={0.3} strokeWidth={1} />
      <Path
        d="M0 -8.2 C2.9 -4.6 5.9 -1.7 5.9 1.9 C5.9 5.4 3.3 7.9 0 7.9 C-3.3 7.9 -5.9 5.4 -5.9 1.9 C-5.9 -.2 -4.6 -1.9 -3.3 -3.4 C-3.2 -1.7 -2.4 -.9 -1.3 -.7 C-1.7 -3.5 -1.1 -5.9 0 -8.2 Z"
        fill="#FFF"
        transform="scale(1.05)"
      />
    </Svg>
  );
}

function DayDot({ day }: { day: StreakWeekDay }) {
  const theme = useAppTheme();
  const gid = `pwsDot${day.date.toEpochDay()}`;
  if (day.isCurrent) {
    return (
      <Svg
        width={18}
        height={18}
        viewBox="-9 -9 18 18"
        style={{
          shadowColor: '#ff2d55',
          shadowOffset: { width: 0, height: 7 },
          shadowOpacity: 0.5,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <Defs>
          <SvgGradient id={gid} x1="0" y1="0" x2="0.6" y2="1">
            <Stop offset="0" stopColor="#FFB03A" />
            <Stop offset="0.45" stopColor="#FF6A3D" />
            <Stop offset="1" stopColor="#FF2D55" />
          </SvgGradient>
        </Defs>
        <Circle r={5.5} fill={`url(#${gid})`} />
      </Svg>
    );
  }
  if (day.trained) {
    // Reference: flat #FF9F0A — trained dots carry no gradient.
    return (
      <Svg width={18} height={18} viewBox="-9 -9 18 18">
        <Circle r={5.5} fill="#FF9F0A" />
      </Svg>
    );
  }
  return (
    <Svg width={18} height={18} viewBox="-9 -9 18 18">
      <Circle
        r={4.7}
        fill="none"
        stroke={theme.isDark ? '#FFFFFF' : '#787880'}
        strokeOpacity={theme.isDark ? 0.16 : 0.24}
        strokeWidth={1.6}
      />
    </Svg>
  );
}

/**
 * The post-workout streak card: 361×108, rx30. Amber flame icon, "{n}-Day
 * Streak" + longest copy, and the session week's seven day-dots — trained
 * days amber, the session day a brand dot, the rest hollow rings. All
 * computed from real session dates; nothing is hardcoded.
 */
export function PostWorkoutStreakCard({
  days,
  longest,
  week,
}: {
  days: number;
  longest: number;
  week: StreakWeekDay[];
}) {
  const { t } = useTranslate();

  if (days <= 0) {
    return null;
  }

  const title =
    days === 1
      ? t('workout.post_workout.streak.title.one')
      : t('workout.post_workout.streak.title.other', { days: days.toString() });
  const subtitle =
    days >= longest
      ? t('workout.post_workout.streak.longest')
      : t('workout.post_workout.streak.best', { best: longest.toString() });

  return (
    <HomeCard radius={30} pad={20}>
      <S.TopRow>
        <S.IconWrap>
          <FlameIcon />
        </S.IconWrap>
        <S.TitleCol>
          <S.Title numberOfLines={1}>{title}</S.Title>
          <S.Subtitle numberOfLines={2}>{subtitle}</S.Subtitle>
        </S.TitleCol>
      </S.TopRow>
      <S.DotsRow>
        <S.Dots>
          {week.map((day) => (
            <DayDot key={day.date.toString()} day={day} />
          ))}
        </S.Dots>
        <S.ThisWeek>{t('workout.post_workout.streak.this_week')}</S.ThisWeek>
      </S.DotsRow>
    </HomeCard>
  );
}

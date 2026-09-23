import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { HomeGradient } from '@/components/presentation/home/shared/home-gradient';
import { HomeText } from '@/components/presentation/home/shared/home-text';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useFormatDate } from '@/hooks/useFormatDate';
import { useFormatTimeOfDay } from '@/hooks/useFormatTimeOfDay';
import type { PersonalRecord } from '@/store/stats/personal-records';
import { fontWeight } from '@/styles/theme';
import type { Session } from '@/models/session-models';
import { Duration, LocalDate, OffsetDateTime } from '@js-joda/core';
import { useHistoryTranslate } from '../history-i18n';
import { Pressable } from 'react-native';
import { Path, Rect, Svg } from 'react-native-svg';
import { GOLD } from '../history-design';
import {
  estimateSessionKcal,
  formatClockDuration,
  formatCount,
  sessionTotalReps,
  sessionTotalSets,
  sessionVolumeKg,
} from '../history-stats';
import {
  AggregateCell,
  AggregateRow,
  CardMiddle,
  CardRight,
  ChipRow,
  CoralEdge,
  DaySection,
  GlossHalf,
  IconTile,
  PrChip,
  SectionLabel,
  SessionCardRow,
} from './day-summary.styles';

function DumbbellGlyph() {
  return (
    <Svg width={28} height={22} viewBox="-15 -10 30 20">
      <Rect x={-13} y={-5.6} width={4.4} height={11.2} rx={1.8} fill="#FFFFFF" />
      <Rect x={-7.6} y={-8} width={3.8} height={16} rx={1.7} fill="#FFFFFF" />
      <Rect x={-7.6} y={-1.9} width={15.2} height={3.8} rx={0.6} fill="#FFFFFF" />
      <Rect x={3.8} y={-8} width={3.8} height={16} rx={1.7} fill="#FFFFFF" />
      <Rect x={8.6} y={-5.6} width={4.4} height={11.2} rx={1.8} fill="#FFFFFF" />
    </Svg>
  );
}

function StarGlyph() {
  return (
    <Svg width={9} height={9} viewBox="-9 -9 18 18">
      <Path
        d="M0 -9 L2.23 -3.07 L8.56 -2.78 L3.61 1.17 L5.29 7.28 L0 3.8 L-5.29 7.28 L-3.61 1.17 L-8.56 -2.78 L-2.23 -3.07 Z"
        fill="#FFD84D"
        transform="scale(0.42)"
      />
    </Svg>
  );
}

function ChevronGlyph() {
  const theme = useAppTheme();
  return (
    <Svg width={10} height={14} viewBox="-5 -7 10 14">
      <Path
        d="M-2 -4 L2 0 L-2 4"
        fill="none"
        stroke={theme.isDark ? '#48484A' : '#C7C7CC'}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function sessionMeta(
  session: Session,
  formatTime: (time: OffsetDateTime) => string,
  t: (key: string, params?: Record<string, string>) => string,
): string {
  const start = session.firstExercise?.earliestTime;
  const end = session.lastExercise?.latestTime;
  const parts: string[] = [];
  if (start && end) {
    parts.push(`${formatTime(start)} – ${formatTime(end)}`);
  }
  const sets = sessionTotalSets(session);
  const exercises = session.recordedExercises.filter((e) => e.isStarted).length;
  parts.push(
    sets === 1
      ? t('history.v2.session.set_count.one')
      : t('history.v2.session.set_count.other', { count: sets.toString() }),
  );
  parts.push(
    exercises === 1
      ? t('history.v2.session.exercise_count.one')
      : t('history.v2.session.exercise_count.other', {
          count: exercises.toString(),
        }),
  );
  return parts.join(' · ');
}

function SelectedSessionCard({
  session,
  prs,
  onPress,
}: {
  session: Session;
  prs: PersonalRecord[];
  onPress: (session: Session) => void;
}) {
  const t = useHistoryTranslate();
  const formatTime = useFormatTimeOfDay();
  const theme = useAppTheme();
  const volume = sessionVolumeKg(session);
  const kcal = estimateSessionKcal(session);
  const reps = sessionTotalReps(session);

  return (
    <Pressable
      onPress={() => onPress(session)}
      accessibilityRole="button"
      accessibilityLabel={session.blueprint.name}
      testID={`history-session-${session.id}`}
    >
      <HomeCard radius={26} pad={0}>
        <SessionCardRow>
          <IconTile>
            <HomeGradient
              variant="brand"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
            <GlossHalf>
              <HomeGradient
                variant="gloss"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              />
            </GlossHalf>
            <DumbbellGlyph />
          </IconTile>
          <CardMiddle>
            <HomeText
              weight={fontWeight.semibold}
              tracking={-0.3}
              numberOfLines={1}
              style={{
                fontSize: 15.5,
                lineHeight: 20,
                color: theme.color.content.primary,
              }}
            >
              {session.blueprint.name}
            </HomeText>
            <HomeText
              weight={fontWeight.medium}
              numberOfLines={1}
              style={{
                fontSize: 11,
                lineHeight: 14,
                color: theme.color.content.secondary,
              }}
            >
              {sessionMeta(session, formatTime, t)}
            </HomeText>
            {prs.length > 0 && (
              <ChipRow>
                <PrChip>
                  <StarGlyph />
                  <HomeText
                    weight={fontWeight.bold}
                    tracking={0.5}
                    style={{ fontSize: 8, lineHeight: 10, color: GOLD.ink }}
                  >
                    {prs.length === 1
                      ? t('history.v2.session.pr_count.one')
                      : t('history.v2.session.pr_count.other', {
                          count: prs.length.toString(),
                        })}
                  </HomeText>
                </PrChip>
              </ChipRow>
            )}
          </CardMiddle>
          <CardRight>
            <HomeText
              weight={fontWeight.bold}
              tracking={-0.25}
              tabular
              style={{
                fontSize: 13.5,
                lineHeight: 17,
                color: theme.color.content.primary,
              }}
            >
              {formatCount(volume)} kg
            </HomeText>
            <HomeText weight={fontWeight.medium} style={{ fontSize: 10, lineHeight: 13, color: '#6C6C70' }}>
              {t('history.v2.session.kcal_reps', {
                kcal: kcal.toString(),
                reps: reps.toString(),
              })}
            </HomeText>
          </CardRight>
          <ChevronGlyph />
        </SessionCardRow>
        <CoralEdge pointerEvents="none" />
      </HomeCard>
    </Pressable>
  );
}

function sumDurations(sessions: Session[]): Duration {
  return sessions.reduce<Duration>((acc, s) => (s.duration ? acc.plus(s.duration) : acc), Duration.ZERO);
}

/** "MONDAY, JUNE 9" label, shared with the empty-day state. */
export function DaySectionLabel({ date }: { date: LocalDate }) {
  const theme = useAppTheme();
  const formatDate = useFormatDate();
  return (
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
        {formatDate(date, { weekday: 'long', month: 'long', day: 'numeric' }).toLocaleUpperCase()}
      </HomeText>
    </SectionLabel>
  );
}

export function DaySummary({
  date,
  sessions,
  prBySessionId,
  onSessionPress,
}: {
  date: LocalDate;
  sessions: Session[];
  prBySessionId: Map<string, PersonalRecord[]>;
  onSessionPress: (session: Session) => void;
}) {
  const theme = useAppTheme();
  const t = useHistoryTranslate();

  const volume = sessions.reduce((sum, s) => sum + sessionVolumeKg(s), 0);
  const kcal = sessions.reduce((sum, s) => sum + estimateSessionKcal(s), 0);
  const duration = sumDurations(sessions);

  const cells: { value: string; label: string }[] = [
    {
      value: sessions.length.toString(),
      label: t('history.v2.day.aggregate.session').toLocaleUpperCase(),
    },
    {
      value: formatCount(volume),
      label: t('history.v2.day.aggregate.volume_kg').toLocaleUpperCase(),
    },
    {
      value: formatClockDuration(duration),
      label: t('history.v2.day.aggregate.duration').toLocaleUpperCase(),
    },
    { value: formatCount(kcal), label: t('history.v2.day.aggregate.kcal_est').toLocaleUpperCase() },
  ];

  return (
    <DaySection>
      <DaySectionLabel date={date} />
      <HomeCard radius={24} pad={0}>
        <AggregateRow>
          {cells.map((cell, i) => (
            <AggregateCell key={cell.label} $first={i === 0}>
              <HomeText
                weight={fontWeight.bold}
                tracking={-0.4}
                tabular
                style={{
                  fontSize: 15,
                  lineHeight: 19,
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
            </AggregateCell>
          ))}
        </AggregateRow>
      </HomeCard>
      {sessions.map((session) => (
        <SelectedSessionCard
          key={session.id}
          session={session}
          prs={prBySessionId.get(session.id) ?? []}
          onPress={onSessionPress}
        />
      ))}
    </DaySection>
  );
}

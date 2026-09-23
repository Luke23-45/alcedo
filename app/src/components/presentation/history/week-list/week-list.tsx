import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { HomeText } from '@/components/presentation/home/shared/home-text';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useFormatDate } from '@/hooks/useFormatDate';
import type { PersonalRecord } from '@/store/stats/personal-records';
import { fontWeight } from '@/styles/theme';
import type { Session } from '@/models/session-models';
import { useHistoryTranslate } from '../history-i18n';
import { Pressable } from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { GOLD } from '../history-design';
import {
  estimateSessionKcal,
  formatClockDuration,
  formatCount,
  sessionTotalSets,
  sessionVolumeKg,
} from '../history-stats';
import {
  DateTile,
  GoldEdge,
  NameRow,
  PrBadge,
  RowMiddle,
  RowRight,
  SessionRowInner,
  WeekHeader,
  WeekSection,
} from './week-list.styles';

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

function sessionMeta(session: Session, t: (key: string, params?: Record<string, string>) => string): string {
  const sets = sessionTotalSets(session);
  const exercises = session.recordedExercises.filter((e) => e.isStarted).length;
  const duration = formatClockDuration(session.duration);
  const parts = [
    sets === 1
      ? t('history.v2.session.set_count.one')
      : t('history.v2.session.set_count.other', { count: sets.toString() }),
  ];
  if (duration !== '—') {
    parts.push(duration);
  }
  parts.push(
    exercises === 1
      ? t('history.v2.session.exercise_count.one')
      : t('history.v2.session.exercise_count.other', {
          count: exercises.toString(),
        }),
  );
  return parts.join(' · ');
}

function WeekSessionRow({
  session,
  isPr,
  onPress,
}: {
  session: Session;
  isPr: boolean;
  onPress: (session: Session) => void;
}) {
  const theme = useAppTheme();
  const t = useHistoryTranslate();
  const formatDate = useFormatDate();
  const volume = sessionVolumeKg(session);
  const kcal = estimateSessionKcal(session);

  return (
    <Pressable
      onPress={() => onPress(session)}
      accessibilityRole="button"
      accessibilityLabel={`${session.blueprint.name}, ${formatDate(session.date, { weekday: 'long', month: 'long', day: 'numeric' })}`}
      testID={`history-session-${session.id}`}
    >
      <HomeCard radius={20} elev="tile" pad={0}>
        <SessionRowInner>
          <DateTile $pr={isPr} $dark={theme.isDark}>
            <HomeText
              weight={fontWeight.bold}
              tracking={0.6}
              style={{
                fontSize: 8,
                lineHeight: 10,
                color: isPr ? GOLD.softInk : '#8E8E93',
              }}
            >
              {formatDate(session.date, { weekday: 'narrow' }).toLocaleUpperCase()}
            </HomeText>
            <HomeText
              weight={fontWeight.bold}
              tracking={-0.5}
              tabular
              style={{
                fontSize: 16,
                lineHeight: 19,
                color: isPr ? GOLD.ink : theme.color.content.primary,
              }}
            >
              {session.date.dayOfMonth().toString().padStart(2, '0')}
            </HomeText>
          </DateTile>
          <RowMiddle>
            <NameRow>
              <HomeText
                weight={fontWeight.semibold}
                tracking={-0.2}
                numberOfLines={1}
                style={{
                  fontSize: 13.5,
                  lineHeight: 17,
                  color: theme.color.content.primary,
                  flexShrink: 1,
                }}
              >
                {session.blueprint.name}
              </HomeText>
              {isPr && (
                <PrBadge>
                  <HomeText
                    weight={fontWeight.bold}
                    tracking={0.5}
                    style={{ fontSize: 7.5, lineHeight: 10, color: GOLD.ink }}
                  >
                    {t('history.v2.session.pr_badge')}
                  </HomeText>
                </PrBadge>
              )}
            </NameRow>
            <HomeText
              weight={fontWeight.medium}
              numberOfLines={1}
              style={{
                fontSize: 10.5,
                lineHeight: 14,
                color: theme.color.content.secondary,
              }}
            >
              {sessionMeta(session, t)}
            </HomeText>
          </RowMiddle>
          <RowRight>
            <HomeText
              weight={fontWeight.bold}
              tracking={-0.25}
              tabular
              style={{
                fontSize: 13,
                lineHeight: 16,
                color: isPr ? GOLD.ink : theme.color.content.primary,
              }}
            >
              {formatCount(volume)} kg
            </HomeText>
            <HomeText weight={fontWeight.medium} style={{ fontSize: 10, lineHeight: 13, color: '#6C6C70' }}>
              {t('history.v2.session.kcal_est', { kcal: kcal.toString() })}
            </HomeText>
          </RowRight>
          <ChevronGlyph />
        </SessionRowInner>
        {isPr && <GoldEdge pointerEvents="none" />}
      </HomeCard>
    </Pressable>
  );
}

export function WeekList({
  sessions,
  rangeLabel,
  prBySessionId,
  onSessionPress,
}: {
  /** Sessions of the selected week excluding the selected day, newest first. */
  sessions: Session[];
  /** e.g. "Jun 3 – 8" — the real span of the rows shown. */
  rangeLabel: string;
  prBySessionId: Map<string, PersonalRecord[]>;
  onSessionPress: (session: Session) => void;
}) {
  const theme = useAppTheme();
  const t = useHistoryTranslate();

  return (
    <WeekSection>
      <WeekHeader>
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
          {t('history.v2.week.title').toLocaleUpperCase()}
        </HomeText>
        <HomeText
          weight={fontWeight.semibold}
          tracking={-0.1}
          style={{ fontSize: 11.5, lineHeight: 15, color: theme.home.seeAll }}
        >
          {rangeLabel}
        </HomeText>
      </WeekHeader>
      {sessions.map((session) => (
        <WeekSessionRow
          key={session.id}
          session={session}
          isPr={(prBySessionId.get(session.id) ?? []).length > 0}
          onPress={onSessionPress}
        />
      ))}
    </WeekSection>
  );
}

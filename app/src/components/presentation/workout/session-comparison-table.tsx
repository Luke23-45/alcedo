import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useFormatDate } from '@/hooks/useFormatDate';
import { Session } from '@/models/session-models';
import { useTranslate } from '@tolgee/react';
import Svg, { Path } from 'react-native-svg';
import {
  completedSetCount,
  formatDurationDelta,
  formatSessionClock,
  formatWeightShort,
  sessionBestSetForMovement,
  sessionTopSet,
} from '../summary/post-workout-format';
import * as S from './session-comparison-table.styles';

function ChevronGlyph({ direction }: { direction: 'up' | 'down' }) {
  const theme = useAppTheme();
  return (
    <Svg width={9} height={9} viewBox="-4.5 -4.5 9 9">
      <Path
        d={direction === 'up' ? 'M-4 2 L0 -2.6 L4 2' : 'M-4 -2 L0 2.6 L4 -2'}
        fill="none"
        stroke={direction === 'up' ? theme.home.delta : '#8E8E93'}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

interface TableRow {
  key: string;
  metric: string;
  previous: string;
  current: string;
  delta: { text: string; positive: boolean; negative: boolean };
}

/**
 * The vs-previous card: 361×196, rx30. Columns METRIC | {prev date} | TODAY | Δ
 * with Volume / Sets / Top set / Duration rows. Every delta is computed from
 * the two real sessions — never from labels.
 */
export function SessionComparisonTable({
  session,
  previousSession,
}: {
  session: Session;
  previousSession?: Session | undefined;
}) {
  const { t } = useTranslate();
  const formatDate = useFormatDate();

  if (!previousSession) {
    return null;
  }

  const prevDateShort = formatDate(previousSession.date, { month: 'short', day: 'numeric' }).toUpperCase();
  const daysAgo = Math.max(0, session.date.toEpochDay() - previousSession.date.toEpochDay());
  const subtitle = t(
    daysAgo === 1 ? 'workout.post_workout.vs_previous.subtitle_one_day' : 'workout.post_workout.vs_previous.subtitle',
    { date: formatDate(previousSession.date, { month: 'long', day: 'numeric' }), days: daysAgo.toString() },
  );

  const volumeDeltaPct = previousSession.totalWeightLifted.value.gt(0)
    ? session.totalWeightLifted
        .minus(previousSession.totalWeightLifted)
        .value.multipliedBy(100)
        .dividedBy(previousSession.totalWeightLifted.convertTo(session.totalWeightLifted.unit).value)
    : undefined;

  const setsDelta = completedSetCount(session) - completedSetCount(previousSession);

  const currentTop = sessionTopSet(session);
  // Same movement on both sides: the previous session's best set for the
  // current session's top exercise, so the delta never compares bench to squat.
  const previousTop = currentTop ? sessionBestSetForMovement(previousSession, currentTop.movementKey) : undefined;
  const topDeltaPct =
    currentTop && previousTop && previousTop.weight.value.gt(0)
      ? currentTop.weight
          .minus(previousTop.weight)
          .value.multipliedBy(100)
          .dividedBy(previousTop.weight.convertTo(currentTop.weight.unit).value)
      : undefined;

  const rows: TableRow[] = [
    {
      key: 'volume',
      metric: t('workout.post_workout.metric.volume'),
      previous: formatWeightShort(previousSession.totalWeightLifted),
      current: formatWeightShort(session.totalWeightLifted),
      delta: percentDelta(volumeDeltaPct?.toFixed(1)),
    },
    {
      key: 'sets',
      metric: t('workout.post_workout.metric.sets'),
      previous: completedSetCount(previousSession).toString(),
      current: completedSetCount(session).toString(),
      delta: {
        text: setsDelta > 0 ? `+${setsDelta}` : setsDelta < 0 ? `−${Math.abs(setsDelta)}` : '0',
        positive: setsDelta > 0,
        negative: setsDelta < 0,
      },
    },
    {
      key: 'topset',
      metric: t('workout.post_workout.metric.top_set', { name: currentTop?.exerciseName ?? '—' }),
      previous: previousTop ? formatWeightShort(previousTop.weight) : '—',
      current: currentTop ? formatWeightShort(currentTop.weight) : '—',
      delta: percentDelta(topDeltaPct?.toFixed(1)),
    },
    {
      key: 'duration',
      metric: t('workout.post_workout.metric.duration'),
      previous: formatSessionClock(previousSession.duration),
      current: formatSessionClock(session.duration),
      delta:
        session.duration && previousSession.duration
          ? {
              text: formatDurationDelta(session.duration, previousSession.duration),
              positive: Math.round(session.duration.minus(previousSession.duration).toMillis() / 1000) > 0,
              negative: Math.round(session.duration.minus(previousSession.duration).toMillis() / 1000) < 0,
            }
          : { text: '—', positive: false, negative: false },
    },
  ];

  return (
    <HomeCard radius={30} pad={20}>
      <S.Title>{t('workout.post_workout.vs_previous.title', { name: previousSession.blueprint.name })}</S.Title>
      <S.Subtitle>{subtitle}</S.Subtitle>
      <S.HeaderRow>
        <S.HeaderMetric>{t('workout.post_workout.metric.label').toUpperCase()}</S.HeaderMetric>
        <S.HeaderPrev>{prevDateShort}</S.HeaderPrev>
        <S.HeaderToday>{t('workout.post_workout.metric.today').toUpperCase()}</S.HeaderToday>
        <S.HeaderDelta>{t('workout.post_workout.metric.delta')}</S.HeaderDelta>
      </S.HeaderRow>
      {rows.map((row, index) => (
        <S.DataRow key={row.key} $last={index === rows.length - 1}>
          <S.Metric numberOfLines={1}>{row.metric}</S.Metric>
          <S.Prev style={{ fontVariant: ['tabular-nums'] }} numberOfLines={1}>
            {row.previous}
          </S.Prev>
          <S.Today style={{ fontVariant: ['tabular-nums'] }} numberOfLines={1}>
            {row.current}
          </S.Today>
          <S.DeltaCell>
            {(row.delta.positive || row.delta.negative) && (
              <S.DeltaChevron $left={row.delta.text.length <= 2 ? 20.5 : 4.5}>
                <ChevronGlyph direction={row.delta.positive ? 'up' : 'down'} />
              </S.DeltaChevron>
            )}
            <S.Delta
              $positive={row.delta.positive}
              $negative={row.delta.negative}
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {row.delta.text}
            </S.Delta>
          </S.DeltaCell>
        </S.DataRow>
      ))}
    </HomeCard>
  );
}

function percentDelta(fixed: string | undefined): TableRow['delta'] {
  if (fixed === undefined) {
    return { text: '—', positive: false, negative: false };
  }
  const n = parseFloat(fixed);
  if (n > 0) {
    return { text: `+${fixed}%`, positive: true, negative: false };
  }
  if (n < 0) {
    return { text: `−${Math.abs(n).toFixed(1)}%`, positive: false, negative: true };
  }
  return { text: '0%', positive: false, negative: false };
}

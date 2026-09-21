import { useFormatDate } from '@/hooks/useFormatDate';
import { Session } from '@/models/session-models';
import { useAppSelector } from '@/store';
import { sessionActiveRest, formatClockDuration } from '@/components/presentation/history/history-stats';
import { useTranslate } from '@tolgee/react';
import { formatSessionClock } from '../../summary/post-workout-format';
import * as S from './session-detail-hero.styles';

const timeFormatters = new Map<string, Intl.DateTimeFormat>();
function timeFormatter(
  locale: string | undefined,
  withDayPeriod: boolean,
  use24HourTime: boolean,
): Intl.DateTimeFormat {
  const key = `${locale}|${withDayPeriod}|${use24HourTime}`;
  const existing = timeFormatters.get(key);
  if (existing) {
    return existing;
  }
  const formatter = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: withDayPeriod && !use24HourTime,
  });
  timeFormatters.set(key, formatter);
  return formatter;
}

/**
 * The archival hero: the same duration typography as the post-workout
 * summary, minus the celebration seal and minus the pink label — a record,
 * not a trophy. Every figure is real: the active/rest split comes from the
 * shared session stats.
 */
export function SessionDetailHero({ session }: { session: Session }) {
  const { t } = useTranslate();
  const formatDate = useFormatDate();
  const locale = useAppSelector((x) => x.settings.preferredLanguage);
  const use24HourTime = useAppSelector((x) => x.settings.use24HourTime);

  const dateLabel = formatDate(session.date, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).toUpperCase();

  const start = session.firstExercise?.earliestTime;
  const end = session.lastExercise?.latestTime;
  const clock =
    start && end
      ? `${timeFormatter(locale, false, use24HourTime).format(new Date(start.toInstant().toEpochMilli()))} – ${timeFormatter(locale, true, use24HourTime).format(new Date(end.toInstant().toEpochMilli()))}`
      : undefined;
  const dateLine = clock ? `${clock} · ${session.blueprint.name}` : session.blueprint.name;

  const split = sessionActiveRest(session);
  const active = formatClockDuration(split?.active);
  const rest = formatClockDuration(split?.rest);

  return (
    <S.HeroWrap>
      <S.DateLabel>{dateLabel}</S.DateLabel>
      <S.Duration style={{ fontVariant: ['tabular-nums'] }}>{formatSessionClock(session.duration)}</S.Duration>
      <S.Split style={{ fontVariant: ['tabular-nums'] }}>
        {t('workout.post_workout.active_rest.line', { active, rest })}
      </S.Split>
      <S.DateLine numberOfLines={1}>{dateLine}</S.DateLine>
    </S.HeroWrap>
  );
}

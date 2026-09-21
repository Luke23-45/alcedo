import { useFormatDate } from '@/hooks/useFormatDate';
import { Session } from '@/models/session-models';
import { useAppSelector } from '@/store';
import { useTranslate } from '@tolgee/react';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { SampleBadge } from '../../home/shared/sample-badge';
import { formatSessionClock } from '../post-workout-format';
import * as S from './post-workout-hero.styles';

/**
 * The duration hero: brand ring (r=30, 2.4pt, 50% opacity) + inner brand
 * 14% circle + amber check, then SESSION COMPLETE / the clock / the date line.
 * The store tracks elapsed time but not the active/rest split, so the
 * reference's split figures render here flagged with a SampleBadge (home
 * convention) rather than as synced facts (Law III: never invent a number).
 */
function RingGlyph() {
  // Reference filter #fs: dy 2, blur 3, black at 0.45.
  return (
    <Svg
      width={60}
      height={60}
      viewBox="-30 -30 60 60"
      style={{ shadowColor: '#000000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.45, shadowRadius: 3 }}
    >
      <Defs>
        <LinearGradient id="pwhBrand" x1="0" y1="0" x2="0.6" y2="1">
          <Stop offset="0" stopColor="#FFB03A" />
          <Stop offset="0.45" stopColor="#FF6A3D" />
          <Stop offset="1" stopColor="#FF2D55" />
        </LinearGradient>
      </Defs>
      <Circle r={30} fill="none" stroke="url(#pwhBrand)" strokeWidth={2.4} opacity={0.5} />
      <Circle r={23} fill="url(#pwhBrand)" opacity={0.14} />
      <Path
        d="M-9 0.5 L-2.6 7 L9.5 -6.5"
        fill="none"
        stroke="#FFB84D"
        strokeWidth={3.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

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
    // The 24-hour preference wins over the editorial range pattern: 13:04
    // needs no day period on either end.
    hour12: withDayPeriod && !use24HourTime,
  });
  timeFormatters.set(key, formatter);
  return formatter;
}

export function PostWorkoutHero({ session }: { session: Session }) {
  const { t } = useTranslate();
  const formatDate = useFormatDate();
  const locale = useAppSelector((x) => x.settings.preferredLanguage);
  const use24HourTime = useAppSelector((x) => x.settings.use24HourTime);

  const datePart = formatDate(session.date, { weekday: 'long', month: 'long', day: 'numeric' });
  const start = session.firstExercise?.earliestTime;
  const end = session.lastExercise?.latestTime;
  const dateLine =
    start && end
      ? `${datePart} · ${timeFormatter(locale, false, use24HourTime).format(new Date(start.toInstant().toEpochMilli()))} – ${timeFormatter(locale, true, use24HourTime).format(new Date(end.toInstant().toEpochMilli()))}`
      : datePart;

  return (
    <S.HeroWrap>
      <RingGlyph />
      <S.Label style={{ fontVariant: ['tabular-nums'] }}>
        {t('workout.post_workout.session_complete.label').toUpperCase()}
      </S.Label>
      <S.Duration style={{ fontVariant: ['tabular-nums'] }}>{formatSessionClock(session.duration)}</S.Duration>
      {/*
        The store tracks elapsed time but not an active/rest split, so the
        reference's split renders here as illustrative figures flagged Sample
        (home convention) rather than as synced facts.
      */}
      <S.SplitLine>
        <S.Split style={{ fontVariant: ['tabular-nums'] }}>
          {t('workout.post_workout.active_rest.line', { active: '33:40', rest: '11:32' })}
        </S.Split>
        <SampleBadge compact />
      </S.SplitLine>
      <S.DateLine>{dateLine}</S.DateLine>
    </S.HeroWrap>
  );
}

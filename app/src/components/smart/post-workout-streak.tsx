import { PostWorkoutStreakCard, StreakWeekDay } from '@/components/presentation/summary/streak-card';
import { Session } from '@/models/session-models/session';
import { useAppSelector, useAppSelectorWithArg } from '@/store';
import { selectSession, selectSessions } from '@/store/stored-sessions';
import { LocalDate } from '@js-joda/core';

/** Consecutive trained days ending on the session's date, from real session dates. */
function currentStreakDays(session: Session, sessions: Session[]): number {
  const trained = trainedEpochDays(session, sessions);
  let days = 0;
  let day = session.date.toEpochDay();
  while (trained.has(day)) {
    days += 1;
    day -= 1;
  }
  return days;
}

/** Longest run of consecutive trained days in the session's year. */
function longestStreakThisYear(session: Session, sessions: Session[]): number {
  const year = session.date.year();
  const days = [...trainedEpochDays(session, sessions)]
    .filter((d) => LocalDate.ofEpochDay(d).year() === year)
    .sort((a, b) => a - b);
  let longest = 0;
  let run = 0;
  let previous = Number.NEGATIVE_INFINITY;
  for (const day of days) {
    run = day === previous + 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
    previous = day;
  }
  return longest;
}

/**
 * Epoch days that count as trained, as known on the session's own date:
 * only started sessions, and never anything after the displayed session.
 * The session on screen is always trained, even if it isn't stored yet.
 */
function trainedEpochDays(session: Session, sessions: Session[]): Set<number> {
  const cutoff = session.date.toEpochDay();
  const days = new Set<number>();
  for (const s of sessions) {
    const day = s.date.toEpochDay();
    if (s.isStarted && day <= cutoff) {
      days.add(day);
    }
  }
  days.add(cutoff);
  return days;
}

/** The Monday–Sunday week containing the session, for the seven day-dots. */
function sessionWeek(session: Session, sessions: Session[]): StreakWeekDay[] {
  const trained = trainedEpochDays(session, sessions);
  const monday = session.date.minusDays(session.date.dayOfWeek().value() - 1);
  return Array.from({ length: 7 }, (_, i) => {
    const date = monday.plusDays(i);
    return {
      date,
      trained: trained.has(date.toEpochDay()),
      isCurrent: date.equals(session.date),
    };
  });
}

/**
 * The post-workout streak card, wired to the store. The day count, the
 * longest-this-year copy, and every week dot are derived from the real dated
 * sessions — the card from the home screen is weekly, so this one is computed
 * here rather than reused.
 */
export function PostWorkoutStreak({ sessionId }: { sessionId: string }) {
  const session = useAppSelectorWithArg(selectSession, sessionId);
  const sessions = useAppSelector(selectSessions);

  if (!session) {
    return null;
  }

  const days = currentStreakDays(session, sessions);

  return (
    <PostWorkoutStreakCard
      days={days}
      longest={Math.max(longestStreakThisYear(session, sessions), days)}
      week={sessionWeek(session, sessions)}
    />
  );
}

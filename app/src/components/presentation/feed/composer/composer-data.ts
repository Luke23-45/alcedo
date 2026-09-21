import { Session } from '@/models/session-models';
import { RecordedWeightedExercise } from '@/models/session-models/recorded-weighted-exercise';
import { Weight } from '@/models/weight';
import { completedSetCount, formatSessionClock } from '@/components/presentation/summary/post-workout-format';
import { getSessionReferenceTime } from '@/store/stored-sessions';
import type { PersonalRecord } from '@/store/stats/personal-records';
import { DateTimeFormatter, LocalDate } from '@js-joda/core';

/**
 * Real-data derivation for the Share Composer and for composer posts rendered
 * in the timeline. Everything is computed from the stored sessions — no
 * invented figures. The contract's "Push Day · Strength — 8,420 kg" falls out
 * of this math for the user's latest recorded session.
 */

export interface ComposerSessionData {
  sessionId: string;
  /** e.g. "Push Day". */
  name: string;
  /** e.g. "Strength". */
  kindLabel: string;
  /** e.g. "8,420". */
  volumeLabel: string;
  /** e.g. "kg". */
  volumeUnit: string;
  /** e.g. "45:12". */
  durationLabel: string;
  /** e.g. "19". */
  setsLabel: string;
  /** e.g. "KINETIC · MONDAY, JUNE 9". */
  kicker: string;
  /** e.g. ["SHOULDER PRESS PR", "VOLUME PR", "13-DAY STREAK"]. */
  prPills: string[];
}

function sessionVolumeKg(session: Session): number {
  let total = new Weight(0, 'kilograms');
  for (const exercise of session.recordedExercises) {
    if (!(exercise instanceof RecordedWeightedExercise)) {
      continue;
    }
    for (const potentialSet of exercise.potentialSets) {
      if (!potentialSet.set?.repsCompleted) {
        continue;
      }
      const weight = exercise.effectiveWeight(potentialSet, session.bodyweight);
      if (weight.value.isZero()) {
        continue;
      }
      total = total.plus(weight.multipliedBy(potentialSet.set.repsCompleted).convertTo('kilograms'));
    }
  }
  return total.value.toNumber();
}

/**
 * Honest display kind for the poster: "{name} · {kind}". Push/pull/upper splits
 * are strength training — the poster names the discipline, not the split — so
 * "Push Day" reads "Push Day · Strength" as the contract requires.
 */
function sessionKindLabel(session: Session): string {
  const name = session.blueprint.name;
  if (/leg/i.test(name)) return 'Legs';
  if (/push|pull|upper|accessory|chest|back|shoulder|arm/i.test(name)) return 'Strength';
  return session.recordedExercises.some((x) => x instanceof RecordedWeightedExercise) ? 'Strength' : 'Cardio';
}

/** The user's latest *recorded* session — started exercises only, newest first. */
export function latestSession(sessions: readonly Session[]): Session | undefined {
  const recorded = sessions.filter((s) => s.recordedExercises.some((x) => x.isStarted));
  const pool = recorded.length > 0 ? recorded : sessions;
  let best: Session | undefined;
  for (const session of pool) {
    if (!best || getSessionReferenceTime(session).isAfter(getSessionReferenceTime(best))) {
      best = session;
    }
  }
  return best;
}

/**
 * Consecutive training days ending today (or yesterday when today has none).
 * Sessions without a started exercise do not count — rest is data, not a streak.
 */
function trainingStreakDays(sessions: readonly Session[]): number {
  const days = new Set(
    sessions.filter((s) => s.recordedExercises.some((x) => x.isStarted)).map((s) => s.date.toString()),
  );
  if (days.size === 0) {
    return 0;
  }
  let cursor = LocalDate.now();
  if (!days.has(cursor.toString())) {
    cursor = cursor.minusDays(1);
  }
  let streak = 0;
  while (days.has(cursor.toString())) {
    streak += 1;
    cursor = cursor.minusDays(1);
  }
  return streak;
}

export function deriveComposerSessionData(
  session: Session,
  sessions: readonly Session[],
  recordsBySession: Map<string, PersonalRecord[]>,
): ComposerSessionData {
  const volumeKg = sessionVolumeKg(session);
  const volumeLabel = Math.round(volumeKg).toLocaleString('en-US');
  const sets = completedSetCount(session);

  const prPills: string[] = [];
  for (const record of recordsBySession.get(session.id) ?? []) {
    prPills.push(`${record.exerciseName.toUpperCase()} PR`);
  }

  const otherMaxVolume = sessions
    .filter((s) => s.id !== session.id)
    .map(sessionVolumeKg)
    .reduce((max, v) => Math.max(max, v), 0);
  if (sessions.some((s) => s.id !== session.id) && volumeKg > otherMaxVolume) {
    prPills.push('VOLUME PR');
  }

  const streak = trainingStreakDays(sessions);
  if (streak >= 2) {
    prPills.push(`${streak}-DAY STREAK`);
  }

  const kickerDate = getSessionReferenceTime(session)
    .toLocalDate()
    .format(DateTimeFormatter.ofPattern('EEEE, MMMM d'))
    .toUpperCase();

  return {
    sessionId: session.id,
    name: session.blueprint.name,
    kindLabel: sessionKindLabel(session),
    volumeLabel,
    volumeUnit: 'kg',
    durationLabel: formatSessionClock(session.duration),
    setsLabel: String(sets),
    kicker: `KINETIC · ${kickerDate}`,
    prPills,
  };
}

/**
 * Real relative age for a composer post: "now" / "21m" / "2h" / "1d", then a
 * short date. Never negative — a future-dated post reads as "now".
 */
export function formatPostAge(
  postedAt: number,
  now: number,
  t: (key: string, fallback: string, params?: Record<string, string | number>) => string,
): string {
  const diffSeconds = Math.max(0, Math.floor((now - postedAt) / 1000));
  if (diffSeconds < 60) {
    return t('feed.composer.post.age.now', 'now');
  }
  const minutes = Math.floor(diffSeconds / 60);
  if (minutes < 60) {
    return t('feed.composer.post.age.minutes', '{count}m', { count: minutes });
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return t('feed.composer.post.age.hours', '{count}h', { count: hours });
  }
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return t('feed.composer.post.age.days', '{count}d', { count: days });
  }
  return new Date(postedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

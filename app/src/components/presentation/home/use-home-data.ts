import { useAppSelector } from '@/store';
import { selectHistoryPersonalRecords, selectSessions } from '@/store/stored-sessions';
import type { PersonalRecord } from '@/store/stats/personal-records';
import { Session } from '@/models/session-models';
import { RecordedWeightedExercise } from '@/models/session-models/recorded-weighted-exercise';
import { Weight } from '@/models/weight';
import { formatSessionClock } from '@/components/presentation/summary/post-workout-format';
import { formatGrouped } from '@/components/presentation/home/shared/home-format';
import { useFormatDate } from '@/hooks/useFormatDate';
import { LocalDate } from '@js-joda/core';
import { useTranslate } from '@tolgee/react';

export interface VolumeDay {
  label: string;
  valueKg: number;
  isToday: boolean;
}

export interface RecentActivityItem {
  id: string;
  title: string;
  subtitle: string;
  value: string;
  unit: string;
  kind: 'strength' | 'cardio' | 'legs' | 'upper';
}

export interface PersonalRecordItem {
  name: string;
  value: string;
  /** Optional improvement over the previous record; shown only when known. */
  delta?: string;
  /** Marks a record set within the current period. */
  isNew?: boolean;
}

export interface ProgramItem {
  id: string;
  name: string;
  detail: string;
  accent: 'strength' | 'conditioning' | 'mobility';
  /** Optional 0–1 progress; the ring and bar render only when present. */
  progressPct?: number;
}

export interface HomeData {
  greeting: string;
  dateLabel: string;
  todaySession: Session | undefined;
  todayExerciseCount: number;
  weeklyVolume: {
    days: VolumeDay[];
    averageKg: number;
    /** Percent change of this week's total vs the previous 7 days; null when not computable. */
    deltaPct: number | null;
    totalKg: number;
    sessionCount: number;
    hasData: boolean;
  };
  recentActivity: RecentActivityItem[];
  personalRecords: PersonalRecordItem[];
  programs: ProgramItem[];
}

/** Single-letter weekday labels indexed by js-joda DayOfWeek value (1 = Monday). */
const WEEKDAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

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

function formatKg(valueKg: number): string {
  return formatGrouped(Math.round(valueKg));
}

/**
 * Honest kind from the session blueprint name. Anything unmatched falls back to
 * the strength/cardio heuristic so a new kind can never hide a session.
 */
function activityKind(session: Session): RecentActivityItem['kind'] {
  const name = session.blueprint.name;
  if (/leg/i.test(name)) return 'legs';
  if (/push|pull|upper|accessory|chest|back|shoulder|arm/i.test(name)) return 'upper';
  return session.recordedExercises.some((x) => x instanceof RecordedWeightedExercise) ? 'strength' : 'cardio';
}

/**
 * Everything the redesigned home screen renders, derived from the real stores.
 * Health data (heart rate, steps, hydration, macros) has no source in the app,
 * so those sections are built with clearly-marked sample values instead.
 */
export function useHomeData(upcoming: readonly Session[] | undefined): HomeData {
  const { t } = useTranslate();
  const formatDate = useFormatDate();
  const sessions = useAppSelector(selectSessions);
  const historyRecords = useAppSelector(selectHistoryPersonalRecords);
  const savedPrograms = useAppSelector((s) => s.program.savedPrograms);
  const activePlanId = useAppSelector((s) => s.program.activePlanId);

  const today = LocalDate.now();
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? t('home.greeting.morning') // en: "Good morning"
      : hour < 18
        ? t('home.greeting.afternoon') // en: "Good afternoon"
        : t('home.greeting.evening'); // en: "Good evening"
  // js-joda text patterns (EEEE/MMMM) throw without the locale plugin, which we
  // don't ship — weekday/month names go through the cached Intl formatters instead.
  const dateLabel = formatDate(today, { weekday: 'long', month: 'long', day: 'numeric' }).toLocaleUpperCase();

  const todaySession = upcoming?.[0];
  const todayExerciseCount = todaySession?.recordedExercises.length ?? 0;

  // --- Weekly volume: rolling 7-day window ending today vs the 7 days before --
  const windowStart = today.minusDays(6);
  const days: VolumeDay[] = [];
  let totalKg = 0;
  let sessionCount = 0;
  let previousKg = 0;
  for (let i = 0; i < 7; i++) {
    const day = windowStart.plusDays(i);
    let dayKg = 0;
    for (const session of sessions) {
      if (session.date.equals(day)) {
        const volumeKg = sessionVolumeKg(session);
        dayKg += volumeKg;
        totalKg += volumeKg;
        sessionCount += 1;
      }
    }
    days.push({ label: WEEKDAY_LETTERS[day.dayOfWeek().value() - 1]!, valueKg: dayKg, isToday: day.equals(today) });
  }
  const previousStart = windowStart.minusDays(7);
  for (const session of sessions) {
    if (!session.date.isBefore(previousStart) && session.date.isBefore(windowStart)) {
      previousKg += sessionVolumeKg(session);
    }
  }
  const deltaPct = previousKg > 0 ? Math.round(((totalKg - previousKg) / previousKg) * 100) : null;

  // --- Recent activity: the three latest finished sessions --------------------
  const recentActivity: RecentActivityItem[] = [...sessions]
    .sort((a, b) => (a.date.isAfter(b.date) ? -1 : a.date.isBefore(b.date) ? 1 : 0))
    .slice(0, 3)
    .map((session) => {
      const volumeKg = sessionVolumeKg(session);
      const datePart = session.date.equals(today)
        ? t('feed.home.recent.today') // en: "Today"
        : formatDate(session.date, { weekday: 'long' });
      // Law III: Session has no kcal/energy field (verified across models/),
      // so the subtitle can only ever show duration — never invented kcal.
      const subtitle = session.duration
        ? `${datePart} · ${formatSessionClock(session.duration)}`
        : `${datePart} · ${t('home.today_session.subtitle', { count: session.recordedExercises.length })}`; // en: "{count} exercises"
      return {
        id: session.id,
        title: session.blueprint.name,
        subtitle,
        value: formatKg(volumeKg),
        unit: t('home.recent.kg_lifted'), // en: "kg lifted"
        kind: activityKind(session),
      };
    });

  // --- Personal records: prefer the big three lifts, else the first three -----
  // The store only emits sessions where a record was actually set, oldest
  // first, so the last entry per exercise is the standing best — Home must
  // show that, not the first time the lift ever PR'd.
  const latestByExercise = new Map<string, PersonalRecord>();
  for (const records of historyRecords.values()) {
    for (const record of records) latestByExercise.set(record.exerciseName, record);
  }
  const latestRecords = [...latestByExercise.values()];
  const liftOrder = [/bench/i, /squat/i, /deadlift/i];
  const personalRecords: PersonalRecordItem[] = liftOrder
    .map((pattern) => latestRecords.find((r) => pattern.test(r.exerciseName)))
    .filter((r) => r !== undefined)
    .concat(latestRecords.filter((r) => !liftOrder.some((pattern) => pattern.test(r.exerciseName))))
    .slice(0, 3)
    .map((r) => {
      const improvement = r.previousBest ? r.oneRepMax.minus(r.previousBest) : undefined;
      const achieved = r.achievedAt;
      return {
        name: r.exerciseName,
        value: r.oneRepMax.shortLocaleFormat(0) ?? '',
        // A record only exists when it beat a previous best, so the delta is
        // always positive here; the "+" makes the improvement explicit.
        delta: improvement ? `+${improvement.shortLocaleFormat(1)}` : undefined,
        isNew: achieved ? achieved.year() === today.year() && achieved.month() === today.month() : undefined,
      };
    });

  // --- Programs: active plan first --------------------------------------------
  const programs: ProgramItem[] = Object.entries(savedPrograms)
    .sort(([a], [b]) => (a === activePlanId ? -1 : b === activePlanId ? 1 : 0))
    .map(([id, program]) => ({
      id,
      name: program.name,
      detail: t('home.programs.session_count', { count: program.sessions.length }), // en: "{count} sessions"
      accent: /condition|metcon|cardio|hiit|engine/i.test(program.name)
        ? 'conditioning'
        : /mobil|yoga|stretch/i.test(program.name)
          ? 'mobility'
          : 'strength',
    }));

  return {
    greeting,
    dateLabel,
    todaySession,
    todayExerciseCount,
    weeklyVolume: {
      days,
      averageKg: totalKg / 7,
      deltaPct,
      totalKg,
      sessionCount,
      hasData: sessionCount > 0,
    },
    recentActivity,
    personalRecords,
    programs,
  };
}

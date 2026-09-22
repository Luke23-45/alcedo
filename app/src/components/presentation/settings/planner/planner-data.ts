import { normalizeExerciseName, SessionBlueprint } from '@/models/blueprint-models';
import { ExerciseDescriptor } from '@/models/exercise-models';
import { RecordedWeightedExercise, Session } from '@/models/session-models';
import BigNumber from 'bignumber.js';
import { DayOfWeek, LocalDate } from '@js-joda/core';

/**
 * Pure computations backing the AI Planner config screen. Everything here is
 * derived from real store data (finished sessions, the exercise library, the
 * planner preference keys) — nothing is hardcoded sample content.
 */

/**
 * Cached Intl formatters — one per locale + option set, reused forever (the
 * same pattern as hooks/useFormatDate; constructing one per render is far too
 * expensive). Passing `undefined` resolves to the device default locale.
 */
const dateFormatters = new Map<string, Intl.DateTimeFormat>();

function dateFormatterFor(locale: string | undefined, opts: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = `${locale ?? ''}|${JSON.stringify(opts)}`;
  const existing = dateFormatters.get(key);
  if (existing) {
    return existing;
  }
  const formatter = new Intl.DateTimeFormat(locale, opts);
  dateFormatters.set(key, formatter);
  return formatter;
}

const numberFormatters = new Map<string, Intl.NumberFormat>();

function decimalFormatterFor(locale: string | undefined): Intl.NumberFormat {
  const key = locale ?? '';
  const existing = numberFormatters.get(key);
  if (existing) {
    return existing;
  }
  const formatter = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  numberFormatters.set(key, formatter);
  return formatter;
}

function jsDate(date: LocalDate): Date {
  return new Date(date.year(), date.monthValue() - 1, date.dayOfMonth());
}

/** 2026-06-08 is a Monday; day.value() 1..7 maps onto Jun 8..14. */
function anchorDateFor(day: DayOfWeek): Date {
  return new Date(2026, 5, 7 + day.value());
}

/** "Jun 30" in the preferred language (device default when unset). */
export function formatMonthDay(date: LocalDate, locale?: string): string {
  return dateFormatterFor(locale, { month: 'short', day: 'numeric' }).format(jsDate(date));
}

/** "Tue, Jun 10" in the preferred language (device default when unset). */
export function formatWeekdayMonthDay(date: LocalDate, locale?: string): string {
  return dateFormatterFor(locale, { weekday: 'short', month: 'short', day: 'numeric' }).format(jsDate(date));
}

/** "Thu" in the preferred language (device default when unset). */
export function weekdayShort(day: DayOfWeek, locale?: string): string {
  return dateFormatterFor(locale, { weekday: 'short' }).format(anchorDateFor(day));
}

/** "7.5" (or "8" for whole numbers), with the locale's decimal separator. */
export function formatRpeValue(value: number, locale?: string): string {
  return Number.isInteger(value) ? value.toString() : decimalFormatterFor(locale).format(value);
}

/** Why the NEXT SESSION preview can or cannot render its card. */
export type NextSessionAvailability = 'ready' | 'planner-off' | 'no-program' | 'no-sessions' | 'no-training-days';

export function nextSessionAvailability(
  plannerEnabled: boolean,
  hasProgram: boolean,
  trainingDayCount: number,
  sessionCount: number,
): NextSessionAvailability {
  if (!plannerEnabled) {
    return 'planner-off';
  }
  if (!hasProgram) {
    return 'no-program';
  }
  // A program can exist without any sessions (all of them deleted): the
  // rotation lookup below would then dereference `sessions[0]` and crash.
  if (sessionCount === 0) {
    return 'no-sessions';
  }
  if (trainingDayCount === 0) {
    return 'no-training-days';
  }
  return 'ready';
}

/** The Monday starting the week that contains `date`. */
export function mondayOfWeek(date: LocalDate): LocalDate {
  return date.minusDays(date.dayOfWeek().value() - DayOfWeek.MONDAY.value());
}

/** Completed-set volume of one session, in kilograms. */
export function sessionVolumeKg(session: Session): number {
  let total = new BigNumber(0);
  for (const exercise of session.recordedExercises) {
    if (!(exercise instanceof RecordedWeightedExercise)) {
      continue;
    }
    for (const potentialSet of exercise.potentialSets) {
      if (!potentialSet.set) {
        continue;
      }
      const setVolume = exercise
        .effectiveWeight(potentialSet, session.bodyweight)
        .multipliedBy(potentialSet.set.repsCompleted)
        .convertTo('kilograms').value;
      total = total.plus(setVolume);
    }
  }
  return total.toNumber();
}

/** Completed-set volume of the 7-day week starting `weekStart`, in kilograms. */
export function weeklyVolumeKg(sessions: Session[], weekStart: LocalDate): number {
  const weekEnd = weekStart.plusDays(7);
  return sessions
    .filter((s) => !s.date.isBefore(weekStart) && s.date.isBefore(weekEnd))
    .reduce((sum, s) => sum + sessionVolumeKg(s), 0);
}

/**
 * Percentage change of this week vs last week, rounded to a whole number.
 * Undefined when either week has no logged volume (nothing honest to compare).
 */
export function volumeChangePercent(thisWeekKg: number, lastWeekKg: number): number | undefined {
  if (thisWeekKg <= 0 || lastWeekKg <= 0) {
    return undefined;
  }
  return Math.round(((thisWeekKg - lastWeekKg) / lastWeekKg) * 100);
}

/** Completed sets per muscle group this week, most-trained first. */
export function muscleLoadThisWeek(
  sessions: Session[],
  weekStart: LocalDate,
  descriptors: Record<string, ExerciseDescriptor>,
): { muscle: string; sets: number }[] {
  const weekEnd = weekStart.plusDays(7);
  const byName = new Map<string, ExerciseDescriptor>();
  for (const descriptor of Object.values(descriptors)) {
    const key = normalizeExerciseName(descriptor.name);
    if (!byName.has(key)) {
      byName.set(key, descriptor);
    }
  }
  const setsPerMuscle = new Map<string, number>();
  for (const session of sessions) {
    if (session.date.isBefore(weekStart) || !session.date.isBefore(weekEnd)) {
      continue;
    }
    for (const exercise of session.recordedExercises) {
      if (!(exercise instanceof RecordedWeightedExercise)) {
        continue;
      }
      const completedSets = exercise.potentialSets.filter((ps) => ps.set).length;
      if (!completedSets) {
        continue;
      }
      const descriptor = byName.get(normalizeExerciseName(exercise.blueprint.name));
      for (const muscle of descriptor?.muscles ?? []) {
        setsPerMuscle.set(muscle, (setsPerMuscle.get(muscle) ?? 0) + completedSets);
      }
    }
  }
  return [...setsPerMuscle.entries()].map(([muscle, sets]) => ({ muscle, sets })).sort((a, b) => b.sets - a.sets);
}

/** The next date after `from` (exclusive) that falls on a training day. */
export function nextTrainingDay(from: LocalDate, trainingDays: DayOfWeek[]): LocalDate {
  const wanted = new Set(trainingDays.map((d) => d.value()));
  for (let offset = 1; offset <= 7; offset++) {
    const candidate = from.plusDays(offset);
    if (wanted.has(candidate.dayOfWeek().value())) {
      return candidate;
    }
  }
  return from.plusDays(1);
}

/**
 * The session the planner should schedule next: the first program session that
 * hasn't been completed in the last 7 days, wrapping around to the first
 * session when the whole rotation is done.
 */
export function nextSessionName(programSessions: SessionBlueprint[], recentSessionNames: string[]): string | undefined {
  if (!programSessions.length) {
    return undefined;
  }
  const recent = new Set(recentSessionNames.map((n) => normalizeExerciseName(n)));
  return programSessions.find((s) => !recent.has(normalizeExerciseName(s.name)))?.name ?? programSessions[0]!.name;
}

/**
 * The next deload-week date: the stored date when the user picked one,
 * otherwise three weeks from today.
 */
export function resolveDeloadWeek(storedIsoDate: string | undefined, today: LocalDate): LocalDate {
  if (storedIsoDate) {
    try {
      return LocalDate.parse(storedIsoDate);
    } catch {
      // Fall through to the default below.
    }
  }
  return today.plusWeeks(3);
}

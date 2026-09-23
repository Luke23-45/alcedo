import { createSelector } from '@reduxjs/toolkit';
import { LocalDate } from '@js-joda/core';
import BigNumber from 'bignumber.js';
import { normalizeExerciseName, WeightedExerciseBlueprint } from '@/models/blueprint-models';
import { ExerciseDescriptor } from '@/models/exercise-models';
import { RecordedWeightedExercise, Session } from '@/models/session-models';
import { Weight } from '@/models/weight';
import { RootState } from '@/store';
import { calculateOneRepMax } from '@/store/stats/calculate-stats';
import {
  getSessionReferenceTime,
  selectExercises,
  selectSessions,
} from '@/store/stored-sessions';
import { localeFormatBigNumber } from '@/utils/locale-bignumber';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface DetailSet {
  /** Effective load in the user's display unit. */
  weight: number;
  reps: number;
  /** Epley e1RM for this set, in the display unit. */
  e1rm: number;
}

export interface DetailSession {
  sessionId: string;
  date: LocalDate;
  /** Heaviest effective load moved this session, display unit. */
  topSet: number;
  volume: number;
  /** Best per-set Epley e1RM this session, display unit. */
  e1rm: number;
  setCount: number;
  repList: number[];
  sets: DetailSet[];
  /** True for the session that set the all-time top-set record. */
  holdsWeightPr: boolean;
}

export interface ExerciseDetailData {
  /** Full recorded name, e.g. "Barbell Bench Press". */
  exerciseName: string;
  /** Equipment prefix stripped, e.g. "Bench Press". */
  shortName: string;
  equipment: string | null;
  /** Up to 3, from the exercise descriptor. */
  muscles: string[];
  mechanic: string | null;
  unitLabel: 'kg' | 'lb';
  /** Newest first. */
  sessions: DetailSession[];
  bestTopSet: number;
  bestE1rm: number;
  sessionCount: number;
  trailing7dVolume: number;
  /** Sessions in the trailing 7 days — the weekly rate for the identity chip. */
  weeklyFrequency: number;
  /** Most recent recorded bodyweight, display unit. Absent when never logged. */
  latestBodyweight: number | null;
  /** The newest recorded blueprint, reused when starting a session from here. */
  logBlueprint: WeightedExerciseBlueprint | null;
}

/* ------------------------------------------------------------------ */
/* Formatting (Law III: one formatter for every bare weight number)    */
/* ------------------------------------------------------------------ */

/** Bare display-unit number: "2,000", "102.5", "34". Unit labels are separate. */
export function formatBare(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return localeFormatBigNumber(new BigNumber(value), Number.isInteger(rounded) ? 0 : 1);
}

const dec1Formatters = new Map<string, Intl.NumberFormat>();

/** One decimal in the caller's locale (undefined = system), cached like useFormatNumber. */
function dec1(locale: string | undefined): Intl.NumberFormat {
  const key = locale ?? 'system';
  const existing = dec1Formatters.get(key);
  if (existing) return existing;
  const created = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  dec1Formatters.set(key, created);
  return created;
}

/** Signed percent delta, e.g. "+11.1%" / "−2.3%" (U+2212, matches the reference). */
export function formatDeltaPercent(from: number, to: number, locale: string | undefined): string | null {
  if (from <= 0) {
    return null;
  }
  const pct = ((to - from) / from) * 100;
  const sign = pct > 0 ? '+' : pct < 0 ? '−' : '';
  return `${sign}${dec1(locale).format(Math.abs(pct))}%`;
}

export function formatWeeklyRate(value: number, locale: string | undefined): string {
  return Math.abs(value - Math.round(value)) < 0.05
    ? Math.round(value).toString()
    : dec1(locale).format(value);
}

/* ------------------------------------------------------------------ */
/* Derivation                                                          */
/* ------------------------------------------------------------------ */

function toDisplayUnit(weight: Weight, unit: 'kilograms' | 'pounds'): number {
  return weight.convertTo(unit).value.toNumber();
}

function buildDetail(
  sessions: Session[],
  exercises: Record<string, ExerciseDescriptor>,
  exerciseName: string,
  useImperialUnits: boolean,
): ExerciseDetailData | undefined {
  const target = normalizeExerciseName(exerciseName);
  const unit = useImperialUnits ? 'pounds' : 'kilograms';
  const unitLabel = useImperialUnits ? 'lb' : 'kg';

  const matched: { session: Session; exercise: RecordedWeightedExercise }[] = [];
  for (const session of sessions) {
    for (const recorded of session.recordedExercises) {
      if (recorded.type !== 'RecordedWeightedExercise') {
        continue;
      }
      if (!recorded.isStarted) {
        continue;
      }
      if (normalizeExerciseName(recorded.blueprint.name) !== target) {
        continue;
      }
      matched.push({ session, exercise: recorded });
    }
  }
  if (matched.length === 0) {
    return undefined;
  }

  // Newest first by the same reference time the rest of the app uses.
  matched.sort(
    (a, b) =>
      getSessionReferenceTime(b.session).toEpochSecond() - getSessionReferenceTime(a.session).toEpochSecond(),
  );

  const detailSessions: DetailSession[] = matched.map(({ session, exercise }) => {
    const sets: DetailSet[] = exercise.potentialSets
      .filter((ps) => ps.set && ps.set.repsCompleted > 0)
      .map((ps) => {
        const effective = exercise.effectiveWeight(ps, session.bodyweight);
        return {
          weight: toDisplayUnit(effective, unit),
          reps: ps.set!.repsCompleted,
          e1rm: toDisplayUnit(calculateOneRepMax(ps, effective), unit),
        };
      });
    const topSet = sets.reduce((m, s) => Math.max(m, s.weight), 0);
    const volume = sets.reduce((sum, s) => sum + s.weight * s.reps, 0);
    const e1rm = sets.reduce((m, s) => Math.max(m, s.e1rm), 0);
    return {
      sessionId: session.id,
      date: session.date,
      topSet,
      volume,
      e1rm,
      setCount: sets.length,
      repList: sets.map((s) => s.reps),
      sets,
      holdsWeightPr: false,
    };
  });

  const bestTopSet = detailSessions.reduce((m, s) => Math.max(m, s.topSet), 0);
  const bestE1rm = detailSessions.reduce((m, s) => Math.max(m, s.e1rm), 0);

  // The record belongs to the earliest session that hit the all-time best,
  // mirroring the personal-records store's running-best semantics.
  const prSession = [...detailSessions]
    .reverse()
    .find((s) => s.topSet === bestTopSet && bestTopSet > 0);
  if (prSession) {
    prSession.holdsWeightPr = true;
  }

  const today = LocalDate.now();
  const trailing7dVolume = detailSessions
    .filter((s) => !s.date.isBefore(today.minusDays(6)))
    .reduce((sum, s) => sum + s.volume, 0);
  const trailing7dSessions = detailSessions.filter((s) => !s.date.isBefore(today.minusDays(6))).length;

  const newestWithBodyweight = matched.find(({ session }) => session.bodyweight !== undefined);

  const descriptor = Object.values(exercises).find(
    (d) => normalizeExerciseName(d.name) === target,
  );
  const equipment = descriptor?.equipment ?? null;
  const muscles = (descriptor?.muscles ?? []).slice(0, 3);
  const mechanic = descriptor?.mechanic ?? null;

  const fullName = matched[0]!.exercise.blueprint.name;
  // Equipment comes from the descriptor vocabulary ("barbell") while the
  // recorded name is title-cased ("Barbell Bench Press") — strip
  // case-insensitively.
  const equipmentPrefix = equipment ? `${equipment} ` : '';
  const shortName =
    equipment && fullName.toLowerCase().startsWith(equipmentPrefix.toLowerCase())
      ? fullName.slice(equipmentPrefix.length).trim() || fullName
      : fullName;

  return {
    exerciseName: fullName,
    shortName,
    equipment,
    muscles,
    mechanic,
    unitLabel,
    sessions: detailSessions,
    bestTopSet,
    bestE1rm,
    sessionCount: detailSessions.length,
    trailing7dVolume,
    weeklyFrequency: trailing7dSessions,
    latestBodyweight: newestWithBodyweight
      ? toDisplayUnit(newestWithBodyweight.session.bodyweight!, unit)
      : null,
    logBlueprint: matched[0]!.exercise.blueprint,
  };
}

/**
 * A fresh freeform session preloaded with the exercise's latest blueprint,
 * the newest bodyweight, and the user's unit preference — the "Log session"
 * action shared by the primary CTA and the nav overflow menu. Null when no
 * blueprint was recorded (the caller falls back to the session tab).
 */
export function buildLogSession(detail: ExerciseDetailData, useImperialUnits: boolean): Session | null {
  if (!detail.logBlueprint) {
    return null;
  }
  const unit = useImperialUnits ? 'pounds' : 'kilograms';
  return Session.freeformSession(
    LocalDate.now(),
    detail.latestBodyweight !== null ? new Weight(detail.latestBodyweight, unit) : undefined,
  ).withAddedExercise(detail.logBlueprint, useImperialUnits);
}

/**
 * All-time detail for one exercise, derived from finished sessions. The stats
 * store's aggregates are windowed (90 days); this selector reads the full
 * history so the chart, PRs, and session list are all-time and mutually
 * consistent (Law III).
 */
export const selectExerciseDetail = createSelector(
  [
    selectSessions,
    selectExercises,
    (_: RootState, exerciseName: string) => exerciseName,
    (state: RootState) => state.settings.useImperialUnits,
  ],
  (sessions, exercises, exerciseName, useImperialUnits) =>
    buildDetail(sessions, exercises, exerciseName, useImperialUnits),
);

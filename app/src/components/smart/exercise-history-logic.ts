import { LocalDate } from '@js-joda/core';
import type { Href } from 'expo-router';
import { formatExerciseSummary } from '@/components/presentation/summary/format-exercise-summary';
import type {
  ExerciseHistoryChartPoint,
  ExerciseHistoryRow,
} from '@/components/presentation/workout/exercise-history-list';
import type { useFormatDate } from '@/hooks/useFormatDate';
import type { useTranslate } from '@tolgee/react';
import { ExerciseBlueprint } from '@/models/blueprint-models';
import { PotentialSet, RecordedCardioExercise, RecordedWeightedExercise } from '@/models/session-models';
import { Weight, shortFormatWeightUnit } from '@/models/weight';
import { calculateOneRepMax } from '@/store/stats/calculate-stats';
import type { ExerciseHistoryEntry } from '@/store/stored-sessions';
import { localeFormatBigNumber } from '@/utils/locale-bignumber';

/**
 * Pure history computation for the exercise history screen
 * (`components/smart/exercise-history.tsx`). RN-free so simulation tests can
 * import it directly.
 */

export function getExerciseHistoryHref(blueprint: ExerciseBlueprint): Href {
  return `/exercise-history?name=${encodeURIComponent(blueprint.name)}&type=${blueprint.type}` as Href;
}

export const INITIAL_VISIBLE_ROWS = 4;
export const CHART_WINDOW = 8;

/** "100 kg" / "2,000 kg" / "119.6 kg" — the reference always separates value and unit. */
export function formatWeight(weight: Weight, decimalPlaces?: number): string {
  const unit = weight.unit === 'nil' ? '' : shortFormatWeightUnit(weight.unit);
  const value = localeFormatBigNumber(weight.value, decimalPlaces);
  return unit ? `${value} ${unit}` : value;
}

export interface CompletedSet {
  reps: number;
  weight: Weight;
  potentialSet: PotentialSet;
}

/** Completed weighted sets with the load actually moved (bodyweight included when known). */
export function completedSetsOf(entry: ExerciseHistoryEntry): CompletedSet[] {
  const { exercise, session } = entry;
  if (!(exercise instanceof RecordedWeightedExercise)) {
    return [];
  }
  return exercise.potentialSets.flatMap((potentialSet) => {
    const reps = potentialSet.set?.repsCompleted;
    if (!reps) {
      return [];
    }
    return [{ reps, weight: exercise.effectiveWeight(potentialSet, session.bodyweight), potentialSet }];
  });
}

export function topSetOf(entry: ExerciseHistoryEntry): CompletedSet | undefined {
  const sets = completedSetsOf(entry);
  return sets.reduce<CompletedSet | undefined>(
    (best, set) => (!best || set.weight.isGreaterThan(best.weight) ? set : best),
    undefined,
  );
}

export interface PrModel {
  weight: Weight;
  reps: number;
  e1rm: Weight;
  date: LocalDate;
  sessionId: string;
}

/** The heaviest completed set ever; ties break toward more reps. Hidden when there is no weighted work. */
export function findPr(entries: ExerciseHistoryEntry[]): PrModel | undefined {
  let best: { set: CompletedSet; entry: ExerciseHistoryEntry } | undefined;
  for (const entry of entries) {
    const { exercise } = entry;
    if (!(exercise instanceof RecordedWeightedExercise) || !exercise.tracksResistance) {
      continue;
    }
    for (const set of completedSetsOf(entry)) {
      if (
        !best ||
        set.weight.isGreaterThan(best.set.weight) ||
        (set.weight.equals(best.set.weight) && set.reps > best.set.reps)
      ) {
        best = { set, entry };
      }
    }
  }
  if (!best) {
    return undefined;
  }
  return {
    weight: best.set.weight,
    reps: best.set.reps,
    e1rm: calculateOneRepMax(best.set.potentialSet, best.set.weight),
    date: best.entry.session.date,
    sessionId: best.entry.session.id,
  };
}

export interface RowContext {
  t: ReturnType<typeof useTranslate>['t'];
  formatDate: ReturnType<typeof useFormatDate>;
  today: LocalDate;
  prSessionId: string | undefined;
  bodyweightLabel: string;
  /** App language for casing/digits (EH05–EH06); undefined = device default. */
  locale: string | undefined;
}

export function setCountLabel(t: RowContext['t'], count: number, locale: string | undefined): string {
  return count === 1
    ? t('exercise.history.set_count.one')
    : t('exercise.history.set_count.other', { count: count.toLocaleString(locale ?? undefined) });
}

export function buildRow(entry: ExerciseHistoryEntry, index: number, ctx: RowContext): ExerciseHistoryRow {
  const { exercise, session } = entry;
  const { t } = ctx;
  const key = `${session.id}:${index}`;
  // Locale-aware like every other date badge (session-comparison-table);
  // the previous code sliced a hard-coded English month abbreviation.
  // Cased in the app language, not blind Unicode default (EH05).
  const month = ctx.formatDate(session.date, { month: 'short' }).toLocaleUpperCase(ctx.locale ?? undefined);
  const day = session.date
    .dayOfMonth()
    .toLocaleString(ctx.locale ?? undefined, { minimumIntegerDigits: 2, useGrouping: false });
  const isPr = ctx.prSessionId !== undefined && session.id === ctx.prSessionId;
  const prLabel = t('exercise.history.pr_chip.label');

  if (exercise instanceof RecordedWeightedExercise) {
    const sets = completedSetsOf(entry);
    const setCount = setCountLabel(t, sets.length, ctx.locale);
    const reps = sets.map((set) => set.reps.toLocaleString(ctx.locale ?? undefined)).join(' · ');
    if (sets.length > 0 && exercise.tracksResistance) {
      const top = topSetOf(entry)!;
      const volume = exercise.totalWeightLiftedWith(session.bodyweight);
      return {
        key,
        sessionId: session.id,
        month,
        day,
        headline: `${reps} @ ${formatWeight(top.weight)}`,
        subline: `${formatWeight(volume, 0)} ${t('exercise.history.volume.label')} · ${setCount}`,
        isPr,
        prLabel,
      };
    }
    return {
      key,
      sessionId: session.id,
      month,
      day,
      headline:
        sets.length > 0
          ? reps
          : formatExerciseSummary(exercise, {
              isFilled: true,
              showWeight: true,
              bodyweightLabel: ctx.bodyweightLabel,
            }),
      subline: setCount,
      isPr,
      prLabel,
    };
  }

  const cardioSets =
    exercise instanceof RecordedCardioExercise ? exercise.sets.filter((set) => set.isCompletelyFilled).length : 0;
  return {
    key,
    sessionId: session.id,
    month,
    day,
    headline: formatExerciseSummary(exercise, {
      isFilled: true,
      showWeight: true,
      bodyweightLabel: ctx.bodyweightLabel,
    }),
    subline: setCountLabel(t, cardioSets, ctx.locale),
    isPr,
    prLabel,
  };
}

export interface ChartModel {
  points: ExerciseHistoryChartPoint[];
  /** First and last top-set weights, in the display unit — for the subtitle. */
  first: Weight | undefined;
  last: Weight | undefined;
}

export function buildChartPoints(entries: ExerciseHistoryEntry[], ctx: RowContext): ChartModel {
  const windowed = entries
    .filter(
      (entry) =>
        entry.exercise instanceof RecordedWeightedExercise &&
        entry.exercise.tracksResistance &&
        completedSetsOf(entry).length > 0,
    )
    .slice(0, CHART_WINDOW)
    .reverse();
  if (windowed.length === 0) {
    return { points: [], first: undefined, last: undefined };
  }
  // Kilograms and pounds are not mixed on one axis: the newest session's unit wins.
  const newest = windowed[windowed.length - 1];
  if (!newest) {
    return { points: [], first: undefined, last: undefined };
  }
  const unit = topSetOf(newest)!.weight.unit;
  const tops = windowed.map((entry) => topSetOf(entry)!.weight.convertTo(unit));
  const points = windowed.map((entry, i) => {
    const top = tops[i]!;
    return {
      value: top.value.toNumber(),
      valueLabel: localeFormatBigNumber(top.value),
      dateLabel: ctx.formatDate(entry.session.date, { month: 'short', day: 'numeric' }),
      sessionId: entry.session.id,
      isToday: entry.session.date.equals(ctx.today),
    };
  });
  return { points, first: tops[0], last: tops[tops.length - 1] };
}

export function buildSubtitle(first: Weight, last: Weight, locale?: string): string {
  const range = `${formatWeight(first)} → ${formatWeight(last)}`;
  if (first.value.isZero()) {
    return range;
  }
  const pct = last.value.minus(first.value).dividedBy(first.value).multipliedBy(100);
  // EH06: locale decimal separator, not toFixed's Latin point.
  const magnitude = new Intl.NumberFormat(locale ?? undefined, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(pct.abs().toNumber());
  const delta = `${pct.isNegative() ? '−' : '+'}${magnitude}%`;
  return `${range} · ${delta}`;
}

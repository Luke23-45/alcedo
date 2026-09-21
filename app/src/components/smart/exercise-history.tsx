import { useState } from 'react';
import { useRouter, type Href } from 'expo-router';
import { useTranslate } from '@tolgee/react';
import { LocalDate } from '@js-joda/core';
import EmptyInfo from '@/components/presentation/foundation/empty-info';
import { SurfaceText } from '@/components/presentation/foundation/surface-text';
import type { MenuItem } from '@/components/presentation/foundation/menu';
import {
  ExerciseHistoryBackground,
  ExerciseHistoryBottomFade,
  ExerciseHistoryChart,
  ExerciseHistoryList,
  ExerciseHistoryNavBar,
  ExerciseHistoryPrBanner,
  ExerciseHistorySectionHeader,
  type ExerciseHistoryChartPoint,
  type ExerciseHistoryPr,
  type ExerciseHistoryRow,
} from '@/components/presentation/workout/exercise-history-list';
import * as S from '@/components/presentation/workout/exercise-history-list.styles';
import { formatExerciseSummary } from '@/components/presentation/summary/format-exercise-summary';
import { useFormatDate } from '@/hooks/useFormatDate';
import { useToday } from '@/hooks/useToday';
import { ExerciseBlueprint, MovementKey } from '@/models/blueprint-models';
import { PotentialSet, RecordedCardioExercise, RecordedWeightedExercise } from '@/models/session-models';
import { Weight, shortFormatWeightUnit } from '@/models/weight';
import { useAppSelectorWithArg } from '@/store';
import { calculateOneRepMax } from '@/store/stats/calculate-stats';
import { selectExerciseHistoryEntries, type ExerciseHistoryEntry } from '@/store/stored-sessions';
import { localeFormatBigNumber } from '@/utils/locale-bignumber';

export function getExerciseHistoryHref(blueprint: ExerciseBlueprint): Href {
  return `/exercise-history?name=${encodeURIComponent(blueprint.name)}&type=${blueprint.type}` as Href;
}

const INITIAL_VISIBLE_ROWS = 4;
const CHART_WINDOW = 8;

/** "100 kg" / "2,000 kg" / "119.6 kg" — the reference always separates value and unit. */
function formatWeight(weight: Weight, decimalPlaces?: number): string {
  const unit = weight.unit === 'nil' ? '' : shortFormatWeightUnit(weight.unit);
  const value = localeFormatBigNumber(weight.value, decimalPlaces);
  return unit ? `${value} ${unit}` : value;
}

interface CompletedSet {
  reps: number;
  weight: Weight;
  potentialSet: PotentialSet;
}

/** Completed weighted sets with the load actually moved (bodyweight included when known). */
function completedSetsOf(entry: ExerciseHistoryEntry): CompletedSet[] {
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

function topSetOf(entry: ExerciseHistoryEntry): CompletedSet | undefined {
  const sets = completedSetsOf(entry);
  return sets.reduce<CompletedSet | undefined>(
    (best, set) => (!best || set.weight.isGreaterThan(best.weight) ? set : best),
    undefined,
  );
}

interface PrModel {
  weight: Weight;
  reps: number;
  e1rm: Weight;
  date: LocalDate;
  sessionId: string;
}

/** The heaviest completed set ever; ties break toward more reps. Hidden when there is no weighted work. */
function findPr(entries: ExerciseHistoryEntry[]): PrModel | undefined {
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

interface RowContext {
  t: ReturnType<typeof useTranslate>['t'];
  formatDate: ReturnType<typeof useFormatDate>;
  today: LocalDate;
  prSessionId: string | undefined;
  bodyweightLabel: string;
}

function setCountLabel(t: RowContext['t'], count: number): string {
  return count === 1
    ? t('exercise.history.set_count.one')
    : t('exercise.history.set_count.other', { count: count.toString() });
}

function buildRow(entry: ExerciseHistoryEntry, index: number, ctx: RowContext): ExerciseHistoryRow {
  const { exercise, session } = entry;
  const { t } = ctx;
  const key = `${session.id}:${index}`;
  const month = session.date.month().name().slice(0, 3);
  const day = session.date.dayOfMonth().toString().padStart(2, '0');
  const isPr = ctx.prSessionId !== undefined && session.id === ctx.prSessionId;
  const prLabel = t('exercise.history.pr_chip.label');

  if (exercise instanceof RecordedWeightedExercise) {
    const sets = completedSetsOf(entry);
    const setCount = setCountLabel(t, sets.length);
    if (sets.length > 0 && exercise.tracksResistance) {
      const top = topSetOf(entry)!;
      const volume = exercise.totalWeightLiftedWith(session.bodyweight);
      return {
        key,
        sessionId: session.id,
        month,
        day,
        headline: `${sets.map((set) => set.reps.toString()).join(' · ')} @ ${formatWeight(top.weight)}`,
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
          ? sets.map((set) => set.reps.toString()).join(' · ')
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
    subline: setCountLabel(t, cardioSets),
    isPr,
    prLabel,
  };
}

interface ChartModel {
  points: ExerciseHistoryChartPoint[];
  /** First and last top-set weights, in the display unit — for the subtitle. */
  first: Weight | undefined;
  last: Weight | undefined;
}

function buildChartPoints(entries: ExerciseHistoryEntry[], ctx: RowContext): ChartModel {
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

function buildSubtitle(first: Weight, last: Weight): string {
  const range = `${formatWeight(first)} → ${formatWeight(last)}`;
  if (first.value.isZero()) {
    return range;
  }
  const pct = last.value.minus(first.value).dividedBy(first.value).multipliedBy(100);
  const delta = `${pct.isNegative() ? '−' : '+'}${pct.abs().toFixed(1)}%`;
  return `${range} · ${delta}`;
}

export function ExerciseHistory(props: { movementKey: MovementKey; exerciseName: string }) {
  const { t } = useTranslate();
  const router = useRouter();
  const today = useToday();
  const formatDate = useFormatDate();
  // No session to exclude: this sheet is opened from an exercise, and shows the whole lineage.
  const entries = useAppSelectorWithArg(selectExerciseHistoryEntries, undefined)(props.movementKey);
  const [expanded, setExpanded] = useState(false);

  const pr = findPr(entries);
  const ctx: RowContext = {
    t,
    formatDate,
    today,
    prSessionId: pr?.sessionId,
    bodyweightLabel: t('exercise.short_bodyweight.label'),
  };
  const rows = entries.map((entry, index) => buildRow(entry, index, ctx));
  const visibleRows = expanded ? rows : rows.slice(0, INITIAL_VISIBLE_ROWS);

  const chart = buildChartPoints(entries, ctx);
  const prBanner: ExerciseHistoryPr | undefined = pr
    ? {
        heading: t('exercise.history.personal_record.label'),
        valueLine: `${formatWeight(pr.weight)} × ${pr.reps}`,
        subLine: t('exercise.history.e1rm_on.label', {
          e1rm: formatWeight(pr.e1rm, 1),
          date: formatDate(pr.date, { month: 'long', day: 'numeric' }),
        }),
      }
    : undefined;

  const toggleExpanded = () => setExpanded((v) => !v);
  const canExpand = rows.length > INITIAL_VISIBLE_ROWS;
  const actionLabel = expanded ? t('exercise.history.show_less.button') : t('exercise.history.see_all.button');
  const menuItems: MenuItem[] = canExpand ? [{ label: actionLabel, onPress: toggleExpanded }] : [];

  const chartSubtitle =
    chart.first && chart.last
      ? chart.points.length > 1
        ? buildSubtitle(chart.first, chart.last)
        : formatWeight(chart.first)
      : '';

  // Top inset applied (not 'off'): the custom nav bar must clear the real
  // status bar. The background stays edge-to-edge via ScreenRoot itself.
  return (
    <S.ScreenRoot edges={{ left: 'additive', right: 'additive', top: 'additive', bottom: 'off' }}>
      <ExerciseHistoryBackground />
      <ExerciseHistoryNavBar title={props.exerciseName} onBack={() => router.back()} menuItems={menuItems} />
      <ExerciseHistoryList
        rows={visibleRows}
        onRowPress={(sessionId) => router.push(`/history/edit?sessionId=${encodeURIComponent(sessionId)}` as Href)}
        banner={<ExerciseHistoryPrBanner pr={prBanner} />}
        chart={
          <ExerciseHistoryChart
            points={chart.points}
            prSessionId={pr?.sessionId}
            title={t('exercise.history.top_set_weight.title')}
            subtitle={chartSubtitle}
            sessionsLabel={
              chart.points.length === 1
                ? t('exercise.history.session_count.one')
                : t('exercise.history.session_count.other', { count: chart.points.length.toString() })
            }
            todayLabel={t('exercise.history.today.label')}
          />
        }
        sectionHeader={
          rows.length > 0 ? (
            <ExerciseHistorySectionHeader
              label={t('exercise.history.past_sessions.label')}
              actionLabel={actionLabel}
              onAction={canExpand ? toggleExpanded : undefined}
            />
          ) : undefined
        }
        empty={
          <EmptyInfo>
            <SurfaceText>{t('exercise.never_done_before.message')}</SurfaceText>
          </EmptyInfo>
        }
      />
      <ExerciseHistoryBottomFade />
    </S.ScreenRoot>
  );
}

import { useAppSelector } from '@/store';
import {
  selectExercises,
  selectHistoryPersonalRecords,
  selectSessions,
} from '@/store/stored-sessions';
import { GranularStatisticView } from '@/store/stats';
import { calculateOneRepMax } from '@/store/stats/calculate-stats';
import { PersonalRecord } from '@/store/stats/personal-records';
import { MovementKey, normalizeExerciseName } from '@/models/blueprint-models';
import { RecordedWeightedExercise, Session } from '@/models/session-models';
import { Weight, shortFormatWeightUnit } from '@/models/weight';
import { LocalDate } from '@js-joda/core';
import { useTranslate } from '@tolgee/react';
import {
  DEFAULT_MUSCLE_TARGET_BANDS,
  MUSCLE_GROUP_ROWS,
  MUSCLE_NORMALIZATION_MAP,
  shortLiftName,
  TrendRange,
  CanonicalMuscleGroup,
} from './constants';

/* ------------------------------------------------------------------ */
/* Small formatting helpers                                            */
/* ------------------------------------------------------------------ */

const MINUS = '−'; // U+2212, matches the reference spec's "−1.8 kg"

export function formatInt(value: number): string {
  return Math.round(value).toLocaleString('en-US');
}

/** One decimal, e.g. 116.7 */
export function format1(value: number): string {
  return (Math.round(value * 10) / 10).toFixed(1);
}

/** Signed one decimal with U+2212 minus, e.g. "+11.7" / "−1.8" */
export function formatSigned1(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  if (rounded === 0) return '0.0';
  return (rounded < 0 ? MINUS : '+') + Math.abs(rounded).toFixed(1);
}

/** Signed percent with one decimal, e.g. "+18.0%" / "−2.2%" */
export function formatSignedPct(fraction: number): string {
  const pct = Math.round(fraction * 1000) / 10;
  if (pct === 0) return '0.0%';
  return (pct < 0 ? MINUS : '+') + Math.abs(pct).toFixed(1) + '%';
}

/** Weight magnitude without unit, trimming ".0": 102.5 / 180 */
export function formatWeightTrim(weight: Weight): string {
  const kg = weight.convertTo('kilograms').value.toNumber();
  const rounded = Math.round(kg * 10) / 10;
  return Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1);
}

function kgOf(weight: Weight): number {
  return weight.convertTo('kilograms').value.toNumber();
}

/* ------------------------------------------------------------------ */
/* Session aggregates                                                  */
/* ------------------------------------------------------------------ */

/** Total lifted volume of a session in kg, mirroring the home screen's math. */
export function sessionVolumeKg(session: Session): number {
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
      total = total.plus(
        weight
          .multipliedBy(potentialSet.set.repsCompleted)
          .convertTo('kilograms'),
      );
    }
  }
  return total.value.toNumber();
}

/** Completed (recorded) sets of a weighted exercise. */
function completedSets(exercise: RecordedWeightedExercise): number {
  return exercise.potentialSets.filter((ps) => ps.set?.repsCompleted).length;
}

/** A day counts as trained when any recorded exercise was started. */
function isTrainedDay(sessions: Session[]): boolean {
  return sessions.some((s) => s.recordedExercises.some((e) => e.isStarted));
}

function sessionsOn(sessions: Session[], day: LocalDate): Session[] {
  return sessions.filter((s) => s.date.equals(day));
}

/* ------------------------------------------------------------------ */
/* Range buckets                                                       */
/* ------------------------------------------------------------------ */

export interface Bucket {
  start: LocalDate;
  end: LocalDate;
  label: string; // "Sep 15"
}

function monthDay(date: LocalDate): string {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return `${months[date.monthValue() - 1]} ${date.dayOfMonth()}`;
}

/**
 * Calendar buckets per range, each ending today:
 * 7D → 7 daily · 4W → 4 weekly ×7d · 6M → 26 weekly ×7d ·
 * 1Y → 12 monthly ×30d · ALL → monthly ×30d back to the first session.
 */
export function bucketsForRange(
  range: TrendRange,
  today: LocalDate,
  earliest: LocalDate | undefined,
): Bucket[] {
  const buckets: Bucket[] = [];
  const push = (end: LocalDate, days: number) => {
    buckets.unshift({
      start: end.minusDays(days - 1),
      end,
      label: monthDay(end),
    });
  };
  switch (range) {
    case '7D':
      for (let i = 0; i < 7; i++) push(today.minusDays(i), 1);
      break;
    case '4W':
      for (let i = 0; i < 4; i++) push(today.minusDays(i * 7), 7);
      break;
    case '6M':
      for (let i = 0; i < 26; i++) push(today.minusDays(i * 7), 7);
      break;
    case '1Y':
      for (let i = 0; i < 12; i++) push(today.minusDays(i * 30), 30);
      break;
    case 'ALL': {
      const from = earliest ?? today;
      const days = Math.max(1, today.toEpochDay() - from.toEpochDay() + 1);
      const count = Math.max(1, Math.ceil(days / 30));
      for (let i = 0; i < count; i++) push(today.minusDays(i * 30), 30);
      break;
    }
  }
  return buckets;
}

export interface ChartPoint {
  label: string;
  value: number;
  /** End date of the bucket; used for "· N wk" spans and the Today label. */
  end: LocalDate;
}

function volumeInBucket(sessions: Session[], bucket: Bucket): number {
  let total = 0;
  for (const session of sessions) {
    if (
      !session.date.isBefore(bucket.start) &&
      !session.date.isAfter(bucket.end)
    ) {
      total += sessionVolumeKg(session);
    }
  }
  return total;
}

/* ------------------------------------------------------------------ */
/* Hero metric data                                                    */
/* ------------------------------------------------------------------ */

export type DeltaTone = 'up' | 'down' | 'neutral';

export interface HeroMetric {
  points: ChartPoint[];
  bigValue: string;
  unit: string;
  caption: string;
  deltaText: string | null;
  deltaTone: DeltaTone;
  footer: string;
  /** Label rendered above the glowing end node. */
  endLabel: string;
}

export interface FeaturedLift {
  key: MovementKey;
  name: string;
  shortName: string;
  sessionCount: number;
}

/** The weighted movement with the most recorded sessions (ties → most sets → name). */
export function featuredLift(sessions: Session[]): FeaturedLift | undefined {
  const byMovement = new Map<
    MovementKey,
    { name: string; sessions: Set<string>; sets: number }
  >();
  for (const session of sessions) {
    for (const exercise of session.recordedExercises) {
      if (
        !(exercise instanceof RecordedWeightedExercise) ||
        !exercise.isStarted ||
        !exercise.tracksResistance
      ) {
        continue;
      }
      const sets = completedSets(exercise);
      if (sets === 0) continue;
      const key = exercise.movementKey();
      const entry = byMovement.get(key) ?? {
        name: exercise.blueprint.name,
        sessions: new Set<string>(),
        sets: 0,
      };
      entry.sessions.add(session.id);
      entry.sets += sets;
      byMovement.set(key, entry);
    }
  }
  let best: FeaturedLift | undefined;
  for (const [key, entry] of byMovement) {
    if (
      !best ||
      entry.sessions.size > best.sessionCount ||
      (entry.sessions.size === best.sessionCount && entry.name < best.name)
    ) {
      best = {
        key,
        name: entry.name,
        shortName: shortLiftName(entry.name),
        sessionCount: entry.sessions.size,
      };
    }
  }
  return best;
}

/** Best Epley e1RM per session for one movement, oldest → newest. */
export function e1rmSeries(
  sessions: Session[],
  key: MovementKey,
): { date: LocalDate; value: number }[] {
  const series: { date: LocalDate; value: number }[] = [];
  for (const session of sessions) {
    let best: number | undefined;
    for (const exercise of session.recordedExercises) {
      if (
        !(exercise instanceof RecordedWeightedExercise) ||
        exercise.movementKey() !== key
      )
        continue;
      for (const ps of exercise.potentialSets) {
        if (!ps.set?.repsCompleted) continue;
        const e1rm = kgOf(
          calculateOneRepMax(
            ps,
            exercise.effectiveWeight(ps, session.bodyweight),
          ),
        );
        if (best === undefined || e1rm > best) best = e1rm;
      }
    }
    if (best !== undefined) series.push({ date: session.date, value: best });
  }
  return series.sort((a, b) => (a.date.isBefore(b.date) ? -1 : 1));
}

function sampleMax(
  series: { date: LocalDate; value: number }[],
  buckets: Bucket[],
): ChartPoint[] {
  return buckets.flatMap((bucket) => {
    let best: number | undefined;
    for (const point of series) {
      if (
        !point.date.isBefore(bucket.start) &&
        !point.date.isAfter(bucket.end)
      ) {
        if (best === undefined || point.value > best) best = point.value;
      }
    }
    return best === undefined
      ? []
      : [{ label: bucket.label, value: best, end: bucket.end }];
  });
}

function sampleLast(
  series: { date: LocalDate; value: number }[],
  buckets: Bucket[],
): ChartPoint[] {
  return buckets.flatMap((bucket) => {
    let last: { date: LocalDate; value: number } | undefined;
    for (const point of series) {
      if (
        !point.date.isBefore(bucket.start) &&
        !point.date.isAfter(bucket.end)
      ) {
        if (!last || !point.date.isBefore(last.date)) last = point;
      }
    }
    return last === undefined
      ? []
      : [{ label: bucket.label, value: last.value, end: bucket.end }];
  });
}

/* ------------------------------------------------------------------ */
/* Section data shapes                                                 */
/* ------------------------------------------------------------------ */

export interface MetricTile {
  label: string;
  value: string;
  unit?: string;
  delta: string;
  deltaTone: DeltaTone;
  spark: number[];
}

export interface PersonalBestRow {
  name: string;
  bestSet: string;
  e1rm: string;
  dateLabel: string;
}

export interface MuscleLoadRow {
  group: CanonicalMuscleGroup;
  sets: number;
  low: number;
  high: number;
}

export interface MuscleCallout {
  muscle: CanonicalMuscleGroup;
  sets: number;
  low: number;
  high: number;
  add: number;
}

export type HeatLevel = 0 | 1 | 2 | 3 | 4;

export interface HeatCell {
  date: LocalDate;
  level: HeatLevel;
  future: boolean;
}

export interface PrTimelineItem {
  dateLabel: string;
  name: string;
  value: string;
}

export interface TrendsOverviewData {
  range: TrendRange;
  subtitle: string;
  volume: HeroMetric;
  e1rm: HeroMetric;
  bodyweight: HeroMetric;
  tiles: [MetricTile, MetricTile, MetricTile];
  featuredShortName: string;
  personalBests: PersonalBestRow[];
  muscleRows: MuscleLoadRow[];
  muscleCallout: MuscleCallout | null;
  heatmap: HeatCell[][];
  heatTrained: number;
  heatElapsed: number;
  heatPct: number;
  heatMonthLabel: string;
  currentStreak: number;
  longestStreak: number;
  longestStreakLabel: string;
  totalSessions: number;
  sessionsThisYear: number;
  avgPerWeek: string;
  trainedToday: boolean;
  prTimeline: PrTimelineItem[];
  prNewCount: number;
  insights: { line1: string; line2: string }[];
}

const LIFT_ORDER = [/bench/i, /squat/i, /deadlift/i];

function orderRecords<T extends { name: string; date: LocalDate }>(
  items: T[],
): T[] {
  const ordered = LIFT_ORDER.map((pattern) =>
    items.find((r) => pattern.test(r.name)),
  ).filter((r): r is T => r !== undefined);
  const rest = items
    .filter((r) => !LIFT_ORDER.some((pattern) => pattern.test(r.name)))
    .sort((a, b) => (a.date.isAfter(b.date) ? -1 : 1));
  return [...ordered, ...rest];
}

/**
 * Everything the Trends overview renders, derived from the real stores.
 * `range` only re-samples the hero chart; tiles and sections use fixed,
 * spec-defined windows (trailing 7d / 13 weeks / trailing year).
 */
export function useTrendsOverviewData(
  stats: GranularStatisticView,
  range: TrendRange,
): Omit<TrendsOverviewData, 'range'> {
  const { t } = useTranslate();
  const sessions = useAppSelector(selectSessions);
  const historyRecords = useAppSelector(selectHistoryPersonalRecords);

  const today = LocalDate.now();
  const earliest = sessions.reduce<LocalDate | undefined>(
    (min, s) => (min === undefined || s.date.isBefore(min) ? s.date : min),
    undefined,
  );

  /* ---- volume: trailing windows ---- */
  const trailing7 = sessions.filter(
    (s) => !s.date.isBefore(today.minusDays(6)) && !s.date.isAfter(today),
  );
  const prior7 = sessions.filter(
    (s) =>
      !s.date.isBefore(today.minusDays(13)) &&
      s.date.isBefore(today.minusDays(6)),
  );
  const trailing7Kg = trailing7.reduce((sum, s) => sum + sessionVolumeKg(s), 0);
  const prior7Kg = prior7.reduce((sum, s) => sum + sessionVolumeKg(s), 0);
  const wow = prior7Kg > 0 ? (trailing7Kg - prior7Kg) / prior7Kg : null;

  const buckets = bucketsForRange(range, today, earliest);
  const volumePoints: ChartPoint[] = buckets.map((b) => ({
    label: b.label,
    value: volumeInBucket(sessions, b),
    end: b.end,
  }));
  const volumeAvg = volumePoints.length
    ? volumePoints.reduce((s, p) => s + p.value, 0) / volumePoints.length
    : 0;
  const volumeGain =
    volumePoints.length >= 2 && volumePoints[0]!.value > 0
      ? (volumePoints[volumePoints.length - 1]!.value -
          volumePoints[0]!.value) /
        volumePoints[0]!.value
      : null;
  const bucketNoun =
    range === '7D'
      ? t('trends.span.days')
      : range === '1Y' || range === 'ALL'
        ? t('trends.span.months')
        : t('trends.span.weeks');
  const rangeSpan =
    range === '7D'
      ? `7-${t('trends.span.day')}`
      : `${buckets.length}-${range === '1Y' || range === 'ALL' ? t('trends.span.month') : t('trends.span.week')}`;

  const volume: HeroMetric = {
    points: volumePoints,
    bigValue: formatInt(trailing7Kg),
    unit: t('trends.unit.kg'),
    caption: t('trends.hero.volume_caption', {
      window: t('trends.window.rolling_7d'),
      span: rangeSpan,
      avg: `${formatInt(volumeAvg)} ${t('trends.unit.kg')}`,
    }),
    deltaText: wow === null ? null : formatSignedPct(wow),
    deltaTone: wow === null ? 'neutral' : wow >= 0 ? 'up' : 'down',
    footer:
      volumeGain === null
        ? ''
        : t('trends.hero.footer_gain', {
            pct: formatSignedPct(volumeGain),
            span: `${volumePoints.length} ${bucketNoun}`,
          }),
    endLabel: formatInt(volumePoints[volumePoints.length - 1]?.value ?? 0),
  };

  /* ---- featured lift e1RM ---- */
  const featured = featuredLift(sessions);
  const e1rmAll = featured ? e1rmSeries(sessions, featured.key) : [];
  const e1rmPoints = sampleMax(e1rmAll, buckets);
  const latestE1rm = e1rmAll[e1rmAll.length - 1]?.value;
  const e1rmGain =
    e1rmPoints.length >= 2
      ? e1rmPoints[e1rmPoints.length - 1]!.value - e1rmPoints[0]!.value
      : null;
  const e1rmGainPct =
    e1rmPoints.length >= 2 && e1rmPoints[0]!.value > 0
      ? (e1rmPoints[e1rmPoints.length - 1]!.value - e1rmPoints[0]!.value) /
        e1rmPoints[0]!.value
      : null;

  const e1rm: HeroMetric = {
    points: e1rmPoints,
    bigValue: latestE1rm === undefined ? '–' : format1(latestE1rm),
    unit: latestE1rm === undefined ? '' : t('trends.unit.kg'),
    caption: featured
      ? t('trends.hero.e1rm_caption', { lift: featured.shortName })
      : '',
    deltaText:
      e1rmGain === null
        ? null
        : formatSigned1(e1rmGain) + ' ' + t('trends.unit.kg'),
    deltaTone: e1rmGain === null ? 'neutral' : e1rmGain >= 0 ? 'up' : 'down',
    footer:
      e1rmGainPct === null
        ? ''
        : t('trends.hero.footer_gain', {
            pct: formatSignedPct(e1rmGainPct),
            span: `${e1rmPoints.length} ${bucketNoun}`,
          }),
    endLabel: e1rmPoints.length
      ? format1(e1rmPoints[e1rmPoints.length - 1]!.value)
      : '',
  };

  /* ---- bodyweight (stats store) ---- */
  const bwSamples = [...stats.bodyweightStats.statistics]
    .map((s) => ({ date: s.dateTime.toLocalDate(), value: kgOf(s.value) }))
    .sort((a, b) => (a.date.isBefore(b.date) ? -1 : 1));
  const bwPoints = sampleLast(bwSamples, buckets);
  const latestBw = bwSamples[bwSamples.length - 1];
  const bwDelta =
    bwPoints.length >= 2
      ? bwPoints[bwPoints.length - 1]!.value - bwPoints[0]!.value
      : null;
  const bwWeeks =
    bwPoints.length >= 2
      ? Math.max(
          1,
          Math.round(
            (bwPoints[bwPoints.length - 1]!.end.toEpochDay() -
              bwPoints[0]!.end.toEpochDay()) /
              7,
          ),
        )
      : 0;
  const bwDeltaPct =
    bwPoints.length >= 2 && bwPoints[0]!.value > 0
      ? (bwPoints[bwPoints.length - 1]!.value - bwPoints[0]!.value) /
        bwPoints[0]!.value
      : null;

  const bodyweight: HeroMetric = {
    points: bwPoints,
    bigValue: latestBw === undefined ? '–' : format1(latestBw.value),
    unit: latestBw === undefined ? '' : t('trends.unit.kg'),
    caption:
      latestBw === undefined
        ? ''
        : t('trends.hero.bodyweight_caption', { count: bwSamples.length }),
    deltaText:
      bwDelta === null
        ? null
        : `${formatSigned1(bwDelta)} ${t('trends.unit.kg')} · ${bwWeeks} ${t('trends.span.wk')}`,
    deltaTone: 'neutral',
    footer:
      bwDeltaPct === null
        ? ''
        : t('trends.hero.footer_gain', {
            pct: formatSignedPct(bwDeltaPct),
            span: `${bwPoints.length} ${bucketNoun}`,
          }),
    endLabel: bwPoints.length
      ? format1(bwPoints[bwPoints.length - 1]!.value)
      : '',
  };

  /* ---- tiles (fixed windows, mirror the spec) ---- */
  const weeklyTrailing: number[] = [];
  for (let i = 7; i >= 0; i--) {
    const end = today.minusDays(i * 7);
    weeklyTrailing.push(
      volumeInBucket(sessions, { start: end.minusDays(6), end, label: '' }),
    );
  }
  const e1rmTail = e1rmAll.slice(-8).map((p) => p.value);
  const e1rmTileGain =
    e1rmTail.length >= 2 ? e1rmTail[e1rmTail.length - 1]! - e1rmTail[0]! : null;
  const bwTail = bwSamples.slice(-8);
  const bwTileDelta =
    bwTail.length >= 2
      ? bwTail[bwTail.length - 1]!.value - bwTail[0]!.value
      : null;
  const bwTileWeeks =
    bwTail.length >= 2
      ? Math.max(
          1,
          Math.round(
            (bwTail[bwTail.length - 1]!.date.toEpochDay() -
              bwTail[0]!.date.toEpochDay()) /
              7,
          ),
        )
      : 0;

  const tiles: [MetricTile, MetricTile, MetricTile] = [
    {
      label: t('trends.tile.volume'),
      value: formatInt(trailing7Kg),
      delta: wow === null ? '–' : formatSignedPct(wow),
      deltaTone: wow === null ? 'neutral' : wow >= 0 ? 'up' : 'down',
      spark: weeklyTrailing,
    },
    {
      label: featured
        ? t('trends.tile.e1rm', { lift: featured.shortName.toUpperCase() })
        : t('trends.tile.e1rm_fallback'),
      value: latestE1rm === undefined ? '–' : format1(latestE1rm),
      unit: latestE1rm === undefined ? undefined : t('trends.unit.kg'),
      delta:
        e1rmTileGain === null
          ? '–'
          : `${formatSigned1(e1rmTileGain)} ${t('trends.unit.kg')}`,
      deltaTone:
        e1rmTileGain === null ? 'neutral' : e1rmTileGain >= 0 ? 'up' : 'down',
      spark: e1rmTail,
    },
    {
      label: t('trends.tile.bodyweight'),
      value: latestBw === undefined ? '–' : format1(latestBw.value),
      unit: latestBw === undefined ? undefined : t('trends.unit.kg'),
      delta:
        bwTileDelta === null
          ? '–'
          : `${formatSigned1(bwTileDelta)} ${t('trends.unit.kg')} · ${bwTileWeeks} ${t('trends.span.wk')}`,
      deltaTone: 'neutral',
      spark: bwTail.map((p) => p.value),
    },
  ];

  /* ---- personal bests: per-exercise all-time bests ---- */
  const sessionById = new Map(sessions.map((s) => [s.id, s]));
  const flatRecords: {
    date: LocalDate;
    sessionId: string;
    record: PersonalRecord;
  }[] = [];
  for (const [sessionId, records] of historyRecords) {
    const session = sessionById.get(sessionId);
    if (!session) continue;
    for (const record of records)
      flatRecords.push({ date: session.date, sessionId, record });
  }
  const bestByName = new Map<
    string,
    { date: LocalDate; sessionId: string; record: PersonalRecord }
  >();
  for (const item of [...flatRecords].sort((a, b) =>
    a.date.isBefore(b.date) ? -1 : 1,
  )) {
    // Records only ever improve, so the latest record per lift is its all-time best.
    bestByName.set(item.record.exerciseName, item);
  }
  const personalBests: PersonalBestRow[] = orderRecords(
    [...bestByName.values()].map(({ date, sessionId, record }) => {
      const session = sessionById.get(sessionId);
      let bestSet = '';
      if (session) {
        let best: { weight: Weight; reps: number; e1rm: number } | undefined;
        for (const exercise of session.recordedExercises) {
          if (
            !(exercise instanceof RecordedWeightedExercise) ||
            exercise.blueprint.name !== record.exerciseName
          ) {
            continue;
          }
          for (const ps of exercise.potentialSets) {
            if (!ps.set?.repsCompleted) continue;
            const weight = exercise.effectiveWeight(ps, session.bodyweight);
            const e1rm = kgOf(calculateOneRepMax(ps, weight));
            if (!best || e1rm > best.e1rm)
              best = { weight, reps: ps.set.repsCompleted, e1rm };
          }
        }
        // Set detail comes from the record's own session — never invented.
        // Without it, fall back to the bare weight (task rule).
        bestSet = best
          ? `${formatWeightTrim(best.weight)} × ${best.reps}`
          : formatWeightTrim(record.oneRepMax);
      }
      return {
        name: record.exerciseName,
        date,
        row: {
          name: record.exerciseName,
          bestSet,
          e1rm: format1(kgOf(record.oneRepMax)),
          dateLabel: monthDay(date),
        } as PersonalBestRow,
      };
    }),
  )
    .slice(0, 5)
    .map((x) => x.row);

  /* ---- muscle group load: trailing 7 days ---- */
  // Primary muscle comes from the exercise library descriptor (matched by
  // normalized blueprint name), the same source the exercise detail screen uses.
  const exercises = useAppSelector(selectExercises);
  const musclesByName = new Map<string, string[]>();
  for (const descriptor of Object.values(exercises)) {
    musclesByName.set(
      normalizeExerciseName(descriptor.name),
      descriptor.muscles,
    );
  }
  const setsByGroup = new Map<CanonicalMuscleGroup, number>();
  for (const session of trailing7) {
    for (const exercise of session.recordedExercises) {
      if (
        !(exercise instanceof RecordedWeightedExercise) ||
        !exercise.isStarted
      )
        continue;
      const raw =
        musclesByName
          .get(normalizeExerciseName(exercise.blueprint.name))?.[0]
          ?.toLowerCase()
          .trim() ?? '';
      const group = MUSCLE_NORMALIZATION_MAP[raw];
      if (!group) continue; // accessory group or unknown: no row in the 6-row chart
      setsByGroup.set(
        group,
        (setsByGroup.get(group) ?? 0) + completedSets(exercise),
      );
    }
  }
  const muscleRows: MuscleLoadRow[] = MUSCLE_GROUP_ROWS.map((group) => ({
    group,
    sets: setsByGroup.get(group) ?? 0,
    low: DEFAULT_MUSCLE_TARGET_BANDS[group].low,
    high: DEFAULT_MUSCLE_TARGET_BANDS[group].high,
  }));
  let muscleCallout: MuscleCallout | null = null;
  for (const row of muscleRows) {
    const ratio = row.sets / row.low;
    const current = muscleCallout
      ? muscleCallout.sets / muscleCallout.low
      : Infinity;
    if (ratio < current)
      muscleCallout = {
        muscle: row.group,
        sets: row.sets,
        low: row.low,
        high: row.high,
        add: 0,
      };
  }
  if (muscleCallout && muscleCallout.sets >= muscleCallout.low) {
    muscleCallout = null; // every shown muscle is inside its band — nothing under-trained
  } else if (muscleCallout) {
    muscleCallout = {
      ...muscleCallout,
      add: muscleCallout.low - muscleCallout.sets,
    };
  }

  /* ---- consistency heatmap: 13 Monday-first weeks ending today ---- */
  const mondayOffset = (today.dayOfWeek().value() - 1 + 7 * 12) % (7 * 13);
  const firstMonday = today.minusDays(mondayOffset);
  const heatmap: HeatCell[][] = [];
  const dailyVolumes: number[] = [];
  let heatTrained = 0;
  for (let col = 0; col < 13; col++) {
    const week: HeatCell[] = [];
    for (let row = 0; row < 7; row++) {
      const date = firstMonday.plusDays(col * 7 + row);
      const future = date.isAfter(today);
      const daySessions = future ? [] : sessionsOn(sessions, date);
      const volume = daySessions.reduce(
        (sum, s) => sum + sessionVolumeKg(s),
        0,
      );
      if (!future) {
        if (isTrainedDay(daySessions)) heatTrained += 1;
        if (volume > 0) dailyVolumes.push(volume);
      }
      week.push({ date, level: 0, future });
    }
    heatmap.push(week);
  }
  // L1–L4 are quartiles of the user's own non-zero daily volumes over the window.
  const sorted = [...dailyVolumes].sort((a, b) => a - b);
  const quantile = (q: number): number => {
    if (sorted.length === 0) return 0;
    const pos = q * (sorted.length - 1);
    const lo = Math.floor(pos);
    const hi = Math.ceil(pos);
    return sorted[lo]! + (sorted[hi]! - sorted[lo]!) * (pos - lo);
  };
  const q1 = quantile(0.25);
  const q2 = quantile(0.5);
  const q3 = quantile(0.75);
  for (const week of heatmap) {
    for (const cell of week) {
      if (cell.future) continue;
      const daySessions = sessionsOn(sessions, cell.date);
      const volume = daySessions.reduce(
        (sum, s) => sum + sessionVolumeKg(s),
        0,
      );
      cell.level =
        volume <= 0
          ? 0
          : volume <= q1
            ? 1
            : volume <= q2
              ? 2
              : volume <= q3
                ? 3
                : 4;
    }
  }
  const heatElapsed = Number(today.toEpochDay() - firstMonday.toEpochDay()) + 1;
  const heatPct =
    heatElapsed > 0 ? Math.round((heatTrained / heatElapsed) * 100) : 0;
  const monthName = (d: LocalDate) => monthDay(d).split(' ')[0]!.toUpperCase();
  const heatMonthLabel = `${monthName(firstMonday)} – ${monthName(today)}`;

  /* ---- streaks & totals ---- */
  const trainedDates = new Set<string>();
  for (const session of sessions) {
    if (isTrainedDay([session])) trainedDates.add(session.date.toString());
  }
  let currentStreak = 0;
  {
    let cursor = trainedDates.has(today.toString())
      ? today
      : today.minusDays(1);
    while (trainedDates.has(cursor.toString())) {
      currentStreak += 1;
      cursor = cursor.minusDays(1);
    }
  }
  let longestStreak = 0;
  let longestEnd: LocalDate | undefined;
  {
    const ordered = [...trainedDates].sort();
    let run = 0;
    let prev: string | undefined;
    for (const iso of ordered) {
      const date = LocalDate.parse(iso);
      run =
        prev && date.equals(LocalDate.parse(prev).plusDays(1)) ? run + 1 : 1;
      if (run > longestStreak) {
        longestStreak = run;
        longestEnd = date;
      }
      prev = iso;
    }
  }
  const longestStart = longestEnd?.minusDays(longestStreak - 1);
  const longestStreakLabel =
    longestStreak > 0 && longestStart && longestEnd
      ? t('trends.streaks.longest', {
          days: longestStreak,
          range: `${monthDay(longestStart)} – ${monthDay(longestEnd)}`,
        })
      : t('trends.streaks.longest_none');
  const sessionsThisYear = sessions.filter(
    (s) => s.date.year() === today.year(),
  ).length;
  const weeksElapsed = today.dayOfYear() / 7;
  const avgPerWeek =
    weeksElapsed > 0 ? (sessionsThisYear / weeksElapsed).toFixed(1) : '0.0';

  /* ---- PR timeline: latest 5 records, newest first ---- */
  const prTimeline: PrTimelineItem[] = [...flatRecords]
    .sort((a, b) =>
      a.date.isAfter(b.date) ? -1 : a.date.isBefore(b.date) ? 1 : 0,
    )
    .slice(0, 5)
    .map(({ date, record }) => ({
      dateLabel: `${monthName(date)} ${date.dayOfMonth()}`,
      name: record.exerciseName,
      value:
        `${format1(kgOf(record.oneRepMax))} ${shortFormatWeightUnit(record.oneRepMax.unit)}`.trim(),
    }));
  const prNewCount = flatRecords.filter(
    (r) => !r.date.isBefore(today.minusDays(6)),
  ).length;

  /* ---- trend insights: rule-based, max 2, each tracing to a real number ---- */
  const insights: { line1: string; line2: string }[] = [];
  if (wow !== null && wow >= 0.15) {
    insights.push({
      line1: t('trends.insights.deload_1', { pct: formatSignedPct(wow) }),
      line2: t('trends.insights.deload_2'),
    });
  }
  if (muscleCallout && insights.length < 2) {
    insights.push({
      line1: t('trends.insights.muscle_1', {
        muscle: muscleCallout.muscle,
        sets: muscleCallout.sets,
        low: muscleCallout.low,
        high: muscleCallout.high,
      }),
      line2: t('trends.insights.muscle_2', {
        muscle: muscleCallout.muscle.toLowerCase(),
      }),
    });
  }
  if (insights.length === 0) {
    if (currentStreak >= 2) {
      insights.push({
        line1: t('trends.insights.streak_1', { days: currentStreak }),
        line2: t('trends.insights.streak_2', { longest: longestStreak }),
      });
    } else {
      insights.push({
        line1: t('trends.insights.consistency_1', {
          trained: heatTrained,
          elapsed: heatElapsed,
          pct: heatPct,
        }),
        line2: t('trends.insights.consistency_2'),
      });
    }
  }

  return {
    subtitle: t('trends.subtitle', {
      start: monthDay(today.minusDays(6)),
      end: monthDay(today),
    }),
    volume,
    e1rm,
    bodyweight,
    tiles,
    featuredShortName: featured?.shortName ?? t('trends.tile.e1rm_fallback'),
    personalBests,
    muscleRows,
    muscleCallout,
    heatmap,
    heatTrained,
    heatElapsed,
    heatPct,
    heatMonthLabel,
    currentStreak,
    longestStreak,
    longestStreakLabel,
    totalSessions: sessions.length,
    sessionsThisYear,
    avgPerWeek,
    trainedToday: trainedDates.has(today.toString()),
    prTimeline,
    prNewCount,
    insights,
  };
}

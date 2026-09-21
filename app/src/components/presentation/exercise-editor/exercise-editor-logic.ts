import {
  CardioExerciseBlueprint,
  CardioExerciseSetBlueprint,
  DistanceUnit,
  ProgressionRule,
  Rest,
  WeightedExerciseBlueprint,
} from '@/models/blueprint-models';
import { ExerciseDescriptor } from '@/models/exercise-models';
import { Weight } from '@/models/weight';
import { fuzzyMatchScore } from '@/components/presentation/workout-editor/exercise-fuzzy-match';
import { Duration } from '@js-joda/core';
import BigNumber from 'bignumber.js';

export type RepsMode = 'fixed' | 'range' | 'perSet';
export type ExerciseKind = 'weighted' | 'cardio';

/** The design's notes field caps at 280 characters (legacy had no cap). */
export const NOTES_MAX_LENGTH = 280;

export function kindOf(exercise: WeightedExerciseBlueprint | CardioExerciseBlueprint): ExerciseKind {
  return exercise instanceof WeightedExerciseBlueprint ? 'weighted' : 'cardio';
}

/** The layout the stored targets most likely came from (mirrors the legacy editor's seeding). */
export function repsModeOf(exercise: WeightedExerciseBlueprint): RepsMode {
  const first = exercise.plannedSets[0]?.reps;
  if (!first) {
    return 'fixed';
  }
  const uniform = exercise.plannedSets.every((s) => s.reps.min === first.min && s.reps.max === first.max);
  if (!uniform) {
    return 'perSet';
  }
  return first.min === first.max ? 'fixed' : 'range';
}

export function setCountOf(exercise: WeightedExerciseBlueprint | CardioExerciseBlueprint): number {
  return exercise instanceof WeightedExerciseBlueprint ? exercise.plannedSets.length : exercise.sets.length;
}

/**
 * The S2-C caption is descriptive copy of a real state: the trailing sets
 * step down. Returns the {from,to} 1-based range when the targets are
 * non-increasing and the last set is strictly below the first; otherwise
 * undefined and the caption is omitted.
 */
export function dropSetTail(targets: { min: number; max: number }[]): { from: number; to: number } | undefined {
  if (targets.length < 2) {
    return undefined;
  }
  const values = targets.map((t) => t.max);
  for (let i = 1; i < values.length; i++) {
    if (values[i]! > values[i - 1]!) {
      return undefined;
    }
  }
  if (values[values.length - 1]! >= values[0]!) {
    return undefined;
  }
  let lastDrop = -1;
  for (let i = 1; i < values.length; i++) {
    if (values[i]! < values[i - 1]!) {
      lastDrop = i;
    }
  }
  if (lastDrop < 0) {
    return undefined;
  }
  return { from: lastDrop + 1, to: values.length };
}

/** "90 s", "2 m", "1 m 30 s" — the rest row and sheet headline. */
export function formatRestValue(rest: Rest): string {
  return formatDurationShort(rest.minRest);
}

export function formatDurationShort(duration: Duration): string {
  const totalSeconds = duration.seconds();
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) {
    return `${seconds} s`;
  }
  if (seconds === 0) {
    return `${minutes} m`;
  }
  return `${minutes} m ${seconds} s`;
}

/** Rest presets backing the S4-B chips. All real Rest shapes (min/max/failure). */
export function restPresetFor(seconds: number): Rest {
  const minRest = Duration.ofSeconds(seconds);
  return {
    minRest,
    maxRest: Duration.ofSeconds(Math.max(seconds, 90)),
    failureRest: Duration.ofSeconds(seconds * 2),
  };
}

/** Real distance units only: metric m/km, imperial mi/yd ("ft" is not a model unit). */
export function distanceUnitOptions(useImperialUnits: boolean): { value: DistanceUnit; label: string }[] {
  return useImperialUnits
    ? [
        { value: 'mile', label: 'mi' },
        { value: 'yard', label: 'yd' },
      ]
    : [
        { value: 'metre', label: 'm' },
        { value: 'kilometre', label: 'km' },
      ];
}

export function distanceStepFor(unit: DistanceUnit): number {
  switch (unit) {
    case 'metre':
      return 100;
    case 'kilometre':
      return 0.5;
    case 'mile':
      return 0.5;
    case 'yard':
      return 50;
  }
}

export function formatDistanceValue(value: BigNumber): string {
  const n = value.toNumber();
  return Number.isInteger(n) ? n.toString() : value.toFixed(1);
}

export type TrackKey = 'time' | 'distance' | 'resistance' | 'incline' | 'weight' | 'steps';

const TRACK_KEYS: TrackKey[] = ['time', 'distance', 'resistance', 'incline', 'weight', 'steps'];

/** Legacy target-switch defaults: 2.5 mi / 5000 m for distance, 30 min for time. */
export function defaultCardioTarget(
  type: 'distance' | 'time',
  useImperialUnits: boolean,
): CardioExerciseSetBlueprint['target'] {
  if (type === 'distance') {
    return {
      type: 'distance',
      value: {
        unit: useImperialUnits ? 'mile' : 'metre',
        value: new BigNumber(useImperialUnits ? 2.5 : 5000),
      },
    };
  }
  return { type: 'time', value: Duration.ofMinutes(30) };
}

/** Convert a stored distance value to display in `unit` (metre↔km, mile↔yd). */
export function convertDistanceUnit(
  target: Extract<CardioExerciseSetBlueprint['target'], { type: 'distance' }>,
  unit: DistanceUnit,
): Extract<CardioExerciseSetBlueprint['target'], { type: 'distance' }> {
  const metresPer: Record<DistanceUnit, number> = { metre: 1, kilometre: 1000, mile: 1609.344, yard: 0.9144 };
  const metres = target.value.value.toNumber() * metresPer[target.value.unit];
  return { type: 'distance', value: { unit, value: new BigNumber(metres / metresPer[unit]) } };
}

/**
 * The distance to display: the stored unit when it belongs to the current
 * metric/imperial pair, otherwise the value converted into the pair's first
 * unit. Storage only changes after the user interacts (unit switch or edit).
 */
export function displayDistance(
  target: Extract<CardioExerciseSetBlueprint['target'], { type: 'distance' }>,
  useImperialUnits: boolean,
): { value: BigNumber; unit: DistanceUnit } {
  const options = distanceUnitOptions(useImperialUnits);
  if (options.some((option) => option.value === target.value.unit)) {
    return target.value;
  }
  return convertDistanceUnit(target, options[0]!.value).value;
}

/** Dirty check for the amber strip: true once the draft differs from the session blueprint. */
export function blueprintsEqual(
  a: WeightedExerciseBlueprint | CardioExerciseBlueprint | undefined,
  b: WeightedExerciseBlueprint | CardioExerciseBlueprint | undefined,
): boolean {
  if (!a || !b) {
    return a === b;
  }
  return JSON.stringify(a.toJSON()) === JSON.stringify(b.toJSON());
}

/**
 * The six TRACK toggles: the target metric is auto-required (locked on),
 * everything else follows the set's stored flags.
 */
export function trackStateOf(set: CardioExerciseSetBlueprint): { key: TrackKey; on: boolean; locked: boolean }[] {
  const flags: Record<TrackKey, boolean> = {
    time: set.trackDuration,
    distance: set.trackDistance,
    resistance: set.trackResistance,
    incline: set.trackIncline,
    weight: set.trackWeight,
    steps: set.trackSteps,
  };
  return TRACK_KEYS.map((key) => ({
    key,
    locked: key === set.target.type,
    on: key === set.target.type ? true : flags[key],
  }));
}

/** Flip one tracking flag; the locked target metric cannot be turned off. */
export function setTrackFlag(set: CardioExerciseSetBlueprint, key: TrackKey, on: boolean): CardioExerciseSetBlueprint {
  if (key === set.target.type) {
    return set;
  }
  const flag: Record<
    TrackKey,
    'trackDuration' | 'trackDistance' | 'trackResistance' | 'trackIncline' | 'trackWeight' | 'trackSteps'
  > = {
    time: 'trackDuration',
    distance: 'trackDistance',
    resistance: 'trackResistance',
    incline: 'trackIncline',
    weight: 'trackWeight',
    steps: 'trackSteps',
  };
  return set.with({ [flag[key]]: on });
}

/** The S3 link glyph turns ember only when the stored link parses as an http(s) URL. */
export function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Link glyph ink: ember when the stored link is a real http(s) URL, neutral
 * grey otherwise (empty or invalid). The reference never shows a third state.
 */
export function linkGlyphColor(link: string): string {
  return isValidHttpUrl(link) ? '#FF6A3D' : '#8E8E93';
}

/**
 * The S6 add flow placeholder: a blank name opens the search-first layout
 * (Done stays disabled until an exercise is picked) and new exercises default
 * to 1 x 8. Shared by the workout editor and the add-exercise hook so every
 * entry point starts identical.
 */
export function newExercisePlaceholder(): WeightedExerciseBlueprint {
  return WeightedExerciseBlueprint.of({ sets: 1, repsConfig: { type: 'fixed', reps: 8 } });
}

/**
 * What confirming the S4-A type switch produces: a fresh blueprint of the
 * target kind carrying only name, notes and link — the rep/target
 * configuration is genuinely reset, never silently migrated.
 */
export function switchExerciseKind(
  exercise: WeightedExerciseBlueprint | CardioExerciseBlueprint,
  target: ExerciseKind,
): WeightedExerciseBlueprint | CardioExerciseBlueprint {
  const preserved = { name: exercise.name, notes: exercise.notes, link: exercise.link };
  return target === 'cardio'
    ? CardioExerciseBlueprint.empty().with(preserved)
    : WeightedExerciseBlueprint.of(preserved);
}

/** Clamp note text to the design's 280-character cap (legacy had no cap — behavior change). */
export function clampNotes(value: string): string {
  return value.length > NOTES_MAX_LENGTH ? value.slice(0, NOTES_MAX_LENGTH) : value;
}

/**
 * The S4-A confirm names exactly what is lost and what survives, computed
 * from the real draft: set count and target type.
 */
export function typeSwitchCopy(
  exercise: WeightedExerciseBlueprint | CardioExerciseBlueprint,
  target: ExerciseKind,
): { titleKey: 'toCardio' | 'toWeighted'; lostCount: number; lostKind: 'reps' | 'targets' } {
  return {
    titleKey: target === 'cardio' ? 'toCardio' : 'toWeighted',
    lostCount: setCountOf(exercise),
    lostKind: kindOf(exercise) === 'weighted' ? 'reps' : 'targets',
  };
}

/** "80.6 kg" / "177.7 lbs" from the real session bodyweight; undefined when none. */
export function formatBodyweight(bodyweight: Weight | undefined, useImperialUnits: boolean): string | undefined {
  if (!bodyweight) {
    return undefined;
  }
  const converted = bodyweight.convertTo(useImperialUnits ? 'pounds' : 'kilograms');
  const suffix = useImperialUnits ? 'lbs' : 'kg';
  return `${converted.value.toFixed(1)} ${suffix}`;
}

export type ScopeSegment = 'top' | 'all';

/** The design offers two scope choices; any lowestSets pick maps to "top". */
export function scopeSegmentOf(scope: ProgressionRule['scope']): ScopeSegment {
  return scope.type === 'allSets' ? 'all' : 'top';
}

export function scopeFromSegment(segment: ScopeSegment, existing?: ProgressionRule['scope']): ProgressionRule['scope'] {
  if (segment === 'all') {
    return { type: 'allSets' };
  }
  // "Top" keeps the rule's existing lowestSets pick so opening the editor never
  // silently narrows a first/middle/all pick down to last.
  return existing?.type === 'lowestSets' ? existing : { type: 'lowestSets', pick: 'last' };
}

/**
 * Collapsed progression summary from real rules, e.g. "+2.5 kg · all sets",
 * "+1 rep · top set", "2 rules", or undefined when there are no rules.
 */
export function progressionSummary(rules: ProgressionRule[], weightSuffix: string): string | undefined {
  if (rules.length === 0) {
    return undefined;
  }
  if (rules.length > 1) {
    return `${rules.length} rules`;
  }
  const rule = rules[0]!;
  const amount =
    rule.axis === 'load'
      ? `${rule.step.toString()} ${weightSuffix}`
      : `${rule.step.toString()} rep${rule.step.eq(1) ? '' : 's'}`;
  const scope = scopeSegmentOf(rule.scope) === 'all' ? 'all sets' : 'top set';
  return `+${amount} · ${scope}`;
}

/** The default rule the "Add progression" row creates (the plan's standard load rule). */
export function defaultProgressionRule(): ProgressionRule {
  return ProgressionRule.load(new BigNumber(2.5));
}

/** Resize the set list, seeding new sets from the last set's targets (legacy behavior). */
export function resizeWeightedSets(exercise: WeightedExerciseBlueprint, count: number): WeightedExerciseBlueprint {
  const sets = [...exercise.plannedSets];
  while (sets.length < count) {
    const last = sets[sets.length - 1];
    sets.push({ reps: last ? { ...last.reps } : { min: 10, max: 10 } });
  }
  return exercise.with({ plannedSets: sets.slice(0, Math.max(1, count)) });
}

/** Project the current targets onto a reps layout, preserving values (legacy semantics). */
export function applyRepsMode(exercise: WeightedExerciseBlueprint, mode: RepsMode): WeightedExerciseBlueprint {
  const sets = exercise.plannedSets;
  const first = sets[0]?.reps ?? { min: 10, max: 10 };
  switch (mode) {
    case 'fixed':
      return exercise.with({
        plannedSets: sets.map(() => ({ reps: { min: first.max, max: first.max } })),
      });
    case 'range':
      return exercise.with({
        plannedSets: sets.map(() => ({ reps: { min: first.min, max: first.max } })),
      });
    case 'perSet':
      return exercise.with({
        plannedSets: sets.map((set) => ({ reps: { ...set.reps } })),
      });
  }
}

/** Replace the targets of one set (per-set grid edits). */
export function updateWeightedSet(
  exercise: WeightedExerciseBlueprint,
  index: number,
  reps: { min: number; max: number },
): WeightedExerciseBlueprint {
  return exercise.with({
    plannedSets: exercise.plannedSets.map((set, i) => (i === index ? { reps: { ...reps } } : set)),
  });
}

/** Add a cardio set copying the last set's configuration (legacy behavior). */
export function addCardioSet(exercise: CardioExerciseBlueprint): CardioExerciseBlueprint {
  const last = exercise.sets[exercise.sets.length - 1] ?? CardioExerciseSetBlueprint.empty();
  return exercise.with({ sets: [...exercise.sets, last] });
}

/** Remove exactly the set at `index`; never below one set. */
export function removeCardioSet(exercise: CardioExerciseBlueprint, index: number): CardioExerciseBlueprint {
  if (exercise.sets.length <= 1) {
    return exercise;
  }
  return exercise.with({ sets: exercise.sets.filter((_, i) => i !== index) });
}

/**
 * Inline catalog search for S6: fuzzy-ranked descriptors, best first,
 * capped. Returns an empty list for a blank query.
 */
export function searchExercises(
  catalog: Record<string, ExerciseDescriptor>,
  query: string,
  limit = 8,
): ExerciseDescriptor[] {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }
  return Object.values(catalog)
    .map((descriptor) => ({ descriptor, score: fuzzyMatchScore(trimmed, descriptor.name) }))
    .filter((entry): entry is { descriptor: ExerciseDescriptor; score: number } => entry.score !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.descriptor);
}

/** "Equipment · Muscle" subtitle for a search result row; undefined when neither is known. */
export function searchResultSubtitle(descriptor: ExerciseDescriptor): { equipment?: string; muscle?: string } {
  return {
    equipment: descriptor.equipment ?? undefined,
    muscle: descriptor.muscles[0],
  };
}

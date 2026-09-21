import type { ExerciseDescriptor } from '@/models/exercise-models';
import { normalizeExerciseName } from '@/models/blueprint-models';
import type { WeightedExerciseStatistics } from '@/store/stats';

/**
 * The exercise picker's data model.
 *
 * The picker joins two sources:
 *  - the exercise library (`selectExercises` from stored-sessions: built-in +
 *    custom exercises, with muscle/equipment metadata), which defines the full
 *    A-Z list and the real library count, and
 *  - per-exercise stats (`weightedExerciseStats`), which supply the recorded
 *    session counts.
 *
 * Everything here is pure and UI-free so it can be unit-tested.
 */

export interface PickerExercise {
  /** Stable id: the library id, or `stats:<normalized-name>` for stats-only entries. */
  id: string;
  name: string;
  /** Primary muscles first, then secondary (mirrors ExerciseDescriptor.muscles). */
  muscles: string[];
  equipment: string | null;
  /** Number of recorded sessions; 0 when the exercise has no stats. */
  sessionCount: number;
}

export type MuscleFilter = 'all' | 'chest' | 'back' | 'legs' | 'shoulders' | 'arms';

export const MUSCLE_FILTERS: readonly MuscleFilter[] = ['all', 'chest', 'back', 'legs', 'shoulders', 'arms'];

/** Muscle vocabulary (as stored on ExerciseDescriptor.muscles) per filter chip. */
const FILTER_MUSCLES: Record<Exclude<MuscleFilter, 'all'>, readonly string[]> = {
  chest: ['chest'],
  back: ['lats', 'middle back', 'lower back'],
  legs: ['quadriceps', 'hamstrings', 'glutes', 'calves', 'abductors', 'adductors'],
  shoulders: ['shoulders', 'traps', 'neck'],
  arms: ['biceps', 'triceps', 'forearms'],
};

const MUSCLE_DISPLAY_NAMES: Record<string, string> = {
  chest: 'Chest',
  shoulders: 'Shoulders',
  biceps: 'Biceps',
  triceps: 'Triceps',
  forearms: 'Forearms',
  quadriceps: 'Quads',
  hamstrings: 'Hamstrings',
  glutes: 'Glutes',
  calves: 'Calves',
  lats: 'Lats',
  'middle back': 'Back',
  'lower back': 'Lower Back',
  traps: 'Traps',
  abdominals: 'Abs',
  abductors: 'Abductors',
  adductors: 'Adductors',
  neck: 'Neck',
};

export function muscleDisplayName(muscle: string): string {
  return MUSCLE_DISPLAY_NAMES[muscle] ?? muscle.charAt(0).toUpperCase() + muscle.slice(1);
}

export function equipmentDisplayName(equipment: string): string {
  return equipment.charAt(0).toUpperCase() + equipment.slice(1);
}

export type ExerciseGlyph = 'dumbbell' | 'leg' | 'pull';

export interface ExerciseTint {
  /** Icon-tile fill color. */
  tile: string;
  /** Tile fill opacity, per the reference spec. */
  tileAlpha: number;
  /** Glyph color. */
  icon: string;
  glyph: ExerciseGlyph;
}

type MuscleGroup = Exclude<MuscleFilter, 'all'> | 'other';

const GROUP_TINTS: Record<MuscleGroup, { tile: string; tileAlpha: number; icon: string }> = {
  // Measured off the reference: bench (chest) #FF2D55 @ .15 / #FF6A88, deadlift
  // (back) #AF52DE @ .16 / #C77DFF, squat (legs) #0A84FF @ .16 / #5EB0FF,
  // shoulder press #FF9F0A @ .15 / #FFB84D, row (arms) #30D158 @ .15 / #4ADE80.
  chest: { tile: '#FF2D55', tileAlpha: 0.15, icon: '#FF6A88' },
  back: { tile: '#AF52DE', tileAlpha: 0.16, icon: '#C77DFF' },
  legs: { tile: '#0A84FF', tileAlpha: 0.16, icon: '#5EB0FF' },
  shoulders: { tile: '#FF9F0A', tileAlpha: 0.15, icon: '#FFB84D' },
  arms: { tile: '#30D158', tileAlpha: 0.15, icon: '#4ADE80' },
  other: { tile: '#8E8E93', tileAlpha: 0.15, icon: '#AEAEB2' },
};

/** Group of an exercise, derived from its primary (first) muscle. */
export function muscleGroupOf(exercise: Pick<PickerExercise, 'muscles'>): MuscleGroup {
  const primary = exercise.muscles[0];
  if (!primary) {
    return 'other';
  }
  for (const [group, members] of Object.entries(FILTER_MUSCLES) as [Exclude<MuscleFilter, 'all'>, readonly string[]][]) {
    if (members.includes(primary)) {
      return group;
    }
  }
  return 'other';
}

/** Icon-tile tint + glyph for an exercise, derived from its primary muscle. */
export function tintForExercise(exercise: Pick<PickerExercise, 'muscles'>): ExerciseTint {
  const group = muscleGroupOf(exercise);
  const tint = GROUP_TINTS[group];
  const glyph: ExerciseGlyph = group === 'legs' ? 'leg' : group === 'back' ? 'pull' : 'dumbbell';
  return { ...tint, glyph };
}

/**
 * Leading subtitle parts for a row, before the "{n} sessions" tail.
 * Pinned/recent rows show up to two muscles; ALL EXERCISES rows show the
 * equipment plus the primary muscle (e.g. "Dumbbell · Shoulders").
 */
export function rowLeadingParts(exercise: PickerExercise, includeEquipment: boolean): string[] {
  const parts: string[] = [];
  const equipment =
    includeEquipment && exercise.equipment && exercise.equipment !== 'body only'
      ? equipmentDisplayName(exercise.equipment)
      : null;
  if (equipment) {
    parts.push(equipment);
  }
  const muscleBudget = equipment ? 1 : 2;
  for (const muscle of exercise.muscles.slice(0, muscleBudget)) {
    parts.push(muscleDisplayName(muscle));
  }
  return parts;
}

/** Recorded sessions for one stats entry: one entry per session per exercise. */
export function sessionCountFor(stat: WeightedExerciseStatistics): number {
  return stat.maxLiftedPerSessionStatistics.statistics.length;
}

/**
 * Join the exercise library with recorded session counts. Exercises that only
 * exist in stats (recorded under a name with no library entry) are appended
 * with empty muscle metadata so they stay reachable.
 */
export function buildPickerExercises(
  exercises: Record<string, ExerciseDescriptor>,
  stats: WeightedExerciseStatistics[],
): PickerExercise[] {
  const sessionCounts = new Map<string, number>();
  for (const stat of stats) {
    const key = normalizeExerciseName(stat.exerciseName);
    sessionCounts.set(key, (sessionCounts.get(key) ?? 0) + sessionCountFor(stat));
  }

  const seen = new Set<string>();
  const result: PickerExercise[] = [];
  for (const [id, descriptor] of Object.entries(exercises)) {
    const key = normalizeExerciseName(descriptor.name);
    seen.add(key);
    result.push({
      id,
      name: descriptor.name,
      muscles: descriptor.muscles,
      equipment: descriptor.equipment,
      sessionCount: sessionCounts.get(key) ?? 0,
    });
  }
  for (const stat of stats) {
    const key = normalizeExerciseName(stat.exerciseName);
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push({
      id: `stats:${key}`,
      name: stat.exerciseName,
      muscles: [],
      equipment: null,
      sessionCount: sessionCounts.get(key) ?? 0,
    });
  }
  return result;
}

/**
 * PINNED has no pin concept in the model, so it is derived: the two exercises
 * with the most recorded sessions ("smart defaults"). Empty when nothing has
 * been recorded yet.
 */
export function pinnedExercises(exercises: PickerExercise[]): PickerExercise[] {
  return exercises
    .filter((x) => x.sessionCount > 0)
    .sort((a, b) => b.sessionCount - a.sessionCount || a.name.localeCompare(b.name))
    .slice(0, 2);
}

export function filterExercises(
  exercises: PickerExercise[],
  query: string,
  filter: MuscleFilter,
): PickerExercise[] {
  const q = query.trim().toLowerCase();
  return exercises.filter((exercise) => {
    if (q && !exercise.name.toLowerCase().includes(q)) {
      return false;
    }
    if (filter !== 'all') {
      const members = FILTER_MUSCLES[filter];
      if (!exercise.muscles.some((m) => members.includes(m))) {
        return false;
      }
    }
    return true;
  });
}

export interface AlphaSection {
  title: string;
  data: PickerExercise[];
}

/** A-Z sections for the ALL EXERCISES list; non-letters bucket under "#". */
export function groupByLetter(exercises: PickerExercise[]): AlphaSection[] {
  const sorted = [...exercises].sort((a, b) => a.name.localeCompare(b.name));
  const buckets = new Map<string, PickerExercise[]>();
  for (const exercise of sorted) {
    const first = exercise.name.charAt(0).toUpperCase();
    const title = first >= 'A' && first <= 'Z' ? first : '#';
    const bucket = buckets.get(title);
    if (bucket) {
      bucket.push(exercise);
    } else {
      buckets.set(title, [exercise]);
    }
  }
  return [...buckets.entries()]
    .sort(([a], [b]) => (a === '#' ? 1 : b === '#' ? -1 : a.localeCompare(b)))
    .map(([title, data]) => ({ title, data }));
}

export type PickerSection =
  | { kind: 'pinned'; title: string; data: PickerExercise[] }
  | { kind: 'recent'; title: string; data: PickerExercise[] }
  | { kind: 'alpha'; title: string; data: PickerExercise[] };

/**
 * Assemble the SectionList sections. The pinned/recent shortcut sections are
 * only shown in the unfiltered state; once the user searches or picks a muscle
 * chip the list becomes pure A-Z results.
 */
export function buildSections(options: {
  pinned: PickerExercise[];
  recent: PickerExercise[];
  alpha: AlphaSection[];
  showShortcuts: boolean;
}): PickerSection[] {
  const sections: PickerSection[] = [];
  if (options.showShortcuts) {
    if (options.pinned.length > 0) {
      sections.push({ kind: 'pinned', title: 'PINNED', data: options.pinned });
    }
    if (options.recent.length > 0) {
      sections.push({ kind: 'recent', title: 'RECENTLY VIEWED', data: options.recent });
    }
  }
  for (const section of options.alpha) {
    sections.push({ kind: 'alpha', title: section.title, data: section.data });
  }
  return sections;
}

/** The A-Z scrubber always shows the full alphabet; taps resolve to sections. */
export const SCRUBBER_LETTERS: readonly string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

/** Resolve a scrubber letter to an alpha section index (exact, else nearest). */
export function sectionIndexForLetter(sections: PickerSection[], letter: string): number {
  let best = -1;
  let bestDistance = Number.MAX_SAFE_INTEGER;
  sections.forEach((section, index) => {
    if (section.kind !== 'alpha') {
      return;
    }
    const distance = Math.abs(section.title.charCodeAt(0) - letter.charCodeAt(0));
    if (distance < bestDistance) {
      bestDistance = distance;
      best = index;
    }
  });
  return best;
}

/** Look an exercise up by name (exact, then normalized) for selection display. */
export function findExerciseByName(
  exercises: PickerExercise[],
  name: string,
): PickerExercise | undefined {
  const exact = exercises.find((x) => x.name === name);
  if (exact) {
    return exact;
  }
  const key = normalizeExerciseName(name);
  return exercises.find((x) => normalizeExerciseName(x.name) === key);
}

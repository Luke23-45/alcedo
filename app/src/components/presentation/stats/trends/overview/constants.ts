/**
 * Trends overview — domain constants.
 *
 * The muscle normalization map and target bands are the documented "missing
 * things" decisions for the Muscle Group Load section:
 *
 * - Raw muscle names come from `WeightedExerciseBlueprint.muscles[0]` (the
 *   primary muscle of each recorded exercise). Names are lowercased before
 *   lookup; anything unmapped is ignored by the chart rather than guessed at.
 * - The six displayed rows are fixed by the reference spec. Accessory groups
 *   (glutes, biceps, triceps/arms) map to `null`: their sets still count toward
 *   session volume everywhere else, but they have no row in this chart —
 *   exactly like the spec, whose 6 rows sum to 63 of the 87-set ledger.
 * - `DEFAULT_MUSCLE_TARGET_BANDS` is NOT in the data model. These bands were
 *   reverse-engineered from the spec SVG's band-rect geometry:
 *   band x-position ÷ 13.375 pt/set (321 pt track / 24 sets), giving
 *   Chest 10–20, Back 10–20, Shoulders 8–16, Quads 8–18, Hamstrings 6–14,
 *   Calves 6–14. They are labelled defaults, not user targets.
 */

export type CanonicalMuscleGroup =
  'Chest' | 'Back' | 'Shoulders' | 'Quads' | 'Hamstrings' | 'Calves';

export const MUSCLE_GROUP_ROWS: readonly CanonicalMuscleGroup[] = [
  'Chest',
  'Back',
  'Shoulders',
  'Quads',
  'Hamstrings',
  'Calves',
];

/**
 * Raw (lowercased) muscle name → canonical display group, or `null` when the
 * muscle has no row in the 6-row chart. `null` entries exist so the mapping is
 * total and deliberate — never an accidental miss.
 */
export const MUSCLE_NORMALIZATION_MAP: Readonly<
  Record<string, CanonicalMuscleGroup | null>
> = {
  // Chest
  chest: 'Chest',
  pectorals: 'Chest',
  pecs: 'Chest',
  // Back
  back: 'Back',
  lats: 'Back',
  latissimus: 'Back',
  traps: 'Back',
  trapezius: 'Back',
  rhomboids: 'Back',
  // Shoulders (front/side/rear delts all roll up here)
  shoulders: 'Shoulders',
  shoulder: 'Shoulders',
  delts: 'Shoulders',
  deltoids: 'Shoulders',
  'front delt': 'Shoulders',
  'front delts': 'Shoulders',
  'side delt': 'Shoulders',
  'side delts': 'Shoulders',
  'rear delt': 'Shoulders',
  'rear delts': 'Shoulders',
  'anterior deltoid': 'Shoulders',
  'lateral deltoid': 'Shoulders',
  'posterior deltoid': 'Shoulders',
  // Quads
  quads: 'Quads',
  quadriceps: 'Quads',
  quad: 'Quads',
  // Hamstrings
  hamstrings: 'Hamstrings',
  hamstring: 'Hamstrings',
  hams: 'Hamstrings',
  // Calves
  calves: 'Calves',
  calf: 'Calves',
  gastrocnemius: 'Calves',
  soleus: 'Calves',
  // Accessory groups: no display row in the 6-row chart (see module doc).
  glutes: null,
  glute: null,
  biceps: null,
  bicep: null,
  triceps: null,
  tricep: null,
  arms: null,
  forearms: null,
  forearm: null,
  abs: null,
  core: null,
  obliques: null,
};

/** Weekly set targets per muscle group — defaults extracted from the spec SVG geometry. */
export const DEFAULT_MUSCLE_TARGET_BANDS: Readonly<
  Record<CanonicalMuscleGroup, { low: number; high: number }>
> = {
  Chest: { low: 10, high: 20 },
  Back: { low: 10, high: 20 },
  Shoulders: { low: 8, high: 16 },
  Quads: { low: 8, high: 18 },
  Hamstrings: { low: 6, high: 14 },
  Calves: { low: 6, high: 14 },
};

/** The bar track spans 0–24 sets (spec: 321 pt / 24 sets = 13.375 pt/set). */
export const MUSCLE_TRACK_MAX_SETS = 24;

export type TrendRange = '7D' | '4W' | '6M' | '1Y' | 'ALL';

export const TREND_RANGES: readonly TrendRange[] = [
  '7D',
  '4W',
  '6M',
  '1Y',
  'ALL',
];

/** Alias used by the range selector. */
export const RANGES: readonly TrendRange[] = TREND_RANGES;

/** Equipment words stripped when deriving a lift's short display name. */
const EQUIPMENT_PREFIXES = [
  'barbell ',
  'dumbbell ',
  'seated ',
  'standing ',
  'cable ',
  'machine ',
  'smith ',
  'ez-bar ',
  'incline ',
  'decline ',
];

/** "Barbell Bench Press" → "Bench Press". Falls back to the full name. */
export function shortLiftName(exerciseName: string): string {
  const lowered = exerciseName.toLowerCase();
  for (const prefix of EQUIPMENT_PREFIXES) {
    if (lowered.startsWith(prefix)) {
      return exerciseName.slice(prefix.length).trim() || exerciseName;
    }
  }
  return exerciseName;
}

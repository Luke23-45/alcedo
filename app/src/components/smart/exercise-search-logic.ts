import { fuzzyMatchScore } from '@/components/presentation/workout-editor/exercise-fuzzy-match';
import { ExerciseDescriptor } from '@/models/exercise-models';

/**
 * Pure search/filter/suggestion logic for the exercise search screen
 * (`components/smart/exercise-search.tsx`). RN-free so simulation tests can
 * import it directly.
 */

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export type FilterInput = {
  text: string;
  muscles: string[];
  equipment: string[];
};

export function computeFiltered(exercises: Record<string, ExerciseDescriptor>, input: FilterInput) {
  const trimmed = input.text.trim();
  const pattern = escapeRegExp(trimmed);
  const fullMatch = new RegExp('^' + pattern + '$', 'i');
  let hasExactMatch = false;
  const scored = Object.entries(exercises)
    .map(([id, exercise]) => ({
      id,
      exercise,
      score: trimmed ? fuzzyMatchScore(pattern, exercise.name) : 0,
    }))
    .filter(
      (x) =>
        (!input.muscles.length || x.exercise.muscles.some((m) => input.muscles.includes(m))) &&
        (!input.equipment.length || (x.exercise.equipment != null && input.equipment.includes(x.exercise.equipment))) &&
        (!trimmed || x.score !== null),
    )
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0) || a.exercise.name.localeCompare(b.exercise.name));
  for (const x of scored) {
    if (!hasExactMatch && trimmed && fullMatch.test(x.exercise.name)) {
      hasExactMatch = true;
    }
  }
  const suggested: ExerciseDescriptor | null =
    !hasExactMatch && trimmed
      ? {
          name: trimmed,
          category: '',
          equipment: null,
          force: null,
          instructions: '',
          level: '',
          mechanic: '',
          muscles: [...input.muscles],
        }
      : null;
  return { ids: scored.map((x) => x.id), suggested };
}

/**
 * The reference frames suggestions as "SUGGESTED FOR PUSH DAY". The route has
 * no plan context, so the day is read off the reference exercise's muscles —
 * push for chest/shoulders/triceps, pull for back/biceps, legs for lower body.
 */
const PUSH_MUSCLES = new Set(['chest', 'shoulders', 'triceps']);
const PULL_MUSCLES = new Set(['lats', 'middle_back', 'lower_back', 'biceps', 'traps', 'forearms']);
const LEG_MUSCLES = new Set(['quadriceps', 'hamstrings', 'glutes', 'calves', 'abductors', 'adductors']);

export type SuggestionDay = 'push' | 'pull' | 'legs';

export function dayForMuscles(muscles: string[]): SuggestionDay | null {
  let push = 0;
  let pull = 0;
  let legs = 0;
  for (const m of muscles) {
    if (PUSH_MUSCLES.has(m)) {
      push++;
    } else if (PULL_MUSCLES.has(m)) {
      pull++;
    } else if (LEG_MUSCLES.has(m)) {
      legs++;
    }
  }
  if (push === 0 && pull === 0 && legs === 0) {
    return null;
  }
  if (push >= pull && push >= legs) {
    return 'push';
  }
  return pull >= legs ? 'pull' : 'legs';
}

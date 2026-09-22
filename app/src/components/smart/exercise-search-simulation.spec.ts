/**
 * Page 21/20 — Exercise search simulation (`/exercise-search`).
 *
 * The screen is a full library search with muscle/equipment filter chips,
 * recents, "suggested for push/pull/leg day" and a create-custom row. React
 * Native is stubbed in this repo's test setup, so coverage runs at the
 * logic level — the same pattern as pages 13–20:
 *
 * A. Filter engine: fuzzy match, exact-match detection (hides the
 *    create-custom row), muscle/equipment filters, empty-query behavior.
 * B. Suggestion day bucketing: push/pull/legs/null + tie-breaking.
 * C. Recents: dedup, cap, clear (store/app reducer).
 * D. Request/result flow: setExerciseSearchResult / clearExerciseSearchResult.
 * E. Catalog staleness guard: the committed query is tracked so a catalog
 *    reload (language change / late hydration) re-resolves results.
 * F. i18n completeness over the screen source.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { computeFiltered, dayForMuscles } from '@/components/smart/exercise-search-logic';
import { ExerciseDescriptor } from '@/models/exercise-models';
import appReducer, {
  clearExerciseSearchResult,
  clearRecentExerciseSearches,
  recordRecentExerciseSearch,
  setExerciseSearchResult,
} from '@/store/app';

const SRC = resolve(__dirname, '..', '..');

const descriptor = (overrides: Partial<ExerciseDescriptor> = {}): ExerciseDescriptor => ({
  name: 'Bench Press',
  category: '',
  equipment: 'barbell',
  force: null,
  instructions: '',
  level: '',
  mechanic: '',
  muscles: ['chest', 'triceps'],
  ...overrides,
});

const library = (): Record<string, ExerciseDescriptor> => ({
  a: descriptor({ name: 'Bench Press', equipment: 'barbell', muscles: ['chest', 'triceps'] }),
  b: descriptor({ name: 'Incline Dumbbell Press', equipment: 'dumbbell', muscles: ['chest', 'shoulders'] }),
  c: descriptor({ name: 'Cable Crossover', equipment: 'cable', muscles: ['chest'] }),
  d: descriptor({ name: 'Barbell Squat', equipment: 'barbell', muscles: ['quadriceps', 'glutes'] }),
});

describe('filter engine', () => {
  it('fuzzy-matches names and ranks better matches first', () => {
    const { ids, suggested } = computeFiltered(library(), { text: 'press', muscles: [], equipment: [] });
    expect(ids).toContain('a');
    expect(ids).toContain('b');
    // "Bench Press" ends with the query; it outranks the mid-name match.
    expect(ids.indexOf('a')).toBeLessThan(ids.indexOf('b'));
    expect(suggested).not.toBeNull();
  });

  it('hides the create-custom suggestion on an exact (case-insensitive) match', () => {
    const exact = computeFiltered(library(), { text: 'bench press', muscles: [], equipment: [] });
    expect(exact.suggested).toBeNull();
    const near = computeFiltered(library(), { text: 'bench pres', muscles: [], equipment: [] });
    expect(near.suggested?.name).toBe('bench pres');
  });

  it('seeds the custom suggestion with the active muscle filters', () => {
    const { suggested } = computeFiltered(library(), { text: 'my lift', muscles: ['chest'], equipment: [] });
    expect(suggested?.muscles).toEqual(['chest']);
  });

  it('filters by muscle and equipment independently', () => {
    const byMuscle = computeFiltered(library(), { text: '', muscles: ['quadriceps'], equipment: [] });
    expect(byMuscle.ids).toEqual(['d']);
    const byEquipment = computeFiltered(library(), { text: '', muscles: [], equipment: ['cable'] });
    expect(byEquipment.ids).toEqual(['c']);
    const both = computeFiltered(library(), { text: '', muscles: ['chest'], equipment: ['barbell'] });
    expect(both.ids).toEqual(['a']);
  });

  it('returns the whole library (no create row) on an empty query without filters', () => {
    const { ids, suggested } = computeFiltered(library(), { text: '', muscles: [], equipment: [] });
    expect(ids).toHaveLength(4);
    expect(suggested).toBeNull();
  });

  it('treats regex metacharacters in the query as literals', () => {
    const { ids } = computeFiltered(library(), { text: 'bench (press)', muscles: [], equipment: [] });
    expect(ids).not.toContain('a');
  });
});

describe('suggestion day bucketing', () => {
  it('buckets push, pull, legs and unknown muscle sets', () => {
    expect(dayForMuscles(['chest', 'shoulders', 'triceps'])).toBe('push');
    expect(dayForMuscles(['lats', 'biceps'])).toBe('pull');
    expect(dayForMuscles(['quadriceps', 'glutes', 'calves'])).toBe('legs');
    expect(dayForMuscles(['neck'])).toBeNull();
    expect(dayForMuscles([])).toBeNull();
  });

  it('breaks ties deterministically toward push, then pull', () => {
    expect(dayForMuscles(['chest', 'lats'])).toBe('push');
    expect(dayForMuscles(['lats', 'quadriceps'])).toBe('pull');
  });
});

describe('recents', () => {
  it('dedups, most-recent-first, and caps the stored list', () => {
    let state = appReducer(undefined, recordRecentExerciseSearch('a'));
    state = appReducer(state, recordRecentExerciseSearch('b'));
    state = appReducer(state, recordRecentExerciseSearch('a'));
    expect(state.recentExerciseSearchIds[0]).toBe('a');
    expect(state.recentExerciseSearchIds.filter((x) => x === 'a')).toHaveLength(1);
    for (let i = 0; i < 30; i++) {
      state = appReducer(state, recordRecentExerciseSearch(`x${i}`));
    }
    expect(state.recentExerciseSearchIds).toHaveLength(5);
  });

  it('clears recents', () => {
    let state = appReducer(undefined, recordRecentExerciseSearch('a'));
    state = appReducer(state, clearRecentExerciseSearches());
    expect(state.recentExerciseSearchIds).toEqual([]);
  });
});

describe('request/result flow', () => {
  it('delivers the picked exercise to the requesting searcher and clears', () => {
    const exercise = descriptor({ name: 'Bench Press' });
    let state = appReducer(undefined, setExerciseSearchResult({ requestId: 'req-1', exercise }));
    expect(state.exerciseSearchResult?.requestId).toBe('req-1');
    expect(state.exerciseSearchResult?.exercise.name).toBe('Bench Press');
    state = appReducer(state, clearExerciseSearchResult());
    expect(state.exerciseSearchResult).toBeUndefined();
  });
});

describe('catalog staleness guard', () => {
  it('tracks the committed query so a catalog reload can re-resolve it', () => {
    const source = readFileSync(join(SRC, 'components', 'smart', 'exercise-search.tsx'), 'utf8');
    expect(source).toMatch(/committedInput\.current = input/);
    expect(source).toMatch(/computeFiltered\(exercises, committedInput\.current\)/);
  });
});

describe('exercise-search i18n completeness', () => {
  it('resolves every key used by the screen in en.json', () => {
    const en = JSON.parse(readFileSync(join(SRC, 'i18n', 'en.json'), 'utf8')) as Record<string, unknown>;
    const source = readFileSync(join(SRC, 'components', 'smart', 'exercise-search.tsx'), 'utf8');
    const keys = new Set<string>();
    for (const m of source.matchAll(/(?:(?<![\w$])t)\('([^']+)'/g)) {
      keys.add(m[1]!);
    }
    // Dynamic suggestion-header keys live in a lookup table, not in t() calls.
    keys.add('exercise.search.suggested_push');
    keys.add('exercise.search.suggested_pull');
    keys.add('exercise.search.suggested_legs');
    expect(keys.size).toBeGreaterThan(0);
    const missing = [...keys].filter((k) => !(k in en));
    expect(missing).toEqual([]);
  });
});

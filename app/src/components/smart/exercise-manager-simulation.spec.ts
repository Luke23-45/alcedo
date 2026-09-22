/**
 * Page 23/24 — Manage exercises simulation (`/settings/manage-exercises`).
 *
 * Thin route + new-design chrome around the legacy `ExerciseManager`
 * (Paper list, swipe-to-delete, accordion edit sheets, snackbar undo).
 * The pure decision logic lives in RN-free `exercise-manager-logic.ts`:
 *
 * A. New-exercise descriptor factory shape.
 * B. Undo-action matrix: built-ins (tombstoned) undo via restoreExercise;
 *    user exercises undo by re-inserting the saved copy.
 * C. Reducer round-trips: delete → undo restores the exercise in both cases.
 * D. Empty states: first-frame (pre-mount) shows no empty row; an empty
 *    library and a filter with no matches each get honest copy.
 * E. i18n completeness over the manager sources.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { buildUndoAction, newExerciseDescriptor } from '@/components/smart/exercise-manager-logic';
import { ExerciseDescriptor } from '@/models/exercise-models';
import {
  deleteExercise,
  restoreExercise,
  setBuiltInExercises,
  storedSessionsReducer,
  updateExercise,
} from '@/store/stored-sessions';

const SRC = resolve(__dirname, '..', '..');

const descriptor = (name: string): ExerciseDescriptor => ({ ...newExerciseDescriptor(), name });

describe('new exercise descriptor', () => {
  it('starts blank, named, and beginner', () => {
    const d = newExerciseDescriptor();
    expect(d.name).toBe('New exercise');
    expect(d.muscles).toEqual([]);
    expect(d.instructions).toBe('');
    expect(d.level).toBe('beginner');
    expect(d.equipment).toBeNull();
  });
});

describe('undo action matrix', () => {
  const id = 'ex-1';
  const saved = descriptor('Squat');

  it('lifts the tombstone for a built-in', () => {
    const action = buildUndoAction(id, { isBuiltIn: true, savedExercise: undefined });
    expect(action.type).toBe(restoreExercise.type);
    expect(action.payload).toBe(id);
  });

  it('lifts the tombstone for a built-in the user edited (override row kept)', () => {
    const action = buildUndoAction(id, { isBuiltIn: true, savedExercise: saved });
    expect(action.type).toBe(restoreExercise.type);
  });

  it('re-inserts the saved copy for a user exercise', () => {
    const action = buildUndoAction(id, { isBuiltIn: false, savedExercise: saved });
    expect(action.type).toBe(updateExercise.type);
    expect(action.payload).toEqual({ id, exercise: saved });
  });

  it('falls back to restoreExercise when a non-built-in has no saved copy', () => {
    const action = buildUndoAction(id, { isBuiltIn: false, savedExercise: undefined });
    expect(action.type).toBe(restoreExercise.type);
  });
});

describe('delete/undo reducer round-trips', () => {
  const init = storedSessionsReducer(undefined, { type: '@@init' } as never);

  it('built-in: delete tombstones, undo un-tombstones', () => {
    const id = 'builtin-squat';
    let s = storedSessionsReducer(init, setBuiltInExercises({ [id]: descriptor('Squat') }));
    s = storedSessionsReducer(s, deleteExercise(id));
    expect(s.hiddenBuiltInIds).toContain(id);
    expect(s.builtInExercises[id]).toBeDefined();

    const undo = buildUndoAction(id, { isBuiltIn: true, savedExercise: undefined });
    s = storedSessionsReducer(s, undo);
    expect(s.hiddenBuiltInIds).not.toContain(id);
  });

  it('user exercise: delete removes, undo re-inserts the saved copy', () => {
    const id = 'user-lunge';
    const saved = descriptor('Lunge');
    let s = storedSessionsReducer(init, updateExercise({ id, exercise: saved }));
    s = storedSessionsReducer(s, deleteExercise(id));
    expect(s.savedExercises[id]).toBeUndefined();

    const undo = buildUndoAction(id, { isBuiltIn: false, savedExercise: saved });
    s = storedSessionsReducer(s, undo);
    expect(s.savedExercises[id]).toEqual(saved);
  });

  it('edited built-in: delete keeps the override, undo restores both', () => {
    const id = 'builtin-bench';
    const override = descriptor('Bench (wide grip)');
    let s = storedSessionsReducer(init, setBuiltInExercises({ [id]: descriptor('Bench Press') }));
    s = storedSessionsReducer(s, updateExercise({ id, exercise: override }));
    s = storedSessionsReducer(s, deleteExercise(id));
    expect(s.savedExercises[id]).toEqual(override);
    expect(s.hiddenBuiltInIds).toContain(id);

    const undo = buildUndoAction(id, { isBuiltIn: true, savedExercise: override });
    s = storedSessionsReducer(s, undo);
    expect(s.hiddenBuiltInIds).not.toContain(id);
    expect(s.savedExercises[id]).toEqual(override);
  });
});

describe('empty states', () => {
  const source = () => readFileSync(join(SRC, 'components', 'smart', 'exercise-manager.tsx'), 'utf8');

  it('does not flash the empty row on the pre-mount frame', () => {
    expect(source()).toMatch(/filtersInitialized && filteredExerciseIds\.length === 0/);
  });

  it('distinguishes an empty library from a filter with no matches', () => {
    const s = source();
    expect(s).toMatch(/generic\.nothing_here_yet\.message/);
    expect(s).toMatch(/exercise\.search\.no_results/);
  });

  it('gives every row a unique testID', () => {
    const s = source();
    expect(s).toMatch(/testID=\{`exercise-delete-btn-\$\{exerciseId\}`\}/);
    expect(s).toMatch(/testID=\{`exercise-accordion-\$\{exerciseId\}`\}/);
    expect(s).not.toMatch(/testID=\{`exercise-delete-btn`\}/);
  });
});

describe('manage-exercises i18n completeness', () => {
  it('resolves every key used by the manager and its chrome in en.json', () => {
    const en = JSON.parse(readFileSync(join(SRC, 'i18n', 'en.json'), 'utf8')) as Record<string, unknown>;
    const keys = new Set<string>();
    for (const file of [
      join('components', 'smart', 'exercise-manager.tsx'),
      join('components', 'presentation', 'settings', 'programs', 'exercise-manager-screen.tsx'),
      join('app', '(tabs)', 'settings', 'manage-exercises.tsx'),
    ]) {
      const source = readFileSync(join(SRC, file), 'utf8');
      for (const m of source.matchAll(/(?:(?<![\w$])t|settingsKey)\('([^']+)'/g)) {
        keys.add(m[1]!);
      }
    }
    expect(keys.size).toBeGreaterThan(0);
    const missing = [...keys].filter((k) => !(k in en));
    expect(missing).toEqual([]);
  });
});

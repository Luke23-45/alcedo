import { Duration, LocalDate } from '@js-joda/core';
import { describe, expect, it, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';

vi.mock('expo-localization', () => ({
  getLocales: () => [{ decimalSeparator: '.' }],
}));

import type { UseTranslateResult } from '@tolgee/react';
import { ProgramBlueprint, Rest, SessionBlueprint } from '@/models/blueprint-models';
import { diffSessionBlueprints, SessionBlueprintDiff } from '@/models/blueprint-diff';
import { Session } from '@/models/session-models/session';
import { makeWeightedBlueprint } from '@/models/session-models/__test__/helpers';
import {
  createAddNewWorkoutDiff,
  createUpdateExistingWorkoutDiff,
  defaultSelection,
  describeChange,
  selectedCount,
  selectedDiff,
  toggleSelected,
} from './plan-diff-logic';
import programReducer, { applyDiffToPlan, savePlan } from '@/store/program';
import { getPlanDiff } from '@/store/program/helpers';

// Deterministic stub: echoes the key and params so assertions stay honest
// about which strings the logic requests.
const t = ((key: string, params?: Record<string, string | number>) =>
  params ? `${key}(${JSON.stringify(params)})` : key) as unknown as UseTranslateResult['t'];

const rest60: Rest = {
  minRest: Duration.ofSeconds(60),
  maxRest: Duration.ofSeconds(90),
  failureRest: Duration.ofSeconds(180),
};
const rest120: Rest = {
  minRest: Duration.ofSeconds(120),
  maxRest: Duration.ofSeconds(180),
  failureRest: Duration.ofSeconds(300),
};

/**
 * The reference scenario from docs/new_design/diff-save-redesign.md:
 * Push Day gains Incline Dumbbell Press, loses Pec Deck, Bench goes
 * 4→5 sets with rest 90→120 s, and the notes change.
 */
function referenceOriginal(): SessionBlueprint {
  return new SessionBlueprint(
    'Push Day',
    [
      makeWeightedBlueprint({ name: 'Barbell Bench Press', sets: 4, repsConfig: { type: 'fixed', reps: 10 } }),
      makeWeightedBlueprint({
        name: 'Pec Deck',
        sets: 3,
        repsConfig: { type: 'fixed', reps: 12 },
        restBetweenSets: rest60,
      }),
    ],
    'Old notes',
  );
}

function referenceModified(): SessionBlueprint {
  return new SessionBlueprint(
    'Push Day',
    [
      makeWeightedBlueprint({
        name: 'Barbell Bench Press',
        sets: 5,
        repsConfig: { type: 'fixed', reps: 10 },
        restBetweenSets: rest120,
      }),
      makeWeightedBlueprint({
        name: 'Incline Dumbbell Press',
        sets: 3,
        repsConfig: { type: 'fixed', reps: 8 },
        restBetweenSets: Rest.medium,
      }),
    ],
    'Line one\nLine two\nLine three',
  );
}

function finishedSession(blueprint: SessionBlueprint): Session {
  return new Session(uuid(), blueprint, [], LocalDate.of(2026, 9, 22), undefined, undefined);
}

function makeStore() {
  return configureStore({
    reducer: { program: programReducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }),
  });
}

function planWith(sessions: SessionBlueprint[], name = 'Plan A'): ProgramBlueprint {
  return new ProgramBlueprint(name, sessions, LocalDate.of(2026, 9, 22));
}

describe('diff-save reference scenario', () => {
  it('groups the Push Day changes exactly as the reference: session, added, removed, modified', () => {
    const diff = diffSessionBlueprints(referenceOriginal(), referenceModified());
    expect(diff.hasChanges).toBe(true);
    expect(diff.sessionChanges.map((c) => c.kind)).toEqual(['sessionNotes']);
    expect(diff.addedExercises).toHaveLength(1);
    expect(diff.addedExercises[0]!.exercise.name).toBe('Incline Dumbbell Press');
    expect(diff.removedExercises).toHaveLength(1);
    expect(diff.removedExercises[0]!.exercise.name).toBe('Pec Deck');
    expect(diff.modifiedExercises).toHaveLength(1);
    expect(diff.modifiedExercises[0]!.exerciseName).toBe('Barbell Bench Press');
    expect(diff.modifiedExercises[0]!.changes.map((c) => c.kind)).toEqual(['exercisePlannedSets', 'exerciseRest']);
  });

  it('counts 5 selected: the locked session-name-free scenario matches the reference "5 SELECTED" chip', () => {
    const diff = diffSessionBlueprints(referenceOriginal(), referenceModified());
    expect(selectedCount(diff, defaultSelection(diff))).toBe(5);
  });

  it('describes the notes change with honest line/character counts', () => {
    const diff = diffSessionBlueprints(referenceOriginal(), referenceModified());
    const view = describeChange(t, diff.sessionChanges[0]!);
    expect(view.locked).toBe(false);
    expect(view.description).toContain('"lines":3');
    expect(view.description).toContain('"characters":28');
  });

  it('describes the added exercise with its real summary and an ADD chip', () => {
    const diff = diffSessionBlueprints(referenceOriginal(), referenceModified());
    const view = describeChange(t, diff.addedExercises[0]!);
    expect(view.titleTone).toBe('added');
    // "3 × 8 · 90 s rest" — computed from the real blueprint, never invented.
    expect(view.description).toContain('"sets":3');
    expect(view.description).toContain('\\"seconds\\":90');
    expect(view.deltaChip).toEqual({ text: 'ADD', tone: 'added' });
  });

  it('describes the removed exercise with its real summary and a REMOVE chip', () => {
    const diff = diffSessionBlueprints(referenceOriginal(), referenceModified());
    const view = describeChange(t, diff.removedExercises[0]!);
    expect(view.titleTone).toBe('removed');
    expect(view.description).toContain('\\"sets\\":3');
    expect(view.description).toMatch(/seconds.{0,8}60/);
    expect(view.deltaChip).toEqual({ text: 'REMOVE', tone: 'removed' });
  });

  it('shows the sets 4→5 transition with a +1 chip and the rest 90→120 s transition with a +30 S chip', () => {
    const diff = diffSessionBlueprints(referenceOriginal(), referenceModified());
    const [setsChange, restChange] = diff.modifiedExercises[0]!.changes;
    const setsView = describeChange(t, setsChange!);
    expect(setsView.transition?.oldText).toContain('"count":4');
    expect(setsView.transition?.newText).toContain('"count":5');
    expect(setsView.deltaChip).toEqual({ text: '+1', tone: 'added' });
    const restView = describeChange(t, restChange!);
    expect(restView.transition?.oldText).toContain('"seconds":90');
    expect(restView.transition?.newText).toContain('"seconds":120');
    expect(restView.deltaChip).toEqual({ text: '+30 S', tone: 'modified' });
  });

  it('shows same-count rep changes as a rep-scheme transition with no chip', () => {
    const original = new SessionBlueprint(
      'Push Day',
      [makeWeightedBlueprint({ name: 'Bench', sets: 3, repsConfig: { type: 'fixed', reps: 10 } })],
      '',
    );
    const modified = new SessionBlueprint(
      'Push Day',
      [makeWeightedBlueprint({ name: 'Bench', sets: 3, repsConfig: { type: 'fixed', reps: 12 } })],
      '',
    );
    const diff = diffSessionBlueprints(original, modified);
    expect(diff.modifiedExercises[0]!.changes).toHaveLength(1);
    const view = describeChange(t, diff.modifiedExercises[0]!.changes[0]!);
    expect(view.transition).toBeDefined();
    expect(view.deltaChip).toBeUndefined();
  });
});

describe('diff-save selection semantics', () => {
  function newModeDiff(): SessionBlueprintDiff {
    const pending = {
      type: 'add' as const,
      programId: 'plan-a',
      diff: diffSessionBlueprints(
        new SessionBlueprint('', [], ''),
        new SessionBlueprint('Workout 4', [makeWeightedBlueprint({ name: 'Squat' })], ''),
      ),
    };
    return createAddNewWorkoutDiff(pending, 'Workout 4');
  }

  it('the locked session-name row is never toggleable and never inflates the count', () => {
    const diff = newModeDiff();
    const locked = diff.sessionChanges.find((c) => c.kind === 'sessionName')!;
    const before = defaultSelection(diff);
    expect(toggleSelected(diff, before, locked.id)).toBe(before);
    expect(selectedCount(diff, before)).toBe(diff.allChanges.length - 1);
  });

  it('unchecking rows drops them from the committed diff, but the locked row is always applied', () => {
    const diff = diffSessionBlueprints(referenceOriginal(), referenceModified());
    let selected = defaultSelection(diff);
    const notesId = diff.sessionChanges[0]!.id;
    const removedId = diff.removedExercises[0]!.id;
    selected = toggleSelected(diff, selected, notesId);
    selected = toggleSelected(diff, selected, removedId);
    expect(selectedCount(diff, selected)).toBe(3);

    const committed = selectedDiff(diff, selected);
    expect(committed.sessionChanges).toHaveLength(0);
    expect(committed.removedExercises).toHaveLength(0);
    expect(committed.addedExercises).toHaveLength(1);
    expect(committed.modifiedExercises).toHaveLength(1);
  });

  it('save-as-new mode names the new workout and marks every exercise added', () => {
    const diff = newModeDiff();
    expect(diff.addedExercises).toHaveLength(1);
    expect(diff.removedExercises).toHaveLength(0);
    const nameChange = diff.sessionChanges.find((c) => c.kind === 'sessionName')!;
    expect(describeChange(t, nameChange).locked).toBe(true);
  });

  it('switching new → update recomputes from the preserved original references', () => {
    const pending = {
      type: 'diff' as const,
      programId: 'plan-a',
      sessionIndex: 0,
      diff: diffSessionBlueprints(referenceOriginal(), referenceModified()),
    };
    const newDiff = createAddNewWorkoutDiff(pending, 'Workout 4');
    expect(newDiff.addedExercises.length).toBeGreaterThan(0);

    const back = createUpdateExistingWorkoutDiff({ ...pending, diff: newDiff });
    expect(back.sessionChanges.map((c) => c.kind)).toEqual(['sessionNotes']);
    expect(back.addedExercises.map((c) => c.exercise.name)).toEqual(['Incline Dumbbell Press']);
    expect(back.removedExercises.map((c) => c.exercise.name)).toEqual(['Pec Deck']);
  });
});

describe('diff-save apply semantics (real store)', () => {
  const PLAN = 'plan-a';

  function storeWithPlan(sessions: SessionBlueprint[]) {
    const store = makeStore();
    store.dispatch(savePlan({ programId: PLAN, programBlueprint: planWith(sessions) }));
    return store;
  }

  function sessionsOf(store: ReturnType<typeof makeStore>) {
    return store.getState().program.savedPrograms[PLAN]!.sessions;
  }

  it('update mode applies only the selected changes to the matched workout', () => {
    const store = storeWithPlan([referenceOriginal()]);
    const diff = diffSessionBlueprints(referenceOriginal(), referenceModified());
    let selected = defaultSelection(diff);
    // The user unchecks "remove Pec Deck": the old exercise must survive.
    selected = toggleSelected(diff, selected, diff.removedExercises[0]!.id);
    const committed = selectedDiff(diff, selected);

    store.dispatch(applyDiffToPlan({ type: 'diff', programId: PLAN, sessionIndex: 0, diff: committed }));

    const [updated] = sessionsOf(store);
    expect(updated!.name).toBe('Push Day');
    // The added exercise lands at its session position (index 1), not appended.
    expect(updated!.exercises.map((e) => e.name)).toEqual([
      'Barbell Bench Press',
      'Incline Dumbbell Press',
      'Pec Deck',
    ]);
    const bench = updated!.exercises[0]!;
    expect(bench.type === 'WeightedExerciseBlueprint' && bench.plannedSets.length).toBe(5);
    expect(updated!.notes).toBe('Line one\nLine two\nLine three');
  });

  it('update mode finds the workout by name when the plan moved it between diff and confirm', () => {
    const other = new SessionBlueprint('Pull Day', [makeWeightedBlueprint({ name: 'Row' })], '');
    const store = storeWithPlan([referenceOriginal(), other]);
    const diff = diffSessionBlueprints(referenceOriginal(), referenceModified());
    const committed = selectedDiff(diff, defaultSelection(diff));

    // The plan was reordered after the diff was computed: Push Day moved 0 → 1.
    // The stale sessionIndex 0 must not land the changes on Pull Day.
    const current = store.getState().program.savedPrograms[PLAN]!;
    store.dispatch(
      savePlan({ programId: PLAN, programBlueprint: planWith([other, referenceOriginal()], current.name) }),
    );
    store.dispatch(applyDiffToPlan({ type: 'diff', programId: PLAN, sessionIndex: 0, diff: committed }));

    const sessions = sessionsOf(store);
    expect(sessions[0]!.name).toBe('Pull Day');
    expect(sessions[0]!.exercises.map((e) => e.name)).toEqual(['Row']);
    expect(sessions[1]!.exercises.map((e) => e.name)).toContain('Incline Dumbbell Press');
  });

  it('save-as-new appends a uniquely named workout and leaves every existing session alone', () => {
    const store = storeWithPlan([referenceOriginal()]);
    const pending = {
      type: 'add' as const,
      programId: PLAN,
      diff: diffSessionBlueprints(new SessionBlueprint('', [], ''), referenceModified()),
    };
    const newDiff = createAddNewWorkoutDiff(pending, 'Workout 2');
    const committed = selectedDiff(newDiff, defaultSelection(newDiff));

    store.dispatch(applyDiffToPlan({ type: 'add', programId: PLAN, diff: committed }));

    const sessions = sessionsOf(store);
    expect(sessions).toHaveLength(2);
    expect(sessions[0]!.name).toBe('Push Day');
    expect(sessions[0]!.exercises).toHaveLength(2);
    expect(sessions[1]!.name).toBe('Workout 2');
    expect(sessions[1]!.exercises.map((e) => e.name)).toEqual(['Barbell Bench Press', 'Incline Dumbbell Press']);
  });

  it('a missing workout is a silent no-op: nothing is invented and other sessions are untouched', () => {
    const store = storeWithPlan([referenceOriginal()]);
    const diff = diffSessionBlueprints(referenceOriginal(), referenceModified());
    const committed = selectedDiff(diff, defaultSelection(diff));
    const before = sessionsOf(store);

    store.dispatch(
      applyDiffToPlan({
        type: 'diff',
        programId: PLAN,
        sessionIndex: 0,
        diff: { ...committed, originalSession: new SessionBlueprint('Deleted Day', [], '') },
      }),
    );

    expect(sessionsOf(store)).toEqual(before);
  });
});

describe('diff-save entry points (getPlanDiff)', () => {
  const PLAN = 'plan-a';

  it('no diff when the finished session already matches the plan', () => {
    const program = planWith([referenceOriginal()]);
    expect(getPlanDiff(program, finishedSession(referenceOriginal()), PLAN)).toBeUndefined();
  });

  it('update-mode diff when a same-named workout exists', () => {
    const program = planWith([referenceOriginal()]);
    const diff = getPlanDiff(program, finishedSession(referenceModified()), PLAN);
    expect(diff?.type).toBe('diff');
    expect(diff?.type === 'diff' && diff.sessionIndex).toBe(0);
  });

  it('add-mode diff when the finished session has a new name', () => {
    const program = planWith([referenceOriginal()]);
    const diff = getPlanDiff(
      program,
      finishedSession(new SessionBlueprint('Push Day v2', referenceModified().exercises, '')),
      PLAN,
    );
    expect(diff?.type).toBe('add');
  });
});

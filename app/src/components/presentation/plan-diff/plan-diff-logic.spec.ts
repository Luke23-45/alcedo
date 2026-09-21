import { Duration } from '@js-joda/core';
import { describe, expect, it, vi } from 'vitest';

vi.mock('expo-localization', () => ({
  getLocales: () => [{ decimalSeparator: '.' }],
}));

import type { UseTranslateResult } from '@tolgee/react';
import { Rest, SessionBlueprint } from '@/models/blueprint-models';
import { diffSessionBlueprints, PlanDiff, SessionBlueprintDiff } from '@/models/blueprint-diff';
import { makeCardioBlueprint, makeWeightedBlueprint } from '@/models/session-models/__test__/helpers';
import {
  createAddNewWorkoutDiff,
  createUpdateExistingWorkoutDiff,
  defaultSelection,
  describeChange,
  restSeconds,
  selectableChanges,
  selectedCount,
  selectedDiff,
  toggleSelected,
} from './plan-diff-logic';

// Deterministic stub: echoes the key and params so assertions stay honest
// about which strings the logic requests.
const t = ((key: string, params?: Record<string, string | number>) =>
  params ? `${key}(${JSON.stringify(params)})` : key) as unknown as UseTranslateResult['t'];

function restOf(seconds: number): Rest {
  return {
    minRest: Duration.ofSeconds(seconds),
    maxRest: Duration.ofSeconds(seconds),
    failureRest: Duration.ofSeconds(seconds),
  };
}

function planDiff(original: SessionBlueprint, modified: SessionBlueprint): PlanDiff {
  return { type: 'diff', programId: 'plan-a', sessionIndex: 0, diff: diffSessionBlueprints(original, modified) };
}

describe('plan-diff selection', () => {
  it('excludes the locked session-name row from the selectable set and the count', () => {
    const diff = diffSessionBlueprints(
      new SessionBlueprint('Push Day', [], 'old notes'),
      new SessionBlueprint('Push Day!', [], 'new notes'),
    );
    expect(diff.allChanges).toHaveLength(2);

    const selectable = selectableChanges(diff);
    expect(selectable).toHaveLength(1);
    expect(selectable[0]!.kind).toBe('sessionNotes');

    // Default: everything checked, but the chip counts only the selectable row.
    expect(selectedCount(diff, defaultSelection(diff))).toBe(1);
  });

  it('toggleSelected never touches the locked row', () => {
    const diff = diffSessionBlueprints(
      new SessionBlueprint('Push Day', [], 'old notes'),
      new SessionBlueprint('Push Day!', [], 'new notes'),
    );
    const lockedId = diff.allChanges.find((c) => c.kind === 'sessionName')!.id;
    const notesId = diff.allChanges.find((c) => c.kind === 'sessionNotes')!.id;

    const afterLockedToggle = toggleSelected(diff, defaultSelection(diff), lockedId);
    expect(afterLockedToggle.has(lockedId)).toBe(true);
    expect(selectedCount(diff, afterLockedToggle)).toBe(1);

    const afterNotesToggle = toggleSelected(diff, defaultSelection(diff), notesId);
    expect(afterNotesToggle.has(notesId)).toBe(false);
    expect(selectedCount(diff, afterNotesToggle)).toBe(0);
  });

  it('reset restores the default all-checked selection', () => {
    const diff = diffSessionBlueprints(
      new SessionBlueprint('Push Day', [], 'old notes'),
      new SessionBlueprint('Push Day!', [], 'new notes'),
    );
    const notesId = diff.allChanges.find((c) => c.kind === 'sessionNotes')!.id;
    const toggled = toggleSelected(diff, defaultSelection(diff), notesId);
    expect(selectedCount(diff, toggled)).toBe(0);

    const reset = defaultSelection(diff);
    expect(selectedCount(diff, reset)).toBe(1);
  });

  it('selectedDiff keeps only the checked changes for the commit', () => {
    const diff = diffSessionBlueprints(
      new SessionBlueprint('Push Day', [makeWeightedBlueprint({ name: 'Squat' })], ''),
      new SessionBlueprint(
        'Push Day',
        [makeWeightedBlueprint({ name: 'Squat' }), makeWeightedBlueprint({ name: 'Bench' })],
        '',
      ),
    );
    const addedId = diff.addedExercises[0]!.id;
    const kept = selectedDiff(diff, toggleSelected(diff, defaultSelection(diff), addedId));
    expect(kept.addedExercises).toHaveLength(0);
    expect(kept.hasChanges).toBe(false);
  });
});

describe('plan-diff delta chips and transitions', () => {
  it('computes the sets delta chip and transition from the real planned sets', () => {
    const diff = diffSessionBlueprints(
      new SessionBlueprint(
        'W',
        [makeWeightedBlueprint({ name: 'Bench', sets: 4, repsConfig: { type: 'fixed', reps: 8 } })],
        '',
      ),
      new SessionBlueprint(
        'W',
        [makeWeightedBlueprint({ name: 'Bench', sets: 5, repsConfig: { type: 'fixed', reps: 8 } })],
        '',
      ),
    );
    const change = diff.modifiedExercises[0]!.changes.find((c) => c.kind === 'exercisePlannedSets')!;
    const view = describeChange(t, change);

    expect(view.deltaChip).toEqual({ text: '+1', tone: 'added' });
    expect(view.transition?.oldText).toContain('"count":4');
    expect(view.transition?.newText).toContain('"count":5');
  });

  it('computes the rest delta chip and transition from the real rest values', () => {
    const diff = diffSessionBlueprints(
      new SessionBlueprint('W', [makeWeightedBlueprint({ name: 'Bench', restBetweenSets: restOf(90) })], ''),
      new SessionBlueprint('W', [makeWeightedBlueprint({ name: 'Bench', restBetweenSets: restOf(120) })], ''),
    );
    const change = diff.modifiedExercises[0]!.changes.find((c) => c.kind === 'exerciseRest')!;
    const view = describeChange(t, change);

    expect(view.deltaChip).toEqual({ text: '+30 S', tone: 'modified' });
    expect(view.transition?.oldText).toContain('"seconds":90');
    expect(view.transition?.newText).toContain('"seconds":120');
  });

  it('omits the chip when rep targets move without a set-count change', () => {
    const diff = diffSessionBlueprints(
      new SessionBlueprint(
        'W',
        [makeWeightedBlueprint({ name: 'Bench', sets: 4, repsConfig: { type: 'fixed', reps: 8 } })],
        '',
      ),
      new SessionBlueprint(
        'W',
        [makeWeightedBlueprint({ name: 'Bench', sets: 4, repsConfig: { type: 'fixed', reps: 10 } })],
        '',
      ),
    );
    const change = diff.modifiedExercises[0]!.changes.find((c) => c.kind === 'exercisePlannedSets')!;
    const view = describeChange(t, change);

    expect(view.deltaChip).toBeUndefined();
    expect(view.transition).toEqual({ oldText: '8', newText: '10' });
  });

  it('marks added and removed exercises with ADD / REMOVE chips', () => {
    const diff = diffSessionBlueprints(
      new SessionBlueprint('W', [makeWeightedBlueprint({ name: 'Squat' })], ''),
      new SessionBlueprint('W', [makeWeightedBlueprint({ name: 'Bench' })], ''),
    );
    const added = describeChange(t, diff.addedExercises[0]!);
    const removed = describeChange(t, diff.removedExercises[0]!);

    expect(added.deltaChip).toEqual({ text: 'ADD', tone: 'added' });
    expect(added.titleTone).toBe('added');
    expect(removed.deltaChip).toEqual({ text: 'REMOVE', tone: 'removed' });
    expect(removed.titleTone).toBe('removed');
  });

  it('derives the added-exercise description from the real blueprint, never invented', () => {
    const diff = diffSessionBlueprints(
      new SessionBlueprint('W', [], ''),
      new SessionBlueprint(
        'W',
        [
          makeWeightedBlueprint({
            name: 'Incline DB Press',
            sets: 3,
            repsConfig: { type: 'fixed', reps: 8 },
            restBetweenSets: restOf(90),
          }),
        ],
        '',
      ),
    );
    const view = describeChange(t, diff.addedExercises[0]!);
    // 3 sets × "8" reps · "90 s" rest — all from the blueprint.
    expect(view.description).toContain('"sets":3');
    expect(view.description).toContain('"reps":"8"');
    expect(view.description).toContain('seconds');
    expect(view.description).toContain('90');
    expect(view.description).not.toContain('matched library');
  });

  it('falls back to the real generic string for cardio exercises without inventing a summary', () => {
    const diff = diffSessionBlueprints(
      new SessionBlueprint('W', [], ''),
      new SessionBlueprint('W', [makeCardioBlueprint()], ''),
    );
    const view = describeChange(t, diff.addedExercises[0]!);
    expect(view.description).toContain('plan.diff.exercise_added.body');
  });

  it('computes session-notes lines and characters from the real new text', () => {
    const diff = diffSessionBlueprints(
      new SessionBlueprint('W', [], 'old'),
      new SessionBlueprint('W', [], 'line one\nline two\nline three'),
    );
    const change = diff.sessionChanges.find((c) => c.kind === 'sessionNotes')!;
    const view = describeChange(t, change);
    expect(view.description).toContain('"lines":3');
    expect(view.description).toContain('"characters":28');
  });
});

describe('plan-diff mode recomputation', () => {
  it('update mode diffs the original session against the modified session', () => {
    const pd = planDiff(
      new SessionBlueprint(
        'Push Day',
        [makeWeightedBlueprint({ name: 'Squat' }), makeWeightedBlueprint({ name: 'Bench' })],
        '',
      ),
      new SessionBlueprint(
        'Push Day',
        [
          makeWeightedBlueprint({ name: 'Squat' }),
          makeWeightedBlueprint({ name: 'Bench' }),
          makeWeightedBlueprint({ name: 'Dip' }),
        ],
        '',
      ),
    );
    const diff: SessionBlueprintDiff = createUpdateExistingWorkoutDiff(pd);
    expect(diff.addedExercises).toHaveLength(1);
    expect(diff.addedExercises[0]!.exercise.name).toBe('Dip');
  });

  it('save-as-new mode diffs against the empty session so everything shows as added', () => {
    const pd = planDiff(
      new SessionBlueprint(
        'Push Day',
        [makeWeightedBlueprint({ name: 'Squat' }), makeWeightedBlueprint({ name: 'Bench' })],
        '',
      ),
      new SessionBlueprint(
        'Push Day',
        [
          makeWeightedBlueprint({ name: 'Squat' }),
          makeWeightedBlueprint({ name: 'Bench' }),
          makeWeightedBlueprint({ name: 'Dip' }),
        ],
        '',
      ),
    );
    const diff: SessionBlueprintDiff = createAddNewWorkoutDiff(pd, 'Workout 3');
    expect(diff.addedExercises).toHaveLength(3);
    // Original references are preserved for switching back.
    expect(diff.originalSession.name).toBe('Push Day');
    expect(diff.newSession.name).toBe('Push Day');
  });
});

describe('restSeconds', () => {
  it('reads the minRest convention in whole seconds', () => {
    expect(restSeconds(restOf(90))).toBe(90);
  });
});

import {
  DiffChange,
  PlanDiff,
  SessionBlueprintDiff,
  diffSessionBlueprints,
  filterDiff,
  getChangeDescription,
  getChangeLabelKey,
} from '@/models/blueprint-diff';
import { ExerciseBlueprint, WeightedExerciseBlueprint, formatPlannedSets, Rest } from '@/models/blueprint-models';
import { EmptySession } from '@/models/session-models';
import type { UseTranslateResult } from '@tolgee/react';
import type { TranslationKey } from '@tolgee/web';

type T = UseTranslateResult['t'];

/** A change the user can toggle. The locked session-name change is always applied. */
export function isLockedChange(change: DiffChange): boolean {
  return change.kind === 'sessionName';
}

export function selectableChanges(diff: SessionBlueprintDiff): DiffChange[] {
  return diff.allChanges.filter((change) => !isLockedChange(change));
}

/** Default checkbox state: everything checked, including the locked row. */
export function defaultSelection(diff: SessionBlueprintDiff): Set<string> {
  return new Set(diff.allChanges.map((change) => change.id));
}

/**
 * Live "N SELECTED" count. Only selectable rows count — the locked
 * session-name row is always applied, so it must not inflate the number.
 */
export function selectedCount(diff: SessionBlueprintDiff, selectedIds: Set<string>): number {
  return selectableChanges(diff).filter((change) => selectedIds.has(change.id)).length;
}

/** Toggle one selectable change; locked changes are never toggled. */
export function toggleSelected(diff: SessionBlueprintDiff, selectedIds: Set<string>, id: string): Set<string> {
  const selectable = new Set(selectableChanges(diff).map((change) => change.id));
  if (!selectable.has(id)) {
    return selectedIds;
  }
  const next = new Set(selectedIds);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  return next;
}

/** The diff the Save action commits: only the checked changes. */
export function selectedDiff(diff: SessionBlueprintDiff, selectedIds: Set<string>): SessionBlueprintDiff {
  return filterDiff(diff, selectedIds);
}

// ============================================================================
// Save-mode recomputation (moved verbatim from the legacy screen)
// ============================================================================

/**
 * Creates a diff for updating an existing workout in the plan.
 * Compares the original session blueprint against the modified session.
 */
export function createUpdateExistingWorkoutDiff(currentPlanDiff: PlanDiff): SessionBlueprintDiff {
  return diffSessionBlueprints(currentPlanDiff.diff.originalSession, currentPlanDiff.diff.newSession);
}

/**
 * Creates a diff for adding a new workout to the plan.
 * Compares against an empty session so all exercises appear as "added".
 * Preserves the original session references for potential undo/comparison.
 */
export function createAddNewWorkoutDiff(currentPlanDiff: PlanDiff, newWorkoutName: string): SessionBlueprintDiff {
  const newSessionWithName = currentPlanDiff.diff.newSession.with({
    name: newWorkoutName,
  });

  return {
    // Diff against empty session so everything shows as "added"
    ...diffSessionBlueprints(EmptySession.blueprint, newSessionWithName),
    // Preserve original references so we can use them again when we turn the switch off
    originalSession: currentPlanDiff.diff.originalSession,
    newSession: currentPlanDiff.diff.newSession,
  };
}

// ============================================================================
// Honest change descriptions — computed from the real DiffChange data only.
// Anything that cannot be derived is omitted, never invented.
// ============================================================================

export type ChangeTitleTone = 'default' | 'added' | 'removed';
export type DeltaChipTone = 'added' | 'removed' | 'modified';

export interface ChangeView {
  id: string;
  locked: boolean;
  titleKey: TranslationKey;
  titleParams?: Record<string, string | number>;
  titleTone: ChangeTitleTone;
  /** Fully translated description line, when the change honestly has one. */
  description?: string;
  /** Old → new transition typography, when honestly computable. */
  transition?: { oldText: string; newText: string };
  /** Delta chip, when honestly computable from the model. */
  deltaChip?: { text: string; tone: DeltaChipTone };
}

/** Display seconds for a rest, using the same minRest convention as the rest of the app. */
export function restSeconds(rest: Rest): number {
  return Math.round(rest.minRest.toMillis() / 1000);
}

function isWeighted(blueprint: ExerciseBlueprint): blueprint is WeightedExerciseBlueprint {
  return blueprint.type === 'WeightedExerciseBlueprint';
}

/** "3 × 8 · 90 s rest" from a real weighted blueprint; undefined for cardio. */
function weightedSummary(t: T, blueprint: ExerciseBlueprint): string | undefined {
  if (!isWeighted(blueprint)) {
    return undefined;
  }
  const sets = blueprint.plannedSets.length;
  const reps = formatPlannedSets(blueprint.plannedSets);
  const rest = t('plan.diff.rest.seconds', { seconds: restSeconds(blueprint.restBetweenSets) });
  return t('plan.diff.exercise_summary', { sets, reps, rest });
}

function labelOf(change: DiffChange): { titleKey: TranslationKey; titleParams?: Record<string, string | number> } {
  const label = getChangeLabelKey(change);
  return { titleKey: label.key, titleParams: label.params };
}

export function describeChange(t: T, change: DiffChange): ChangeView {
  const base = {
    id: change.id,
    locked: isLockedChange(change),
  };

  if (change.kind === 'sessionName') {
    return {
      ...base,
      titleKey: 'plan.diff.session_name.label',
      titleTone: 'default',
      description: t('plan.diff.session_name.always_detail', { sessionName: change.newValue }),
    };
  }

  if (change.kind === 'sessionNotes') {
    // The model carries the real old/new text, so the line/character counts are honest.
    const lines = change.newValue.length === 0 ? 0 : change.newValue.split('\n').length;
    return {
      ...base,
      titleKey: 'plan.diff.session_notes.label',
      titleTone: 'default',
      description: t('plan.diff.session_notes.detail', { lines, characters: change.newValue.length }),
    };
  }

  if (change.kind === 'exercise' && change.type === 'added') {
    const summary = weightedSummary(t, change.exercise);
    return {
      ...base,
      titleKey: 'plan.diff.exercise_added.name',
      titleParams: { name: change.exercise.name },
      titleTone: 'added',
      description: summary ?? t('plan.diff.exercise_added.body', { name: change.exercise.name }),
      deltaChip: { text: 'ADD', tone: 'added' },
    };
  }

  if (change.kind === 'exercise' && change.type === 'removed') {
    const summary = weightedSummary(t, change.exercise);
    return {
      ...base,
      titleKey: 'plan.diff.exercise_removed.name',
      titleParams: { name: change.exercise.name },
      titleTone: 'removed',
      description: summary
        ? t('plan.diff.exercise_removed.detail', { detail: summary })
        : t('plan.diff.exercise_removed.body', { name: change.exercise.name }),
      deltaChip: { text: 'REMOVE', tone: 'removed' },
    };
  }

  if (change.kind === 'exercisePlannedSets') {
    const oldLen = change.oldValue.length;
    const newLen = change.newValue.length;
    if (oldLen !== newLen) {
      const delta = newLen - oldLen;
      return {
        ...base,
        titleKey: 'plan.diff.sets.label',
        titleTone: 'default',
        transition: {
          oldText: t('plan.diff.sets.count', { count: oldLen }),
          newText: t('plan.diff.sets.count', { count: newLen }),
        },
        deltaChip: {
          text: delta > 0 ? `+${delta}` : `${delta}`,
          tone: delta > 0 ? 'added' : 'removed',
        },
      };
    }
    // Same set count, rep targets moved: show the real rep scheme transition, no chip.
    return {
      ...base,
      titleKey: 'plan.diff.sets.label',
      titleTone: 'default',
      transition: {
        oldText: formatPlannedSets(change.oldValue),
        newText: formatPlannedSets(change.newValue),
      },
    };
  }

  if (change.kind === 'exerciseRest') {
    const oldSec = restSeconds(change.oldValue);
    const newSec = restSeconds(change.newValue);
    const delta = newSec - oldSec;
    return {
      ...base,
      titleKey: 'plan.diff.rest.label',
      titleTone: 'default',
      transition: {
        oldText: t('plan.diff.rest.seconds', { seconds: oldSec }),
        newText: t('plan.diff.rest.seconds', { seconds: newSec }),
      },
      // A rest change always has a nonzero delta by construction; guard anyway.
      deltaChip: delta === 0 ? undefined : { text: `${delta > 0 ? '+' : '−'}${Math.abs(delta)} S`, tone: 'modified' },
    };
  }

  if (change.kind === 'exerciseName') {
    return {
      ...base,
      titleKey: 'plan.diff.name.label',
      titleTone: 'default',
      transition: { oldText: change.oldValue, newText: change.newValue },
    };
  }

  // Everything else (reordered, progression, superset, resistance, notes, link,
  // targets, tracking, exercise type, cardio sets): the model's real strings.
  const { titleKey, titleParams } = labelOf(change);
  return {
    ...base,
    titleKey,
    titleParams,
    titleTone: 'default',
    description: getChangeDescription(t, change),
  };
}

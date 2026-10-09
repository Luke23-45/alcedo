/**
 * Pure progression verdict calculation (D11 / README §3.3).
 *
 * Diffing applyProgression against the current exercise ensures the verdict
 * never disagrees with the blueprint's progression rules.
 */

import BigNumber from 'bignumber.js';
import { applyProgression, RepsTarget } from '@/models/blueprint-models';
import { RecordedWeightedExercise } from '@/models/session-models';

export type Verdict =
  | { kind: 'increaseLoad'; step: BigNumber }
  | { kind: 'increaseReps'; step: number }
  | { kind: 'resetReps'; target: RepsTarget }
  | { kind: 'hold'; reason: 'noRule' | 'noLoad' | 'atCeiling' }
  | { kind: 'ease'; reason: 'failureSet' | 'missedTarget' };

/**
 * Computes the progression verdict for a weighted exercise.
 *
 * Honesty rules:
 * 1. Ease short-circuits: any logged failure set or any set falling short
 *    of its minimum reps target triggers an 'ease' verdict immediately,
 *    preventing inappropriate progressive overload on bad days.
 * 2. Diff against applyProgression: uses the plan's exact rule engine.
 */
export function calculateProgressionVerdict(exercise: RecordedWeightedExercise): Verdict {
  const recordedSets = exercise.potentialSets.filter((ps) => ps.set !== undefined);

  // 1. Ease short-circuit: check for failure sets or missed rep targets
  for (let i = 0; i < exercise.potentialSets.length; i++) {
    const potential = exercise.potentialSets[i];
    if (!potential?.set) continue;

    const set = potential.set;
    if (set.type === 'failure') {
      return { kind: 'ease', reason: 'failureSet' };
    }

    const target = exercise.repsTargetForSet(i);
    if (set.repsCompleted < target.min) {
      return { kind: 'ease', reason: 'missedTarget' };
    }
  }

  // 2. No rules configured
  const progression = exercise.blueprint.progression;
  if (!progression || progression.length === 0) {
    return { kind: 'hold', reason: 'noRule' };
  }

  // 3. No load tracking available for a load rule
  if (
    exercise.blueprint.resistance === 'none' &&
    progression.some((rule) => rule.axis === 'load')
  ) {
    return { kind: 'hold', reason: 'noLoad' };
  }

  // 4. Probe copy: diff applyProgression(blueprint.progression, exercise)
  const moved = applyProgression(progression, exercise);

  // Compare sets between exercise and moved
  for (let i = 0; i < exercise.potentialSets.length; i++) {
    const origPotential = exercise.potentialSets[i];
    const movedPotential = moved.potentialSets[i];
    if (!origPotential || !movedPotential) continue;

    // Check load increase
    const loadDiff = movedPotential.weight.value.minus(origPotential.weight.value);
    if (loadDiff.isGreaterThan(0)) {
      return { kind: 'increaseLoad', step: loadDiff };
    }

    // Check reps increase or reset
    const origTarget = exercise.repsTargetForSet(i);
    const movedTarget = moved.repsTargetForSet(i);
    if (movedTarget.max > origTarget.max) {
      return { kind: 'increaseReps', step: movedTarget.max - origTarget.max };
    }
    if (movedTarget.max < origTarget.max) {
      return { kind: 'resetReps', target: movedTarget };
    }
  }

  return { kind: 'hold', reason: 'atCeiling' };
}

/** Formats a verdict into a display chip text and arithmetic string. */
export function formatVerdictText(verdict: Verdict, weightUnitText: string = 'kg'): { label: string; detail?: string } {
  switch (verdict.kind) {
    case 'increaseLoad':
      return {
        label: `+${verdict.step.toString()} ${weightUnitText.toUpperCase()}`,
        detail: 'PROGRESSIVE LOAD',
      };
    case 'increaseReps':
      return {
        label: `+${verdict.step} ${verdict.step === 1 ? 'REP' : 'REPS'}`,
        detail: 'VOLUME TARGET',
      };
    case 'resetReps':
      return {
        label: `RESET (${verdict.target.min}–${verdict.target.max})`,
        detail: 'LADDER RECYCLE',
      };
    case 'hold':
      return {
        label: 'HOLD STEADY',
        detail: verdict.reason === 'noRule' ? 'NO PROGRESSION RULE' : 'AT CEILING',
      };
    case 'ease':
      return {
        label: 'EASE BACK',
        detail: verdict.reason === 'failureSet' ? 'FAILURE SET LOGGED' : 'TARGET MISSED',
      };
  }
}

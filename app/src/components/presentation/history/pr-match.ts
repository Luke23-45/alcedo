import { Session } from '@/models/session-models';
import { RecordedWeightedExercise } from '@/models/session-models/recorded-weighted-exercise';
import { Weight } from '@/models/weight';
import { calculateOneRepMax } from '@/store/stats/calculate-stats';
import { PersonalRecord } from '@/store/stats/personal-records';

export interface ExercisePrMatch {
  /** The exercise holds a record for this session: gold volume + PR chip. */
  hasPr: boolean;
  /** Potential-set indexes whose e1RM equals the record: gold-outlined set chips. */
  prSetIndexes: Set<number>;
  /** The record-setting set, for "{weight} × {reps}" card copy. */
  prSet: { weight: Weight; reps: number } | undefined;
}

const noMatch: ExercisePrMatch = {
  hasPr: false,
  prSetIndexes: new Set(),
  prSet: undefined,
};

/**
 * Matches a session's exercises against the records selectHistoryPersonalRecords
 * attributes to it. A PR set is a set whose estimated one-rep max equals the
 * record — the same e1RM basis findPersonalRecords uses (effective weight,
 * bodyweight included), so the gold outline can never disagree with the card.
 */
export function matchSessionPrs(session: Session, records: PersonalRecord[] | undefined): ExercisePrMatch[] {
  const byName = new Map((records ?? []).map((record) => [record.exerciseName, record]));

  return session.recordedExercises.map((exercise) => {
    if (!(exercise instanceof RecordedWeightedExercise) || !exercise.isStarted) {
      return noMatch;
    }
    const record = byName.get(exercise.blueprint.name);
    if (!record) {
      return noMatch;
    }

    const prSetIndexes = new Set<number>();
    let prSet: { weight: Weight; reps: number } | undefined;
    exercise.potentialSets.forEach((potentialSet, index) => {
      if (!potentialSet.set?.repsCompleted) {
        return;
      }
      const e1rm = calculateOneRepMax(potentialSet, exercise.effectiveWeight(potentialSet, session.bodyweight));
      if (e1rm.equals(record.oneRepMax, true)) {
        prSetIndexes.add(index);
        if (!prSet) {
          prSet = {
            weight: exercise.effectiveWeight(potentialSet, session.bodyweight),
            reps: potentialSet.set.repsCompleted,
          };
        }
      }
    });

    return { hasPr: true, prSetIndexes, prSet };
  });
}

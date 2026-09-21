import PotentialSetCounter from '@/components/presentation/workout/weighted/potential-set-counter';
import { RecordedWeightedExercise } from '@/models/session-models';
import { View } from 'react-native';
import ExerciseSection from '@/components/presentation/workout/exercise-section';
import { OffsetDateTime } from '@js-joda/core';
import { Updater } from '@/utils/types';

interface WeightedExerciseProps {
  recordedExercise: RecordedWeightedExercise;
  previousRecordedExercises: RecordedWeightedExercise[];
  toStartNext: boolean;
  isReadonly: boolean;
  showPreviousButton: boolean;
  /** Position of this exercise in the session (1-based index tile). */
  index?: number;
  /** 'active' renders the workout-flow reference card; 'classic' keeps the legacy layout. */
  variant?: 'active' | 'classic';

  timeProvider: () => OffsetDateTime;
  updateExercise: (update: Updater<RecordedWeightedExercise>) => void;
  resetSetTimer: () => void;
  onEditExercise: (() => void) | undefined;
  onRemoveExercise: () => void;
}

export default function WeightedExercise(props: WeightedExerciseProps) {
  const { updateExercise, timeProvider, resetSetTimer } = props;
  const { recordedExercise } = props;

  const setToStartNext = recordedExercise.potentialSets.findIndex((x) => !x.set);
  const previousExercise = props.previousRecordedExercises
    .filter((x) => x.progressionKey() === props.recordedExercise.progressionKey())
    .at(0);

  return (
    <ExerciseSection
      recordedExercise={props.recordedExercise}
      previousRecordedExercises={props.previousRecordedExercises}
      toStartNext={props.toStartNext}
      isReadonly={props.isReadonly}
      showPreviousButton={props.showPreviousButton}
      updateExercise={props.updateExercise}
      onEditExercise={props.onEditExercise}
      onRemoveExercise={props.onRemoveExercise}
      index={props.index}
      variant={props.variant}
      // The reference draws the Add Set row on completed exercises only.
      onAddSet={!props.isReadonly && recordedExercise.isComplete ? () => updateExercise((ex) => ex.withAddedSet()) : undefined}
    >
      <View>
        {recordedExercise.potentialSets.map((set, index) => (
          <PotentialSetCounter
            isReadonly={props.isReadonly}
            key={index}
            index={index}
            variant={props.variant}
            repsTarget={recordedExercise.repsTargetForSet(index)}
            onTap={() => {
              const previousSet = set.set;
              const newSet = recordedExercise.withCycledRepCount(index, timeProvider()).getSet(index).set;
              updateExercise((ex) => ex.withCycledRepCount(index, timeProvider()));
              // We only want to reset the timer when switching between unfilled and filled
              // Otherwise, keep the same time
              if (!previousSet || !newSet) {
                resetSetTimer();
              }
            }}
            previousRepCount={previousExercise?.potentialSets[index]?.set?.repsCompleted}
            previousWeight={previousExercise?.potentialSets[index]?.weight}
            onUpdateReps={(reps) => {
              updateExercise((ex) => ex.withRepCount(index, reps, timeProvider()));
              resetSetTimer();
            }}
            onUpdateWeight={(w, applyTo) => updateExercise((ex) => ex.withWeight(index, w, applyTo))}
            set={set}
            toStartNext={props.toStartNext && setToStartNext === index && !props.isReadonly}
            resistance={recordedExercise.blueprint.resistance}
            weightIncrement={recordedExercise.blueprint.weightIncrement}
          />
        ))}
      </View>
    </ExerciseSection>
  );
}

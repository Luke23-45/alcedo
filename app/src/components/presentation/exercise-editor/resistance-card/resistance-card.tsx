import { View } from 'react-native';
import { useTranslate } from '@tolgee/react';
import { Resistance, WeightedExerciseBlueprint } from '@/models/blueprint-models';
import { Card, Hairline, RadioDot, RadioRing } from '../editor-primitives';
import { formatBodyweight } from '../exercise-editor-logic';
import { Weight } from '@/models/weight';
import { ResistanceBody, ResistanceLabel, ResistanceRow, ResistanceTextColumn } from './resistance-card.styles';

const OPTIONS: Resistance[] = ['external', 'bodyweight', 'none'];

export function ResistanceCard({
  exercise,
  onChange,
  bodyweight,
  useImperialUnits,
}: {
  exercise: WeightedExerciseBlueprint;
  onChange: (exercise: WeightedExerciseBlueprint) => void;
  bodyweight: Weight | undefined;
  useImperialUnits: boolean;
}) {
  const { t } = useTranslate();
  const bodyweightText = formatBodyweight(bodyweight, useImperialUnits);

  const explanation = (option: Resistance): string => {
    switch (option) {
      case 'external':
        return t('exercise.editor.resistance.external.body', 'Barbell, dumbbell, machine or cable load.');
      case 'bodyweight':
        return bodyweightText
          ? t('exercise.editor.resistance.bodyweight.body', 'Scaled by your bodyweight ({weight}).', {
              weight: bodyweightText,
            })
          : t('exercise.editor.resistance.bodyweight.body_no_weight', 'Scaled by your bodyweight.');
      case 'none':
        return t('exercise.editor.resistance.none.body', 'No load tracked — technique or mobility work.');
    }
  };

  const label = (option: Resistance): string => {
    switch (option) {
      case 'external':
        return t('exercise.editor.resistance.external.label', 'External');
      case 'bodyweight':
        return t('exercise.editor.resistance.bodyweight.label', 'Bodyweight');
      case 'none':
        return t('exercise.editor.resistance.none.label', 'None');
    }
  };

  return (
    <Card>
      <View>
        {OPTIONS.map((option, index) => {
          const selected = exercise.resistance === option;
          return (
            <View key={option}>
              {index > 0 ? <Hairline /> : null}
              <ResistanceRow
                $selected={selected}
                onPress={() => onChange(exercise.with({ resistance: option }))}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                accessibilityLabel={label(option)}
              >
                <ResistanceTextColumn>
                  <ResistanceLabel $selected={selected}>{label(option)}</ResistanceLabel>
                  <ResistanceBody $selected={selected}>{explanation(option)}</ResistanceBody>
                </ResistanceTextColumn>
                <RadioRing $selected={selected}>{selected ? <RadioDot /> : null}</RadioRing>
              </ResistanceRow>
            </View>
          );
        })}
      </View>
    </Card>
  );
}

import { useTranslate } from '@tolgee/react';
import { WeightedExerciseBlueprint } from '@/models/blueprint-models';
import { Card, ChevronRightGlyph, Hairline, RowCaption, RowLabel, Toggle } from '../editor-primitives';
import { formatRestValue } from '../exercise-editor-logic';
import { OptionPad, OptionRow, OptionTextColumn, RestValueChip, RestValueText, RowAction } from './options-card.styles';

export function OptionsCard({
  exercise,
  onChange,
  restTimersEnabled,
  nextExerciseName,
  onOpenRestSheet,
}: {
  exercise: WeightedExerciseBlueprint;
  onChange: (exercise: WeightedExerciseBlueprint) => void;
  restTimersEnabled: boolean;
  nextExerciseName?: string;
  onOpenRestSheet: () => void;
}) {
  const { t } = useTranslate();
  return (
    <Card>
      <OptionPad>
        {restTimersEnabled ? (
          <>
            <OptionRow
              onPress={onOpenRestSheet}
              accessibilityRole="button"
              accessibilityLabel={t('exercise.editor.rest.label', 'Rest between sets')}
              accessibilityValue={{ text: formatRestValue(exercise.restBetweenSets) }}
            >
              <RowLabel>{t('exercise.editor.rest.label', 'Rest between sets')}</RowLabel>
              <RowAction>
                <RestValueChip>
                  <RestValueText>{formatRestValue(exercise.restBetweenSets)}</RestValueText>
                </RestValueChip>
                <ChevronRightGlyph />
              </RowAction>
            </OptionRow>
            <Hairline />
          </>
        ) : null}
        <OptionRow
          onPress={() => onChange(exercise.with({ supersetWithNext: !exercise.supersetWithNext }))}
          accessibilityRole="switch"
          accessibilityState={{ checked: exercise.supersetWithNext }}
          accessibilityLabel={t('workout.superset_next_exercise.button', 'Superset with next')}
        >
          <OptionTextColumn>
            <RowLabel>{t('workout.superset_next_exercise.button', 'Superset with next')}</RowLabel>
            {nextExerciseName ? (
              <RowCaption numberOfLines={1} ellipsizeMode="tail">
                {t('exercise.editor.superset.pairs_with', 'Pairs with {name}', { name: nextExerciseName })}
              </RowCaption>
            ) : null}
          </OptionTextColumn>
          <Toggle
            on={exercise.supersetWithNext}
            label={t('workout.superset_next_exercise.button', 'Superset with next')}
            onChange={(on) => onChange(exercise.with({ supersetWithNext: on }))}
          />
        </OptionRow>
      </OptionPad>
    </Card>
  );
}

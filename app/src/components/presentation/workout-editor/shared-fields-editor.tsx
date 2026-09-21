import { FormRow } from '@/components/presentation/foundation/form-row';
import { useAppTheme } from '@/hooks/useAppTheme';
import { CardioExerciseBlueprint, ExerciseBlueprint, WeightedExerciseBlueprint } from '@/models/blueprint-models';
import { useTranslate } from '@tolgee/react';
import { TextInput } from 'react-native-paper';

export function SharedFieldsEditor({
  exercise,
  updateExercise,
}: {
  exercise: ExerciseBlueprint;
  updateExercise: (ex: Partial<CardioExerciseBlueprint | WeightedExerciseBlueprint>) => void;
}) {
  const { t } = useTranslate();
  const theme = useAppTheme();
  return (
    <>
      <FormRow>
        <TextInput
          mode="outlined"
          label={t('plan.notes.label')}
          testID="exercise-notes"
          style={{ marginBottom: theme.space.sm }}
          value={exercise.notes}
          onChangeText={(notes) => updateExercise({ notes })}
          multiline
        />
      </FormRow>
      <FormRow>
        <TextInput
          mode="outlined"
          testID="exercise-link"
          label={t('generic.external_link.label')}
          style={{ marginBottom: theme.space.sm }}
          placeholder="https://"
          value={exercise.link}
          onChangeText={(link) => updateExercise({ link })}
        />
      </FormRow>
    </>
  );
}

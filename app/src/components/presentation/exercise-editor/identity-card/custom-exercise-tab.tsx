import { useTranslate } from '@tolgee/react';
import { useAppTheme } from '@/hooks/useAppTheme';
import { ExerciseDescriptor } from '@/models/exercise-models';
import { Card, SegmentedControl } from '../editor-primitives';
import { ExerciseKind } from '../exercise-editor-logic';
import {
  AddSearchPad,
  CreateButton,
  CreateLabel,
  DuplicateRow,
  DuplicateText,
  FieldLabel,
  FormGap,
  LinkAction,
  LinkActionLabel,
  NameWell,
  SearchHint,
  SearchInput,
} from './identity-card.styles';

export type AddExerciseTab = 'library' | 'custom';

/**
 * The Custom tab of the add-exercise split: name field, Weighted/Cardio
 * picker, duplicate-name guard, and the explicit Create action. Nothing is
 * committed until Create — backing out leaves the pristine placeholder.
 * Inputs are controlled by the parent so switching tabs never wipes them.
 */
export function CustomExerciseTab({
  name,
  onNameChange,
  kind,
  onKindChange,
  catalog,
  onCreate,
  onUseLibrary,
}: {
  name: string;
  onNameChange: (name: string) => void;
  kind: ExerciseKind;
  onKindChange: (kind: ExerciseKind) => void;
  catalog: Record<string, ExerciseDescriptor>;
  onCreate: () => void;
  onUseLibrary: (name: string) => void;
}) {
  const { t } = useTranslate();
  const { isDark } = useAppTheme();
  const trimmed = name.trim();
  const duplicate = findCatalogMatch(catalog, trimmed);
  const createDisabled = trimmed.length === 0;

  return (
    <Card radius={20}>
      <AddSearchPad>
        <FieldLabel>{t('exercise.editor.custom.name.label', 'Name')}</FieldLabel>
        <NameWell>
          <SearchInput
            value={name}
            onChangeText={onNameChange}
            placeholder={t('exercise.editor.custom.name.placeholder', 'e.g. Zercher Squat')}
            placeholderTextColor={isDark ? '#6C6C70' : '#8E8E93'}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={createDisabled ? undefined : onCreate}
            accessibilityLabel={t('exercise.editor.custom.name.label', 'Name')}
          />
        </NameWell>
        <FormGap />
        <FieldLabel>{t('exercise.editor.type.label', 'Exercise type')}</FieldLabel>
        <SegmentedControl<ExerciseKind>
          options={[
            { value: 'weighted', label: t('exercise.editor.type.weighted', 'Weighted') },
            { value: 'cardio', label: t('exercise.editor.type.cardio', 'Cardio / Time') },
          ]}
          value={kind}
          onChange={onKindChange}
          accessibilityLabel={t('exercise.editor.type.label', 'Exercise type')}
        />
        {duplicate ? (
          <DuplicateRow>
            <DuplicateText numberOfLines={2}>
              {t('exercise.editor.custom.duplicate_hint', '“{name}” is in the library.', { name: duplicate })}
            </DuplicateText>
            <LinkAction
              onPress={() => onUseLibrary(duplicate)}
              accessibilityRole="button"
              accessibilityLabel={t('exercise.editor.custom.use_library.button', 'Use library version')}
            >
              <LinkActionLabel>{t('exercise.editor.custom.use_library.button', 'Use library version')}</LinkActionLabel>
            </LinkAction>
          </DuplicateRow>
        ) : null}
        <CreateButton
          $disabled={createDisabled}
          onPress={createDisabled ? undefined : onCreate}
          disabled={createDisabled}
          accessibilityRole="button"
          accessibilityLabel={t('exercise.editor.custom.create.button', 'Create exercise')}
          accessibilityState={{ disabled: createDisabled }}
        >
          <CreateLabel>{t('exercise.editor.custom.create.button', 'Create exercise')}</CreateLabel>
        </CreateButton>
        <SearchHint>
          {t(
            'exercise.editor.custom.guidance',
            'Name it, pick a type, and create it — set up reps, rest, and progression on the next screen.',
          )}
        </SearchHint>
      </AddSearchPad>
    </Card>
  );
}

/** Exact (case-insensitive) catalog hit for a typed custom name, if any. */
function findCatalogMatch(
  catalog: Record<string, ExerciseDescriptor>,
  name: string,
): string | undefined {
  if (!name) {
    return undefined;
  }
  const needle = name.toLocaleLowerCase();
  return Object.values(catalog).find((descriptor) => descriptor.name.toLocaleLowerCase() === needle)?.name;
}

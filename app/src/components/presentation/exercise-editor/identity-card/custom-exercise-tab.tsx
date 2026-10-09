import { useTranslate } from '@tolgee/react';
import { useAppTheme } from '@/hooks/useAppTheme';
import { ExerciseDescriptor } from '@/models/exercise-models';
import { translateExerciseMeta } from '@/utils/exercise-meta';
import { useState } from 'react';
import { Pressable } from 'react-native';
import { Card, SegmentedControl, XGlyph } from '../editor-primitives';
import { ExerciseKind } from '../exercise-editor-logic';
import {
  AddSearchPad,
  Chip,
  ChipRow,
  ChipScroll,
  ChipText,
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

const POPULAR_MUSCLES = [
  'chest',
  'back',
  'shoulders',
  'biceps',
  'triceps',
  'quadriceps',
  'hamstrings',
  'glutes',
  'calves',
  'abs',
];

const POPULAR_EQUIPMENT = [
  'barbell',
  'dumbbell',
  'cable',
  'machine',
  'body only',
  'kettlebells',
  'bands',
];

export interface CustomExerciseTabProps {
  name: string;
  onNameChange: (name: string) => void;
  kind: ExerciseKind;
  onKindChange: (kind: ExerciseKind) => void;
  catalog: Record<string, ExerciseDescriptor>;
  onCreate: (descriptor: ExerciseDescriptor) => void;
  onUseLibrary: (name: string) => void;
}

/**
 * The Custom tab of the add-exercise split: name field, Weighted/Cardio
 * picker, muscle & equipment classification, duplicate-name guard,
 * and the explicit Create action.
 */
export function CustomExerciseTab({
  name,
  onNameChange,
  kind,
  onKindChange,
  catalog,
  onCreate,
  onUseLibrary,
}: CustomExerciseTabProps) {
  const { t } = useTranslate();
  const { isDark } = useAppTheme();
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);

  const trimmed = name.trim();
  const duplicate = findCatalogMatch(catalog, trimmed);
  const createDisabled = trimmed.length === 0;

  const handleCreate = () => {
    if (createDisabled) {
      return;
    }
    const descriptor: ExerciseDescriptor = {
      name: trimmed,
      category: kind === 'cardio' ? 'cardio' : 'strength',
      equipment: selectedEquipment,
      muscles: selectedMuscle ? [selectedMuscle] : [],
      instructions: '',
      force: null,
      level: 'beginner',
      mechanic: null,
    };
    onCreate(descriptor);
  };

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
            onSubmitEditing={createDisabled ? undefined : handleCreate}
            accessibilityLabel={t('exercise.editor.custom.name.label', 'Name')}
          />
          {name.length > 0 ? (
            <Pressable
              onPress={() => onNameChange('')}
              accessibilityRole="button"
              accessibilityLabel={t('generic.clear.button', 'Clear')}
              hitSlop={10}
            >
              <XGlyph />
            </Pressable>
          ) : null}
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

        <FormGap />
        <FieldLabel>{t('exercise.editor.custom.muscle.label', 'Target Muscle')}</FieldLabel>
        <ChipScroll horizontal showsHorizontalScrollIndicator={false}>
          <ChipRow>
            {POPULAR_MUSCLES.map((muscle) => {
              const active = selectedMuscle === muscle;
              return (
                <Chip
                  key={muscle}
                  $active={active}
                  onPress={() => setSelectedMuscle(active ? null : muscle)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <ChipText $active={active}>{translateExerciseMeta(t, 'muscle', muscle)}</ChipText>
                </Chip>
              );
            })}
          </ChipRow>
        </ChipScroll>

        <FormGap />
        <FieldLabel>{t('exercise.editor.custom.equipment.label', 'Equipment')}</FieldLabel>
        <ChipScroll horizontal showsHorizontalScrollIndicator={false}>
          <ChipRow>
            {POPULAR_EQUIPMENT.map((equipment) => {
              const active = selectedEquipment === equipment;
              return (
                <Chip
                  key={equipment}
                  $active={active}
                  onPress={() => setSelectedEquipment(active ? null : equipment)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <ChipText $active={active}>{translateExerciseMeta(t, 'equipment', equipment)}</ChipText>
                </Chip>
              );
            })}
          </ChipRow>
        </ChipScroll>

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
          onPress={createDisabled ? undefined : handleCreate}
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
            'Name it, categorize it, and create it — configure sets, rest, and progression next.',
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

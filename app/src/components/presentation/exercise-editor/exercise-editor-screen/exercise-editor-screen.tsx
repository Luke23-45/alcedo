import { useState } from 'react';
import { useTranslate } from '@tolgee/react';
import { CardioExerciseSetBlueprint, ExerciseBlueprint, WeightedExerciseBlueprint } from '@/models/blueprint-models';
import { ExerciseDescriptor } from '@/models/exercise-models';
import { Weight } from '@/models/weight';
import { translateExerciseMeta } from '@/utils/exercise-meta';
import { BackChevronGlyph, MicroLabel, SegmentedControl } from '../editor-primitives';
import { AddSearchCards, IdentityCard, SearchResultItem } from '../identity-card/identity-card';
import { SetConfigCard } from '../set-config-card/set-config-card';
import { DetailCard } from '../detail-card/detail-card';
import { OptionsCard } from '../options-card/options-card';
import { ResistanceCard } from '../resistance-card/resistance-card';
import { ProgressionCard } from '../progression-card/progression-card';
import { CardioSetCard } from '../cardio-set-card/cardio-set-card';
import { RestSheet } from '../rest-sheet/rest-sheet';
import { TypeSwitchDialog } from '../type-switch-dialog/type-switch-dialog';
import {
  addCardioSet,
  ExerciseKind,
  kindOf,
  removeCardioSet,
  restPresetFor,
  searchExercises,
  switchExerciseKind,
  typeSwitchCopy,
} from '../exercise-editor-logic';
import {
  AddSetButton,
  AddSetText,
  ContentBottomPad,
  DirtyDot,
  DirtyRow,
  DirtyText,
  LabelGap,
  NavBack,
  NavDone,
  NavDoneText,
  NavRow,
  NavTitle,
  RemoveSetButton,
  RemoveSetText,
  ScreenRoot,
  SectionGap,
  SetButtonsRow,
  TypePickerPad,
} from './exercise-editor-screen.styles';

export interface ExerciseEditorScreenProps {
  isNew: boolean;
  exercise: ExerciseBlueprint;
  onExerciseChange: (exercise: ExerciseBlueprint) => void;
  dirty: boolean;
  doneDisabled: boolean;
  onDone: () => void;
  onBack: () => void;
  restTimersEnabled: boolean;
  useImperialUnits: boolean;
  bodyweight: Weight | undefined;
  nextExerciseName?: string;
  catalog: Record<string, ExerciseDescriptor>;
  weightSuffix: string;
}

type RestTarget = { kind: 'weighted' } | { kind: 'cardio'; index: number };

export function ExerciseEditorScreen(props: ExerciseEditorScreenProps) {
  const { t } = useTranslate();
  const { exercise, onExerciseChange, isNew } = props;

  const [searchOpen, setSearchOpen] = useState(isNew);
  const [query, setQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [pendingType, setPendingType] = useState<ExerciseKind | null>(null);
  const [restTarget, setRestTarget] = useState<RestTarget | null>(null);

  const kind = kindOf(exercise);
  const isWeighted = exercise instanceof WeightedExerciseBlueprint;
  // S6: before a name is picked, Add mode shows only the search cards — no
  // name well, no type picker. The placeholder underneath is weighted 1×8.
  const showAddSearch = isNew && exercise.name.trim() === '';

  const results: SearchResultItem[] = searchExercises(props.catalog, query).map((descriptor) => {
    const firstMuscle = descriptor.muscles[0];
    const parts = [
      descriptor.equipment ? translateExerciseMeta(t, 'equipment', descriptor.equipment) : undefined,
      firstMuscle ? translateExerciseMeta(t, 'muscle', firstMuscle) : undefined,
    ].filter((part): part is string => !!part);
    return { name: descriptor.name, subtitle: parts.length > 0 ? parts.join(' · ') : undefined };
  });

  const selectExercise = (name: string) => {
    onExerciseChange(exercise.with({ name }));
    setSearchOpen(false);
    setQuery('');
  };

  const requestTypeSwitch = (next: ExerciseKind) => {
    if (next !== kind) {
      setPendingType(next);
    }
  };

  const confirmTypeSwitch = () => {
    if (!pendingType) {
      return;
    }
    onExerciseChange(switchExerciseKind(exercise, pendingType));
    setPendingType(null);
  };

  const typePicker = (
    <TypePickerPad>
      <SegmentedControl<ExerciseKind>
        options={[
          { value: 'weighted', label: t('exercise.editor.type.weighted', 'Weighted') },
          { value: 'cardio', label: t('exercise.editor.type.cardio', 'Cardio / Time') },
        ]}
        value={kind}
        onChange={requestTypeSwitch}
        accessibilityLabel={t('exercise.editor.type.label', 'Exercise type')}
      />
    </TypePickerPad>
  );

  const updateSetAt = (index: number, set: CardioExerciseSetBlueprint) => {
    if (!isWeighted) {
      onExerciseChange(
        exercise.with({
          sets: exercise.sets.map((existing, i) => (i === index ? set : existing)),
        }),
      );
    }
  };

  const searchSectionProps = {
    query,
    onQueryChange: setQuery,
    results,
    onSelectResult: selectExercise,
    searchFocused,
    onSearchFocusChange: setSearchFocused,
  };

  return (
    <ScreenRoot>
      <NavRow>
        <NavBack
          onPress={props.onBack}
          accessibilityRole="button"
          accessibilityLabel={t('generic.back.button', 'Back')}
        >
          <BackChevronGlyph />
        </NavBack>
        <NavTitle numberOfLines={1}>
          {isNew ? t('exercise.add.title', 'Add Exercise') : t('exercise.edit.title', 'Edit Exercise')}
        </NavTitle>
        <NavDone
          $disabled={props.doneDisabled}
          onPress={props.onDone}
          disabled={props.doneDisabled}
          accessibilityRole="button"
          accessibilityLabel={t('exercise.editor.done.button', 'Done')}
          accessibilityState={{ disabled: props.doneDisabled }}
        >
          <NavDoneText>{t('exercise.editor.done.button', 'Done')}</NavDoneText>
        </NavDone>
      </NavRow>

      {props.dirty ? (
        <DirtyRow>
          <DirtyDot />
          <DirtyText>{t('exercise.editor.unsaved_draft', 'Unsaved draft · commits when you leave')}</DirtyText>
        </DirtyRow>
      ) : null}

      <MicroLabel>{t('exercise.editor.section.exercise', 'Exercise').toLocaleUpperCase()}</MicroLabel>
      <LabelGap />
      {showAddSearch ? (
        <AddSearchCards {...searchSectionProps} />
      ) : (
        <IdentityCard
          name={exercise.name}
          searchOpen={searchOpen}
          onToggleSearch={() => setSearchOpen((open) => !open)}
          query={query}
          onQueryChange={setQuery}
          results={results}
          onSelectResult={selectExercise}
          searchFocused={searchFocused}
          onSearchFocusChange={setSearchFocused}
          footer={typePicker}
        />
      )}

      {isWeighted ? (
        <>
          <SectionGap />
          <MicroLabel>{t('exercise.editor.section.set_config', 'Set Configuration').toLocaleUpperCase()}</MicroLabel>
          <LabelGap />
          <SetConfigCard exercise={exercise} onChange={onExerciseChange} />
          <SectionGap />
          <MicroLabel>{t('exercise.editor.section.details', 'Detail').toLocaleUpperCase()}</MicroLabel>
          <LabelGap />
          <DetailCard exercise={exercise} onChange={onExerciseChange} />
          <SectionGap />
          <MicroLabel>{t('exercise.editor.section.options', 'Workout Options').toLocaleUpperCase()}</MicroLabel>
          <LabelGap />
          <OptionsCard
            exercise={exercise}
            onChange={onExerciseChange}
            restTimersEnabled={props.restTimersEnabled}
            nextExerciseName={props.nextExerciseName}
            onOpenRestSheet={() => setRestTarget({ kind: 'weighted' })}
          />
          <SectionGap />
          <MicroLabel>{t('exercise.editor.section.resistance', 'Resistance').toLocaleUpperCase()}</MicroLabel>
          <LabelGap />
          <ResistanceCard
            exercise={exercise}
            onChange={onExerciseChange}
            bodyweight={props.bodyweight}
            useImperialUnits={props.useImperialUnits}
          />
          <SectionGap />
          <MicroLabel>{t('exercise.editor.section.progression', 'Progression').toLocaleUpperCase()}</MicroLabel>
          <LabelGap />
          <ProgressionCard exercise={exercise} onChange={onExerciseChange} weightSuffix={props.weightSuffix} />
        </>
      ) : (
        <>
          <SectionGap />
          <MicroLabel>{t('exercise.editor.type.cardio', 'Cardio / Time').toLocaleUpperCase()}</MicroLabel>
          <LabelGap />
          {exercise.sets.map((set, index) => (
            <CardioSetCard
              key={index}
              set={set}
              index={index}
              onChange={(next) => updateSetAt(index, next)}
              onRemove={() => onExerciseChange(removeCardioSet(exercise, index))}
              removeDisabled={exercise.sets.length <= 1}
              useImperialUnits={props.useImperialUnits}
              restTimersEnabled={props.restTimersEnabled}
              onOpenRestSheet={() => setRestTarget({ kind: 'cardio', index })}
            />
          ))}
          <SetButtonsRow>
            <RemoveSetButton
              $disabled={exercise.sets.length <= 1}
              onPress={() => onExerciseChange(removeCardioSet(exercise, exercise.sets.length - 1))}
              disabled={exercise.sets.length <= 1}
              accessibilityRole="button"
              accessibilityLabel={t('exercise.editor.remove_set', 'Remove set')}
              accessibilityState={{ disabled: exercise.sets.length <= 1 }}
            >
              <RemoveSetText>{t('exercise.editor.remove_set', 'Remove set')}</RemoveSetText>
            </RemoveSetButton>
            <AddSetButton
              onPress={() => onExerciseChange(addCardioSet(exercise))}
              accessibilityRole="button"
              accessibilityLabel={t('exercise.editor.add_set', 'Add set')}
            >
              <AddSetText>{t('exercise.editor.add_set', 'Add set')}</AddSetText>
            </AddSetButton>
          </SetButtonsRow>
          <SectionGap />
          <MicroLabel>{t('exercise.editor.section.details', 'Detail').toLocaleUpperCase()}</MicroLabel>
          <LabelGap />
          <DetailCard exercise={exercise} onChange={onExerciseChange} />
        </>
      )}
      <ContentBottomPad />

      {restTarget?.kind === 'weighted' && isWeighted ? (
        <RestSheet
          rest={exercise.restBetweenSets}
          onChange={(rest) => onExerciseChange(exercise.with({ restBetweenSets: rest }))}
          onClose={() => setRestTarget(null)}
        />
      ) : null}
      {restTarget?.kind === 'cardio' && !isWeighted ? (
        <RestSheet
          rest={exercise.sets[restTarget.index]?.restBetweenSets ?? restPresetFor(60)}
          onChange={(rest) =>
            updateSetAt(restTarget.index, exercise.sets[restTarget.index]!.with({ restBetweenSets: rest }))
          }
          onApplyToAll={() => {
            const source = exercise.sets[restTarget.index]?.restBetweenSets ?? restPresetFor(60);
            onExerciseChange(
              exercise.with({
                sets: exercise.sets.map((set) => set.with({ restBetweenSets: source })),
              }),
            );
          }}
          onClose={() => setRestTarget(null)}
        />
      ) : null}
      {pendingType ? (
        <TypeSwitchDialog
          copy={typeSwitchCopy(exercise, pendingType)}
          onCancel={() => setPendingType(null)}
          onConfirm={confirmTypeSwitch}
        />
      ) : null}
    </ScreenRoot>
  );
}

import { spacing, useAppTheme } from '@/hooks/useAppTheme';
import { useTranslate } from '@tolgee/react';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, View } from 'react-native';
import { Icon, List, Text, TextInput } from 'react-native-paper';
import { PageActions } from '@/components/presentation/foundation/page-actions';
import AddIcon from '@expo/material-symbols/add.xml';
import TouchableRipple from '@/components/presentation/foundation/touchable-ripple';
import { AccordionItem } from '@/components/presentation/foundation/accordion-item';
import { useScroll } from '@/hooks/useScrollListener';
import {
  deleteExercise as deleteExerciseAction,
  selectExerciseById,
  selectExercises,
  setFilteredExerciseIds as setFilteredExerciseIdsAction,
  updateExercise,
} from '@/store/stored-sessions';
import { RootState, useAppSelector, useAppSelectorWithArg } from '@/store';
import { useDispatch, useStore } from 'react-redux';
import { uuid } from '@/utils/uuid';
import { SwipeRow } from 'react-native-swipe-list-view';
import { showSnackbar } from '@/store/app';
import { useMountEffect } from '@/hooks/useMountEffect';
import { buildUndoAction, newExerciseDescriptor } from './exercise-manager-logic';
import ExerciseMuscleSelector from '@/components/presentation/workout-editor/exercise-muscle-selector';
import ExerciseFilterer from '@/components/presentation/workout-editor/exercise-filterer';
import { LegendList } from '@legendapp/list';
import { ExerciseDescriptor } from '@/models/exercise-models';
import { translateExerciseMeta } from '@/utils/exercise-meta';
import { HeaderHeightContext } from 'expo-router/react-navigation';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

function ExerciseListItem({
  exerciseId,
  expand,
  onDelete,
}: {
  exerciseId: string;
  expand: boolean;
  onDelete: () => void;
}) {
  const { colors } = useAppTheme();
  const { t } = useTranslate();
  const exercise = useAppSelectorWithArg(selectExerciseById, exerciseId);
  const [expanded, setExpanded] = useState(expand);
  const [listExpanded, setListExpanded] = useState(expand);

  const rowRef = useRef<SwipeRow<unknown>>(null);
  useEffect(() => {
    rowRef.current?.closeRowWithoutAnimation();
  }, [exerciseId]);
  if (!exercise) {
    return null;
  }

  return (
    // @ts-expect-error -- Swipe row seems to have trouble with typescript, it works
    <SwipeRow disableRightSwipe ref={rowRef} rightActivationValue={-70} rightActionValue={-70} rightOpenValue={-70}>
      <View
        style={{
          alignItems: 'flex-end',
          justifyContent: 'center',
          flex: 1,
          paddingVertical: 4,
        }}
      >
        <TouchableRipple
          onPress={onDelete}
          style={{
            height: '100%',
            width: 70,
            backgroundColor: colors.error,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          accessibilityRole="button"
          accessibilityLabel={t('exercise.delete.label', 'Delete {name}', { name: exercise.name })}
          testID={`exercise-delete-btn-${exerciseId}`}
        >
          <Icon source={'delete'} size={30} color={colors.onError} />
        </TouchableRipple>
      </View>
      <List.Accordion
        title={exercise.name}
        // Important to have a space to ensure they are all the same size
        // Otherwise delete button can show through when there is no desc
        description={exercise.muscles.map((m) => translateExerciseMeta(t, 'muscle', m)).join(', ') || ' '}
        descriptionNumberOfLines={1}
        expanded={listExpanded}
        onPress={() => {
          if (rowRef.current?.isOpen) {
            return;
          }
          if (!expanded) {
            setListExpanded(true);
            setExpanded(true);
          } else {
            setExpanded(false);
          }
        }}
        testID={`exercise-accordion-${exerciseId}`}
      >
        <AccordionItem
          isExpanded={expanded}
          onToggled={(isOpen) => {
            setExpanded(isOpen);
            if (!isOpen) {
              // Wait until collapse finishes before unmounting
              setListExpanded(false);
            }
          }}
        >
          <ExerciseEditSheet exercise={exercise} exerciseId={exerciseId} />
        </AccordionItem>
      </List.Accordion>
    </SwipeRow>
  );
}

export default function ExerciseManager() {
  const dispatch = useDispatch();
  const { t } = useTranslate();
  const { space } = useAppTheme();
  const { getState } = useStore<RootState>();
  const exercises = useAppSelector(selectExercises);
  const filteredExerciseIds = useAppSelector((s) => s.storedSessions.filteredExerciseIds);
  const setFilteredExerciseIds = (ids: string[]) => {
    dispatch(setFilteredExerciseIdsAction(ids));
  };

  useMountEffect(() => {
    setFilteredExerciseIds(Object.keys(exercises));
    setFiltersInitialized(true);
  });
  const insets = useSafeAreaInsets();
  const headerHeight = useContext(HeaderHeightContext); // Intentionally don't use useHeaderHeight as it might not be in a stack
  const topInsetHeight = Platform.select({ ios: headerHeight }) ?? 0;
  const [floatingBottomSize, setFloatingBottomSize] = useState(0);
  // filteredExerciseIds starts empty before the mount effect runs; the
  // empty state must not flash on that first frame.
  const [filtersInitialized, setFiltersInitialized] = useState(false);
  const bottomInsetHeight = floatingBottomSize + (Platform.select({ ios: insets.bottom }) ?? 0);
  // Honest empty state: nothing rendered until the mount effect has seeded
  // the filtered list, so the pre-init frame never flashes "no matches".
  const showEmptyState = filtersInitialized && filteredExerciseIds.length === 0;

  const addExercise = () => {
    const newId = uuid();
    dispatch(updateExercise({ id: newId, exercise: newExerciseDescriptor() }));
    setFilteredExerciseIds([newId]);
  };

  const deleteExercise = (id: string) => {
    const state = getState().storedSessions;
    const isBuiltIn = !!state.builtInExercises[id];
    const savedExercise = state.savedExercises[id];
    const exercise = exercises[id];
    if (!exercise) {
      return;
    }

    setFilteredExerciseIds(filteredExerciseIds.filter((x) => x !== id));
    dispatch(deleteExerciseAction(id));
    // Built-ins are tombstoned by deleteExercise (an override row, if the
    // user edited the built-in, is kept), so undo lifts the tombstone;
    // user exercises are re-inserted from the saved copy.
    const undoAction = buildUndoAction(id, { isBuiltIn, savedExercise });
    dispatch(
      showSnackbar({
        text: t('deletion.item_deleted.message', { name: exercise.name }),
        action: t('generic.undo.button'),
        dispatchAction: [undoAction, setFilteredExerciseIdsAction(filteredExerciseIds)],
      }),
    );
  };

  const flatListItems = useMemo(
    () => ['filter', ...(showEmptyState ? ['empty'] : filteredExerciseIds)],
    [filteredExerciseIds, showEmptyState],
  );
  const { handleScroll } = useScroll();
  return (
    <SafeAreaView style={{ flex: 1 }} edges={{ left: 'additive', right: 'additive', top: 'off', bottom: 'off' }}>
      <LegendList
        onScroll={handleScroll}
        contentContainerStyle={{
          // ME01: insetBlockStart/End are web logical props LegendList never
          // maps — dead on native. Same values, valid properties.
          paddingTop: topInsetHeight,
          paddingBottom: bottomInsetHeight,
        }}
        style={{ flex: 1 }}
        data={flatListItems}
        getItemType={(_, index) => (index === 0 ? 'filters' : flatListItems[index] === 'empty' ? 'empty' : 'exercise')}
        keyExtractor={(item, index) => (index === 0 ? 'filters' : item)}
        renderItem={({ item, index }) => {
          if (index === 0) {
            return (
              <ExerciseFilterer
                exerciseName=""
                onFilteredExerciseIdsChange={setFilteredExerciseIds}
                onSuggestedNewExercise={() => {}}
              />
            );
          }
          if (item === 'empty') {
            // The library itself is empty on a fresh install before the
            // built-ins load; otherwise the filters matched nothing.
            const libraryEmpty = Object.keys(exercises).length === 0;
            return (
              <View style={{ padding: space.xl, alignItems: 'center' }}>
                <Text variant="bodyMedium">
                  {t(libraryEmpty ? 'generic.nothing_here_yet.message' : 'exercise.search.no_results')}
                </Text>
              </View>
            );
          }
          return (
            <ExerciseListItem
              exerciseId={item}
              expand={flatListItems.length === 2}
              onDelete={() => deleteExercise(item)}
            />
          );
        }}
      />
      <View
        onLayout={(event) => setFloatingBottomSize(event.nativeEvent.layout.height)}
        style={{
          position: 'absolute',
          bottom: Platform.select({ ios: insets.bottom }) ?? 0,
          width: '100%',
        }}
      >
        <PageActions
          primary={{
            label: t('exercise.add.button'),
            icon: AddIcon,
            systemImage: 'plus',
            onPress: addExercise,
          }}
        />
      </View>
    </SafeAreaView>
  );
}

function ExerciseEditSheet({ exercise, exerciseId }: { exercise: ExerciseDescriptor; exerciseId: string }) {
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const update = (ex: Partial<ExerciseDescriptor>) => {
    dispatch(updateExercise({ exercise: { ...exercise, ...ex }, id: exerciseId }));
  };
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: spacing.pageHorizontalMargin,
        gap: spacing[2],
      }}
    >
      <TextInput
        label={t('exercise.name.label')}
        value={exercise.name}
        onChangeText={(name) => update({ name })}
        testID="exercise-name-input"
      />
      <TextInput
        label={t('generic.instructions.label')}
        value={exercise.instructions}
        onChangeText={(instructions) => update({ instructions })}
        multiline
        testID="exercise-instructions-input"
      />
      <ExerciseMuscleSelector muscles={exercise.muscles} onChange={(muscles) => update({ muscles })} />
    </View>
  );
}

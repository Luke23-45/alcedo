import ConfirmationDialog from '@/components/presentation/foundation/confirmation-dialog';
import Menu from '@/components/presentation/foundation/menu';
import { HomeScreenBackground } from '@/components/presentation/home/shared/home-auras';
import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { getSessionExerciseEditorHref } from '@/components/smart/session-exercise-editor';
import { useAppReducedMotion } from '@/hooks/useMotionSettings';
import { useOnDismiss } from '@/hooks/useOnDismiss';
import { useAppTheme } from '@/hooks/useAppTheme';
import { ExerciseBlueprint, WeightedExerciseBlueprint } from '@/models/blueprint-models';
import { Session } from '@/models/session-models';
import { Weight } from '@/models/weight';
import { useAppSelector, useAppSelectorWithArg } from '@/store';
import { selectSession, updateStoredSession } from '@/store/stored-sessions';
import { localeFormatBigNumber } from '@/utils/locale-bignumber';
import { useTranslate } from '@tolgee/react';
import { Href, Stack, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { TextInput } from 'react-native';
import { Gesture, GestureDetector, ScrollView } from 'react-native-gesture-handler';
import { runOnJS, SharedValue, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Ellipse, G, Line, Path, RadialGradient, Rect, Stop } from 'react-native-svg';
import { useDispatch } from 'react-redux';
import { buildDraftCommitUpdate, resolveDraftName, shouldCommitDraftOnDismiss, type DraftDismissIntent } from './draft';
import { countPlanSets, estimatePlanMinutes, estimatePlanVolumeKg, formatRowSummary } from './plan-estimates';
import { reorderExercises } from './reorder';
import * as S from './session-workout-editor.styles';

export function getSessionWorkoutEditorHref(sessionId: string, opts?: { focusNotes?: boolean }): Href {
  const params = `sessionId=${encodeURIComponent(sessionId)}${opts?.focusNotes ? '&focus=notes' : ''}`;
  return `/workout-editor?${params}` as Href;
}

/* ------------------------------------------------------------------ *
 * Geometry (three-canvas redesign, 393×852)
 * ------------------------------------------------------------------ */

const ROW_HEIGHT = 64;
const ROW_GAP = 10;
/** Visual pitch of a row: 64pt row + 1pt divider + 9pt breathing room. */
const PITCH = ROW_HEIGHT + ROW_GAP;

/* ------------------------------------------------------------------ *
 * Glyphs — drawn from the spec's geometry.
 * ------------------------------------------------------------------ */

function DotsGlyph() {
  const theme = useAppTheme();
  return (
    <Svg width={18} height={8} viewBox="0 0 18 8">
      <G fill={theme.home.seeAll}>
        <Circle cx={2} cy={4} r={2} />
        <Circle cx={9} cy={4} r={2} />
        <Circle cx={16} cy={4} r={2} />
      </G>
    </Svg>
  );
}

function BackGlyph() {
  const theme = useAppTheme();
  return (
    <Svg width={12} height={20} viewBox="-6 -10 12 20">
      <Path
        d="M2 -7 L-4 0 L2 7"
        fill="none"
        stroke={theme.home.seeAll}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function DragHandleGlyph() {
  const theme = useAppTheme();
  return (
    <Svg width={12} height={14} viewBox="0 0 12 14">
      <G fill={theme.isDark ? '#6C6C70' : '#AEAEB2'}>
        <Rect x={0} y={0} width={12} height={2} rx={1} />
        <Rect x={0} y={6} width={12} height={2} rx={1} />
        <Rect x={0} y={12} width={12} height={2} rx={1} />
      </G>
    </Svg>
  );
}

function ChevronGlyph() {
  const theme = useAppTheme();
  return (
    <Svg width={8} height={12} viewBox="-4 -6 8 12">
      <Path
        d="M-2 -4 L2 0 L-2 4"
        fill="none"
        stroke={theme.isDark ? '#48484A' : '#C7C7CC'}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function PlusGlyph() {
  const theme = useAppTheme();
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16">
      <G stroke={theme.home.seeAll} strokeWidth={2.1} strokeLinecap="round">
        <Line x1={0} y1={8} x2={16} y2={8} />
        <Line x1={8} y1={0} x2={8} y2={16} />
      </G>
    </Svg>
  );
}

/** Dumbbell from the empty-state geometry: plates plus bar, rounded joins. */
function DumbbellGlyph() {
  const theme = useAppTheme();
  return (
    <Svg width={42} height={24} viewBox="-21 -12 42 24">
      <G fill="none" stroke={theme.color.content.tertiary} strokeLinecap="round">
        <Rect x={-15} y={-6} width={5} height={12} rx={2} strokeWidth={1.8} />
        <Rect x={10} y={-6} width={5} height={12} rx={2} strokeWidth={1.8} />
        <Line x1={-10} y1={0} x2={10} y2={0} strokeWidth={2.6} />
      </G>
    </Svg>
  );
}

function ScreenAura() {
  const theme = useAppTheme();
  return (
    <S.AuraWrap pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 393 852" preserveAspectRatio="xMidYMin slice">
        <Defs>
          <RadialGradient id="workoutEditorAura" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#FF9F0A" stopOpacity={theme.isDark ? 0.13 : 0.07} />
            <Stop offset="100%" stopColor="#FF9F0A" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={70} cy={160} rx={290} ry={290} fill="url(#workoutEditorAura)" />
      </Svg>
    </S.AuraWrap>
  );
}

/* ------------------------------------------------------------------ *
 * Draggable row
 * ------------------------------------------------------------------ */

type DragShared = {
  /** Index of the row being dragged, -1 when idle. */
  active: SharedValue<number>;
  /** Slot the dragged row currently hovers, in row indices. */
  target: SharedValue<number>;
  /** Live finger translation of the dragged row, in points. */
  dy: SharedValue<number>;
};

type RowCallbacks = {
  onDragBegin: () => void;
  onDragCommit: (from: number, to: number) => void;
  onDragCancel: () => void;
};

/**
 * Builds the handle-only pan gesture for a row. Lives at module scope (a plain
 * function, not a component or hook) so mutating the reanimated shared values
 * stays out of the React Compiler's prop-mutation tracking.
 */
function createRowPanGesture(
  index: number,
  total: number,
  drag: DragShared,
  reduceMotion: boolean,
  callbacks: { current: RowCallbacks },
) {
  return Gesture.Pan()
    .activeOffsetY([-8, 8])
    .failOffsetX([-12, 12])
    .onBegin(() => {
      drag.active.value = index;
      drag.target.value = index;
      drag.dy.value = 0;
      runOnJS(() => callbacks.current.onDragBegin())();
    })
    .onUpdate((event) => {
      drag.dy.value = event.translationY;
      drag.target.value = Math.min(total - 1, Math.max(0, Math.round(index + event.translationY / PITCH)));
    })
    .onFinalize((_, success) => {
      const from = index;
      const to = drag.target.value;
      if (success && to !== from) {
        // Glide exactly onto the target slot first; the commit then swaps
        // the natural order underneath with zero visual jump.
        drag.dy.value = withTiming((to - from) * PITCH, { duration: reduceMotion ? 0 : 140 }, (finished) => {
          if (finished) {
            runOnJS(() => callbacks.current.onDragCommit(from, to))();
          }
        });
      } else {
        drag.dy.value = withTiming(0, { duration: reduceMotion ? 0 : 180 });
        drag.active.value = -1;
        runOnJS(() => callbacks.current.onDragCancel())();
      }
    });
}

function ExerciseRow(props: {
  index: number;
  total: number;
  name: string;
  summary: string;
  drag: DragShared;
  onPress: () => void;
  onLongPress: () => void;
  onDragBegin: () => void;
  onDragCommit: (from: number, to: number) => void;
  onDragCancel: () => void;
}) {
  const { index, total, drag } = props;
  const { t } = useTranslate();
  const reduceMotion = useAppReducedMotion();
  const last = index === total - 1;

  const animatedStyle = useAnimatedStyle(() => {
    const active = drag.active.value;
    if (active === -1) {
      return {};
    }
    if (active === index) {
      return { transform: [{ translateY: drag.dy.value }], zIndex: 10 };
    }
    const target = drag.target.value;
    let shift = 0;
    if (active < target && index > active && index <= target) {
      shift = -PITCH;
    } else if (active > target && index < active && index >= target) {
      shift = PITCH;
    }
    return {
      transform: [{ translateY: withTiming(shift, { duration: reduceMotion ? 0 : 170 }) }],
      zIndex: 1,
    };
  });

  // The lifted row reads as picked up: a brand border fades in over the row.
  const borderStyle = useAnimatedStyle(() => ({
    opacity: withTiming(drag.active.value === index ? 1 : 0, { duration: reduceMotion ? 0 : 150 }),
  }));

  // The gesture object needs a stable identity for GestureDetector, so the
  // callbacks it invokes go through a ref and stay out of the dependency list.
  const callbacks = useRef<RowCallbacks>(props);
  useEffect(() => {
    callbacks.current = props;
  });
  const pan = useMemo(
    () => createRowPanGesture(index, total, drag, reduceMotion, callbacks),
    [index, total, drag, reduceMotion, callbacks],
  );

  return (
    <S.RowSlot style={animatedStyle} $last={last}>
      <S.ActiveBorder style={borderStyle} pointerEvents="none" />
      <S.RowPress
        onPress={props.onPress}
        onLongPress={props.onLongPress}
        accessibilityRole="button"
        accessibilityLabel={props.name || t('workout.editor.untitled_exercise', 'Untitled exercise')}
      >
        <GestureDetector gesture={pan}>
          <S.GrabZone
            accessibilityRole="button"
            accessibilityLabel={t('workout.editor.drag_to_reorder.label', 'Drag to reorder')}
          >
            <S.Grip>
              <DragHandleGlyph />
            </S.Grip>
            <S.NumberTile>
              <S.NumberText style={{ fontVariant: ['tabular-nums'] }}>{index + 1}</S.NumberText>
            </S.NumberTile>
          </S.GrabZone>
        </GestureDetector>
        <S.RowTexts>
          {props.name ? (
            <S.RowName numberOfLines={1}>{props.name}</S.RowName>
          ) : (
            <S.RowNameEmpty numberOfLines={1}>
              {t('workout.editor.untitled_exercise', 'Untitled exercise')}
            </S.RowNameEmpty>
          )}
          <S.RowSummary numberOfLines={1}>{props.summary}</S.RowSummary>
        </S.RowTexts>
        <ChevronGlyph />
      </S.RowPress>
      {!last && <S.RowDivider />}
    </S.RowSlot>
  );
}

/* ------------------------------------------------------------------ *
 * Screen
 * ------------------------------------------------------------------ */

export function SessionWorkoutEditor(props: { sessionId: string; focusNotes?: boolean }) {
  const { sessionId, focusNotes = false } = props;
  const theme = useAppTheme();
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const { push, dismiss } = useRouter();
  const insets = useSafeAreaInsets();
  const reduceMotion = useAppReducedMotion();

  const workout = useAppSelectorWithArg(selectSession, sessionId);
  const useImperialUnits = useAppSelector((x) => x.settings.useImperialUnits);
  const displayUnit = useImperialUnits ? 'pounds' : 'kilograms';

  const [name, setName] = useState(workout?.blueprint.name ?? '');
  const [nameFocused, setNameFocused] = useState(false);
  const [notes, setNotes] = useState(workout?.blueprint.notes ?? '');
  const [dragging, setDragging] = useState(false);
  const [confirmingClear, setConfirmingClear] = useState(false);
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);

  // Name and notes are local drafts: typing never touches the store. The
  // draft commits on Save and on ordinary dismissal; only Cancel discards it.
  // Refs feed the unmount-time commit, which always sees the latest values.
  const nameRef = useRef(name);
  const notesRef = useRef(notes);
  const nameDirty = useRef(false);
  const notesDirty = useRef(false);
  const dismissIntent = useRef<DraftDismissIntent>(null);

  const dragActive = useSharedValue(-1);
  const dragTarget = useSharedValue(0);
  const dragDy = useSharedValue(0);
  const drag: DragShared = { active: dragActive, target: dragTarget, dy: dragDy };

  const scrollRef = useRef<ScrollView>(null);
  const notesInputRef = useRef<TextInput>(null);
  const notesSectionY = useRef(0);

  // Stable row keys across reorders: the blueprint objects are immutable, so
  // identity survives the array shuffle and rows keep their instances.
  const rowKeys = useRef(new WeakMap<ExerciseBlueprint, number>());
  const rowKeyCounter = useRef(0);
  const rowKeyFor = (blueprint: ExerciseBlueprint) => {
    let key = rowKeys.current.get(blueprint);
    if (key === undefined) {
      key = rowKeyCounter.current++;
      rowKeys.current.set(blueprint, key);
    }
    return `exercise-${key}`;
  };

  const commitDraft = () => {
    const nextName = resolveDraftName(nameRef.current, nameDirty.current, workout?.blueprint.name);
    dispatch(
      updateStoredSession({
        sessionId,
        update: buildDraftCommitUpdate(nextName, notesDirty.current ? notesRef.current : undefined),
      }),
    );
    nameDirty.current = false;
    notesDirty.current = false;
  };

  // Ordinary dismissal (back chevron, swipe-back) commits the draft; only an
  // explicit Cancel discards it.
  useOnDismiss(() => {
    if (shouldCommitDraftOnDismiss(dismissIntent.current)) {
      commitDraft();
    }
  });

  const updateSession = (update: (s: Session) => Session) => {
    dispatch(updateStoredSession({ sessionId, update }));
  };

  // Add flow: insert a default exercise and open the editor in Add mode, where
  // the inline search picks the real exercise. Backing out keeps the exercise
  // in the plan with its defaults — the choice is named, not hidden.
  const openAddExercise = () => {
    if (!workout) {
      return;
    }
    const newIndex = workout.recordedExercises.length;
    updateSession((s) =>
      s.withAddedExercise(
        WeightedExerciseBlueprint.of({ sets: 1, repsConfig: { type: 'fixed', reps: 8 } }),
        useImperialUnits,
      ),
    );
    push(getSessionExerciseEditorHref(sessionId, newIndex, { isNew: true }));
  };

  const onSave = () => {
    dismissIntent.current = 'save';
    commitDraft();
    dismiss();
  };

  const onBack = () => {
    dismissIntent.current = null;
    commitDraft();
    dismiss();
  };

  const onCancel = () => {
    dismissIntent.current = 'cancel';
    dismiss();
  };

  const onDiscardChanges = () => {
    dismissIntent.current = 'cancel';
    dismiss();
  };

  const onChangeName = (value: string) => {
    nameRef.current = value;
    nameDirty.current = true;
    setName(value);
  };

  const onChangeNotes = (value: string) => {
    notesRef.current = value;
    notesDirty.current = true;
    setNotes(value);
  };

  const onDragBegin = () => setDragging(true);
  const onDragCancel = () => setDragging(false);
  const onDragCommit = (from: number, to: number) => {
    // The dragged row already glided exactly onto its target slot, so zeroing
    // the shared offsets in the same tick as the reorder is visually seamless.
    dragActive.value = -1;
    dragDy.value = 0;
    setDragging(false);
    updateSession((s) => reorderExercises(s, from, to));
  };

  const clearAllExercises = () => {
    updateSession((s) =>
      s.with({
        blueprint: s.blueprint.with({ exercises: [] }),
        recordedExercises: [],
      }),
    );
  };

  useEffect(() => {
    if (!workout) {
      dismiss();
    }
  }, [workout, dismiss]);

  // Opened from the notes card: land on the notes field, keyboard up.
  useEffect(() => {
    if (!focusNotes) {
      return;
    }
    const id = setTimeout(() => {
      scrollRef.current?.scrollTo({ y: Math.max(0, notesSectionY.current - 140), animated: !reduceMotion });
      notesInputRef.current?.focus();
    }, 450);
    return () => clearTimeout(id);
  }, [focusNotes, reduceMotion]);

  // Hooks must run before the early return below: these don't depend on workout.
  const dropIndicatorStyle = useAnimatedStyle(() => {
    if (dragActive.value === -1) {
      return { opacity: 0 };
    }
    return {
      opacity: 1,
      transform: [{ translateY: dragTarget.value * PITCH - ROW_GAP / 2 }],
    };
  });

  if (!workout) {
    return null;
  }

  const exercises = workout.blueprint.exercises;
  const totalSets = countPlanSets(workout);
  const volumeKg = estimatePlanVolumeKg(workout);
  const minutes = estimatePlanMinutes(workout);

  const volumeText =
    volumeKg === undefined
      ? '–'
      : localeFormatBigNumber(new Weight(volumeKg, 'kilograms').convertTo(displayUnit).value, 0);
  const volumeLabel = `${useImperialUnits ? 'LBS' : 'KG'} · ${t('workout.editor.meta.est_volume', 'EST. VOLUME')}`;
  const formatWeight = (kg: number) => new Weight(kg, 'kilograms').convertTo(displayUnit).shortLocaleFormat();

  const isDirty = nameDirty.current || notesDirty.current;

  return (
    <S.Screen>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView
        edges={{ top: 'additive', bottom: 'off', left: 'additive', right: 'additive' }}
        style={{ flex: 1, backgroundColor: theme.color.background.base }}
      >
        <HomeScreenBackground />
        <ScreenAura />

        <S.NavRow>
          <S.NavSideButton
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel={t('generic.back.button', 'Back')}
          >
            <BackGlyph />
          </S.NavSideButton>
          <S.NavTitle>{t('workout.editor.title', 'Edit Plan')}</S.NavTitle>
          <Menu
            trigger={(open) => (
              <S.MenuTrigger
                onPress={open}
                accessibilityRole="button"
                accessibilityLabel={t('workout.editor.more_options.label', 'More options')}
              >
                <DotsGlyph />
              </S.MenuTrigger>
            )}
            items={[
              {
                label: t('workout.editor.remove_all_exercises.button', 'Remove All Exercises'),
                systemImage: 'trash',
                destructive: true,
                disabled: exercises.length === 0,
                onPress: () => setConfirmingClear(true),
              },
              {
                label: t('workout.editor.discard_changes.button', 'Discard Changes'),
                systemImage: 'xmark',
                destructive: true,
                disabled: !isDirty,
                onPress: onDiscardChanges,
              },
            ]}
          />
        </S.NavRow>

        <S.DraftStrip>
          <S.DraftDot />
          <S.DraftText>
            {t('workout.editor.draft_strip', 'Unsaved draft · commits on Save or swipe back · only Cancel discards')}
          </S.DraftText>
        </S.DraftStrip>

        <S.Scroll ref={scrollRef} scrollEnabled={!dragging} showsVerticalScrollIndicator={false}>
          <S.Content>
            <S.PlanNameWrap>
              <S.MicroLabel>{t('workout.editor.plan_name.label', 'Plan name')}</S.MicroLabel>
              <S.PlanNameInput
                testID="workout-name"
                value={name}
                onChangeText={onChangeName}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
                placeholder={t('workout.editor.plan_name.placeholder', 'Untitled workout')}
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={onSave}
                accessibilityLabel={t('workout.editor.plan_name.label', 'Plan name')}
              />
              <S.PlanNameUnderline $focused={nameFocused} />
            </S.PlanNameWrap>

            <S.Section>
              <HomeCard radius={24} pad={0} elev="card">
                <S.MetaBody>
                  <S.MetaRow>
                    <S.MetaCol>
                      <S.MetaValue style={{ fontVariant: ['tabular-nums'] }}>{exercises.length}</S.MetaValue>
                      <S.MetaLabel>{t('workout.editor.meta.exercises', 'Exercises')}</S.MetaLabel>
                    </S.MetaCol>
                    <S.MetaDivider />
                    <S.MetaCol>
                      <S.MetaValue style={{ fontVariant: ['tabular-nums'] }}>{totalSets}</S.MetaValue>
                      <S.MetaLabel>{t('workout.editor.meta.sets', 'Sets')}</S.MetaLabel>
                    </S.MetaCol>
                    <S.MetaDivider />
                    <S.MetaCol>
                      <S.MetaValue style={{ fontVariant: ['tabular-nums'] }}>{volumeText}</S.MetaValue>
                      <S.MetaLabel>{volumeLabel}</S.MetaLabel>
                    </S.MetaCol>
                    <S.MetaDivider />
                    <S.MetaCol>
                      <S.MetaValue style={{ fontVariant: ['tabular-nums'] }}>
                        {minutes === undefined ? '–' : minutes}
                      </S.MetaValue>
                      <S.MetaLabel>{t('workout.editor.meta.est_time', 'MIN · EST. TIME')}</S.MetaLabel>
                    </S.MetaCol>
                  </S.MetaRow>
                  <S.MetaFootnote>
                    {t('workout.editor.meta.computed_from_history', 'Computed from logged history')}
                  </S.MetaFootnote>
                </S.MetaBody>
              </HomeCard>
            </S.Section>

            <S.Section onLayout={(event) => (notesSectionY.current = event.nativeEvent.layout.y)}>
              <S.SectionHeaderRow>
                <S.MicroLabel>{t('workout.editor.notes.label', 'Notes')}</S.MicroLabel>
                <S.NotesHint>{t('workout.editor.notes.hint', 'no limit · optional')}</S.NotesHint>
              </S.SectionHeaderRow>
              <HomeCard radius={24} pad={16} elev="card">
                <S.NotesInput
                  ref={notesInputRef}
                  value={notes}
                  onChangeText={onChangeNotes}
                  placeholder={t('workout.editor.notes.placeholder', 'Add session notes…')}
                  multiline
                  autoCorrect
                  onFocus={() =>
                    scrollRef.current?.scrollTo({
                      y: Math.max(0, notesSectionY.current - 140),
                      animated: !reduceMotion,
                    })
                  }
                  accessibilityLabel={t('workout.editor.notes.label', 'Notes')}
                />
              </HomeCard>
            </S.Section>

            <S.Section>
              <S.SectionHeaderRow>
                <S.MicroLabel>{t('workout.editor.exercises.label', 'Exercises')}</S.MicroLabel>
                {exercises.length > 0 && (
                  <S.HeaderHint>{t('workout.editor.drag_to_reorder.label', 'Drag to reorder')}</S.HeaderHint>
                )}
              </S.SectionHeaderRow>
              {exercises.length === 0 ? (
                <HomeCard radius={28} pad={0} elev="card">
                  <S.EmptyBody>
                    <S.EmptyIconRing>
                      <DumbbellGlyph />
                    </S.EmptyIconRing>
                    <S.EmptyTitle>{t('workout.editor.empty.title', 'Workout contains no exercises.')}</S.EmptyTitle>
                    <S.EmptyBodyText>
                      {t('workout.editor.empty.body', 'Add your first exercise to build this plan.')}
                    </S.EmptyBodyText>
                    <S.EmptyAddButton>
                      <S.EmptyAddPress
                        onPress={openAddExercise}
                        accessibilityRole="button"
                        accessibilityLabel={t('workout.editor.add_exercise.button', 'Add Exercise')}
                      >
                        <PlusGlyph />
                        <S.EmptyAddLabel>{t('workout.editor.add_exercise.button', 'Add Exercise')}</S.EmptyAddLabel>
                      </S.EmptyAddPress>
                    </S.EmptyAddButton>
                  </S.EmptyBody>
                </HomeCard>
              ) : (
                <HomeCard radius={24} pad={16} elev="card">
                  <S.RowsClip>
                    {exercises.map((blueprint, index) => (
                      <ExerciseRow
                        key={rowKeyFor(blueprint)}
                        index={index}
                        total={exercises.length}
                        name={blueprint.name}
                        summary={formatRowSummary(
                          blueprint,
                          workout.recordedExercises[index],
                          workout.bodyweight,
                          formatWeight,
                          t('workout.editor.bodyweight.label', 'Bodyweight'),
                        )}
                        drag={drag}
                        onPress={() => push(getSessionExerciseEditorHref(sessionId, index))}
                        onLongPress={() => setRemovingIndex(index)}
                        onDragBegin={onDragBegin}
                        onDragCommit={onDragCommit}
                        onDragCancel={onDragCancel}
                      />
                    ))}
                    <S.DropIndicator style={dropIndicatorStyle} pointerEvents="none">
                      <S.DropDot />
                      <S.DropDash />
                      <S.DropDot />
                    </S.DropIndicator>
                  </S.RowsClip>
                </HomeCard>
              )}
              {dragging && (
                <S.ReorderCaption>
                  {t(
                    'workout.editor.reorder_caption',
                    'Reorder commits index changes to the store on drop. Blueprint and recorded exercises stay aligned 1-for-1.',
                  )}
                </S.ReorderCaption>
              )}
            </S.Section>

            {exercises.length === 0 && (
              <S.Section>
                <S.BehaviorCard>
                  <S.BehaviorBody>
                    <S.BehaviorKicker>
                      {t('workout.editor.add_behavior.kicker', 'ADD BEHAVIOR · DELIBERATE')}
                    </S.BehaviorKicker>
                    <S.BehaviorText>
                      {t(
                        'workout.editor.add_behavior.body',
                        'Tap adds the exercise to the plan immediately. The configuration sheet opens next. Backing out keeps the exercise in the plan with defaults.',
                      )}
                    </S.BehaviorText>
                  </S.BehaviorBody>
                </S.BehaviorCard>
              </S.Section>
            )}

            <S.Footnote>
              {t(
                'workout.editor.formula_footnote',
                'Est. time = 45s/set work + rests + 60s between exercises. Row weights are last-recorded, not plan targets.',
              )}
            </S.Footnote>
          </S.Content>
        </S.Scroll>

        <S.FooterBar style={{ paddingBottom: insets.bottom + 10 }}>
          {exercises.length === 0 ? (
            <S.CancelButton
              onPress={onCancel}
              accessibilityRole="button"
              accessibilityLabel={t('generic.cancel.button', 'Cancel')}
            >
              <S.CancelLabel>{t('generic.cancel.button', 'Cancel')}</S.CancelLabel>
            </S.CancelButton>
          ) : (
            <>
              <S.FooterRow>
                <S.AddButton
                  onPress={openAddExercise}
                  accessibilityRole="button"
                  accessibilityLabel={t('workout.editor.add_exercise.button', 'Add Exercise')}
                >
                  <PlusGlyph />
                  <S.AddButtonLabel>{t('workout.editor.add_exercise.button', 'Add Exercise')}</S.AddButtonLabel>
                </S.AddButton>
                <S.SaveButtonShell>
                  <S.SaveButton
                    onPress={onSave}
                    accessibilityRole="button"
                    accessibilityLabel={t('workout.editor.save.button', 'Save Plan')}
                  >
                    <S.SaveGloss />
                    <S.SaveButtonLabel>{t('workout.editor.save.button', 'Save Plan')}</S.SaveButtonLabel>
                  </S.SaveButton>
                </S.SaveButtonShell>
              </S.FooterRow>
              <S.SaveSubcaption>
                {t('workout.editor.save_subcaption', 'Changes apply to this session only.')}
              </S.SaveSubcaption>
            </>
          )}
        </S.FooterBar>
      </SafeAreaView>

      <ConfirmationDialog
        open={confirmingClear}
        headline={t('workout.editor.remove_all_exercises.confirm.title', 'Remove all exercises?')}
        textContent={t('workout.editor.remove_all_exercises.confirm.body', {
          defaultValue: 'All {count} exercises will be removed. This cannot be undone. Past sessions are not affected.',
          count: exercises.length,
        })}
        okText={t('workout.editor.remove_all_exercises.confirm.ok', 'Remove all')}
        destructive
        onCancel={() => setConfirmingClear(false)}
        onOk={() => {
          setConfirmingClear(false);
          clearAllExercises();
        }}
      />
      <ConfirmationDialog
        open={removingIndex !== null}
        headline={t('exercise.remove.confirm.title', 'Remove exercise?')}
        textContent={t('workout.editor.remove_exercise.confirm.body', {
          defaultValue: '{name} will be removed from this plan. Recorded history for past sessions is not affected.',
          name:
            removingIndex !== null
              ? workout.blueprint.exercises[removingIndex]?.name ||
                t('workout.editor.untitled_exercise', 'Untitled exercise')
              : '',
        })}
        okText={t('generic.remove.button', 'Remove')}
        destructive
        onCancel={() => setRemovingIndex(null)}
        onOk={() => {
          const index = removingIndex;
          setRemovingIndex(null);
          if (index !== null) {
            updateSession((s) => s.withRemovedExercise(index));
          }
        }}
      />
    </S.Screen>
  );
}

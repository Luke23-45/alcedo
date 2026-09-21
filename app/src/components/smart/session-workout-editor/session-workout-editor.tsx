import ConfirmationDialog from '@/components/presentation/foundation/confirmation-dialog';
import Menu from '@/components/presentation/foundation/menu';
import { HomeScreenBackground } from '@/components/presentation/home/shared/home-auras';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useOnDismiss } from '@/hooks/useOnDismiss';
import {
  ExerciseBlueprint,
  formatPlannedSets,
  WeightedExerciseBlueprint,
} from '@/models/blueprint-models';
import { RecordedExercise, RecordedWeightedExercise, Session } from '@/models/session-models';
import { useAppSelector, useAppSelectorWithArg } from '@/store';
import { selectSession, updateStoredSession } from '@/store/stored-sessions';
import { formatCardioTarget } from '@/utils/format-cardio-target';
import { alpha } from '@/styles/theme';
import { useTranslate } from '@tolgee/react';
import { Href, Stack, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable } from 'react-native';
import { Gesture, GestureDetector, ScrollView } from 'react-native-gesture-handler';
import {
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useAppReducedMotion } from '@/hooks/useMotionSettings';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Ellipse, G, Line, Path, RadialGradient, Rect, Stop } from 'react-native-svg';
import { getSessionExerciseEditorHref } from '@/components/smart/session-exercise-editor';
import { Weight } from '@/models/weight';
import { useDispatch } from 'react-redux';
import * as S from './session-workout-editor.styles';

export function getSessionWorkoutEditorHref(sessionId: string): Href {
  return `/workout-editor?sessionId=${encodeURIComponent(sessionId)}` as Href;
}

/* ------------------------------------------------------------------ *
 * Geometry (spec screen 4, 393×852)
 * ------------------------------------------------------------------ */

const ROW_HEIGHT = 64;
const ROW_GAP = 10;
/** Visual pitch of a row: 64pt card + 10pt gap. */
const PITCH = ROW_HEIGHT + ROW_GAP;

type Difficulty = 'beginner' | 'intermediate' | 'advanced';
const DIFFICULTIES: Difficulty[] = ['beginner', 'intermediate', 'advanced'];

/* ------------------------------------------------------------------ *
 * Glyphs — drawn from the spec's <defs> geometry.
 * ------------------------------------------------------------------ */

function DotsGlyph() {
  return (
    <Svg width={18} height={8} viewBox="0 0 18 8">
      <G fill="#8E8E93">
        <Circle cx={2} cy={4} r={2} />
        <Circle cx={9} cy={4} r={2} />
        <Circle cx={16} cy={4} r={2} />
      </G>
    </Svg>
  );
}

function DragHandleGlyph() {
  return (
    <Svg width={12} height={12} viewBox="0 0 12 12">
      <G fill="#6C6C70">
        <Rect x={0} y={0} width={12} height={2} rx={1} />
        <Rect x={0} y={5} width={12} height={2} rx={1} />
        <Rect x={0} y={10} width={12} height={2} rx={1} />
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
        stroke={theme.isDark ? '#48484A' : '#AEAEB2'}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function PlusGlyph() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16">
      <G stroke="#FF9F0A" strokeWidth={2.1} strokeLinecap="round">
        <Line x1={0} y1={8} x2={16} y2={8} />
        <Line x1={8} y1={0} x2={8} y2={16} />
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
 * Derived plan data — computed from the actual session, never hardcoded.
 * ------------------------------------------------------------------ */

/** Row summary in the spec's shape: "4 × 5  ·  100 kg  ·  90s rest". */
function summarizeExercise(blueprint: ExerciseBlueprint, recorded: RecordedExercise | undefined): string {
  if (blueprint instanceof WeightedExerciseBlueprint) {
    const parts = [`${blueprint.plannedSets.length} × ${formatPlannedSets(blueprint.plannedSets)}`];
    if (blueprint.resistance === 'bodyweight') {
      parts.push('Bodyweight');
    } else if (blueprint.resistance !== 'none' && recorded instanceof RecordedWeightedExercise) {
      const heaviest = recorded.potentialSets.reduce<Weight | undefined>(
        (max, set) => (!max || set.weight.isGreaterThan(max) ? set.weight : max),
        undefined,
      );
      if (heaviest && !heaviest.value.isZero() && heaviest.unit !== 'nil') {
        parts.push(heaviest.shortLocaleFormat());
      }
    }
    parts.push(`${Math.round(blueprint.restBetweenSets.minRest.toMillis() / 1000)}s rest`);
    return parts.join('  ·  ');
  }
  return `${blueprint.sets.length} × ${formatCardioTarget(blueprint.sets[0]!.target)}`;
}

/** Rough plan length: 45s of work per set, prescribed rests, 60s between exercises. */
function estimateMinutes(session: Session): number {
  let seconds = 0;
  for (const blueprint of session.blueprint.exercises) {
    if (blueprint instanceof WeightedExerciseBlueprint) {
      const sets = blueprint.plannedSets.length;
      seconds += sets * 45 + Math.max(0, sets - 1) * (blueprint.restBetweenSets.minRest.toMillis() / 1000);
    } else {
      seconds += blueprint.sets.length * 120;
    }
  }
  if (session.blueprint.exercises.length > 1) {
    seconds += (session.blueprint.exercises.length - 1) * 60;
  }
  return Math.max(1, Math.round(seconds / 60));
}

/** Reorder that keeps blueprint.exercises and recordedExercises aligned. */
function reorderExercises(session: Session, from: number, to: number): Session {
  if (from === to) {
    return session;
  }
  const move = <T,>(items: T[]): T[] => {
    const next = [...items];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item!);
    return next;
  };
  return session.with({
    blueprint: session.blueprint.with({ exercises: move(session.blueprint.exercises) }),
    recordedExercises: move(session.recordedExercises),
  });
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
  const reduceMotion = useAppReducedMotion();

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
    <S.RowSlot style={animatedStyle}>
      <S.RowCard>
        <S.RowPress
          onPress={props.onPress}
          onLongPress={props.onLongPress}
          accessibilityRole="button"
          accessibilityLabel={props.name}
        >
          <GestureDetector gesture={pan}>
            <S.HandleBox>
              <DragHandleGlyph />
            </S.HandleBox>
          </GestureDetector>
          <S.NumberTile>
            <S.NumberText style={{ fontVariant: ['tabular-nums'] }}>{index + 1}</S.NumberText>
          </S.NumberTile>
          <S.RowTexts>
            <S.RowName numberOfLines={1}>{props.name}</S.RowName>
            <S.RowSummary numberOfLines={1}>{props.summary}</S.RowSummary>
          </S.RowTexts>
          <ChevronGlyph />
        </S.RowPress>
      </S.RowCard>
    </S.RowSlot>
  );
}

/* ------------------------------------------------------------------ *
 * Screen
 * ------------------------------------------------------------------ */

export function SessionWorkoutEditor(props: { sessionId: string }) {
  const { sessionId } = props;
  const theme = useAppTheme();
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const { push, dismiss } = useRouter();
  const insets = useSafeAreaInsets();
  const reduceMotion = useAppReducedMotion();

  const workout = useAppSelectorWithArg(selectSession, sessionId);
  const useImperialUnits = useAppSelector((x) => x.settings.useImperialUnits);

  const [name, setName] = useState(workout?.blueprint.name ?? '');
  const [nameFocused, setNameFocused] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate');
  const [dragging, setDragging] = useState(false);
  const [footerHeight, setFooterHeight] = useState(0);
  const [trackWidth, setTrackWidth] = useState(0);
  const [confirmingClear, setConfirmingClear] = useState(false);
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);

  // The name is a draft until Save (or the legacy dismiss path) commits it.
  const nameRef = useRef(name);
  const nameDirty = useRef(false);
  const dismissIntent = useRef<'save' | 'cancel' | null>(null);

  const dragActive = useSharedValue(-1);
  const dragTarget = useSharedValue(0);
  const dragDy = useSharedValue(0);
  const drag: DragShared = { active: dragActive, target: dragTarget, dy: dragDy };

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

  const commitName = () => {
    if (!nameDirty.current) {
      return;
    }
    nameDirty.current = false;
    const trimmed = nameRef.current.trim();
    const target = trimmed.length > 0 ? trimmed : workout?.blueprint.name;
    if (target === undefined || target === workout?.blueprint.name) {
      return;
    }
    dispatch(
      updateStoredSession({
        sessionId,
        update: (s) => s.with({ blueprint: s.blueprint.with({ name: target }) }),
      }),
    );
  };

  // Legacy behavior: leaving the screen persists the name draft. Cancel opts out.
  useOnDismiss(() => {
    if (dismissIntent.current !== 'cancel') {
      commitName();
    }
  });

  const updateSession = (update: (s: Session) => Session) => {
    dispatch(updateStoredSession({ sessionId, update }));
  };

  // Add flow: insert an empty exercise and open the editor in Add mode, where the
  // inline search picks the real exercise. Backing out with no selection removes it.
  const openAddExercise = () => {
    if (!workout) {
      return;
    }
    const newIndex = workout.recordedExercises.length;
    dispatch(
      updateStoredSession({
        sessionId,
        // S6 default for a fresh Add: 1 set × 8 reps; the name is picked in the editor.
        update: (s) =>
          s.withAddedExercise(
            WeightedExerciseBlueprint.of({ sets: 1, repsConfig: { type: 'fixed', reps: 8 } }),
            useImperialUnits,
          ),
      }),
    );
    push(getSessionExerciseEditorHref(sessionId, newIndex, { isNew: true }));
  };

  const onSave = () => {
    dismissIntent.current = 'save';
    commitName();
    dismiss();
  };

  const onCancel = () => {
    dismissIntent.current = 'cancel';
    dismiss();
  };

  const onChangeName = (value: string) => {
    nameRef.current = value;
    nameDirty.current = true;
    setName(value);
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
    if (!workout) {
      return;
    }
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

  // Hooks must run before the early return below: these don't depend on workout.
  const slot = trackWidth / 3;
  const thumbWidth = Math.max(0, slot - 3.94);
  const thumbStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: withTiming(DIFFICULTIES.indexOf(difficulty) * slot, { duration: reduceMotion ? 0 : 220 }) },
    ],
  }));

  if (!workout) {
    return null;
  }

  const exercises = workout.blueprint.exercises;
  const totalSets = exercises.reduce(
    (count, blueprint) =>
      count + (blueprint instanceof WeightedExerciseBlueprint ? blueprint.plannedSets.length : blueprint.sets.length),
    0,
  );
  const minutes = estimateMinutes(workout);

  const difficultyLabel = (d: Difficulty) =>
    d === 'beginner'
      ? t('workout.editor.difficulty.beginner', 'Beginner')
      : d === 'advanced'
        ? t('workout.editor.difficulty.advanced', 'Advanced')
        : t('workout.editor.difficulty.intermediate', 'Intermediate');

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
          <S.CancelButton onPress={onCancel} accessibilityRole="button">
            <S.CancelText>{t('generic.cancel.button', 'Cancel')}</S.CancelText>
          </S.CancelButton>
          <S.NavTitleWrap pointerEvents="none">
            <S.NavTitle>{t('workout.editor.title', 'Edit Plan')}</S.NavTitle>
          </S.NavTitleWrap>
          <S.NavMenuWrap>
            <Menu
              trigger={(open) => (
                <Pressable
                  onPress={open}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={t('workout.editor.title', 'Edit Plan')}
                  style={{
                    width: 44,
                    height: 44,
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    paddingRight: 2,
                  }}
                >
                  <DotsGlyph />
                </Pressable>
              )}
              items={[
                {
                  label: t('workout.editor.remove_all_exercises.button', 'Remove All Exercises'),
                  systemImage: 'trash',
                  destructive: true,
                  disabled: exercises.length === 0,
                  onPress: () => setConfirmingClear(true),
                },
              ]}
            />
          </S.NavMenuWrap>
        </S.NavRow>

        <ScrollView
          scrollEnabled={!dragging}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: footerHeight + 24 }}
        >
          <S.Content>
            <S.PlanFieldOuter
              $focused={nameFocused}
              colors={nameFocused ? undefined : (['transparent', 'transparent', 'transparent'] as const)}
              style={{ borderCurve: 'continuous' }}
            >
              <S.PlanFieldEdge $focused={nameFocused} style={{ borderCurve: 'continuous' }}>
                <S.PlanFieldBody $focused={nameFocused} style={{ borderCurve: 'continuous' }}>
                  <S.PlanFieldContent>
                    <S.PlanLabel>{t('workout.editor.plan_name.label', 'Plan name')}</S.PlanLabel>
                    <S.PlanInput
                      testID="workout-name"
                      value={name}
                      onChangeText={onChangeName}
                      onFocus={() => setNameFocused(true)}
                      onBlur={() => setNameFocused(false)}
                      autoCorrect={false}
                      returnKeyType="done"
                      onSubmitEditing={onSave}
                      cursorColor="#FF6A3D"
                      selectionColor="#FF6A3D"
                      placeholderTextColor={theme.isDark ? '#6C6C70' : '#AEAEB2'}
                      accessibilityLabel={t('workout.editor.plan_name.label', 'Plan name')}
                    />
                  </S.PlanFieldContent>
                </S.PlanFieldBody>
              </S.PlanFieldEdge>
            </S.PlanFieldOuter>

            <S.MetaCard>
              <S.MetaInner>
                <S.MetaColumn>
                  <S.MetaValue style={{ fontVariant: ['tabular-nums'] }}>{exercises.length}</S.MetaValue>
                  <S.MetaLabel>{t('workout.editor.meta.exercises', 'Exercises')}</S.MetaLabel>
                </S.MetaColumn>
                <S.MetaDivider />
                <S.MetaColumn>
                  <S.MetaValue style={{ fontVariant: ['tabular-nums'] }}>{totalSets}</S.MetaValue>
                  <S.MetaLabel>{t('workout.editor.meta.sets', 'Sets')}</S.MetaLabel>
                </S.MetaColumn>
                <S.MetaDivider />
                <S.MetaColumn>
                  <S.MetaValue style={{ fontVariant: ['tabular-nums'] }}>{minutes}</S.MetaValue>
                  <S.MetaLabel>{t('workout.editor.meta.min_est', 'Min est')}</S.MetaLabel>
                </S.MetaColumn>
                <S.MetaDivider />
                <S.MetaColumn>
                  <S.MetaValue style={{ fontVariant: ['tabular-nums'] }}>–</S.MetaValue>
                  <S.MetaLabel>{t('workout.editor.meta.week_of', 'Week of 6')}</S.MetaLabel>
                </S.MetaColumn>
              </S.MetaInner>
            </S.MetaCard>

            <S.SegmentTrack
              onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
              accessibilityRole="radiogroup"
            >
              {thumbWidth > 0 && (
                <S.SegmentThumbSlot style={[thumbStyle, { width: thumbWidth }]}>
                  <S.SegmentThumb style={{ borderCurve: 'continuous' }} />
                </S.SegmentThumbSlot>
              )}
              <S.SegmentLabels>
                {DIFFICULTIES.map((option) => (
                  <S.SegmentOption
                    key={option}
                    onPress={() => setDifficulty(option)}
                    hitSlop={{ top: 4, bottom: 4 }}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: difficulty === option }}
                    accessibilityLabel={difficultyLabel(option)}
                  >
                    <S.SegmentOptionText $selected={difficulty === option}>
                      {difficultyLabel(option)}
                    </S.SegmentOptionText>
                  </S.SegmentOption>
                ))}
              </S.SegmentLabels>
            </S.SegmentTrack>

            <S.SectionHeaderRow>
              <S.SectionLabel>{t('workout.editor.exercises.label', 'Exercises')}</S.SectionLabel>
              <S.DragHint>{t('workout.editor.drag_to_reorder.label', 'Drag to reorder')}</S.DragHint>
            </S.SectionHeaderRow>

            {exercises.length === 0 ? (
              <S.EmptyRows>
                <S.EmptyRowsText>
                  {t('workout.contains_no_exercises.message', 'Workout contains no exercises.')}
                </S.EmptyRowsText>
              </S.EmptyRows>
            ) : (
              exercises.map((blueprint, index) => (
                <ExerciseRow
                  key={rowKeyFor(blueprint)}
                  index={index}
                  total={exercises.length}
                  name={blueprint.name}
                  summary={summarizeExercise(blueprint, workout.recordedExercises[index])}
                  drag={drag}
                  onPress={() => push(getSessionExerciseEditorHref(sessionId, index))}
                  onLongPress={() => setRemovingIndex(index)}
                  onDragBegin={onDragBegin}
                  onDragCommit={onDragCommit}
                  onDragCancel={onDragCancel}
                />
              ))
            )}
          </S.Content>
        </ScrollView>

        <S.FooterFloat onLayout={(event) => setFooterHeight(event.nativeEvent.layout.height)}>
          <S.FooterFade
            pointerEvents="none"
            colors={
              theme.isDark
                ? [alpha('#050507', 0), alpha('#050507', 0.94)]
                : [alpha('#F8F8FC', 0), alpha('#F8F8FC', 0.94)]
            }
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />
          <S.FooterBar
            colors={
              theme.isDark
                ? [alpha('#15151A', 0.94), alpha('#0C0C10', 0.99)]
                : ['#FFFFFF', '#F4F4F6']
            }
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{ paddingBottom: insets.bottom + 14 }}
          >
            <S.AddRow
              onPress={openAddExercise}
              accessibilityRole="button"
              accessibilityLabel={t('workout.editor.add_exercise.button', 'Add Exercise')}
              style={{ borderCurve: 'continuous' }}
            >
              <PlusGlyph />
              <S.AddLabel>{t('workout.editor.add_exercise.button', 'Add Exercise')}</S.AddLabel>
            </S.AddRow>
            <S.SaveOuter style={{ borderCurve: 'continuous' }}>
              <S.SavePress
                onPress={onSave}
                accessibilityRole="button"
                accessibilityLabel={t('workout.editor.save.button', 'Save Plan')}
                style={{ borderCurve: 'continuous' }}
              >
                <S.SaveGloss />
                <S.SaveLabel>{t('workout.editor.save.button', 'Save Plan')}</S.SaveLabel>
              </S.SavePress>
            </S.SaveOuter>
          </S.FooterBar>
        </S.FooterFloat>
      </SafeAreaView>

      <ConfirmationDialog
        open={confirmingClear}
        headline={t('workout.editor.remove_all_exercises.confirm.title', 'Remove all exercises?')}
        textContent={t(
          'workout.editor.remove_all_exercises.confirm.body',
          'This will remove every exercise from the plan.',
        )}
        okText={t('generic.delete.button', 'Delete')}
        onCancel={() => setConfirmingClear(false)}
        onOk={() => {
          setConfirmingClear(false);
          clearAllExercises();
        }}
      />
      <ConfirmationDialog
        open={removingIndex !== null}
        headline={t('exercise.remove.confirm.title', 'Remove exercise?')}
        textContent={t('exercise.remove.confirm.body')}
        okText={t('generic.remove.button', 'Remove')}
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

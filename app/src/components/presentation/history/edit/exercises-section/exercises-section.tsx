import { useAppSelector } from '@/store';
import { selectHistoryPersonalRecords } from '@/store/stored-sessions';
import { RecordedCardioExercise, RecordedExercise, RecordedWeightedExercise, Session } from '@/models/session-models';
import { ExerciseBlueprint } from '@/models/blueprint-models';
import { shortFormatWeightUnit, Weight } from '@/models/weight';
import { localeFormatBigNumber } from '@/utils/locale-bignumber';
import { useTranslate } from '@tolgee/react';
import { OffsetDateTime } from '@js-joda/core';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS, SharedValue, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useAppReducedMotion } from '@/hooks/useMotionSettings';
import Svg, { Circle, G, Line, Rect } from 'react-native-svg';
import * as S from './exercises-section.styles';

/* ------------------------------------------------------------------ *
 * Geometry (Edit Session spec): collapsed row 361×74 rx22, 10pt gap.
 * ------------------------------------------------------------------ */

const ROW_HEIGHT = 74;
const ROW_GAP = 10;
/** Visual pitch of a collapsed row: 74pt card + 10pt gap. */
const PITCH = ROW_HEIGHT + ROW_GAP;
/** Expanded row: 74 header + 10 gap + 140 editor panel + 18 bottom pad. */
const EXPANDED_HEIGHT = 242;

/** Reorder that keeps blueprint.exercises and recordedExercises aligned. Copied from
 *  components/smart/session-workout-editor (same contract, same behavior). */
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
    blueprint: session.blueprint.with({
      exercises: move(session.blueprint.exercises),
    }),
    recordedExercises: move(session.recordedExercises),
  });
}

/* ------------------------------------------------------------------ *
 * Glyphs — drawn from the spec's <defs> geometry.
 * ------------------------------------------------------------------ */

function GripGlyph() {
  return (
    <Svg width={12} height={14} viewBox="0 0 12 14">
      <G fill="#6C6C70">
        <Rect x={0} y={0} width={12} height={2} rx={1} />
        <Rect x={0} y={6} width={12} height={2} rx={1} />
        <Rect x={0} y={12} width={12} height={2} rx={1} />
      </G>
    </Svg>
  );
}

function PlusGlyph() {
  return (
    <Svg width={12} height={12} viewBox="0 0 12 12">
      <G stroke="#8E8E93" strokeWidth={1.9} strokeLinecap="round">
        <Line x1={0} y1={6} x2={12} y2={6} />
        <Line x1={6} y1={0} x2={6} y2={12} />
      </G>
    </Svg>
  );
}

function StepperCircle({ children }: { children: ReactNode }) {
  return (
    <Svg width={30} height={30} viewBox="0 0 30 30">
      <Circle
        cx={15}
        cy={15}
        r={14.6}
        fill="#FFFFFF"
        fillOpacity={0.08}
        stroke="#FFFFFF"
        strokeOpacity={0.1}
        strokeWidth={0.8}
      />
      {children}
    </Svg>
  );
}

function MinusGlyph() {
  return (
    <StepperCircle>
      <Line x1={9} y1={15} x2={21} y2={15} stroke="#C7C7CC" strokeWidth={2} strokeLinecap="round" />
    </StepperCircle>
  );
}

function StepperPlusGlyph() {
  return (
    <StepperCircle>
      <G stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round">
        <Line x1={9} y1={15} x2={21} y2={15} />
        <Line x1={15} y1={9} x2={15} y2={21} />
      </G>
    </StepperCircle>
  );
}

/* ------------------------------------------------------------------ *
 * Drag machinery (handle-only pan; same construction as the workout
 * editor, with the 84pt pitch of these rows).
 * ------------------------------------------------------------------ */

type DragShared = {
  active: SharedValue<number>;
  target: SharedValue<number>;
  dy: SharedValue<number>;
};

type RowCallbacks = {
  onDragBegin: () => void;
  onDragCommit: (from: number, to: number) => void;
  onDragCancel: () => void;
};

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

/* ------------------------------------------------------------------ *
 * Row
 * ------------------------------------------------------------------ */

type Selection = { exerciseIndex: number; setIndex: number };

function ExerciseRow(props: {
  index: number;
  total: number;
  blueprint: ExerciseBlueprint;
  recorded: RecordedExercise;
  bodyweight: Weight | undefined;
  hasPr: boolean;
  expanded: boolean;
  selectedSet: number | null;
  drag: DragShared;
  onSelectSet: (setIndex: number) => void;
  onDeselect: () => void;
  onAddSet: () => void;
  onDeleteSet: (setIndex: number) => void;
  onStepWeight: (setIndex: number, direction: 1 | -1) => void;
  onStepReps: (setIndex: number, direction: 1 | -1) => void;
  onDragBegin: () => void;
  onDragCommit: (from: number, to: number) => void;
  onDragCancel: () => void;
}) {
  const { index, total, drag, expanded } = props;
  const { t } = useTranslate();
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

  const callbacks = useRef<RowCallbacks>(props);
  useEffect(() => {
    callbacks.current = props;
  });
  const pan = useMemo(
    () => createRowPanGesture(index, total, drag, reduceMotion, callbacks),
    [index, total, drag, reduceMotion, callbacks],
  );

  const recorded = props.recorded;
  const weighted = recorded instanceof RecordedWeightedExercise ? recorded : null;
  const sets = weighted ? weighted.potentialSets : [];

  const volumeText = weighted
    ? `${localeFormatBigNumber(weighted.totalWeightLiftedWith(props.bodyweight).convertTo('kilograms').value, 0)} kg`
    : `${(recorded as RecordedCardioExercise).sets.length} ${t('history.edit.totals.sets.label', 'Sets').toLowerCase()}`;

  const selectedPotential = props.selectedSet !== null ? sets[props.selectedSet] : undefined;
  const editingWeight = selectedPotential?.weight;
  const editingReps = selectedPotential ? (selectedPotential.set?.repsCompleted ?? selectedPotential.target.max) : 0;

  return (
    <S.RowSlot $height={expanded ? EXPANDED_HEIGHT : ROW_HEIGHT} style={animatedStyle}>
      <S.RowOuter $radius={22} $focused={expanded} style={{ borderCurve: 'continuous' }}>
        <S.RowBody $radius={expanded ? 20.8 : 21} style={{ borderCurve: 'continuous' }}>
          <S.RowTop>
            <S.RowLine>
              <GestureDetector gesture={pan}>
                <S.HandleBox
                  accessibilityRole="button"
                  accessibilityLabel={t('history.edit.row.reorder.a11y', 'Reorder {name}', {
                    name: props.blueprint.name,
                  })}
                >
                  <GripGlyph />
                </S.HandleBox>
              </GestureDetector>
              <S.RowTexts>
                <S.RowName numberOfLines={1}>
                  {props.blueprint.name}
                  {props.hasPr && (
                    <S.PrChip>
                      <S.PrChipText>PR</S.PrChipText>
                    </S.PrChip>
                  )}
                </S.RowName>
              </S.RowTexts>
              <S.RowVolume $pr={props.hasPr} style={{ fontVariant: ['tabular-nums'] }}>
                {volumeText}
              </S.RowVolume>
            </S.RowLine>

            <S.ChipsRow>
              {weighted && (
                <>
                  {sets.map((potential, setIndex) => {
                    const reps = potential.set?.repsCompleted ?? potential.target.max;
                    const focused = props.selectedSet === setIndex;
                    return (
                      <S.SetChip
                        key={setIndex}
                        $focused={focused}
                        onPress={() => (focused ? props.onDeselect() : props.onSelectSet(setIndex))}
                        hitSlop={{ top: 9, bottom: 9, left: 4, right: 4 }}
                        accessibilityRole="button"
                        accessibilityLabel={t('history.edit.row.select_set.a11y', 'Edit set {n} of {m}', {
                          n: setIndex + 1,
                          m: sets.length,
                        })}
                        accessibilityState={{ selected: focused }}
                        style={{ borderCurve: 'continuous' }}
                      >
                        <S.SetChipText $focused={focused} style={{ fontVariant: ['tabular-nums'] }}>
                          {localeFormatBigNumber(potential.weight.value)} × {reps}
                        </S.SetChipText>
                      </S.SetChip>
                    );
                  })}
                  <S.AddSetChip
                    onPress={props.onAddSet}
                    hitSlop={{ top: 9, bottom: 9, left: 6, right: 6 }}
                    accessibilityRole="button"
                    accessibilityLabel={t('workout.session.add_set.button', 'Add set')}
                    style={{ borderCurve: 'continuous' }}
                  >
                    <PlusGlyph />
                  </S.AddSetChip>
                </>
              )}
            </S.ChipsRow>
          </S.RowTop>

          {expanded && selectedPotential && (
            <S.EditorPanel style={{ borderCurve: 'continuous' }}>
              <S.EditorHeaderRow>
                <S.EditorTitle>
                  {t('history.edit.set_editor.title', 'Editing set {n} of {m}', {
                    n: (props.selectedSet ?? 0) + 1,
                    m: sets.length,
                  })}
                </S.EditorTitle>
                <S.DeleteSetButton
                  onPress={() => props.onDeleteSet(props.selectedSet ?? 0)}
                  accessibilityRole="button"
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <S.DeleteSetText>{t('history.edit.set_editor.delete_set.button', 'Delete set')}</S.DeleteSetText>
                </S.DeleteSetButton>
              </S.EditorHeaderRow>

              <S.StepperRow>
                <S.StepperLabel>{t('history.edit.set_editor.weight.label', 'Weight')}</S.StepperLabel>
                <S.StepperControls>
                  <S.StepperButton
                    onPress={() => props.onStepWeight(props.selectedSet ?? 0, -1)}
                    accessibilityRole="button"
                    accessibilityLabel={t('history.edit.stepper.decrease.a11y', 'Decrease {label}', {
                      label: t('history.edit.set_editor.weight.label', 'Weight'),
                    })}
                  >
                    <MinusGlyph />
                  </S.StepperButton>
                  <S.StepperValue style={{ fontVariant: ['tabular-nums'] }}>
                    {editingWeight
                      ? `${localeFormatBigNumber(editingWeight.value)} ${shortFormatWeightUnit(editingWeight.unit)}`
                      : '—'}
                  </S.StepperValue>
                  <S.StepperButton
                    onPress={() => props.onStepWeight(props.selectedSet ?? 0, 1)}
                    accessibilityRole="button"
                    accessibilityLabel={t('history.edit.stepper.increase.a11y', 'Increase {label}', {
                      label: t('history.edit.set_editor.weight.label', 'Weight'),
                    })}
                  >
                    <StepperPlusGlyph />
                  </S.StepperButton>
                </S.StepperControls>
              </S.StepperRow>
              <S.StepperDivider />
              <S.StepperRow>
                <S.StepperLabel>{t('history.edit.set_editor.reps.label', 'Reps')}</S.StepperLabel>
                <S.StepperControls>
                  <S.StepperButton
                    onPress={() => props.onStepReps(props.selectedSet ?? 0, -1)}
                    accessibilityRole="button"
                    accessibilityLabel={t('history.edit.stepper.decrease.a11y', 'Decrease {label}', {
                      label: t('history.edit.set_editor.reps.label', 'Reps'),
                    })}
                  >
                    <MinusGlyph />
                  </S.StepperButton>
                  <S.StepperValue style={{ fontVariant: ['tabular-nums'] }}>{editingReps}</S.StepperValue>
                  <S.StepperButton
                    onPress={() => props.onStepReps(props.selectedSet ?? 0, 1)}
                    accessibilityRole="button"
                    accessibilityLabel={t('history.edit.stepper.increase.a11y', 'Increase {label}', {
                      label: t('history.edit.set_editor.reps.label', 'Reps'),
                    })}
                  >
                    <StepperPlusGlyph />
                  </S.StepperButton>
                </S.StepperControls>
              </S.StepperRow>
              <S.StepperDivider />
            </S.EditorPanel>
          )}
        </S.RowBody>
      </S.RowOuter>
    </S.RowSlot>
  );
}

/* ------------------------------------------------------------------ *
 * Section
 * ------------------------------------------------------------------ */

export function ExercisesSection({
  session,
  updateSession,
  onAddExercise,
  onDragStateChange,
}: {
  session: Session;
  updateSession: (update: (s: Session) => Session) => void;
  onAddExercise: () => void;
  onDragStateChange?: (dragging: boolean) => void;
}) {
  const { t } = useTranslate();
  const [selection, setSelection] = useState<Selection | null>(null);
  const prRecords = useAppSelector(selectHistoryPersonalRecords);
  const useImperialUnits = useAppSelector((x) => x.settings.useImperialUnits);

  const dragActive = useSharedValue(-1);
  const dragTarget = useSharedValue(0);
  const dragDy = useSharedValue(0);
  const drag: DragShared = {
    active: dragActive,
    target: dragTarget,
    dy: dragDy,
  };

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

  const prNames = useMemo(() => {
    const names = new Set<string>();
    for (const record of prRecords.get(session.id) ?? []) {
      names.add(record.exerciseName);
    }
    return names;
  }, [prRecords, session.id]);

  const exercises = session.blueprint.exercises;
  const recordedAt = (exerciseIndex: number) => session.recordedExercises[exerciseIndex];
  const validSelection =
    selection !== null &&
    selection.exerciseIndex < exercises.length &&
    (() => {
      const recorded = recordedAt(selection.exerciseIndex);
      return recorded instanceof RecordedWeightedExercise && selection.setIndex < recorded.potentialSets.length;
    })()
      ? selection
      : null;

  const withWeighted = (exerciseIndex: number, fn: (re: RecordedWeightedExercise) => RecordedWeightedExercise) =>
    updateSession((s) => {
      const recorded = s.recordedExercises[exerciseIndex];
      if (!(recorded instanceof RecordedWeightedExercise)) {
        return s;
      }
      return s.with({
        recordedExercises: s.recordedExercises.with(exerciseIndex, fn(recorded)),
      });
    });

  const handleStepWeight = (exerciseIndex: number, setIndex: number, direction: 1 | -1) =>
    withWeighted(exerciseIndex, (re) => {
      const potential = re.potentialSets[setIndex];
      if (!potential) {
        return re;
      }
      const stepped = potential.weight.plus(re.blueprint.weightIncrement.multipliedBy(direction));
      const clamped = stepped.value.isNegative() ? new Weight(0, stepped.unit) : stepped;
      return re.withWeight(setIndex, clamped, 'thisSet');
    });

  const handleStepReps = (exerciseIndex: number, setIndex: number, direction: 1 | -1) =>
    withWeighted(exerciseIndex, (re) => {
      const potential = re.potentialSets[setIndex];
      if (!potential) {
        return re;
      }
      const next = (potential.set?.repsCompleted ?? potential.target.max) + direction;
      return re.withRepCount(setIndex, next <= 0 ? undefined : next, OffsetDateTime.now());
    });

  const handleAddSet = (exerciseIndex: number) => {
    const recorded = session.recordedExercises[exerciseIndex];
    const nextIndex = recorded instanceof RecordedWeightedExercise ? recorded.potentialSets.length : 0;
    // Pass the unit so an exercise whose sets were all deleted reseeds from the
    // blueprint instead of leaving the add control dead (withAddedSet no-ops
    // on empty without one).
    withWeighted(exerciseIndex, (re) => re.withAddedSet(useImperialUnits ? 'pounds' : 'kilograms'));
    setSelection({ exerciseIndex, setIndex: nextIndex });
  };

  const handleDeleteSet = (exerciseIndex: number, setIndex: number) => {
    withWeighted(exerciseIndex, (re) =>
      re.with({
        potentialSets: re.potentialSets.filter((_, i) => i !== setIndex),
      }),
    );
    setSelection(null);
  };

  const handleDragBegin = () => {
    setSelection(null);
    onDragStateChange?.(true);
  };
  const handleDragCancel = () => {
    onDragStateChange?.(false);
  };
  const handleDragCommit = (from: number, to: number) => {
    dragActive.value = -1;
    dragDy.value = 0;
    onDragStateChange?.(false);
    updateSession((s) => reorderExercises(s, from, to));
  };

  return (
    <>
      <S.SectionHeaderRow>
        <S.SectionLabel>{t('history.edit.exercises.label', 'Exercises')}</S.SectionLabel>
        <S.DragHint>
          {t('history.edit.exercises.drag_to_reorder', '{count} · drag to reorder', { count: exercises.length })}
        </S.DragHint>
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
            blueprint={blueprint}
            recorded={session.recordedExercises[index]!}
            bodyweight={session.bodyweight}
            hasPr={prNames.has(blueprint.name)}
            expanded={validSelection?.exerciseIndex === index}
            selectedSet={validSelection?.exerciseIndex === index ? validSelection.setIndex : null}
            drag={drag}
            onSelectSet={(setIndex) => setSelection({ exerciseIndex: index, setIndex })}
            onDeselect={() => setSelection(null)}
            onAddSet={() => handleAddSet(index)}
            onDeleteSet={(setIndex) => handleDeleteSet(index, setIndex)}
            onStepWeight={(setIndex, direction) => handleStepWeight(index, setIndex, direction)}
            onStepReps={(setIndex, direction) => handleStepReps(index, setIndex, direction)}
            onDragBegin={handleDragBegin}
            onDragCommit={handleDragCommit}
            onDragCancel={handleDragCancel}
          />
        ))
      )}

      <S.AddExerciseButton
        onPress={onAddExercise}
        accessibilityRole="button"
        accessibilityLabel={t('history.edit.add_exercise.button', 'Add Exercise')}
        style={{ borderCurve: 'continuous' }}
      >
        <AddExerciseGlyph />
        <S.AddExerciseLabel>{t('history.edit.add_exercise.button', 'Add Exercise')}</S.AddExerciseLabel>
      </S.AddExerciseButton>
    </>
  );
}

function AddExerciseGlyph() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16">
      <G stroke="#FF9F0A" strokeWidth={2.1} strokeLinecap="round">
        <Line x1={0} y1={8} x2={16} y2={8} />
        <Line x1={8} y1={0} x2={8} y2={16} />
      </G>
    </Svg>
  );
}

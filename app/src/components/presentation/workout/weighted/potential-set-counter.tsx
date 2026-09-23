import { PotentialSet, WeightAppliesTo } from '@/models/session-models';
import { Resistance, RepsTarget } from '@/models/blueprint-models';
import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import { Text as PaperText, Chip } from 'react-native-paper';
import { Animated, Keyboard, View } from 'react-native';
import WeightDialog from '@/components/presentation/foundation/editors/weight-dialog';
import { useAppTheme } from '@/hooks/useAppTheme';
import FocusRing from '@/components/presentation/foundation/focus-ring';
import { T, useTranslate } from '@tolgee/react';
import Holdable from '@/components/presentation/foundation/holdable';
import { Weight, shortFormatWeightUnit } from '@/models/weight';
import { localeFormatBigNumber } from '@/utils/locale-bignumber';
import Svg, { Circle, G, Path } from 'react-native-svg';
import PotentialSetAdditionalActionsDialog from '@/components/presentation/workout/weighted/potential-sets-addition-actions-dialog';
import { usePulse } from '@/components/presentation/workout/use-pulse';
import { sessionPalette } from '@/components/presentation/workout/session/session-tokens';
import {
  CheckPressable,
  NumberText,
  NumberTile,
  PrevText,
  RepsPressable,
  SetRow,
  SetRowState,
  WeightPressable,
  WeightText,
} from './potential-set-counter.styles';

interface PotentialSetCounterProps {
  set: PotentialSet;
  /** 0-based position of this set within the exercise. */
  index: number;
  weightIncrement: BigNumber;
  repsTarget: RepsTarget;
  previousRepCount: number | undefined;
  previousWeight: Weight | undefined;
  toStartNext: boolean;
  isReadonly: boolean;
  resistance: Resistance;
  /** 'active' renders the workout-flow reference row (no focus ring). */
  variant?: 'active' | 'classic';

  onTap: () => void;
  onUpdateWeight: (weight: Weight, applyTo: WeightAppliesTo) => void;
  onUpdateReps: (reps: number | undefined) => void;
}

function formatSetWeight(weight: Weight, resistance: Resistance, bodyweightLabel: string): string {
  if (weight.value.isZero() && resistance === 'bodyweight') {
    return bodyweightLabel;
  }
  const text = localeFormatBigNumber(weight.value.decimalPlaces(weight.value.isInteger() ? 0 : 1));
  return `${text} ${shortFormatWeightUnit(weight.unit)}`.trim();
}

function CheckMark({ state }: { state: SetRowState }) {
  const { isDark } = useAppTheme();
  const c = sessionPalette(isDark).card;

  if (state === 'done') {
    return (
      <Svg width={22} height={22} viewBox="0 0 22 22">
        <Circle cx={11} cy={11} r={11} fill={c.checkDoneFill} />
        {/* The reference draws the check glyph at 82% scale. */}
        <G transform="translate(11,11) scale(0.82)">
          <Path
            d="M-4.2 0.4 L-1.3 3.4 L4.6 -3.2"
            stroke={c.checkMark}
            strokeWidth={2.3}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </G>
      </Svg>
    );
  }
  if (state === 'current') {
    return (
      <Svg
        width={26}
        height={26}
        viewBox="-13 -13 26 26"
        style={{
          shadowColor: '#FF2D55',
          shadowOpacity: 0.5,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 7 },
          elevation: 6,
        }}
      >
        <Circle cx={0} cy={0} r={11} fill={c.checkFill} stroke={c.checkRing} strokeWidth={2.2} />
      </Svg>
    );
  }
  return (
    <Svg width={26} height={26} viewBox="-13 -13 26 26">
      <Circle cx={0} cy={0} r={11} fill="none" stroke={c.checkUpcomingRing} strokeWidth={1.6} />
    </Svg>
  );
}

/** The current-set ring's inner dot breathes on its own; the ring stays solid. */
function CurrentSetDot() {
  const { isDark } = useAppTheme();
  const pulse = usePulse(1800, 0.4);
  return (
    <Animated.View style={{ opacity: pulse, position: 'absolute', top: 9, left: 9, width: 8, height: 8 }}>
      <Svg width={8} height={8} viewBox="-4 -4 8 8">
        <Circle cx={0} cy={0} r={4} fill={sessionPalette(isDark).card.checkDot} />
      </Svg>
    </Animated.View>
  );
}

/**
 * One set row in the active-session exercise card: number tile, tappable
 * weight, tappable reps, previous/target hint, and the log check.
 *
 * Editing behavior is unchanged from the classic tile: tapping reps cycles
 * the rep count, long-press opens the precise rep editor, tapping weight
 * opens the weight editor.
 */
export default function PotentialSetCounter(props: PotentialSetCounterProps) {
  const theme = useAppTheme();
  const { t } = useTranslate();
  const [isWeightDialogOpen, setIsWeightDialogOpen] = useState(false);
  const [isRepsDialogOpen, setIsRepsDialogOpen] = useState(false);
  const maxReps = props.repsTarget.max;

  useEffect(() => {
    if (!isRepsDialogOpen) {
      Keyboard.dismiss();
    }
  }, [isRepsDialogOpen]);
  const [applyTo, setApplyTo] = useState<WeightAppliesTo>('uncompletedSets');

  const done = props.set.set !== undefined;
  const state: SetRowState = done ? 'done' : props.toStartNext ? 'current' : 'upcoming';
  const loggedReps = props.set.set?.repsCompleted;
  const weightText = formatSetWeight(props.set.weight, props.resistance, t('exercise.short_bodyweight.label'));

  const prevText =
    state === 'current'
      ? t('workout.session.target_reps.label', { reps: maxReps })
      : props.previousRepCount !== undefined
        ? t('workout.session.prev_set.label', {
            reps: props.previousRepCount,
            weight: props.previousWeight
              ? formatSetWeight(props.previousWeight, props.resistance, t('exercise.short_bodyweight.label'))
              : '—',
          })
        : undefined;

  const openWeightDialog = () => {
    setApplyTo(props.set.set ? 'thisSet' : 'uncompletedSets');
    setIsWeightDialogOpen(true);
  };

  const rowContent = (
    <>
      <SetRow>
        <NumberTile $state={state}>
          <NumberText $state={state}>{props.index + 1}</NumberText>
        </NumberTile>
        <WeightPressable
          onPress={props.isReadonly ? undefined : openWeightDialog}
          disabled={props.isReadonly}
          hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
        >
          <WeightText $state={state} numberOfLines={1}>
            {weightText}
          </WeightText>
        </WeightPressable>
        <RepsPressable
          onPress={props.isReadonly ? undefined : props.onTap}
          disabled={props.isReadonly}
          hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
        >
          <WeightText $state={state} $tracking={0} numberOfLines={1}>
            × {loggedReps ?? maxReps}
          </WeightText>
        </RepsPressable>
        {prevText !== undefined && (
          <PrevText $state={state} numberOfLines={1}>
            {prevText}
          </PrevText>
        )}
        {prevText === undefined && <View style={{ flex: 1 }} />}
        <CheckPressable
          onPress={props.isReadonly ? undefined : props.onTap}
          disabled={props.isReadonly}
          hitSlop={11}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: done }}
          accessibilityLabel={t('exercise.set_number.label', { number: props.index + 1 })}
        >
          {state === 'current' ? (
            <View style={{ width: 26, height: 26, alignItems: 'center', justifyContent: 'center' }}>
              <CheckMark state={state} />
              <CurrentSetDot />
            </View>
          ) : (
            <CheckMark state={state} />
          )}
        </CheckPressable>
      </SetRow>
        <WeightDialog
          open={isWeightDialogOpen}
          allowNegative
          increment={props.weightIncrement}
          weight={props.set.weight}
          onClose={() => setIsWeightDialogOpen(false)}
          updateWeight={(w) => props.onUpdateWeight(w, applyTo)}
        >
          <View style={{ gap: theme.space.sm }}>
            <PaperText variant="labelLarge">
              <T keyName="weight.apply_to.label" />
            </PaperText>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: theme.space.xs,
              }}
            >
              <Chip
                selected={applyTo === 'thisSet'}
                testID="repcount-apply-weight-to-this-set"
                onPress={() => setApplyTo('thisSet')}
              >
                <T keyName="exercise.this_set.label" />
              </Chip>
              <Chip
                selected={applyTo === 'uncompletedSets'}
                testID="repcount-apply-weight-to-uncompleted-sets"
                onPress={() => setApplyTo('uncompletedSets')}
              >
                <T keyName="exercise.uncompleted_sets.label" />
              </Chip>
              <Chip
                selected={applyTo === 'allSets'}
                testID="repcount-apply-weight-to-all-sets"
                onPress={() => setApplyTo('allSets')}
              >
                <T keyName="exercise.all_sets.label" />
              </Chip>
            </View>
          </View>
        </WeightDialog>
    </>
  );

  return (
    <Holdable disabled={props.isReadonly} onLongPress={() => setIsRepsDialogOpen(true)}>
      {/* The reference active card marks the current set with its red tile and
          ring — the focus ring stays a classic-variant affordance. */}
      {props.variant === 'active' ? (
        rowContent
      ) : (
        <FocusRing isSelected={props.toStartNext} radius={10}>
          {rowContent}
        </FocusRing>
      )}

      <PotentialSetAdditionalActionsDialog
        open={isRepsDialogOpen}
        repTarget={maxReps}
        set={props.set}
        updateRepCount={(reps) => props.onUpdateReps(reps)}
        close={() => setIsRepsDialogOpen(false)}
      />
    </Holdable>
  );
}

import React, { useState } from 'react';
import { View, Modal, TouchableWithoutFeedback } from 'react-native';
import { Button, Dialog, Portal, Text as PaperText } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import Reanimated, { runOnUI } from 'react-native-reanimated';
import Svg, { Circle, Path, G } from 'react-native-svg';
import BigNumber from 'bignumber.js';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useTranslate } from '@tolgee/react';
import { PotentialSet, SetType, WeightAppliesTo } from '@/models/session-models';
import { RepsTarget, Resistance } from '@/models/blueprint-models';
import { Weight, WeightUnit } from '@/models/weight';
import { calculateOneRepMax } from '@/store/stats/calculate-stats';
import WeightDialog from '@/components/presentation/foundation/editors/weight-dialog';
import PotentialSetAdditionalActionsDialog from '@/components/presentation/workout/weighted/potential-sets-addition-actions-dialog';
import { usePressScale } from '@/hooks/usePressScale';
import { detailPalette } from '../detail-tokens';
import * as S from './set-row.styles';

function formatSetWeight(weight: Weight, resistance: Resistance, bodyweightLabel: string): string {
  if (weight.value.isZero() && resistance === 'bodyweight') {
    return bodyweightLabel;
  }
  const isInt = weight.value.isInteger();
  const val = weight.value.decimalPlaces(isInt ? 0 : 1).toString();
  return `${val} ${weight.unit}`;
}

const RPE_OPTIONS: (number | undefined)[] = [
  undefined,
  6.0,
  6.5,
  7.0,
  7.5,
  8.0,
  8.5,
  9.0,
  9.5,
  10.0,
];

const SET_TYPES: { type: SetType; labelKey: string }[] = [
  { type: 'working', labelKey: 'workout.set_type.working' },
  { type: 'warmUp', labelKey: 'workout.set_type.warmup' },
  { type: 'failure', labelKey: 'workout.set_type.failure' },
  { type: 'drop', labelKey: 'workout.set_type.drop' },
];

export interface SetRowProps {
  set: PotentialSet;
  index: number;
  isCurrent: boolean;
  isReadonly?: boolean;
  resistance: Resistance;
  repsTarget: RepsTarget;
  weightIncrement: BigNumber;
  rpeTracking?: boolean;
  previousWeight?: Weight;
  previousRepCount?: number;
  onTapCheck: () => void;
  onUpdateWeight: (weight: Weight, applyTo: WeightAppliesTo) => void;
  onUpdateReps: (reps: number | undefined) => void;
  onUpdateType: (type: SetType) => void;
  onUpdateRpe: (rpe: number | undefined) => void;
}

export function SetRowItem({
  set,
  index,
  isCurrent,
  isReadonly = false,
  resistance,
  repsTarget,
  weightIncrement,
  rpeTracking = false,
  previousWeight,
  previousRepCount,
  onTapCheck,
  onUpdateWeight,
  onUpdateReps,
  onUpdateType,
  onUpdateRpe,
}: SetRowProps) {
  const theme = useAppTheme();
  const pal = detailPalette(theme.isDark);
  const { t } = useTranslate();
  const { pressIn, pressOut, animatedStyle } = usePressScale(isReadonly);

  const [weightDialogOpen, setWeightDialogOpen] = useState(false);
  const [repsDialogOpen, setRepsDialogOpen] = useState(false);
  const [typeMenuOpen, setTypeMenuOpen] = useState(false);
  const [rpePickerOpen, setRpePickerOpen] = useState(false);
  const [applyTo, setApplyTo] = useState<WeightAppliesTo>('uncompletedSets');

  const done = set.set !== undefined;
  const setType: SetType = set.set?.type ?? 'working';
  const rowState = done ? 'done' : isCurrent ? 'current' : 'upcoming';
  const loggedReps = set.set?.repsCompleted;
  const loggedRpe = set.set?.rpe;

  // Safe increment value (default to 2.5 if 0)
  const step = weightIncrement.isGreaterThan(0) ? weightIncrement : new BigNumber(2.5);

  const handleMinus = () => {
    if (isReadonly) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const nextVal = BigNumber.max(0, set.weight.value.minus(step));
    onUpdateWeight(new Weight(nextVal, set.weight.unit), 'thisSet');
  };

  const handlePlus = () => {
    if (isReadonly) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const nextVal = set.weight.value.plus(step);
    onUpdateWeight(new Weight(nextVal, set.weight.unit), 'thisSet');
  };

  const handleCheckPress = () => {
    if (isReadonly) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onTapCheck();
  };

  // e1RM calculation for completed sets
  const e1rm = done && set.set ? calculateOneRepMax(set, set.weight) : undefined;
  const prevE1rm =
    previousWeight && previousRepCount !== undefined
      ? previousWeight.multipliedBy(new BigNumber(1).plus(new BigNumber(previousRepCount).div(30)))
      : undefined;

  const e1rmTrend = (() => {
    if (!e1rm || !prevE1rm) return undefined;
    if (e1rm.isGreaterThan(prevE1rm)) return 'up';
    if (prevE1rm.isGreaterThan(e1rm)) return 'down';
    return 'same';
  })();

  const weightStr = formatSetWeight(set.weight, resistance, t('exercise.short_bodyweight.label'));

  return (
    <>
      <S.RowContainer $isCurrent={isCurrent}>
        {/* Number Tile: tap or long-press opens type menu */}
        <S.NumberTile
          $state={rowState}
          $type={setType}
          onPress={() => !isReadonly && setTypeMenuOpen(true)}
          onLongPress={() => !isReadonly && setTypeMenuOpen(true)}
          hitSlop={6}
        >
          <S.NumberText $state={rowState} $type={setType}>
            {index + 1}
          </S.NumberText>
          {setType === 'warmUp' && <S.WarmUpLabel>W</S.WarmUpLabel>}
        </S.NumberTile>

        {/* Load Stepper: - value + */}
        <S.StepperGroup>
          <S.StepperButton onPress={handleMinus} disabled={isReadonly} hitSlop={4}>
            <S.StepperButtonText>−</S.StepperButtonText>
          </S.StepperButton>

          <S.WeightPressable
            onPress={() => {
              if (isReadonly) return;
              setApplyTo(set.set ? 'thisSet' : 'uncompletedSets');
              setWeightDialogOpen(true);
            }}
            disabled={isReadonly}
            hitSlop={6}
          >
            <S.WeightValue $done={done} numberOfLines={1}>
              {weightStr}
            </S.WeightValue>
          </S.WeightPressable>

          <S.StepperButton onPress={handlePlus} disabled={isReadonly} hitSlop={4}>
            <S.StepperButtonText>+</S.StepperButtonText>
          </S.StepperButton>
        </S.StepperGroup>

        {/* Reps with printed target range */}
        <S.RepsPressable
          onPress={() => !isReadonly && onTapCheck()}
          onLongPress={() => !isReadonly && setRepsDialogOpen(true)}
          disabled={isReadonly}
          hitSlop={6}
        >
          <S.RepsValue $done={done} numberOfLines={1}>
            × {loggedReps ?? repsTarget.max}
          </S.RepsValue>
          <S.RepsTargetSub numberOfLines={1}>
            {repsTarget.min === repsTarget.max
              ? `${repsTarget.min}`
              : `${repsTarget.min}–${repsTarget.max}`}
          </S.RepsTargetSub>
        </S.RepsPressable>

        {/* RPE Chip (only when rpeTracking enabled) */}
        {rpeTracking && (
          <S.RpePill onPress={() => !isReadonly && setRpePickerOpen(true)} hitSlop={6}>
            <S.RpePillText>{loggedRpe !== undefined ? `RPE ${loggedRpe}` : 'RPE'}</S.RpePillText>
            {loggedRpe !== undefined && (
              <S.EffortBarTrack>
                <S.EffortBarFill $percent={(loggedRpe - 5) / 5} />
              </S.EffortBarTrack>
            )}
          </S.RpePill>
        )}

        {/* Space filler / e1RM lane */}
        <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
          {e1rm && (
            <S.E1rmStack>
              <S.E1rmValue numberOfLines={1}>
                {e1rm.value.decimalPlaces(1).toString()} {e1rm.unit}
              </S.E1rmValue>
              {e1rmTrend && (
                <S.E1rmSub $trend={e1rmTrend}>
                  {e1rmTrend === 'up' ? '▲ BEST' : e1rmTrend === 'down' ? '▼' : '='}
                </S.E1rmSub>
              )}
            </S.E1rmStack>
          )}
        </View>

        {/* Checkmark Button */}
        <S.CheckPressable
          onPress={handleCheckPress}
          onPressIn={() => runOnUI(pressIn)()}
          onPressOut={() => runOnUI(pressOut)()}
          disabled={isReadonly}
          hitSlop={8}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: done }}
        >
          <Reanimated.View style={animatedStyle}>
            {done ? (
              <Svg width={28} height={28} viewBox="0 0 28 28">
                <Circle
                  cx={14}
                  cy={14}
                  r={12}
                  fill={setType === 'failure' ? pal.detail.setRow.failureCheck : pal.card.checkDoneFill}
                />
                <G transform="translate(14, 14) scale(0.95)">
                  <Path
                    d="M-5 0.4 L-1.6 4 L5.6 -4"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </G>
              </Svg>
            ) : isCurrent ? (
              <Svg width={28} height={28} viewBox="0 0 28 28">
                <Circle cx={14} cy={14} r={12} fill={pal.card.checkFill} stroke={pal.card.checkRing} strokeWidth={2} />
                <Circle cx={14} cy={14} r={4.5} fill={pal.card.checkDot} />
              </Svg>
            ) : (
              <Svg width={28} height={28} viewBox="0 0 28 28">
                <Circle
                  cx={14}
                  cy={14}
                  r={12}
                  fill="none"
                  stroke={pal.card.checkUpcomingRing}
                  strokeWidth={2}
                />
              </Svg>
            )}
          </Reanimated.View>
        </S.CheckPressable>
      </S.RowContainer>

      {/* Weight Dialog */}
      <WeightDialog
        open={weightDialogOpen}
        allowNegative
        increment={step}
        weight={set.weight}
        onClose={() => setWeightDialogOpen(false)}
        updateWeight={(w) => onUpdateWeight(w, applyTo)}
      />

      {/* Reps Dialog */}
      <PotentialSetAdditionalActionsDialog
        open={repsDialogOpen}
        repTarget={repsTarget.max}
        set={set}
        updateRepCount={(reps) => onUpdateReps(reps)}
        close={() => setRepsDialogOpen(false)}
      />

      {/* Set Type Menu Dialog */}
      <Portal>
        <Dialog visible={typeMenuOpen} onDismiss={() => setTypeMenuOpen(false)}>
          <Dialog.Title>Set Type</Dialog.Title>
          <Dialog.Content>
            {SET_TYPES.map(({ type, labelKey }) => (
              <Button
                key={type}
                mode={setType === type ? 'contained' : 'text'}
                onPress={() => {
                  onUpdateType(type);
                  setTypeMenuOpen(false);
                }}
                style={{ marginVertical: 4, justifyContent: 'flex-start' }}
              >
                {t(labelKey)}
              </Button>
            ))}
          </Dialog.Content>
        </Dialog>
      </Portal>

      {/* RPE Picker Dialog */}
      <Portal>
        <Dialog visible={rpePickerOpen} onDismiss={() => setRpePickerOpen(false)}>
          <Dialog.Title>Rate of Perceived Exertion (RPE)</Dialog.Title>
          <Dialog.Content>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {RPE_OPTIONS.map((val) => (
                <Button
                  key={val ?? 'none'}
                  mode={loggedRpe === val ? 'contained' : 'outlined'}
                  onPress={() => {
                    onUpdateRpe(val);
                    setRpePickerOpen(false);
                  }}
                  compact
                >
                  {val !== undefined ? `${val.toFixed(1)}` : 'None'}
                </Button>
              ))}
            </View>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </>
  );
}

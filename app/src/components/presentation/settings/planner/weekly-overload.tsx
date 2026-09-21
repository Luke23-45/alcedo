import Svg, { Path } from 'react-native-svg';
import { Pressable } from 'react-native';
import { useDispatch } from 'react-redux';
import { usePreferredWeightSuffix, usePreferredWeightUnit } from '@/hooks/usePreferredWeightUnit';
import { useAppSelector } from '@/store';
import { setPlannerWeeklyOverloadKg } from '@/store/settings';
import { useTranslate } from '@tolgee/react';
import { settingsKey } from '@/components/presentation/settings/shared/settings-i18n';
import {
  OverloadCaption,
  OverloadCard,
  OverloadText,
  OverloadTitle,
  StepButton,
  Stepper,
  StepValue,
} from './weekly-overload.styles';

const STEP_KG = 0.5;
const MIN_KG = 0;
const MAX_KG = 10;

function trimZeros(value: number): string {
  return value.toFixed(1).replace(/\.0$/, '');
}

/**
 * Weekly overload stepper: how much the planner adds to main lifts each week.
 * Stored in kilograms; displayed in the preferred unit.
 */
export function WeeklyOverload() {
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const overloadKg = useAppSelector((s) => s.settings.plannerWeeklyOverloadKg);
  const unit = usePreferredWeightUnit();
  const suffix = usePreferredWeightSuffix();

  const displayKg = unit === 'pounds' ? overloadKg * 2.20462 : overloadKg;
  const display = `${trimZeros(Math.round(displayKg * 2) / 2)} ${suffix}`;

  const set = (kg: number) =>
    dispatch(setPlannerWeeklyOverloadKg(Math.min(MAX_KG, Math.max(MIN_KG, Math.round(kg * 2) / 2))));

  return (
    <OverloadCard>
      <OverloadText>
        <OverloadTitle>{t(settingsKey('settings.planner.weekly_overload.label'))}</OverloadTitle>
        <OverloadCaption>{t(settingsKey('settings.planner.weekly_overload.caption'))}</OverloadCaption>
      </OverloadText>
      <Stepper>
        <Pressable
          onPress={() => set(overloadKg - STEP_KG)}
          accessibilityRole="button"
          accessibilityLabel={t(settingsKey('settings.planner.weekly_overload.decrease'))}
          hitSlop={7}
          style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
        >
          <StepButton>
            <Svg width={14} height={14} viewBox="-7 -7 14 14">
              <Path d="M-5 0 H5" stroke="#C7C7CC" strokeWidth={2} strokeLinecap="round" />
            </Svg>
          </StepButton>
        </Pressable>
        <StepValue>{display}</StepValue>
        <Pressable
          onPress={() => set(overloadKg + STEP_KG)}
          accessibilityRole="button"
          accessibilityLabel={t(settingsKey('settings.planner.weekly_overload.increase'))}
          hitSlop={7}
          style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
        >
          <StepButton>
            <Svg width={14} height={14} viewBox="-7 -7 14 14">
              <Path d="M-5 0 H5 M0 -5 V5" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" />
            </Svg>
          </StepButton>
        </Pressable>
      </Stepper>
    </OverloadCard>
  );
}

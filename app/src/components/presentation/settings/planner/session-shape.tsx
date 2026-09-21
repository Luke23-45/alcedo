import { Pressable } from 'react-native';
import { useDispatch } from 'react-redux';
import { PlannerFocus } from '@/store/settings/registry';
import { setPlannerFocus, setPlannerTargetRpe, setPlannerTargetSessionMinutes } from '@/store/settings';
import { useAppSelector } from '@/store';
import { useTranslate } from '@tolgee/react';
import { settingsKey } from '@/components/presentation/settings/shared/settings-i18n';
import { PlannerSlider } from './planner-slider';
import { FocusCard, FocusLabel, FocusOption, FocusOptionText, FocusTrack, ShapeCard } from './session-shape.styles';

const FOCUS_OPTIONS: PlannerFocus[] = ['strength', 'hypertrophy', 'conditioning'];

function formatRpe(value: number): string {
  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
}

/**
 * SESSION SHAPE: target-length slider (30–90 min), focus chips, and target
 * effort slider (RPE 5–10). All three persist through the planner preference
 * keys, so the planner actually plans from them.
 */
export function SessionShape() {
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const targetMinutes = useAppSelector((s) => s.settings.plannerTargetSessionMinutes);
  const targetRpe = useAppSelector((s) => s.settings.plannerTargetRpe);
  const focus = useAppSelector((s) => s.settings.plannerFocus);

  return (
    <>
      <ShapeCard>
        <PlannerSlider
          label={t(settingsKey('settings.planner.target_length.label'))}
          value={targetMinutes}
          min={30}
          max={90}
          step={5}
          onChange={(value) => dispatch(setPlannerTargetSessionMinutes(value))}
          formatValue={(value) => t(settingsKey('settings.planner.target_length.value'), { count: value })}
          formatTick={(value) => value.toString()}
          accessibilityLabel={t(settingsKey('settings.planner.target_length.label'))}
          testID="planner-target-length-slider"
        />
      </ShapeCard>
      <FocusCard>
        <FocusLabel>{t(settingsKey('settings.planner.focus.label'))}</FocusLabel>
        <FocusTrack accessibilityRole="radiogroup">
          {FOCUS_OPTIONS.map((option) => {
            const selected = focus === option;
            return (
              <Pressable
                key={option}
                onPress={() => dispatch(setPlannerFocus(option))}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                accessibilityLabel={t(settingsKey(`settings.planner.focus.${option}`))}
                style={{ flex: 1 }}
              >
                <FocusOption $selected={selected}>
                  <FocusOptionText $selected={selected}>
                    {t(settingsKey(`settings.planner.focus.${option}`))}
                  </FocusOptionText>
                </FocusOption>
              </Pressable>
            );
          })}
        </FocusTrack>
      </FocusCard>
      <ShapeCard>
        <PlannerSlider
          label={t(settingsKey('settings.planner.target_rpe.label'))}
          value={targetRpe}
          min={5}
          max={10}
          step={0.5}
          onChange={(value) => dispatch(setPlannerTargetRpe(value))}
          midTick
          formatValue={formatRpe}
          formatTick={formatRpe}
          accessibilityLabel={t(settingsKey('settings.planner.target_rpe.label'))}
          testID="planner-target-rpe-slider"
        />
      </ShapeCard>
    </>
  );
}

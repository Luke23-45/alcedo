import { HomeText } from '@/components/presentation/home/shared/home-text';
import { useAppTheme } from '@/hooks/useAppTheme';
import { alpha, fontWeight } from '@/styles/theme';
import { useTranslate } from '@tolgee/react';
import { type PickerExercise } from '../exercise-picker-model';
import {
  BarGradient,
  BarHairline,
  ButtonEdge,
  ButtonGradient,
  ConfirmButton,
  ConfirmLabelWrap,
  ConfirmWrap,
  GlossLayer,
} from './sticky-confirm.styles';

/**
 * Sticky confirmation: tb bar, brand-gradient "Show Trends" button (361×54
 * rx27) with helper line. Disabled until an exercise is selected: reduced
 * opacity, no action, and the helper names the no-selection state.
 */
export function StickyConfirm({
  exercise,
  onConfirm,
}: {
  exercise: PickerExercise | undefined;
  onConfirm: () => void;
}) {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const disabled = exercise === undefined;
  return (
    <ConfirmWrap>
      <BarGradient
        colors={
          (theme.isDark
            ? [alpha('#15151A', 0.94), alpha('#0C0C10', 0.99)]
            : [alpha('#FBFBFD', 0.94), alpha('#F1F1F6', 0.99)]) as [string, string]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      <BarHairline />
      <ConfirmButton
        $disabled={disabled}
        onPress={disabled ? undefined : onConfirm}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        accessibilityLabel={t('stats.exercise_picker.confirm.button')}
      >
        <ButtonGradient />
        <GlossLayer />
        <ButtonEdge />
        <ConfirmLabelWrap>
          <HomeText
            weight={fontWeight.semibold}
            tracking={-0.3}
            style={{ fontSize: 16, lineHeight: 22, color: '#FFFFFF' }}
          >
            {t('stats.exercise_picker.confirm.button')}
          </HomeText>
        </ConfirmLabelWrap>
      </ConfirmButton>
      <HomeText
        weight={fontWeight.medium}
        style={{
          fontSize: 10.5,
          lineHeight: 14,
          marginTop: 8,
          textAlign: 'center',
          color: theme.isDark ? '#6C6C70' : '#8E8E93',
        }}
      >
        {disabled
          ? t('stats.exercise_picker.confirm.hint.empty')
          : t('stats.exercise_picker.confirm.hint.ready', { name: exercise.name })}
      </HomeText>
    </ConfirmWrap>
  );
}

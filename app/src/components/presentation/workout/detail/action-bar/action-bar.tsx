import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useTranslate } from '@tolgee/react';
import { FocusState } from '@/components/presentation/workout/session/workout-focus-state';
import { BrandButton } from '@/components/presentation/workout/session/brand-button/brand-button';
import { sessionPalette } from '@/components/presentation/workout/session/session-tokens';
import * as S from './action-bar.styles';

export interface ActionBarProps {
  focusState: FocusState;
  onPrimary: () => void;
  onSecondary?: () => void;
  primaryLabel?: string;
  secondaryLabel?: string;
  isPaused?: boolean;
}

/**
 * Pinned Action Bar at screen bottom (§4.2.7 / P4.7).
 * Fixed over a 44pt fade (`fd`) + background gradient (`tb`), extended under
 * the home indicator by `insets.bottom`. 54pt BrandButton for primary CTA,
 * 44pt ghost action for secondary. Paused workout dims secondary and locks primary to Resume.
 */
export function ActionBar({
  focusState,
  onPrimary,
  onSecondary,
  primaryLabel,
  secondaryLabel,
  isPaused = false,
}: ActionBarProps) {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const { t } = useTranslate();
  const pal = sessionPalette(theme.isDark);

  const resolvePrimaryText = (): string => {
    if (primaryLabel) return primaryLabel;
    switch (focusState.primary.verb) {
      case 'startWorkout':
        return t('workout.session.start.button', 'Start Workout');
      case 'logSet':
        return t('workout.session.log_set.button', 'Log Set');
      case 'nextExercise':
        return t('workout.session.next_exercise.button', 'Next Exercise');
      case 'finishWorkout':
        return t('workout.session.finish_workout.button', 'Finish Workout');
      case 'resumeWorkout':
        return t('workout.session.resume.button', 'Resume Workout');
      case 'adjustRest':
        return t('rest_timer.adjust.label', 'Rest Running');
      default:
        return 'Continue';
    }
  };

  const resolveSecondaryText = (): string | undefined => {
    if (secondaryLabel) return secondaryLabel;
    if (!focusState.secondary) return undefined;
    switch (focusState.secondary.verb) {
      case 'addExercise':
        return t('workout.session.add_exercise.button', 'Add Exercise');
      case 'skip':
        return t('rest_timer.skip.button', 'Skip Rest');
      case 'finishWorkout':
        return t('workout.session.finish.button', 'Finish');
      default:
        return undefined;
    }
  };

  const secText = resolveSecondaryText();

  return (
    <S.ActionBarWrapper pointerEvents="box-none">
      {/* 44pt fade-out above footer (spec fd) */}
      <LinearGradient
        colors={[
          theme.isDark ? 'rgba(5,5,7,0)' : 'rgba(243,243,248,0)',
          pal.footer.fadeEnd,
        ]}
        style={{ height: 44, width: '100%' }}
        pointerEvents="none"
      />

      {/* Solid gradient container (spec tb) */}
      <LinearGradient
        colors={[pal.footer.gradientFrom, pal.footer.gradientTo]}
        style={{ width: '100%' }}
      >
        <S.BarBody $bottomInset={insets.bottom}>
          {/* Secondary ghost CTA */}
          {secText && onSecondary && (
            <S.SecondaryPressable
              onPress={isPaused ? undefined : onSecondary}
              $disabled={isPaused}
              hitSlop={8}
              accessibilityRole="button"
            >
              <S.SecondaryText>{secText}</S.SecondaryText>
            </S.SecondaryPressable>
          )}

          {/* Primary 54pt BrandButton */}
          <S.PrimarySlot>
            <BrandButton
              label={resolvePrimaryText()}
              onPress={onPrimary}
              height={54}
              radius={27}
              fontSize={16}
              letterSpacing={-0.3}
              testID="detail-primary-cta"
            />
          </S.PrimarySlot>
        </S.BarBody>
      </LinearGradient>
    </S.ActionBarWrapper>
  );
}

import Svg, { Path } from 'react-native-svg';
import { HomeGradient } from '../../home/shared/home-gradient';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useTranslate } from '@tolgee/react';
import * as S from './plan-commit-bar.styles';

/** 15px down-tray glyph for the save button. Rounded joins throughout. */
function SaveGlyph() {
  return (
    <Svg width={15} height={15} viewBox="0 0 15 15">
      <Path
        d="M7.5 2.5v6.5M4.9 6.9l2.6 2.6 2.6-2.6"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2.5 10.5h10V12a1.5 1.5 0 01-1.5 1.5H4A1.5 1.5 0 012.5 12v-1.5z"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={1.7}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

interface PlanCommitBarProps {
  selectedCount: number;
  saveDisabled: boolean;
  onSave: () => void;
  onDiscard: () => void;
}

/**
 * The floating commit bar from the diff-save reference: ghost Discard
 * (110×54) beside the gradient Save (54pt tall). At zero selections the
 * save button is disabled and labeled plain "Save".
 */
export function PlanCommitBar({ selectedCount, saveDisabled, onSave, onDiscard }: PlanCommitBarProps) {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const dark = theme.isDark;

  const saveLabel = saveDisabled
    ? t('generic.save.button')
    : t('plan.diff.commit.save_changes', { count: selectedCount });

  return (
    <S.BarSurface $dark={dark}>
      <S.DiscardButton
        $dark={dark}
        onPress={onDiscard}
        accessibilityRole="button"
        accessibilityLabel={t('plan.diff.commit.discard')}
        style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
      >
        <S.DiscardLabel $dark={dark} numberOfLines={1}>
          {t('plan.diff.commit.discard')}
        </S.DiscardLabel>
      </S.DiscardButton>
      <S.SaveButton
        $dark={dark}
        $disabled={saveDisabled}
        onPress={saveDisabled ? undefined : onSave}
        disabled={saveDisabled}
        accessibilityRole="button"
        accessibilityLabel={saveLabel}
        accessibilityState={{ disabled: saveDisabled }}
        style={({ pressed }) => ({ opacity: pressed && !saveDisabled ? 0.85 : 1 })}
      >
        {!saveDisabled && (
          <S.SaveGradientFill>
            <HomeGradient variant="brand" style={{ flex: 1 }} />
            <S.SaveGloss />
            <S.SaveEdge pointerEvents="none" />
          </S.SaveGradientFill>
        )}
        <S.SaveContent>
          {!saveDisabled && <SaveGlyph />}
          <S.SaveLabel $disabled={saveDisabled}>{saveLabel}</S.SaveLabel>
        </S.SaveContent>
      </S.SaveButton>
    </S.BarSurface>
  );
}

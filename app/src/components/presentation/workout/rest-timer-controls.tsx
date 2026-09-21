import { Path, Svg } from 'react-native-svg';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useTranslate } from '@tolgee/react';
import type { RestTimerControlsProps } from './rest-timer-controls-props';
import * as S from './rest-timer.styles';

/** White play triangle, optically nudged right like the reference (+1.4pt). */
function PlayGlyph() {
  return (
    <Svg width={20} height={20} viewBox="-10 -10 20 20" style={{ marginLeft: 1.5 }}>
      <Path d="M-4 -6.4 L6.4 0 L-4 6.4 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth={2.4} strokeLinejoin="round" />
    </Svg>
  );
}

/** The 30pt −15/+15 circles and 30pt-tall pills keep their reference visuals; hitSlop expands them to 44×44. */
const hitSlop44 = { top: 7, bottom: 7, left: 7, right: 7 };
const hitSlopTall = { top: 7, bottom: 7 };

/**
 * The reference control sets, per timer state. Running and paused share the
 * −15/+15/Skip row (paused swaps the −15 slot for the resume circle); the
 * complete state gets the brand "Log Set" pill, or Skip when unwired.
 */
export function RestTimerControls({
  variant,
  onSubtract15,
  onAdd15,
  onTogglePause,
  onSkip,
  onLogSet,
}: RestTimerControlsProps) {
  const theme = useAppTheme();
  const { t } = useTranslate();
  const dark = theme.isDark;
  const adjustColor = dark ? '#C7C7CC' : '#1C1C1E';
  const pillColor = dark ? '#F5F5F7' : '#1C1C1E';

  const skipPill = (width: number) => (
    <S.SkipPill
      $width={width}
      onPress={onSkip}
      accessibilityRole="button"
      accessibilityLabel={t('rest_timer.dismiss')}
      hitSlop={hitSlopTall}
    >
      <S.SkipLabel $color={pillColor}>{t('rest_timer.skip')}</S.SkipLabel>
    </S.SkipPill>
  );

  if (variant === 'complete') {
    if (onLogSet) {
      return (
        <S.LogSetPill
          onPress={onLogSet}
          accessibilityRole="button"
          accessibilityLabel={t('rest_timer.log_set')}
          hitSlop={hitSlopTall}
        >
          <S.LogSetBackground />
          <S.LogSetEdge />
          <S.LogSetLabel>{t('rest_timer.log_set')}</S.LogSetLabel>
        </S.LogSetPill>
      );
    }
    return <S.ControlsRow>{skipPill(64)}</S.ControlsRow>;
  }

  const add15 = (gapAfter: number) => (
    <S.AdjustButton
      $gapAfter={gapAfter}
      onPress={onAdd15}
      accessibilityRole="button"
      accessibilityLabel={t('rest_timer.add_15')}
      hitSlop={hitSlop44}
    >
      <S.AdjustLabel $color={adjustColor}>+15</S.AdjustLabel>
    </S.AdjustButton>
  );

  if (variant === 'paused') {
    return (
      <S.ControlsRow>
        <S.ResumeButton
          $gapAfter={10}
          onPress={onTogglePause}
          accessibilityRole="button"
          accessibilityLabel={t('rest_timer.resume')}
          hitSlop={{ top: 3, bottom: 3, left: 3, right: 3 }}
        >
          <S.ResumeCircle>
            <PlayGlyph />
          </S.ResumeCircle>
        </S.ResumeButton>
        {add15(8)}
        {skipPill(62)}
      </S.ControlsRow>
    );
  }

  return (
    <S.ControlsRow>
      <S.AdjustButton
        $gapAfter={8}
        onPress={onSubtract15}
        accessibilityRole="button"
        accessibilityLabel={t('rest_timer.subtract_15')}
        hitSlop={hitSlop44}
      >
        {/* U+2212 minus, as drawn in the reference. */}
        <S.AdjustLabel $color={adjustColor}>−15</S.AdjustLabel>
      </S.AdjustButton>
      {add15(12)}
      {skipPill(64)}
    </S.ControlsRow>
  );
}

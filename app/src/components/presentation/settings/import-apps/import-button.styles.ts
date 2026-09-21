import styled, { css } from 'styled-components/native';
import { type as typeStyle } from '@/styles/theme';

/**
 * S5 §6: sticky footer surface (backup-redesign.md §5: hairline top edge on a
 * translucent material). Mirrors the plan-diff commit bar treatment.
 */
export const BarSurface = styled.View`
  padding: 16px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => (theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)')};
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(28,28,30,0.72)' : 'rgba(249,249,249,0.72)')};
`;

/**
 * The 54pt brand Import button: pill, gloss, white edge, crimson shadow
 * (backup-redesign.md §5 `br`/`fb`/`gl`). Light-mode gradient follows the
 * design's light-mode delta (#FF9500 → #E8003F).
 */
export const ImportPressable = styled.Pressable`
  height: 54px;
  border-radius: 27px;
  border-curve: continuous;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.22);
  ${({ theme }) =>
    theme.isDark
      ? css`
          shadow-color: #ff2d55;
          shadow-offset: 0px 7px;
          shadow-opacity: 0.5;
          shadow-radius: 12px;
          elevation: 8;
        `
      : css`
          shadow-color: #d70015;
          shadow-offset: 0px 7px;
          shadow-opacity: 0.35;
          shadow-radius: 12px;
          elevation: 8;
        `}
`;

export const ImportGradientFill = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

/** Gloss: top-half white sheen, clipped to the pill. */
export const ImportGloss = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 27px;
  border-top-left-radius: 27px;
  border-top-right-radius: 27px;
`;

export const ImportLabel = styled.Text`
  ${({ theme }) => typeStyle(theme, 'callout', { weight: '600' })}
  letter-spacing: -0.3px;
  color: #ffffff;
`;

/** "Opens document picker · no confirmation" (backup-redesign.md §5) —
 * 10.5pt secondary, centered below the button. */
export const ImportCaption = styled.Text`
  ${({ theme }) => typeStyle(theme, 'footnote', { weight: '500' })}
  font-size: 10.5px;
  line-height: 15px;
  color: ${({ theme }) => theme.color.content.secondary};
  text-align: center;
  margin-top: 8px;
`;

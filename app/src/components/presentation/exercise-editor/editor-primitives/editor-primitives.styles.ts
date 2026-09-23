import styled, { css } from 'styled-components/native';
import { StyleSheet } from 'react-native';
import { HomeGradient, HomeGradientVariant } from '../../home/shared/home-gradient';
import { type as typeHelper } from '@/styles/theme';
import { editorPalette } from '../exercise-editor-tokens';

// ============================================================================
// Card shell — the reference two-layer treatment: 1pt edge-stroke gradient
// (white fading downward / black in light) over the diagonal 3-stop body,
// dy10/blur14 shadow. Concentric radii: edge r, body r-1.
// ============================================================================

export const CardMargin = styled.View`
  margin-left: 16px;
  margin-right: 16px;
`;

export const CardEdge = styled(HomeGradient).attrs({ variant: 'cardEdge' as HomeGradientVariant })<{
  $radius: number;
}>`
  border-radius: ${({ $radius }) => $radius}px;
  border-curve: continuous;
  padding: 1px;
  ${({ theme }) =>
    theme.isDark
      ? css`
          shadow-color: #000000;
          shadow-offset: 0px 10px;
          shadow-opacity: 0.5;
          shadow-radius: 14px;
          elevation: 8;
        `
      : css`
          shadow-color: #14142b;
          shadow-offset: 0px 8px;
          shadow-opacity: 0.075;
          shadow-radius: 16px;
          elevation: 4;
        `}
`;

export const CardBody = styled(HomeGradient).attrs({ variant: 'cardBody' as HomeGradientVariant })<{
  $radius: number;
}>`
  border-radius: ${({ $radius }) => $radius}px;
  border-curve: continuous;
  overflow: hidden;
`;

export const CardPad = styled.View`
  padding-left: 16px;
  padding-right: 16px;
`;

export const Hairline = styled.View`
  height: ${StyleSheet.hairlineWidth}px;
  margin-left: 16px;
  margin-right: 12px;
  background-color: ${({ theme }) => editorPalette(theme.isDark).hairline};
`;

// ============================================================================
// Type — exact spec sizes, defined once.
// ============================================================================

export const MicroLabel = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 10px;
  line-height: 13px;
  font-weight: 700;
  letter-spacing: 1.35px;
  color: ${({ theme }) => editorPalette(theme.isDark).text.caption};
  margin-left: 24px;
`;

/** In-card subhead (NOTES, TRACK, EXTERNAL LINK): 9pt vs the 10pt section label. */
export const SubHead = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 9px;
  line-height: 12px;
  font-weight: 700;
  letter-spacing: 1.2px;
  color: ${({ theme }) => editorPalette(theme.isDark).text.caption};
`;

export const RowLabel = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 13.5px;
  line-height: 18px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: ${({ theme }) => editorPalette(theme.isDark).text.secondary};
`;

export const RowCaption = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 10.5px;
  line-height: 14px;
  font-weight: 500;
  color: ${({ theme }) => editorPalette(theme.isDark).text.caption};
`;

export const TertiaryCaption = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 10.5px;
  line-height: 14px;
  font-weight: 500;
  color: ${({ theme }) => editorPalette(theme.isDark).text.tertiary};
`;

export const StepperValue = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 16px;
  line-height: 20px;
  font-weight: 700;
  letter-spacing: -0.4px;
  color: ${({ theme }) => editorPalette(theme.isDark).text.primary};
  min-width: 48px;
  text-align: center;
  font-variant: tabular-nums;
`;

export const SmallStepperValue = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 13px;
  line-height: 16px;
  font-weight: 700;
  color: ${({ theme }) => editorPalette(theme.isDark).text.primary};
  min-width: 28px;
  text-align: center;
  font-variant: tabular-nums;
`;

// ============================================================================
// Segmented control — track 40pt (sections) / 44pt, thumb inset 2–3pt.
// ============================================================================

export const SegmentTrack = styled.View<{ $height: number }>`
  height: ${({ $height }) => $height}px;
  border-radius: ${({ $height }) => $height / 2}px;
  border-curve: continuous;
  flex-direction: row;
  background-color: ${({ theme }) => editorPalette(theme.isDark).control.track};
`;

export const SegmentButton = styled.Pressable`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const SegmentThumb = styled.View<{ $selected: boolean; $height: number }>`
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  border-radius: ${({ $height }) => ($height - 4) / 2}px;
  border-curve: continuous;
  ${({ theme, $selected }) => {
    const palette = editorPalette(theme.isDark);
    if (!$selected) {
      return css`
        background-color: transparent;
      `;
    }
    return theme.isDark
      ? css`
          background-color: ${palette.control.thumb};
          border-width: 1px;
          border-color: ${palette.control.thumbStroke};
          shadow-color: #000000;
          shadow-offset: 0px 2px;
          shadow-opacity: 0.55;
          shadow-radius: 4px;
        `
      : css`
          background-color: ${palette.control.thumb};
          border-width: 1px;
          border-color: ${palette.control.thumbStroke};
          shadow-color: #000000;
          shadow-offset: 0px 1px;
          shadow-opacity: 0.18;
          shadow-radius: 3px;
          elevation: 2;
        `;
  }}
`;

export const SegmentLabel = styled.Text<{ $selected: boolean }>`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 12.5px;
  line-height: 16px;
  font-weight: 600;
  letter-spacing: -0.15px;
  color: ${({ theme, $selected }) => ($selected ? editorPalette(theme.isDark).text.primary : '#8E8E93')};
`;

// ============================================================================
// Stepper — r15 circles (r11 small), minus #C7C7CC / plus white.
// ============================================================================

export const StepperButton = styled.Pressable<{ $small?: boolean; $disabled?: boolean }>`
  width: ${({ $small }) => ($small ? 22 : 30)}px;
  height: ${({ $small }) => ($small ? 22 : 30)}px;
  border-radius: ${({ $small }) => ($small ? 11 : 15)}px;
  border-curve: continuous;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${({ theme }) => editorPalette(theme.isDark).control.stroke};
  background-color: ${({ theme }) => editorPalette(theme.isDark).control.fill};
  opacity: ${({ $disabled }) => ($disabled ? 0.35 : 1)};
`;

export const StepperRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

// ============================================================================
// Toggle — 44×26; locked reads dimmed-green + lock, never a choice.
// ============================================================================

export const ToggleTrack = styled.View<{ $on: boolean; $locked: boolean }>`
  width: 44px;
  height: 26px;
  border-radius: 13px;
  border-curve: continuous;
  justify-content: center;
  background-color: ${({ theme, $on, $locked }) => {
    const palette = editorPalette(theme.isDark);
    if (!$on) {
      return theme.isDark ? 'rgba(255,255,255,0.14)' : 'rgba(120,120,128,0.20)';
    }
    if ($locked) {
      return palette.lockedToggle;
    }
    return palette.accent.green;
  }};
`;

export const ToggleKnob = styled.View<{ $on: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 11px;
  background-color: #ffffff;
  position: absolute;
  ${({ $on }) =>
    $on
      ? css`
          right: 2px;
        `
      : css`
          left: 2px;
        `}
  shadow-color: #000000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.25;
  shadow-radius: 2px;
  elevation: 2;
`;

export const LockedKnobWrap = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const LockedRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

// ============================================================================
// Radio — r10 ring; ember ring+dot selected.
// ============================================================================

export const RadioRing = styled.View<{ $selected: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  border-width: ${({ $selected }) => ($selected ? 2 : 1.6)}px;
  border-color: ${({ theme, $selected }) =>
    $selected
      ? theme.isDark
        ? editorPalette(true).accent.ember
        : editorPalette(false).accent.emberOnLight
      : editorPalette(theme.isDark).radio};
`;

export const RadioDot = styled.View`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${({ theme }) =>
    theme.isDark ? editorPalette(true).accent.ember : editorPalette(false).accent.emberOnLight};
`;

// ============================================================================
// Inset well — the name row and the unfocused search field. Reference: white
// .07 fill, white .09 @.9 stroke, rx 14; icon center 20pt from the well edge.
// ============================================================================

export const WellField = styled.Pressable<{ $height?: number }>`
  min-height: ${({ $height }) => $height ?? 48}px;
  border-radius: 14px;
  border-curve: continuous;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding-left: 10px;
  padding-right: 10px;
  background-color: ${({ theme }) => editorPalette(theme.isDark).well.fill};
  border-width: 0.9px;
  border-color: ${({ theme }) => editorPalette(theme.isDark).well.stroke};
`;

/**
 * Focused search field — the reference draws the ember gradient as the field
 * stroke (1.6pt) with a soft #FF6A3D glow. The gradient wrapper carries the
 * padding; the inner well keeps the field fill.
 */
export const FocusGlow = styled(HomeGradient).attrs({ variant: 'brand' as HomeGradientVariant })`
  border-radius: 15.6px;
  border-curve: continuous;
  padding: 1.6px;
  shadow-color: #ff6a3d;
  shadow-offset: 0px 0px;
  shadow-opacity: 0.4;
  shadow-radius: 5px;
  elevation: 4;
`;

export const FocusFieldInner = styled.View<{ $height?: number }>`
  min-height: ${({ $height }) => $height ?? 48}px;
  border-radius: 14px;
  border-curve: continuous;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding-left: 10px;
  padding-right: 10px;
  background-color: ${({ theme }) => (theme.isDark ? editorPalette(true).well.fill : 'rgba(255,255,255,0.92)')};
`;

export const ResultTile = styled.View<{ $bg: string }>`
  width: 28px;
  height: 28px;
  border-radius: 9px;
  border-curve: continuous;
  align-items: center;
  justify-content: center;
  background-color: ${({ $bg }) => $bg};
`;

export const ResultTileLetter = styled.Text<{ $fg: string }>`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 12px;
  line-height: 14px;
  font-weight: 700;
  color: ${({ $fg }) => $fg};
`;

/**
 * Search-result tile accents, cycled by result index. First two match the
 * reference exactly (red, blue); the rest continue the iOS accent ramp.
 * Single source for tile accents in this feature (no token duplicate).
 */
const TILE_ACCENTS = [
  { bg: 'rgba(255,45,85,0.15)', fg: '#FF6A88' },
  { bg: 'rgba(10,132,255,0.16)', fg: '#5EB0FF' },
  { bg: 'rgba(48,209,88,0.15)', fg: '#7EE2A0' },
  { bg: 'rgba(255,159,10,0.16)', fg: '#FFB340' },
  { bg: 'rgba(191,90,242,0.16)', fg: '#D69CFF' },
] as const;

export function tileAccent(index: number): { bg: string; fg: string } {
  return TILE_ACCENTS[index % TILE_ACCENTS.length]!;
}

// ============================================================================
// Overlay sheets / dialogs.
// ============================================================================

export const OverlayBackdrop = styled.Pressable`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.55);
  justify-content: flex-end;
`;

export const SheetHandle = styled.View`
  width: 36px;
  height: 5px;
  border-radius: 2.5px;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.22)' : 'rgba(120, 120, 128, 0.35)')};
  align-self: center;
  margin-top: 12px;
  margin-bottom: 12px;
`;

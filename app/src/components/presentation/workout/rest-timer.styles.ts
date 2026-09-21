import { createElement, type ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import styled, { css } from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/hooks/useAppTheme';
import { alpha, type FontWeight } from '@/styles/theme';

/* ------------------------------------------------------------------ *
 * Gradient shells. `styled(LinearGradient)` keeps `colors` required in
 * the v6 types even when provided via `.attrs()`, so these tiny
 * hook-driven wrappers give the styled layer optional props instead.
 * Written with createElement — this file stays `.styles.ts` (no JSX).
 * ------------------------------------------------------------------ */

type ShellProps = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** 1pt edge stroke: white fading downward (dark) / black (light). */
function EdgeGradient({ children, style, testID }: ShellProps) {
  const theme = useAppTheme();
  return createElement(
    LinearGradient,
    {
      colors: [...theme.home.cardEdge.colors],
      start: theme.home.cardEdge.start,
      end: theme.home.cardEdge.end,
      style,
      testID,
    },
    children,
  );
}

/** Diagonal 3-stop card body, lit from above. */
function BodyGradient({ children, style }: ShellProps) {
  const theme = useAppTheme();
  return createElement(
    LinearGradient,
    {
      colors: [...theme.home.card.colors],
      start: theme.home.card.start,
      end: theme.home.card.end,
      style,
    },
    children,
  );
}

/** Brand gradient: #FFB03A → #FF6A3D → #FF2D55, stops 0 / 0.45 / 1. Same in both themes. */
function BrandGradient({ children, style }: ShellProps) {
  return createElement(
    LinearGradient,
    {
      colors: ['#FFB03A', '#FF6A3D', '#FF2D55'],
      locations: [0, 0.45, 1],
      start: { x: 0, y: 0 },
      end: { x: 0.6, y: 1 },
      style,
    },
    children,
  );
}

const cardShadow = (theme: { isDark: boolean }) =>
  theme.isDark
    ? css`
        shadow-color: #000000;
        shadow-offset: 0px 8px;
        shadow-opacity: 0.5;
        shadow-radius: 12px;
        elevation: 8;
      `
    : css`
        shadow-color: #14142b;
        shadow-offset: 0px 8px;
        shadow-opacity: 0.075;
        shadow-radius: 16px;
        elevation: 4;
      `;

const brandShadow = (theme: { isDark: boolean }) =>
  theme.isDark
    ? css`
        shadow-color: #ff2d55;
        shadow-offset: 0px 6px;
        shadow-opacity: 0.5;
        shadow-radius: 10px;
        elevation: 6;
      `
    : css`
        shadow-color: #ff2d55;
        shadow-offset: 0px 6px;
        shadow-opacity: 0.35;
        shadow-radius: 10px;
        elevation: 4;
      `;

/* ------------------------------------------------------------------ *
 * Card: 361×88 (stretches to the footer width), rx26.
 * ------------------------------------------------------------------ */

export const TimerCard = styled(EdgeGradient)`
  border-radius: 26px;
  padding: 1px;
  ${({ theme }) => cardShadow(theme)}
`;

/** Body sits 1pt inside the edge stroke, so the radius stays concentric (26 − 0.5). */
export const TimerCardBody = styled(BodyGradient)`
  border-radius: 25.5px;
  overflow: hidden;
`;

export const CardRow = styled.View`
  flex-direction: row;
  align-items: center;
  height: 88px;
  padding-left: 14.5px;
  padding-right: 14px;
`;

/**
 * Ring + text tap toggles pause while running — the reference running state
 * draws no pause button, but pause must stay reachable.
 */
export const PauseZone = styled.Pressable`
  flex: 1;
  flex-direction: row;
  align-items: center;
  align-self: stretch;
`;

/* ------------------------------------------------------------------ *
 * Countdown ring: r=26, stroke 7. The SVG draws the track, the glow
 * copy and the progress arc; the center label/check overlays it.
 * ------------------------------------------------------------------ */

export const RingWrap = styled.View`
  width: 59px;
  height: 59px;
  align-items: center;
  justify-content: center;
`;

/** Absolute overlay so the seconds/check sit centered on the ring instead of
    flowing beneath the SVG. */
export const RingOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
`;

export const RingCenterLabel = styled.Text<{ $color: string; $dimmed: boolean }>`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 13px;
  font-weight: 700;
  letter-spacing: -0.4px;
  color: ${({ $color }) => $color};
  opacity: ${({ $dimmed }) => ($dimmed ? 0.6 : 1)};
`;

/* ------------------------------------------------------------------ *
 * Middle column: label/chip above the clock.
 * ------------------------------------------------------------------ */

export const MiddleColumn = styled.View<{ $gap: number; $topPad: number }>`
  flex: 1;
  /* The reference pins the chip row 12pt from the card top rather than
     centering the column: paused chip 12..32, clock baseline 62 (rel). */
  align-self: flex-start;
  justify-content: flex-start;
  padding-top: ${({ $topPad }) => $topPad}px;
  gap: ${({ $gap }) => $gap}px;
  margin-left: 12.5px;
  margin-right: 8px;
`;

export const TimerText = styled.Text<{
  $size: number;
  $weight: FontWeight;
  $tracking?: number;
  $color: string;
  $lineHeight?: number;
}>`
  font-family: ${({ theme }) => theme.font.text};
  font-size: ${({ $size }) => $size}px;
  font-weight: ${({ $weight }) => $weight};
  letter-spacing: ${({ $tracking }) => $tracking ?? 0}px;
  color: ${({ $color }) => $color};
  ${({ $lineHeight }) =>
    $lineHeight !== undefined
      ? css`
          line-height: ${$lineHeight}px;
        `
      : ''}
`;

/** PAUSED / READY chip: 20pt tall, rx10, hue fill at 16%. */
export const Chip = styled.View<{ $width: number; $fill: string }>`
  width: ${({ $width }) => $width}px;
  height: 20px;
  border-radius: 10px;
  background-color: ${({ $fill }) => $fill};
  align-items: center;
  justify-content: center;
`;

export const ChipLabel = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.8px;
  color: ${({ $color }) => $color};
`;

export const ChipRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const ChipDetail = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 10.5px;
  font-weight: 500;
  color: ${({ $color }) => $color};
  margin-left: 12px;
`;

/** Complete-state "Set N · {exercise}": 19pt. Spec says 650, but RN renders
    non-hundred weights as Regular — 600 is the nearest representable. */
export const CompleteTitle = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 19px;
  font-weight: 600;
  letter-spacing: -0.4px;
  line-height: 24px;
  color: ${({ $color }) => $color};
`;

/* ------------------------------------------------------------------ *
 * Controls. The 30pt −15/+15 circles and the 30pt-tall pills keep their
 * reference visuals; hitSlop at the call site expands them to 44×44.
 * ------------------------------------------------------------------ */

export const ControlsRow = styled.View`
  flex-direction: row;
  align-items: center;
  /* Reference control centers sit at cy=709 (card-rel 45); the row centers
     at 44, so nudge down 1pt. */
  margin-top: 1px;
`;

export const AdjustButton = styled.Pressable<{ $gapAfter: number }>`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  margin-right: ${({ $gapAfter }) => $gapAfter}px;
  background-color: ${({ theme }) => (theme.isDark ? alpha('#FFFFFF', 0.07) : alpha('#000000', 0.06))};
  border-width: 0.8px;
  border-color: ${({ theme }) => (theme.isDark ? alpha('#FFFFFF', 0.09) : alpha('#000000', 0.1))};
`;

export const AdjustLabel = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 9.5px;
  font-weight: 700;
  color: ${({ $color }) => $color};
`;

export const SkipPill = styled.Pressable<{ $width: number }>`
  width: ${({ $width }) => $width}px;
  height: 30px;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => (theme.isDark ? alpha('#FFFFFF', 0.1) : alpha('#000000', 0.06))};
  border-width: 0.8px;
  border-color: ${({ theme }) => (theme.isDark ? alpha('#FFFFFF', 0.1) : alpha('#000000', 0.1))};
`;

export const SkipLabel = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: -0.15px;
  color: ${({ $color }) => $color};
`;

/** Paused-state resume: brand-gradient circle, r=19, white play triangle. */
export const ResumeButton = styled.Pressable<{ $gapAfter: number }>`
  width: 38px;
  height: 38px;
  align-items: center;
  justify-content: center;
  margin-right: ${({ $gapAfter }) => $gapAfter}px;
`;

export const ResumeCircle = styled(BrandGradient)`
  width: 38px;
  height: 38px;
  border-radius: 19px;
  align-items: center;
  justify-content: center;
  ${({ theme }) => brandShadow(theme)}
`;

/** Complete-state "Log Set": brand pill 92×30 with a white 22% inner edge. */
export const LogSetPill = styled.Pressable`
  width: 92px;
  height: 30px;
  border-radius: 15px;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  ${({ theme }) => brandShadow(theme)}
`;

export const LogSetBackground = styled(BrandGradient)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

export const LogSetEdge = styled.View`
  position: absolute;
  left: 0.5px;
  top: 0.5px;
  right: 0.5px;
  bottom: 0.5px;
  border-radius: 14.5px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.22);
`;

export const LogSetLabel = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 12px;
  /* Spec says 650; RN falls back to Regular for non-hundred weights, so 600. */
  font-weight: 600;
  letter-spacing: -0.15px;
  color: #ffffff;
`;

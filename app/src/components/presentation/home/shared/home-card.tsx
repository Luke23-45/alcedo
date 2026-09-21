import styled, { css } from 'styled-components/native';
import type { StyleProp, ViewStyle } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { HomeGradient, type HomeGradientVariant } from './home-gradient';

export type HomeCardElevation = 'card' | 'tile';

/**
 * The 1pt edge stroke: a gradient layer (white fading downward in dark mode,
 * black in light mode) with 1pt of padding, so the body gradient inside reads
 * as inset by the stroke. Shadows are measured off the reference SVGs:
 * cards dy 10 / blur 14, tiles dy 6 / blur 8.
 */
const EdgeLayer = styled(HomeGradient).attrs({ variant: 'cardEdge' as HomeGradientVariant })<{
  $radius: number;
  $elev: HomeCardElevation;
}>`
  border-radius: ${({ $radius }) => $radius}px;
  padding: 1px;
  ${({ theme, $elev }) =>
    theme.isDark
      ? $elev === 'card'
        ? css`
            shadow-color: #000000;
            shadow-offset: 0px 10px;
            shadow-opacity: 0.5;
            shadow-radius: 14px;
            elevation: 8;
          `
        : css`
            shadow-color: #000000;
            shadow-offset: 0px 6px;
            shadow-opacity: 0.42;
            shadow-radius: 8px;
            elevation: 4;
          `
      : $elev === 'card'
        ? css`
            shadow-color: #14142b;
            shadow-offset: 0px 8px;
            shadow-opacity: 0.075;
            shadow-radius: 16px;
            elevation: 4;
          `
        : css`
            shadow-color: #14142b;
            shadow-offset: 0px 5px;
            shadow-opacity: 0.06;
            shadow-radius: 10px;
            elevation: 2;
          `}
`;

/** Diagonal 3-stop card body, lit from above. Clips children to its radius. */
const BodyLayer = styled(HomeGradient).attrs({ variant: 'cardBody' as HomeGradientVariant })<{
  $radius: number;
  $pad: number;
}>`
  border-radius: ${({ $radius }) => $radius}px;
  padding: ${({ $pad }) => $pad}px;
  overflow: hidden;
`;

export function HomeCard({
  hero,
  radius,
  elev = 'card',
  pad,
  children,
  style,
}: {
  /** The screen's anchor card: 30pt radius, 20pt padding. */
  hero?: boolean;
  /** Explicit radius in points; defaults to 30 (hero) or 24. */
  radius?: number;
  /** Shadow scale: 'card' (dy 10) or 'tile' (dy 6). */
  elev?: HomeCardElevation;
  /** Padding override in points. */
  pad?: number;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useAppTheme();
  const r = radius ?? (hero ? theme.home.radius.hero : theme.home.radius.tile);
  return (
    <EdgeLayer $radius={r} $elev={elev} style={[{ borderCurve: 'continuous' }, style]}>
      <BodyLayer $radius={Math.max(0, r - 1)} $pad={pad ?? (hero ? 20 : 16)} style={{ borderCurve: 'continuous' }}>
        {children}
      </BodyLayer>
    </EdgeLayer>
  );
}

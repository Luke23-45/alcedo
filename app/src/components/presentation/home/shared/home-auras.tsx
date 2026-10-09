import Svg, { Defs, RadialGradient, Stop, Ellipse } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { useAppTheme } from '@/hooks/useAppTheme';

const AuraLayer = styled.View<{ $top: number; $side: number }>`
  position: absolute;
  top: ${({ $top }) => $top}px;
  left: ${({ $side }) => $side}px;
  right: ${({ $side }) => $side}px;
  bottom: 0;
`;

/**
 * Asymmetric ambient color auras behind the home content so darkness has
 * atmosphere (never unbroken pure black). Positions and opacities are measured
 * off the reference SVGs (400x2300 canvas); the layer stretches with the
 * scroll content (taller than any viewport, so `slice` keeps every aura
 * aspect-true) and the SVG covers it. Pointer-transparent.
 *
 * COUPLING: this renders inside the home scroller's padded content box
 * (`scrollStyle` in `(tabs)/(session)/index.tsx`), so the layer bleeds back
 * out with the exact negative of that padding — full screen edge to edge,
 * status zone included. If the scroller padding ever changes, these offsets
 * follow it via the same theme tokens.
 */
export function HomeAuras() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  // Negative of the home scroller's own padding: the glow must reach the
  // screen edges and the status zone, not stop at the content box.
  const bleedSide = -theme.layout.screenPadding;
  const bleedTop = -(insets.top + theme.space.sm);
  // Exact per-mode values extracted from the reference SVGs (gAuraA..D).
  // Positions are identical in both modes; light uses iOS-tone colors at
  // lower opacity so the pale background stays calm.
  const auras = theme.isDark
    ? [
        { id: 'auraRed', color: '#FF2D55', opacity: 0.2, cx: 60, cy: 180, r: 300 },
        { id: 'auraBlue', color: '#0A84FF', opacity: 0.13, cx: 370, cy: 900, r: 330 },
        { id: 'auraGreen', color: '#A6FF00', opacity: 0.08, cx: 30, cy: 1500, r: 300 },
        { id: 'auraPurple', color: '#BF5AF2', opacity: 0.12, cx: 380, cy: 1980, r: 300 },
      ]
    : [
        { id: 'auraRed', color: '#FF2D55', opacity: 0.09, cx: 60, cy: 180, r: 300 },
        { id: 'auraBlue', color: '#007AFF', opacity: 0.075, cx: 370, cy: 900, r: 330 },
        { id: 'auraGreen', color: '#34C759', opacity: 0.06, cx: 30, cy: 1500, r: 300 },
        { id: 'auraPurple', color: '#AF52DE', opacity: 0.075, cx: 380, cy: 1980, r: 300 },
      ];

  return (
    <AuraLayer $top={bleedTop} $side={bleedSide} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 400 2300" preserveAspectRatio="xMidYMid slice">
        <Defs>
          {auras.map((a) => (
            <RadialGradient key={a.id} id={a.id} cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={a.color} stopOpacity={a.opacity} />
              <Stop offset="100%" stopColor={a.color} stopOpacity={0} />
            </RadialGradient>
          ))}
        </Defs>
        {auras.map((a) => (
          <Ellipse key={a.id} cx={a.cx} cy={a.cy} rx={a.r} ry={a.r} fill={`url(#${a.id})`} />
        ))}
      </Svg>
    </AuraLayer>
  );
}

/**
 * Screen-background gradient (3-stop, near-vertical). Rendered behind the
 * scroll view via FullHeightScrollView's `screenBackground` prop so it covers
 * the whole screen, including overscroll.
 */
export function HomeScreenBackground() {
  const theme = useAppTheme();
  const spec = theme.home.screenBackground;
  return (
    <LinearGradient
      colors={[...spec.colors] as [string, string, string]}
      start={spec.start}
      end={spec.end}
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
    />
  );
}

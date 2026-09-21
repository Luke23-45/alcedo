import styled from 'styled-components/native';
import Svg, { Defs, RadialGradient, Stop, Ellipse } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/hooks/useAppTheme';

const AuraLayer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

/**
 * Screen 7's atmosphere: the 3-stop screen background plus the three radial
 * auras measured off the reference SVG (393×1190 canvas) — coral over the
 * hero, gold mid-screen, blue low. Light mode keeps the positions and halves
 * the opacities so the pale background stays calm. Pointer-transparent.
 */
export function PostWorkoutAuras() {
  const theme = useAppTheme();
  const spec = theme.home.screenBackground;
  const dim = theme.isDark ? 1 : 0.5;

  const auras = [
    { id: 'pwa1a', color: '#FF6A3D', opacity: 0.26 * dim, cx: 196, cy: 190, r: 230 },
    { id: 'pwa1b', color: '#FF2D55', opacity: 0.09 * dim, cx: 196, cy: 190, r: 230 },
    { id: 'pwa2', color: '#FFD60A', opacity: 0.09 * dim, cx: 360, cy: 600, r: 280 },
    { id: 'pwa3', color: '#0A84FF', opacity: 0.09 * dim, cx: 40, cy: 960, r: 260 },
  ];

  return (
    <AuraLayer pointerEvents="none">
      <LinearGradient
        colors={[...spec.colors] as [string, string, string]}
        start={spec.start}
        end={spec.end}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <Svg width="100%" height="100%" viewBox="0 0 393 1190" preserveAspectRatio="none">
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

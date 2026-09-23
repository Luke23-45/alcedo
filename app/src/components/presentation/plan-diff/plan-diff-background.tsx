import styled from 'styled-components/native';
import Svg, { Defs, RadialGradient, Stop, Ellipse } from 'react-native-svg';
import { useAppTheme } from '@/hooks/useAppTheme';

const BackgroundLayer = styled.View<{ $base: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(p) => p.$base};
`;

/**
 * The diff-save screen atmosphere, measured off the reference SVG
 * (393×1000 canvas): a warm ember aura under the header and a faint green
 * aura low on the screen. Light mode keeps the positions and dims the
 * opacities so the pale background stays calm. Pointer-transparent.
 */
export function PlanDiffBackground() {
  const theme = useAppTheme();
  const dim = theme.isDark ? 1 : 0.6;

  const auras = [
    { id: 'pda-ember', color: '#FF6A3D', opacity: 0.16 * dim, cx: 60, cy: 140, r: 280 },
    { id: 'pda-green', color: '#30D158', opacity: 0.08 * dim, cx: 370, cy: 760, r: 300 },
  ];

  return (
    <BackgroundLayer $base={theme.isDark ? '#0B0B0E' : '#F2F2F7'} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 393 1000" preserveAspectRatio="xMidYMid slice">
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
    </BackgroundLayer>
  );
}

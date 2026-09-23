import styled from 'styled-components/native';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';
import { useAppTheme } from '@/hooks/useAppTheme';

const AuraLayer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

/**
 * Ambient color auras behind the active session, measured off the
 * workout-flow reference (393x852 canvas): a crimson wash top-left and a
 * blue wash at mid-right. Light mode keeps the same geometry at faint
 * opacity.
 */
export function SessionAuras() {
  const { isDark } = useAppTheme();
  const dim = isDark ? 1 : 0.35;
  const auras = [
    { id: 'sesCrimson', color: '#FF2D55', opacity: 0.2 * dim, cx: 60, cy: 150, r: 300 },
    { id: 'sesBlue', color: '#0A84FF', opacity: 0.11 * dim, cx: 370, cy: 480, r: 280 },
  ];

  return (
    <AuraLayer pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 393 852" preserveAspectRatio="xMidYMid slice">
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

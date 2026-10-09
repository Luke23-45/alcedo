import styled from 'styled-components/native';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';
import { useAppTheme } from '@/hooks/useAppTheme';
import { FocusKind } from '../session/workout-focus-state';

const AuraLayer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

interface DetailAurasProps {
  phase: FocusKind;
}

/**
 * Phase-reactive ambient aura behind the workout detail page (P4.0c).
 * Asymmetric radial gradient (12–18% opacity, never centered) matching
 * the current focus state machine phase, using xMidYMid slice.
 */
export function DetailAuras({ phase }: DetailAurasProps) {
  const { isDark } = useAppTheme();
  const dim = isDark ? 1 : 0.35;

  const phaseColor = (() => {
    switch (phase) {
      case 'start':
        return '#0A84FF'; // iOS System Blue
      case 'ready':
        return '#FF2D55'; // iOS Brand Red
      case 'resting':
        return '#00D9E9'; // iOS Stand Cyan
      case 'restReady':
        return '#30D158'; // iOS System Green
      case 'paused':
        return '#FF9F0A'; // iOS System Amber
      case 'exerciseDone':
      case 'allDone':
        return '#30D158'; // iOS System Green
    }
  })();

  const auras = [
    // Primary phase aura: positioned asymmetrically top-left near hero card
    { id: 'detailPhaseAura', color: phaseColor, opacity: 0.16 * dim, cx: 70, cy: 160, r: 290 },
    // Subtle secondary wash: deep bottom-right for atmospheric depth
    { id: 'detailSecondaryAura', color: '#0A84FF', opacity: 0.08 * dim, cx: 360, cy: 500, r: 260 },
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

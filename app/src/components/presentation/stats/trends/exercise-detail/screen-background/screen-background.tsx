import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { HomeScreenBackground } from '@/components/presentation/home/shared/home-auras';
import { useAppTheme } from '@/hooks/useAppTheme';
import * as S from './screen-background.styles';

/**
 * The reference's background: the theme's screen background (which is the
 * spec's exact 3-stop diagonal in dark mode) plus the two spec auras — the
 * red-pink bloom top-left and the gold bloom mid-right. In light mode the
 * same positions render at home-light calm opacities. Pointer-transparent.
 */
export function ExerciseDetailBackground() {
  const theme = useAppTheme();
  const auras = theme.isDark
    ? [
        { id: 'edA1', color: '#FF2D55', opacity: 0.2, cx: 70, cy: 160, r: 280 },
        { id: 'edA2', color: '#FFD60A', opacity: 0.08, cx: 375, cy: 700, r: 300 },
      ]
    : [
        { id: 'edA1', color: '#FF2D55', opacity: 0.06, cx: 70, cy: 160, r: 280 },
        { id: 'edA2', color: '#FF9F0A', opacity: 0.05, cx: 375, cy: 700, r: 300 },
      ];
  return (
    <S.BackgroundLayer>
      <HomeScreenBackground />
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 393 1650"
        preserveAspectRatio="xMidYMid slice"
        style={S.auraSvg}
        pointerEvents="none"
      >
        <Defs>
          {auras.map((a) => (
            <RadialGradient
              key={a.id}
              id={a.id}
              gradientUnits="userSpaceOnUse"
              cx={a.cx}
              cy={a.cy}
              r={a.r}
            >
              <Stop offset="0%" stopColor={a.color} stopOpacity={a.opacity} />
              <Stop offset="100%" stopColor={a.color} stopOpacity={0} />
            </RadialGradient>
          ))}
        </Defs>
        {auras.map((a) => (
          <Circle key={a.id} cx={a.cx} cy={a.cy} r={a.r} fill={`url(#${a.id})`} />
        ))}
      </Svg>
    </S.BackgroundLayer>
  );
}

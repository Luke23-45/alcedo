import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';
import { HomeScreenBackground } from '@/components/presentation/home/shared/home-auras';
import { useAppTheme } from '@/hooks/useAppTheme';
import { BackgroundLayer } from './sheet-background.styles';

/**
 * Sheet background: the theme's screen background plus the spec's A1 ambient
 * (radial #FF2D55 @ .15 at 330,240, r 290), softened in light mode so the pale
 * background stays calm. Pointer-transparent.
 */
export function SheetBackground() {
  const theme = useAppTheme();
  const opacity = theme.isDark ? 0.15 : 0.05;
  return (
    <BackgroundLayer pointerEvents="none">
      <HomeScreenBackground />
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 393 852"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <Defs>
          <RadialGradient id="pkA1" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#FF2D55" stopOpacity={opacity} />
            <Stop offset="100%" stopColor="#FF2D55" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={330} cy={240} rx={290} ry={290} fill="url(#pkA1)" />
      </Svg>
    </BackgroundLayer>
  );
}

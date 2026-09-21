import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/hooks/useAppTheme';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';
import * as S from './settings-background.styles';

interface Aura {
  id: string;
  color: string;
  /** Dark-mode peak opacity, from the spec. */
  opacity: number;
  cx: number;
  cy: number;
  r: number;
}

export type SettingsBackgroundVariant = 'home' | 'backup' | 'planner' | 'programs' | 'preferences' | 'notifications';

// Measured off docs/new_design/settings-dark.md: Screen 1 auras (red .13 at
// (60,160) r290; blue .10 at (375,800) r320), Screen 6 auras (blue .13 at
// (330,180) r280; gold .10 at (40,860) r280), Screen 4 auras (violet .16
// at (330,200) r290; red .10 at (40,1100) r280), the Screen 5 aura
// (amber .12 at (60,160) r280), the Screen 2 aura (violet .13 at (330,200)
// r280), and the Screen 3 aura (red .12 at (60,180) r280), all on a
// 393-wide canvas.

// Measured off docs/new_design/settings-dark.md: Screen 1 auras (red .13 at
// (60,160) r290; blue .10 at (375,800) r320), Screen 6 auras (blue .13 at
// (330,180) r280; gold .10 at (40,860) r280), Screen 4 auras (violet .16
// at (330,200) r290; red .10 at (40,1100) r280), and the Screen 5 aura
// (amber .12 at (60,160) r280) on a 393-wide canvas.
const AURAS: Record<SettingsBackgroundVariant, Aura[]> = {
  home: [
    { id: 'sh-a1', color: '#FF2D55', opacity: 0.13, cx: 60, cy: 160, r: 290 },
    { id: 'sh-a2', color: '#0A84FF', opacity: 0.1, cx: 375, cy: 800, r: 320 },
  ],
  backup: [
    { id: 'sb-a1', color: '#0A84FF', opacity: 0.13, cx: 330, cy: 180, r: 280 },
    { id: 'sb-a2', color: '#FFD60A', opacity: 0.1, cx: 40, cy: 860, r: 280 },
  ],
  planner: [
    { id: 'sp-a1', color: '#8E7BFF', opacity: 0.16, cx: 330, cy: 200, r: 290 },
    { id: 'sp-a2', color: '#FF2D55', opacity: 0.1, cx: 40, cy: 1100, r: 280 },
  ],
  programs: [{ id: 'sg-a1', color: '#FF9F0A', opacity: 0.12, cx: 60, cy: 160, r: 280 }],
  preferences: [{ id: 'sp2-a1', color: '#AF52DE', opacity: 0.13, cx: 330, cy: 200, r: 280 }],
  notifications: [{ id: 'sn3-a1', color: '#FF3B30', opacity: 0.12, cx: 60, cy: 180, r: 280 }],
};

/**
 * Atmospheric settings background: the home screen's 3-stop base with two
 * asymmetric radial auras per spec. Light mode keeps the app's pale screen
 * gradient with the same hues at calm opacities. Pointer-transparent.
 */
export function SettingsBackground({ variant }: { variant: SettingsBackgroundVariant }) {
  const theme = useAppTheme();
  const dark = theme.isDark;
  const base = theme.home.screenBackground;
  const auras = AURAS[variant];
  // Light mode calms the auras so the pale surface stays quiet.
  const dim = dark ? 1 : 0.45;

  return (
    <S.BackgroundLayer pointerEvents="none">
      <LinearGradient
        colors={[...base.colors]}
        locations={[0, 0.5, 1]}
        start={base.start}
        end={base.end}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <Svg width="100%" height="100%" viewBox="0 0 393 1600" preserveAspectRatio="xMidYMin slice">
        <Defs>
          {auras.map((a) => (
            <RadialGradient key={a.id} id={a.id} cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={a.color} stopOpacity={a.opacity * dim} />
              <Stop offset="100%" stopColor={a.color} stopOpacity={0} />
            </RadialGradient>
          ))}
        </Defs>
        {auras.map((a) => (
          <Ellipse key={a.id} cx={a.cx} cy={a.cy} rx={a.r} ry={a.r} fill={`url(#${a.id})`} />
        ))}
      </Svg>
    </S.BackgroundLayer>
  );
}

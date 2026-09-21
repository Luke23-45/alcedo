import Svg, { Defs, RadialGradient, Stop, Ellipse } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/hooks/useAppTheme';
import * as S from './session-detail-auras.styles';

/**
 * The archival atmosphere: the 3-stop screen background plus the three radial
 * auras measured off the Screen 2 reference (393×1848 canvas) — coral over
 * the hero, blue mid-screen, violet low. Light mode keeps the positions and
 * halves the opacities so the pale background stays calm. Pointer-transparent.
 */
export function SessionDetailAuras() {
  const theme = useAppTheme();
  const spec = theme.home.screenBackground;
  const dim = theme.isDark ? 1 : 0.5;

  return (
    <S.AuraLayer pointerEvents="none">
      <LinearGradient
        colors={[...spec.colors] as [string, string, string]}
        start={spec.start}
        end={spec.end}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <Svg width="100%" height="100%" viewBox="0 0 393 1848" preserveAspectRatio="none">
        <Defs>
          <RadialGradient id="sda1" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#FF6A3D" stopOpacity={0.18 * dim} />
            <Stop offset="55%" stopColor="#FF2D55" stopOpacity={0.07 * dim} />
            <Stop offset="100%" stopColor="#FF2D55" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="sda2" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#0A84FF" stopOpacity={0.1 * dim} />
            <Stop offset="100%" stopColor="#0A84FF" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="sda3" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#BF5AF2" stopOpacity={0.1 * dim} />
            <Stop offset="100%" stopColor="#BF5AF2" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={196} cy={190} rx={230} ry={230} fill="url(#sda1)" />
        <Ellipse cx={370} cy={900} rx={300} ry={300} fill="url(#sda2)" />
        <Ellipse cx={30} cy={1550} rx={280} ry={280} fill="url(#sda3)" />
      </Svg>
    </S.AuraLayer>
  );
}

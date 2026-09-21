import Svg, { Defs, RadialGradient, Stop, Ellipse } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/hooks/useAppTheme';
import * as S from './feed-background.styles';
import { FEED_AURAS_DARK, FEED_AURAS_LIGHT, FEED_BG_DARK, FEED_BG_LIGHT, FEED_BG_LOCATIONS } from './timeline-tokens';

/**
 * Atmospheric feed background (Screen 1 spec): 3-stop near-vertical base
 * with three radial auras — red .16 at (60, 200), purple .12 at (375, 1000),
 * blue .10 at (30, 1700) on a 393×2313 canvas. Exact stops live in
 * timeline-tokens. Light mode keeps the app's pale screen gradient with the
 * same hues at calm opacities. Pointer-transparent.
 */
export function FeedBackground({ contentHeight }: { contentHeight: number }) {
  const theme = useAppTheme();
  const dark = theme.isDark;
  const auras = dark ? FEED_AURAS_DARK : FEED_AURAS_LIGHT;
  return (
    <S.BackgroundLayer pointerEvents="none" style={{ height: contentHeight }}>
      <LinearGradient
        colors={[...(dark ? FEED_BG_DARK : FEED_BG_LIGHT)]}
        locations={[...FEED_BG_LOCATIONS]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.25, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <Svg width="100%" height="100%" viewBox="0 0 393 2313" preserveAspectRatio="none">
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
    </S.BackgroundLayer>
  );
}

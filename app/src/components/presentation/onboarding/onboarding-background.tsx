import { useAppTheme } from '@/hooks/useAppTheme';
import { ReactNode, useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Defs, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';
import { BackgroundLayer, BackgroundRoot } from './onboarding-background.styles';
import { ONBOARDING_AURAS, onboardingColors } from './onboarding-tokens';

const CROSSFADE_MS = 450;

/**
 * Full-bleed onboarding backdrop: a vertical base gradient plus two soft
 * radial auras whose color and position change per page. The auras crossfade
 * when the page changes; the base gradient stays put.
 */
export function OnboardingBackground({ page, children }: { page: number; children: ReactNode }) {
  const theme = useAppTheme();
  const colors = onboardingColors(theme, page);
  const geometry = ONBOARDING_AURAS[page] ?? ONBOARDING_AURAS[0]!;

  const fade = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    fade.setValue(0);
    const animation = Animated.timing(fade, {
      toValue: 1,
      duration: CROSSFADE_MS,
      easing: Easing.bezier(0.16, 0.84, 0.24, 1),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [page, fade]);

  return (
    <BackgroundRoot>
      <BackgroundLayer pointerEvents="none">
        <Svg width="100%" height="100%" viewBox="0 0 393 852" preserveAspectRatio="xMidYMid slice">
          <Defs>
            <LinearGradient id="onb-bg" x1="0" y1="0" x2="0.25" y2="1">
              <Stop offset="0" stopColor={colors.backgroundStops[0]} />
              <Stop offset="0.5" stopColor={colors.backgroundStops[1]} />
              <Stop offset="1" stopColor={colors.backgroundStops[2]} />
            </LinearGradient>
          </Defs>
          <Rect width="393" height="852" fill="url(#onb-bg)" />
        </Svg>
        <BackgroundLayer key={page} style={{ opacity: fade }} pointerEvents="none">
          <Svg width="100%" height="100%" viewBox="0 0 393 852" preserveAspectRatio="xMidYMid slice">
            <Defs>
              <RadialGradient
                id="onb-aura-a"
                gradientUnits="userSpaceOnUse"
                cx={geometry.a.cx}
                cy={geometry.a.cy}
                r={geometry.a.r}
              >
                <Stop offset="0" stopColor={colors.auraA.color} stopOpacity={colors.auraA.opacity} />
                <Stop offset="1" stopColor={colors.auraA.color} stopOpacity={0} />
              </RadialGradient>
              <RadialGradient
                id="onb-aura-b"
                gradientUnits="userSpaceOnUse"
                cx={geometry.b.cx}
                cy={geometry.b.cy}
                r={geometry.b.r}
              >
                <Stop offset="0" stopColor={colors.auraB.color} stopOpacity={colors.auraB.opacity} />
                <Stop offset="1" stopColor={colors.auraB.color} stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Rect width="393" height="852" fill="url(#onb-aura-a)" />
            <Rect width="393" height="852" fill="url(#onb-aura-b)" />
          </Svg>
        </BackgroundLayer>
      </BackgroundLayer>
      {children}
    </BackgroundRoot>
  );
}

import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { useAppReducedMotion } from '@/hooks/useMotionSettings';

/**
 * A gently pulsing opacity value for live indicators (LIVE chip, current-set
 * ring). Freezes at full opacity when reduced motion is preferred — either by
 * the OS or by the in-app Reduce Motion switch.
 */
export function usePulse(durationMs = 1600, minOpacity = 0.25): Animated.Value {
  const value = useRef(new Animated.Value(1)).current;
  const reduceMotion = useAppReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      value.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: minOpacity,
          duration: durationMs / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 1,
          duration: durationMs / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [reduceMotion, durationMs, minOpacity, value]);

  return value;
}

import { ReactNode, useEffect, useRef } from 'react';
import { Animated, Easing, StyleProp, ViewStyle } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

const EASE_OUT_EXPO = Easing.bezier(0.16, 0.84, 0.24, 1);

/**
 * Staggered "wake up" entrance for onboarding content after the launch handoff.
 *
 * Before `revealed` the content is invisible but still laid out, so the first
 * live frame stays pixel-identical to the launch image. After `revealed` it
 * rises into place on the shared motion curve. Touches are disabled until the
 * reveal starts.
 */
export function OnboardingReveal({
  revealed,
  delay = 0,
  children,
  style,
}: {
  revealed: boolean;
  delay?: number;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const reduceMotion = useReducedMotion();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!revealed) {
      return;
    }
    if (reduceMotion) {
      progress.setValue(1);
      return;
    }
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 750,
      delay,
      easing: EASE_OUT_EXPO,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [revealed, delay, reduceMotion, progress]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [14, 0] });

  return (
    <Animated.View
      style={[style, { opacity: progress, transform: [{ translateY }] }]}
      pointerEvents={revealed ? 'auto' : 'none'}
    >
      {children}
    </Animated.View>
  );
}

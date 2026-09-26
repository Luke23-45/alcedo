import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { motion } from '@/styles/theme';
import { useAppReducedMotion } from './useMotionSettings';

/**
 * Apple-style press physics: the control compresses to 0.97 scale the instant
 * the finger lands, springing back on release. Runs entirely on the UI thread
 * via Reanimated — no JS round-trip between touch and feedback.
 *
 * `pressIn`/`pressOut` are worklets: attach them to a Gesture's onBegin/onFinalize,
 * or call them from Pressable's onPressIn/onPressOut (wrapped in runOnUI).
 * They are no-ops when reduced motion is on or the control is disabled.
 */
export function usePressScale(disabled = false) {
  const reduceMotion = useAppReducedMotion();
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - pressed.value * 0.03 }],
  }));

  const pressIn = () => {
    'worklet';
    if (disabled || reduceMotion) return;
    pressed.value = withSpring(1, motion.spring.press);
  };

  const pressOut = () => {
    'worklet';
    if (disabled || reduceMotion) return;
    pressed.value = withSpring(0, motion.spring.press);
  };

  return { pressIn, pressOut, animatedStyle: disabled || reduceMotion ? undefined : animatedStyle };
}

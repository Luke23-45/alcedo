import {
  cancelHaptic,
  triggerClickHaptic,
  triggerSlowRiseHaptic,
} from '~/modules/native-lib/src/ReactNativeHapticsModule';
import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Reanimated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useAppReducedMotion } from '@/hooks/useMotionSettings';

export type HoldableProps = {
  children: ReactNode;
  onLongPress: () => void;
  duration?: number;
  disabled?: boolean;
  style?: ViewStyle;
};

export default function Holdable({ children, onLongPress, duration = 500, style, disabled }: HoldableProps) {
  const reduceMotion = useAppReducedMotion();
  // UI-thread scale: the press-and-hold growth starts the instant the finger
  // lands, with no JS round-trip. Only the long-press callback hops to JS.
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleLongPress = () => {
    onLongPress();
    triggerClickHaptic();
  };

  const gesture = disabled
    ? Gesture.Manual()
    : Gesture.LongPress()
        .minDuration(duration)
        .onBegin(() => {
          'worklet';
          if (!reduceMotion) {
            scale.value = withTiming(1.1, { duration, easing: Easing.bezier(0.16, 0.84, 0.24, 1) });
          }
          runOnJS(triggerSlowRiseHaptic)();
        })
        .onFinalize((_, triggered) => {
          'worklet';
          if (!reduceMotion) {
            scale.value = withTiming(1, { duration: 200 });
          }
          if (!triggered) runOnJS(cancelHaptic)();
        })
        .onStart(() => {
          'worklet';
          runOnJS(handleLongPress)();
        });

  return (
    <GestureDetector gesture={gesture}>
      <Reanimated.View style={[style, animatedStyle]}>{children}</Reanimated.View>
    </GestureDetector>
  );
}

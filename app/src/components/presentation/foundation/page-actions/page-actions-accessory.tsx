import { spacing } from '@/hooks/useAppTheme';
import { useAppReducedMotion } from '@/hooks/useMotionSettings';
import { ReactNode, useEffect, useRef, useState } from 'react';
import Reanimated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

/**
 * Slides the page's accessory in and out, and animates the space it takes with it, so the actions
 * above don't jump when it appears or leaves.
 */
export function PageActionsAccessory({ children }: { children?: ReactNode }) {
  const visible = !!children;
  const reduceMotion = useAppReducedMotion();
  // UI-thread progress: Reanimated drives marginBottom on the UI thread.
  // The old Animated.timing claimed layout props "can't run off the main
  // thread" — they can, with Reanimated.
  const progress = useSharedValue(visible ? 1 : 0);
  const heightSV = useSharedValue(0);
  const [mounted, setMounted] = useState(visible);
  // Leaving outlives the prop, so the last accessory stays on screen for as long as it takes to go.
  const departing = useRef(children);
  if (children) departing.current = children;

  const animatedStyle = useAnimatedStyle(() => ({
    alignSelf: 'stretch' as const,
    // Collapsing the height would need `overflow: 'hidden'`, which would cut the bar's shadow.
    // So it keeps its size and hands the space back through a negative margin: the container is
    // anchored to the bottom, so it shrinks upwards, taking the actions down with it while the
    // bar slides out under the tab bar. The parent's gap goes with it, or it lingers as a seam.
    marginBottom: interpolate(progress.value, [0, 1], [-(heightSV.value + spacing[2]), 0]),
  }));

  useEffect(() => {
    if (visible) setMounted(true);
    const target = visible ? 1 : 0;
    if (reduceMotion) {
      progress.value = target;
      if (!visible) setMounted(false);
      return;
    }
    progress.value = withTiming(
      target,
      {
        duration: 250,
        easing: visible ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
      },
      (finished) => {
        if (finished && !visible) runOnJS(setMounted)(false);
      },
    );
  }, [visible, progress, reduceMotion]);

  if (!mounted) return null;

  return (
    <Reanimated.View
      onLayout={(event) => {
        heightSV.value = event.nativeEvent.layout.height;
      }}
      style={animatedStyle}
    >
      {children ?? departing.current}
    </Reanimated.View>
  );
}

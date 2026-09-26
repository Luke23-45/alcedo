import { useEffect, useRef } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Reanimated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useAppReducedMotion } from '@/hooks/useMotionSettings';

type AccordionItemProps = {
  isExpanded: boolean;
  unexpandedHeight?: number;
  startsExpanded?: boolean;
  duration?: number;
  onToggled?: (expanded: boolean) => void;
  children: React.ReactNode;
  style?: object;
};

// Apple's standard deceleration curve.
const APPLE_EASE = Easing.bezier(0.16, 0.84, 0.24, 1);

export function AccordionItem({
  isExpanded,
  startsExpanded,
  duration = 200,
  onToggled,
  children,
  style,
  unexpandedHeight = 0,
}: AccordionItemProps) {
  const reduceMotion = useAppReducedMotion();
  // UI-thread height: Reanimated drives layout props on the UI thread, so the
  // expand/collapse no longer drops frames to JS layout work.
  const height = useSharedValue(unexpandedHeight);
  const measuredHeightRef = useRef(unexpandedHeight);
  const settledHeightRef = useRef(unexpandedHeight);
  const onToggledRef = useRef(onToggled);
  onToggledRef.current = onToggled;

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
    overflow: 'hidden' as const,
  }));

  // Stable JS callback for the UI-thread completion handler.
  const handleToggled = useRef((expanded: boolean) => {
    onToggledRef.current?.(expanded);
  });

  const animateTo = (expanded: boolean) => {
    const targetHeight = expanded ? measuredHeightRef.current : unexpandedHeight;
    if (settledHeightRef.current === targetHeight) {
      onToggledRef.current?.(expanded);
      return;
    }
    settledHeightRef.current = targetHeight;
    if (reduceMotion) {
      height.value = targetHeight;
      onToggledRef.current?.(expanded);
      return;
    }
    const onComplete = handleToggled.current;
    height.value = withTiming(targetHeight, { duration, easing: APPLE_EASE }, (finished) => {
      if (finished) runOnJS(onComplete)(expanded);
    });
  };
  // Keep a ref to the latest animateTo for the layout handler (avoids stale closures).
  const animateToRef = useRef(animateTo);
  animateToRef.current = animateTo;

  useEffect(() => {
    animateToRef.current(isExpanded);
  }, [isExpanded, duration, unexpandedHeight, reduceMotion]);

  const onLayoutContent = (e: LayoutChangeEvent) => {
    const measured = e.nativeEvent.layout.height;
    const prevMeasured = measuredHeightRef.current;
    measuredHeightRef.current = measured;
    if (isExpanded && startsExpanded && prevMeasured === unexpandedHeight) {
      // First measurement while starting expanded: snap, don't animate.
      height.value = measured;
      settledHeightRef.current = measured;
      return;
    }
    // Content height changed (e.g. dynamic children): re-settle.
    animateToRef.current(isExpanded);
  };

  return (
    <Reanimated.View style={[animatedStyle, style]}>
      <View style={styles.content} onLayout={onLayoutContent}>
        {children}
      </View>
    </Reanimated.View>
  );
}

const styles = StyleSheet.create({
  content: {
    position: 'absolute',
    width: '100%',
  },
});

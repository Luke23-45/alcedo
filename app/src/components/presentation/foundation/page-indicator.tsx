import { spacing } from '@/hooks/useAppTheme';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Reanimated, { interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';

export interface PageIndicatorProps {
  count: number;
  /** UI-thread scroll progress in page units (0 = first page). */
  progress: SharedValue<number>;
  color: string;
  style?: StyleProp<ViewStyle>;
}

function IndicatorDot({ index, progress, color }: { index: number; progress: SharedValue<number>; color: string }) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [index - 1, index, index + 1];
    return {
      opacity: interpolate(progress.value, inputRange, [0.3, 0.9, 0.3], 'clamp'),
      width: interpolate(progress.value, inputRange, [spacing[2], spacing[6], spacing[2]], 'clamp'),
    };
  });
  return <Reanimated.View style={[styles.dot, { backgroundColor: color }, animatedStyle]} />;
}

export function PageIndicator({ count, progress, color, style }: PageIndicatorProps) {
  if (count <= 1) {
    return null;
  }
  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: count }).map((_, index) => (
        <IndicatorDot key={index} index={index} progress={progress} color={color} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[2],
  },
  dot: {
    height: spacing[2],
    borderRadius: spacing[1],
  },
});

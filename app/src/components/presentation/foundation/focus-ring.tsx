import { useAppTheme } from '@/hooks/useAppTheme';
import { useAppReducedMotion } from '@/hooks/useMotionSettings';
import { ReactNode, useEffect } from 'react';
import { View, ViewProps } from 'react-native';
import Reanimated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export const ANIMATION_DURATION = 600;

export default function FocusRing({
  isSelected,
  children,
  radius,
  style,
  padding,
  ...rest
}: {
  isSelected: boolean;
  children: ReactNode;
  radius?: number;
  padding?: number;
} & ViewProps) {
  const theme = useAppTheme();
  const reduceMotion = useAppReducedMotion();
  padding ??= 5;

  // UI-thread progress: Reanimated drives top/bottom/left/right/borderWidth on
  // the UI thread — the old Animated.timing with useNativeDriver:false ran 600ms
  // of layout on the JS thread, on the workout screen.
  const progress = useSharedValue(isSelected ? 1 : 0);

  useEffect(() => {
    progress.value = reduceMotion ? (isSelected ? 1 : 0) : withTiming(isSelected ? 1 : 0, {
      duration: ANIMATION_DURATION,
      easing: Easing.bezier(0.2, 0, 0, 1),
    });
  }, [isSelected, reduceMotion, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const pos = interpolate(progress.value, [0, 0.25, 1], [0, -8, -padding!]);
    const borderWidth = interpolate(progress.value, [0, 0.25, 1], [0, 8, 3]);
    return {
      top: pos,
      bottom: pos,
      left: pos,
      right: pos,
      opacity: progress.value,
      borderWidth,
    };
  });

  return (
    <View style={style}>
      <Reanimated.View
        style={[
          {
            borderColor: theme.color.border.hairline,
            position: 'absolute',
            borderRadius: radius ?? theme.space.huge,
          },
          animatedStyle,
        ]}
        {...rest}
      />
      {children}
    </View>
  );
}

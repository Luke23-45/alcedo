import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable } from 'react-native';
import { useAppReducedMotion } from '@/hooks/useMotionSettings';
import { SwitchThumb, SwitchTrack } from './settings-switch.styles';

/**
 * iOS-style toggle used across the planner settings screens. 44×44 touch
 * target; the thumb slides on the standard deceleration curve and freezes
 * instantly when reduced motion is on.
 */
export function SettingsSwitch({
  value,
  onValueChange,
  accessibilityLabel,
  testID,
}: {
  value: boolean;
  onValueChange: (value: boolean) => void;
  accessibilityLabel: string;
  testID?: string;
}) {
  const reduceMotion = useAppReducedMotion();
  const offset = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(offset, {
      toValue: value ? 1 : 0,
      duration: reduceMotion ? 0 : 180,
      easing: Easing.bezier(0.16, 0.84, 0.24, 1),
      useNativeDriver: true,
    }).start();
  }, [value, offset, reduceMotion]);

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      hitSlop={9}
      style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
    >
      <SwitchTrack $on={value}>
        <Animated.View
          style={{
            transform: [
              {
                translateX: offset.interpolate({
                  inputRange: [0, 1],
                  outputRange: [2, 44 - 22 - 2],
                }),
              },
            ],
          }}
        >
          <SwitchThumb />
        </Animated.View>
      </SwitchTrack>
    </Pressable>
  );
}

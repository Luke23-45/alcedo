import { useAppTheme } from '@/hooks/useAppTheme';
import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { Knob, Track } from './onboarding-switch.styles';
import { onboardingColors } from './onboarding-tokens';

/**
 * The iOS-style switch from the onboarding mocks: 44x26 track, 22pt knob,
 * springy slide between the theme's on/off fills. Presentational — the parent
 * row owns the toggle gesture and accessibility role.
 */
export function OnboardingSwitch({ value }: { value: boolean }) {
  const theme = useAppTheme();
  const colors = onboardingColors(theme, 0);
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    const animation = Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 250,
      easing: Easing.bezier(0.16, 0.84, 0.24, 1),
      useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop();
  }, [value, anim]);

  const knobX = anim.interpolate({ inputRange: [0, 1], outputRange: [2, 20] });
  const trackColor = anim.interpolate({ inputRange: [0, 1], outputRange: [colors.switchOff, colors.switchOn] });

  return (
    <Track style={{ backgroundColor: trackColor }} pointerEvents="none">
      <Knob
        style={{
          transform: [{ translateX: knobX }],
          shadowColor: '#000000',
          shadowOpacity: colors.knobShadowOpacity,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 4,
          elevation: 3,
        }}
      />
    </Track>
  );
}

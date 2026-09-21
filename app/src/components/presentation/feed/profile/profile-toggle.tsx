import { useAppTheme } from "@/hooks/useAppTheme";
import { useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useAppReducedMotion } from '@/hooks/useMotionSettings';
import * as S from "./profile-toggle.styles";
import { profilePalette } from "./profile-tokens";

const AnimatedKnob = Animated.createAnimatedComponent(S.ToggleKnob);
/**
 * Reference knob geometry: off → cx at track-local 11 (left edge), on → cx
 * at 31 (2pt from the right edge), so the 22pt knob travels 20pt.
 */
const TRAVEL = S.TOGGLE_WIDTH - 22 - 2;

/**
 * iOS-style switch, 44×26 rx13, purely visual. Green when on (#30D158 /
 * #34C759), thumb slides on the standard curve; instant under reduced motion.
 * The owning row is the accessible switch — this view never takes focus, so
 * screen readers announce exactly one control per row.
 */
export function ProfileToggle({ value, testID }: { value: boolean; testID?: string }) {
  const theme = useAppTheme();
  const palette = profilePalette(theme.isDark);
  const reduceMotion = useAppReducedMotion();
  const target = value ? TRAVEL : 0;
  const x = useSharedValue(target);

  useEffect(() => {
    x.value = reduceMotion
      ? target
      : withTiming(target, { duration: 200, easing: Easing.bezier(0.16, 0.84, 0.24, 1) });
  }, [target, reduceMotion, x]);

  const knobStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return (
    <S.ToggleTrack
      $on={palette.toggleOn}
      $off={palette.toggleOff}
      $value={value}
      accessible={false}
      testID={testID}
      // Not pressable: the owning row is the 44pt+ switch target.
    >
      <AnimatedKnob style={knobStyle} />
    </S.ToggleTrack>
  );
}

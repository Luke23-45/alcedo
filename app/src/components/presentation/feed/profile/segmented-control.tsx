import { useAppTheme } from "@/hooks/useAppTheme";
import { useEffect } from "react";
import { Pressable } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useAppReducedMotion } from '@/hooks/useMotionSettings';
import * as S from "./segmented-control.styles";
import { profilePalette } from "./profile-tokens";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Track width in pt: 120 (units) or 161 (visibility). */
  width: number;
  /** Thumb width in pt: 56 (units) or 49.7 (visibility). */
  thumbWidth: number;
  /** Label size: 11.5 (units) or 11 (visibility). */
  labelSize: number;
  testID?: string;
}

const AnimatedThumb = Animated.createAnimatedComponent(S.Thumb);

/**
 * Inline segmented control from the profile spec: 28pt track, 24pt thumb,
 * thumb centered in its segment. Animates on the standard curve; instant
 * under reduced motion.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  width,
  thumbWidth,
  labelSize,
  testID,
}: SegmentedControlProps<T>) {
  const theme = useAppTheme();
  const palette = profilePalette(theme.isDark);
  const reduceMotion = useAppReducedMotion();
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const segmentWidth = width / options.length;
  const thumbX = (segmentWidth - thumbWidth) / 2 + selectedIndex * segmentWidth;
  const x = useSharedValue(thumbX);

  useEffect(() => {
    x.value = reduceMotion
      ? thumbX
      : withTiming(thumbX, {
          duration: 200,
          easing: Easing.bezier(0.16, 0.84, 0.24, 1),
        });
  }, [thumbX, reduceMotion, x]);

  const thumbStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return (
    <S.Track $width={width} $track={palette.segmentedTrack} testID={testID}>
      <AnimatedThumb
        $width={thumbWidth}
        $thumb={palette.segmentedThumb}
        $shadow={palette.segmentedThumbShadow}
        style={thumbStyle}
      />
      {options.map((option, index) => (
        <Pressable
          key={option.value}
          accessibilityRole="radio"
          accessibilityState={{ selected: index === selectedIndex }}
          accessibilityLabel={option.label}
          hitSlop={{ top: 8, bottom: 8 }}
          onPress={() => onChange(option.value)}
          style={{
            width: segmentWidth,
            height: S.TRACK_HEIGHT,
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          <S.OptionLabel
            $selected={index === selectedIndex}
            $size={labelSize}
            $selectedColor={palette.value}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {option.label}
          </S.OptionLabel>
        </Pressable>
      ))}
    </S.Track>
  );
}

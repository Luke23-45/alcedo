import { useAppReducedMotion } from '@/hooks/useMotionSettings';
import { useEffect, useState } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import * as S from './preference-segmented.styles';

const AnimatedThumb = Animated.createAnimatedComponent(S.Thumb);

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

interface PreferenceSegmentedProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** 'large' = 44pt theme switch; 'small' = 30pt unit switch. */
  size?: 'large' | 'small';
  accessibilityLabel: string;
  testID?: string;
}

/**
 * Segmented control matching the Screen 2 mockups. Every option is a
 * ≥44×44 target (the small variant reaches 44pt via hitSlop). The thumb
 * snaps to its final position under reduced motion.
 */
export function PreferenceSegmented<T extends string>({
  options,
  value,
  onChange,
  size = 'large',
  accessibilityLabel,
  testID,
}: PreferenceSegmentedProps<T>) {
  const reduceMotion = useAppReducedMotion();
  const [trackWidth, setTrackWidth] = useState(0);
  const index = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );
  const height = size === 'large' ? 44 : 30;
  const segmentWidth = trackWidth > 0 ? trackWidth / options.length : 0;
  // Spec-measured thumb fit: the large thumb overshoots its segment by 2pt
  // per side (111 in a 107 segment); the small thumb insets by 2pt (56 in
  // a 60 segment).
  const thumbDelta = size === 'large' ? 4 : -4;

  const offset = useSharedValue(index * segmentWidth - thumbDelta / 2);
  useEffect(() => {
    const target = index * segmentWidth - thumbDelta / 2;
    offset.value = reduceMotion || segmentWidth === 0 ? target : withTiming(target, { duration: 220 });
  }, [index, segmentWidth, reduceMotion, offset, thumbDelta]);

  const thumbStyle = useAnimatedStyle(() => ({
    width: segmentWidth + thumbDelta,
    transform: [{ translateX: offset.value }],
  }));

  return (
    <S.Track
      $height={height}
      testID={testID}
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
    >
      {segmentWidth > 0 ? <AnimatedThumb $height={height} style={thumbStyle} /> : undefined}
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <S.OptionPressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={option.label}
            hitSlop={size === 'large' ? undefined : { top: 7, bottom: 7, left: 4, right: 4 }}
            onPress={() => onChange(option.value)}
          >
            <S.OptionLabel $selected={selected} $large={size === 'large'}>
              {option.label}
            </S.OptionLabel>
          </S.OptionPressable>
        );
      })}
    </S.Track>
  );
}

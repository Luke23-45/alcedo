import { useAppReducedMotion } from '@/hooks/useMotionSettings';
import { useEffect, useState } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { segmentedIndex, segmentedThumb } from './preference-segmented-math';
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
  const index = segmentedIndex(options, value);
  const height = size === 'large' ? 44 : 30;
  const segmentWidth = trackWidth > 0 ? trackWidth / options.length : 0;
  const thumb = segmentedThumb(index, segmentWidth, size);

  const offset = useSharedValue(thumb.offset);
  useEffect(() => {
    offset.value = reduceMotion || segmentWidth === 0 ? thumb.offset : withTiming(thumb.offset, { duration: 220 });
  }, [thumb.offset, segmentWidth, reduceMotion, offset]);

  const thumbStyle = useAnimatedStyle(() => ({
    width: thumb.width,
    transform: [{ translateX: offset.value }],
  }));

  return (
    <S.Track
      $height={height}
      testID={testID}
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      onLayout={(e) => {
        const width = e.nativeEvent.layout.width;
        setTrackWidth((prev) => (prev === width ? prev : width));
      }}
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
            <S.OptionLabel $selected={selected} $large={size === 'large'} numberOfLines={1}>
              {option.label}
            </S.OptionLabel>
          </S.OptionPressable>
        );
      })}
    </S.Track>
  );
}

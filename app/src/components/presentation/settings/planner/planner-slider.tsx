import { useRef, useState } from 'react';
import { LayoutChangeEvent, PanResponder, View } from 'react-native';
import { HomeGradient } from '@/components/presentation/home/shared/home-gradient';
import {
  SliderLabel,
  SliderMinMaxLeft,
  SliderMinMaxMid,
  SliderMinMaxRight,
  SliderMinMaxRow,
  SliderRow,
  SliderThumb,
  SliderTouchZone,
  SliderTrack,
  SliderValue,
} from './planner-slider.styles';

const THUMB_SIZE = 26;

/**
 * The planner's brand slider: 6pt track with a brand-gradient fill, white
 * thumb with a brand core. Drag or tap the 44pt-tall touch zone; VoiceOver
 * adjusts in `step` increments. Matches the settings spec geometry
 * (thumb at fraction × track width).
 */
export function PlannerSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatValue,
  formatTick,
  /** Show a static midpoint tick (the RPE slider's 7.5). */
  midTick,
  accessibilityLabel,
  testID,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  formatValue: (value: number) => string;
  formatTick: (value: number) => string;
  midTick?: boolean;
  accessibilityLabel: string;
  testID?: string;
}) {
  const [trackWidth, setTrackWidth] = useState(0);
  const trackWidthRef = useRef(0);

  const setFromX = (x: number) => {
    const width = trackWidthRef.current;
    if (width <= 0) {
      return;
    }
    const fraction = Math.min(1, Math.max(0, x / width));
    const raw = min + fraction * (max - min);
    const stepped = Math.round(raw / step) * step;
    // Round away float dust (e.g. 7.5 not 7.499999).
    const clean = Math.round(stepped * 100) / 100;
    onChange(Math.min(max, Math.max(min, clean)));
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => {
        event.currentTarget.measure((_, __, ___, ____, pageX) => {
          setFromX(event.nativeEvent.pageX - pageX);
        });
      },
      onPanResponderMove: (event) => {
        event.currentTarget.measure((_, __, ___, ____, pageX) => {
          setFromX(event.nativeEvent.pageX - pageX);
        });
      },
    }),
  ).current;

  const onTrackLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    trackWidthRef.current = width;
    setTrackWidth(width);
  };

  const fraction = (value - min) / (max - min);
  const fillWidth = fraction * trackWidth;
  const thumbLeft = fillWidth - THUMB_SIZE / 2;

  return (
    <View testID={testID}>
      <SliderRow>
        <SliderLabel>{label}</SliderLabel>
        <SliderValue>{formatValue(value)}</SliderValue>
      </SliderRow>
      <SliderTouchZone
        {...panResponder.panHandlers}
        accessibilityRole="adjustable"
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={{ min, max, now: value, text: formatValue(value) }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(event) => {
          if (event.nativeEvent.actionName === 'increment') {
            onChange(Math.min(max, value + step));
          } else {
            onChange(Math.max(min, value - step));
          }
        }}
      >
        <View onLayout={onTrackLayout}>
          <SliderTrack>
            {trackWidth > 0 && <HomeGradient variant="brand" style={{ width: Math.max(0, fillWidth), height: 6 }} />}
          </SliderTrack>
        </View>
        {trackWidth > 0 && (
          <SliderThumb style={{ left: Math.max(-THUMB_SIZE / 2, thumbLeft), top: 22 - THUMB_SIZE / 2 }}>
            <HomeGradient variant="brand" style={{ width: 9, height: 9, borderRadius: 4.5 }} />
          </SliderThumb>
        )}
      </SliderTouchZone>
      <SliderMinMaxRow>
        <SliderMinMaxLeft>{formatTick(min)}</SliderMinMaxLeft>
        {midTick ? <SliderMinMaxMid>{formatTick((min + max) / 2)}</SliderMinMaxMid> : undefined}
        <SliderMinMaxRight>{formatTick(max)}</SliderMinMaxRight>
      </SliderMinMaxRow>
    </View>
  );
}

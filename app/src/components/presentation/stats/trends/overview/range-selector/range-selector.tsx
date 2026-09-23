import { useEffect, useState } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTranslate } from '@tolgee/react';
import { fontWeight } from '@/styles/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { HomeText } from '@/components/presentation/home/shared/home-text';
import { RANGES, TrendRange } from '../constants';
import { trendsPalette } from '../trends-colors';
import { Option, Thumb, Track } from './range-selector.styles';

/** Reference fallback until the track measures itself: 361/5 = 72.2pt/slot. */
const SLOT_FALLBACK = 361 / RANGES.length;

/**
 * 7D / 4W / 6M / 1Y / ALL segmented control. The thumb glides between
 * slots and re-samples the hero chart; tiles and sections keep their
 * spec-defined windows.
 */
export function RangeSelector({
  range,
  onChange,
}: {
  range: TrendRange;
  onChange: (range: TrendRange) => void;
}) {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const palette = trendsPalette(theme.isDark);
  const selected = RANGES.indexOf(range);

  // The track stretches full-width on every device, so the slot pitch comes
  // from the measured track — never the 361pt reference constant.
  const [trackW, setTrackW] = useState(0);
  const slot = trackW > 0 ? trackW / RANGES.length : SLOT_FALLBACK;
  const thumbW = slot - 4;

  const thumbX = useSharedValue(selected * SLOT_FALLBACK);
  useEffect(() => {
    thumbX.value = withTiming(selected * slot, { duration: 220 });
  }, [selected, slot, thumbX]);
  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: thumbX.value }],
  }));

  const labels: Record<TrendRange, string> = {
    '7D': t('trends.range.7D'),
    '4W': t('trends.range.4W'),
    '6M': t('trends.range.6M'),
    '1Y': t('trends.range.1Y'),
    ALL: t('trends.range.all'),
  };

  return (
    <Track
      $fill={palette.segmentedTrack}
      accessibilityRole="tablist"
      onLayout={(e) => setTrackW(e.nativeEvent.layout.width)}
    >
      <Thumb
        $fill={palette.segmentedThumb}
        $border={palette.segmentedThumbBorder}
        $dark={theme.isDark}
        style={[thumbStyle, { width: thumbW }]}
      />
      {RANGES.map((key, index) => {
        const active = index === selected;
        return (
          <Option
            key={key}
            onPress={() => onChange(key)}
            hitSlop={{ top: 4, bottom: 4 }}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={labels[key]}
          >
            <HomeText
              weight={fontWeight.semibold}
              tracking={-0.15}
              style={{
                fontSize: 12,
                lineHeight: 15,
                color: active ? palette.primary : palette.dim,
              }}
            >
              {labels[key]}
            </HomeText>
          </Option>
        );
      })}
    </Track>
  );
}

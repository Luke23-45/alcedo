import { useEffect } from 'react';
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

const SLOT = 361 / RANGES.length; // 72.2pt per option; thumb sits 2pt inside

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

  const thumbX = useSharedValue(selected * SLOT);
  useEffect(() => {
    thumbX.value = withTiming(selected * SLOT, { duration: 220 });
  }, [selected, thumbX]);
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
    <Track $fill={palette.segmentedTrack} accessibilityRole="tablist">
      <Thumb
        $fill={palette.segmentedThumb}
        $border={palette.segmentedThumbBorder}
        $dark={theme.isDark}
        style={thumbStyle}
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

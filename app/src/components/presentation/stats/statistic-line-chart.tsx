import { StatisticOverTime } from '@/store/stats';
import { QuantityAxis } from '@/components/presentation/stats/quantity-axis';
import { LineChart, lineDataItem } from 'react-native-gifted-charts';
import { View } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { alpha } from '@/styles/theme';
import { useEffect, useState } from 'react';
import { lineGraphProps } from '@/components/presentation/stats/line-graph-props';
import { useFormatDate } from '@/hooks/useFormatDate';
import { Text } from 'react-native-paper';

export function StatisticLineChart<T>({
  statistics: { statistics, maxValue, minValue },
  axis,
}: {
  statistics: StatisticOverTime<T>;
  axis: QuantityAxis<T>;
}) {
  const formatDate = useFormatDate();
  const theme = useAppTheme();
  const max = axis.toNumber(maxValue);
  const min = axis.toNumber(minValue);
  const points: lineDataItem[] = statistics.map((stat): lineDataItem => {
    const value = axis.toNumber(stat.value);
    const label = formatDate(stat.dateTime.toLocalDate(), {
      day: 'numeric',
      month: 'short',
    });
    return {
      value,
      label,
      focusedDataPointLabelComponent: () => (
        <FocusedDatapointLabelComponent value={axis.formatNumber(value)} label={label} />
      ),
    };
  });
  const [width, setWidth] = useState(0);
  // On android the area chart renders poorly unless it is delayed until after initial render
  const [areaChart, setAreaChart] = useState(false);
  useEffect(() => {
    setAreaChart(!!width);
  }, [width]);
  return (
    <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      <LineChart
        {...lineGraphProps(theme, width, points.length)}
        negativeStepValue={min < 0 ? -0.2 * min : undefined!}
        showFractionalValues={false}
        dataPointLabelWidth={70}
        showReferenceLine1
        areaChart={areaChart}
        delayBeforeUnFocus={10_000}
        referenceLine1Position={max}
        dataSet={[
          {
            data: points,
            strokeDashArray: [1],
            dataPointsColor: theme.color.interactive.tint,
            color: theme.color.interactive.tint,
            dataPointsRadius: 5,
            startFillColor: alpha(theme.color.interactive.tint, 0.1),
            endFillColor: alpha(theme.color.interactive.tint, 0.1),
            startOpacity: 0.1,
            endOpacity: 0.1,
          },
        ]}
        showDataPointLabelOnFocus
        noOfSections={4}
        height={100}
        mostNegativeValue={min < 0 ? min : undefined!}
        yAxisOffset={Math.floor(min) - 10}
        noOfSectionsBelowXAxis={min < 0 ? 5 : 0}
      />
    </View>
  );
}

function FocusedDatapointLabelComponent(props: { value: string; label: string }) {
  const theme = useAppTheme();
  return (
    <View
      style={{
        alignItems: 'center',
        paddingVertical: theme.space.xs,
        backgroundColor: theme.color.background.elevated,
        borderRadius: 4,
        borderColor: theme.color.border.hairline,
        borderStyle: 'solid',
        borderWidth: 1,
      }}
    >
      <Text>{props.label}</Text>
      <Text>{props.value}</Text>
    </View>
  );
}

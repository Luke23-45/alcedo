import { OptionalStatisticOverTime } from '@/store/stats';
import { usePreferredWeightUnit } from '@/hooks/usePreferredWeightUnit';
import { LineChart, lineDataItem } from 'react-native-gifted-charts';
import { View } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useState } from 'react';
import { SurfaceText } from '@/components/presentation/foundation/surface-text';
import { useTranslate } from '@tolgee/react';
import { lineGraphProps } from '@/components/presentation/stats/line-graph-props';
import { Text } from 'react-native-paper';
import { Weight } from '@/models/weight';
import { useFormatDate } from '@/hooks/useFormatDate';

export default function SessionStatGraphCard(props: { sessionStats: OptionalStatisticOverTime<Weight>[] }) {
  const formatDate = useFormatDate();
  const weightUnit = usePreferredWeightUnit();
  const { t } = useTranslate();
  const theme = useAppTheme();
  const pointColors = [...theme.color.graph.series, theme.color.zone.recovery, theme.color.zone.endurance, theme.color.zone.tempo, theme.color.zone.threshold, theme.color.zone.max];
  const points: lineDataItem[][] = props.sessionStats.map((x) =>
    x.statistics.map(
      (stat): lineDataItem => ({
        value: stat.value?.convertTo(weightUnit).value.toNumber()!,
        dataPointText: stat.value?.shortLocaleFormat(2) ?? '',
        textShiftY: -10,
        label: formatDate(stat.dateTime.toLocalDate(), {
          day: 'numeric',
          month: 'short',
        }),
      }),
    ),
  );
  const [width, setWidth] = useState(0);
  const legendItems = props.sessionStats.map((stat, i) => ({
    key: stat.title ?? `Series ${i + 1}`,
    color: pointColors[i % pointColors.length],
  }));
  if (!props.sessionStats.length) {
    return undefined;
  }
  return (
    <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)} style={{ gap: theme.space.sm }} testID="session-stat-card">
      <SurfaceText font="text-2xl" style={{ textAlign: 'center' }}>
        {t('workout.sessions.title')}
      </SurfaceText>
      <LineChart
        dataSet={points.map((x, i) => ({
          data: x,
          color: pointColors[i % pointColors.length],
          dataPointsColor: pointColors[i % pointColors.length],
        }))}
        {...lineGraphProps(theme, width, Math.max(...points.map((x) => x.length)))}
      />
      <View
        testID="stats-legend"
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: theme.space.sm,
          marginTop: theme.space.sm,
        }}
      >
        {legendItems.map((item) => (
          <View
            key={item.key}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: theme.space.sm,
              marginBottom: theme.space.xs,
            }}
          >
            <View
              style={{
                width: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: item.color,
                borderColor: theme.color.border.hairline,
                marginRight: 6,
              }}
            />
            <Text style={{ color: theme.color.content.primary }}>{item.key}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

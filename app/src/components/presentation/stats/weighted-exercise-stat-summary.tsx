import Icon from '@/components/presentation/foundation/icon';
import TouchableRipple from '@/components/presentation/foundation/touchable-ripple';
import { useAppTheme } from '@/hooks/useAppTheme';
import { WeightedExerciseStatistics } from '@/store/stats';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

export function WeightedExerciseStatSummary({
  exerciseStats,
  onPress,
}: {
  exerciseStats: WeightedExerciseStatistics;
  onPress: (item: WeightedExerciseStatistics) => void;
}) {
  const theme = useAppTheme();
  return (
    <TouchableRipple onPress={() => onPress(exerciseStats)}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: theme.space.base,
          gap: theme.space.sm,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text variant="bodyMedium">{exerciseStats.exerciseName}</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Text variant="bodySmall">
              Total lifted: {exerciseStats.totalVolumeStatistics.totalValue.shortLocaleFormat(0)}
            </Text>
            <Text variant="bodySmall">
              1RM: {exerciseStats.max1RMPerSessionStatistics.currentValue.shortLocaleFormat(0)}
            </Text>
          </View>
        </View>
        <Icon source="chevronRight" size={24} />
      </View>
    </TouchableRipple>
  );
}

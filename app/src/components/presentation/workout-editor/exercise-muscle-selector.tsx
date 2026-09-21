import { useAppTheme } from '@/hooks/useAppTheme';
import { useAppSelector } from '@/store';
import { selectMuscles } from '@/store/stored-sessions';
import { T, useTranslate } from '@tolgee/react';
import { translateExerciseMeta } from '@/utils/exercise-meta';
import { View } from 'react-native';
import { Chip, Text } from 'react-native-paper';

export default function ExerciseMuscleSelector(props: { muscles: string[]; onChange: (muscles: string[]) => void }) {
  const { muscles, onChange } = props;
  const { t } = useTranslate();
  const theme = useAppTheme();
  const muscleList = useAppSelector(selectMuscles);
  return (
    <View style={{ gap: theme.space.sm }}>
      <Text variant="labelLarge">
        <T keyName="muscles.muscle.label" />
      </Text>
      <View
        style={{
          flexDirection: 'row',
          gap: theme.space.xs,
          flexWrap: 'wrap',
        }}
      >
        {muscleList.map((x) => (
          <Chip
            mode="outlined"
            key={x}
            onPress={() => {
              onChange(muscles.includes(x) ? muscles.filter((musc) => musc !== x) : muscles.concat([x]));
            }}
            showSelectedOverlay
            selected={muscles.includes(x)}
            testID={`exercise-muscle-chip`}
          >
            {translateExerciseMeta(t, 'muscle', x)}
          </Chip>
        ))}
      </View>
    </View>
  );
}

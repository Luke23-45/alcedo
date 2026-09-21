import { Remote } from '@/components/presentation/foundation/remote';
import { ExercisePickerScreen } from '@/components/presentation/stats/trends/exercise-picker/exercise-picker-screen';
import { useAppSelector } from '@/store';
import { fetchOverallStats, selectOverallView } from '@/store/stats';
import { Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

/**
 * Exercise picker (Phase 3, Screen 3): sheet-style chooser. The native header
 * is hidden; the screen renders its own grabber + Cancel + title chrome while
 * keeping the OS status bar. Cancel dismisses, exactly as before.
 */
export default function ExerciseListPage() {
  const dispatch = useDispatch();
  const { exerciseName } = useLocalSearchParams<{ exerciseName?: string }>();
  useFocusEffect(() => {
    dispatch(fetchOverallStats());
  });
  const stats = useAppSelector(selectOverallView);
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView
      edges={{ bottom: 'additive', left: 'additive', right: 'additive', top: 'off' }}
      style={{ flex: 1, paddingTop: insets.top }}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <Remote
        value={stats}
        success={(view) => (
          <ExercisePickerScreen
            weightedExerciseStats={view.weightedExerciseStats}
            initialExerciseName={typeof exerciseName === 'string' ? exerciseName : undefined}
          />
        )}
      />
    </SafeAreaView>
  );
}

import { SessionExerciseEditor } from '@/components/smart/session-exercise-editor';
import { useLocalSearchParams } from 'expo-router';

export default function ExerciseEditorPage() {
  const { sessionId, index, isNew } = useLocalSearchParams<{
    sessionId: string;
    index: string;
    isNew?: string;
  }>();
  // The only in-app producer emits `isNew=1` or omits it; parse explicitly so
  // a deep link like `?isNew=0` can never flip the editor into add mode.
  return <SessionExerciseEditor sessionId={sessionId} index={Number(index)} isNew={isNew === '1'} />;
}

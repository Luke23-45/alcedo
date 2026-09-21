import { SessionWorkoutEditor } from '@/components/smart/session-workout-editor';
import { useLocalSearchParams } from 'expo-router';

export default function WorkoutEditorPage() {
  const { sessionId, focus } = useLocalSearchParams<{ sessionId: string; focus?: string }>();
  return <SessionWorkoutEditor sessionId={sessionId} focusNotes={focus === 'notes'} />;
}

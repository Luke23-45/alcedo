import { SessionExerciseEditor } from '@/components/smart/session-exercise-editor';
import { Redirect, useLocalSearchParams } from 'expo-router';

/** Repeated query params arrive as arrays — the first value wins. */
function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default function ExerciseEditorPage() {
  const params = useLocalSearchParams<{
    sessionId: string;
    index: string;
    isNew?: string;
  }>();
  const sessionId = first(params.sessionId);
  const index = Number(first(params.index));
  // A deep link with a missing/garbled index used to render a stuck blank
  // screen (dismiss has no target when opened directly). Bounce home instead.
  if (!sessionId || !Number.isInteger(index) || index < 0) {
    return <Redirect href="/" />;
  }
  // The only in-app producer emits `isNew=1` or omits it; parse explicitly so
  // a deep link like `?isNew=0` can never flip the editor into add mode.
  return <SessionExerciseEditor sessionId={sessionId} index={index} isNew={first(params.isNew) === '1'} />;
}

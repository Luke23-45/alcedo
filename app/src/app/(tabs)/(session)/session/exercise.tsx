import { SessionExercise } from '@/components/smart/session-exercise';
import { Redirect, Stack, useLocalSearchParams } from 'expo-router';

/** Repeated query params arrive as arrays — the first value wins. */
function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default function SessionExercisePage() {
  const params = useLocalSearchParams<{
    sessionId: string;
    index: string;
  }>();
  const sessionId = first(params.sessionId);
  const index = Number(first(params.index));

  // A deep link with a missing/garbled index or sessionId bounces home.
  if (!sessionId || !Number.isInteger(index) || index < 0) {
    return <Redirect href="/" />;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SessionExercise sessionId={sessionId} index={index} />
    </>
  );
}

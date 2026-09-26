import { PostWorkoutScreen } from '@/components/presentation/summary/post-workout-screen/post-workout-screen';
import { useFinishWorkout } from '@/hooks/useFinishWorkout';
import { useAppSelectorWithArg } from '@/store';
import { selectSession } from '@/store/stored-sessions';
import { useTranslate } from '@tolgee/react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function PostWorkoutPage() {
  const { sessionId, source } = useLocalSearchParams<{
    sessionId?: string;
    source?: 'finished' | 'live' | 'history';
  }>();
  const session = useAppSelectorWithArg(selectSession, sessionId ?? '');
  const openedAfterFinishingWorkout = source === 'finished';
  const showBackButton = !openedAfterFinishingWorkout;
  const { dismissTo, push } = useRouter();
  const finishWorkout = useFinishWorkout(sessionId);
  const { t } = useTranslate();

  useEffect(() => {
    if (!sessionId || !session) {
      dismissTo('/session');
    }
  }, [dismissTo, session, sessionId]);

  if (!sessionId || !session) {
    return null;
  }

  return (
    <>
      <Stack.Screen
        options={{
          presentation: 'modal',
          title: t('workout.post_workout.title'),
          gestureEnabled: showBackButton,
          headerBackVisible: showBackButton,
          headerLeft: openedAfterFinishingWorkout ? () => null : undefined!,
        }}
      />
      <PostWorkoutScreen
        sessionId={session.id}
        onDone={async () => {
          if (!openedAfterFinishingWorkout) {
            // Live sources never finish the workout from here — back navigation only.
            dismissTo('/(tabs)/(session)');
            return;
          }
          // Awaited: navigating before the finish is durable risks resurrecting the workout on restart.
          const hasDiff = await finishWorkout();
          dismissTo('/');
          if (hasDiff) {
            push('/diff-save');
          }
        }}
      />
    </>
  );
}

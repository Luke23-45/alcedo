import { SessionDetailScreen } from '@/components/presentation/history/session-detail-screen/session-detail-screen';
import { PostWorkoutScreen } from '@/components/presentation/summary/post-workout-screen/post-workout-screen';
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
  const isHistory = source === 'history';
  const openedAfterFinishingWorkout = source === 'finished';
  const showBackButton = !openedAfterFinishingWorkout;
  const { dismissTo, back, canGoBack } = useRouter();
  const { t } = useTranslate();

  useEffect(() => {
    if (!sessionId || !session) {
      dismissTo(isHistory ? '/history' : '/session');
    }
  }, [dismissTo, isHistory, session, sessionId]);

  if (!sessionId || !session) {
    return null;
  }

  if (isHistory) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false, gestureEnabled: true }} />
        <SessionDetailScreen
          session={session}
          onBack={() => {
            if (canGoBack()) {
              back();
            } else {
              dismissTo('/history');
            }
          }}
          onDeleted={() => dismissTo('/history')}
        />
      </>
    );
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
      <PostWorkoutScreen sessionId={session.id} onDone={() => dismissTo('/(tabs)/(session)')} />
    </>
  );
}

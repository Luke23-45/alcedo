import ConfirmationDialog from '@/components/presentation/foundation/confirmation-dialog';
import { WorkoutDetail } from '@/components/presentation/workout/detail';
import { useAppSelector, useAppSelectorWithArg } from '@/store';
import { useDispatch } from 'react-redux';
import { selectSession, updateStoredSession } from '@/store/stored-sessions';
import { useFinishWorkout } from '@/hooks/useFinishWorkout';
import { useTranslate } from '@tolgee/react';
import { Href, Redirect, useRouter } from 'expo-router';
import { useKeepAwake } from 'expo-keep-awake';
import { useState } from 'react';

export function getSessionExerciseHref(sessionId: string, index: number): Href {
  return `/session/exercise?sessionId=${encodeURIComponent(sessionId)}&index=${encodeURIComponent(index.toString())}` as Href;
}

export function SessionExercise(props: { sessionId: string; index: number }) {
  const session = useAppSelectorWithArg(selectSession, props.sessionId);
  const dispatch = useDispatch();
  const finishWorkout = useFinishWorkout(session?.id);
  const showPostWorkoutSummary = useAppSelector((x) => x.settings.showPostWorkoutSummary);
  const keepAwake = useAppSelector((x) => x.settings.keepScreenAwakeDuringWorkout);
  const { dismissTo, push } = useRouter();
  const { t } = useTranslate();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const save = async (force = false) => {
    if (!session) {
      return;
    }
    if (!force && !session.isComplete) {
      setConfirmOpen(true);
      return;
    }
    setConfirmOpen(false);
    if (showPostWorkoutSummary) {
      push(`/session/post-workout?sessionId=${encodeURIComponent(session.id)}&source=finished`);
      return;
    }
    // Awaited: navigating before the finish is durable risks resurrecting the workout on restart.
    const hasDiff = await finishWorkout();
    dismissTo('/');
    if (hasDiff) {
      push('/diff-save');
    }
  };

  // Finishing clears the active session while this screen is still mounted for the dismiss animation.
  if (!session) {
    return null;
  }

  if (props.index < 0 || props.index >= session.recordedExercises.length) {
    return <Redirect href="/session" />;
  }

  return (
    <>
      {keepAwake && <KeepAwake />}
      <WorkoutDetail
        session={session}
        exerciseIndex={props.index}
        updateSession={(update) => dispatch(updateStoredSession({ sessionId: session.id, update }))}
        onFinishWorkout={() => save()}
        onBack={() => dismissTo('/session')}
      />
      <ConfirmationDialog
        okText={t('generic.finish.button')}
        onOk={() => save(true)}
        onCancel={() => setConfirmOpen(false)}
        textContent={t('workout.finish.incomplete.body')}
        headline={t('workout.finish.confirm.title')}
        open={confirmOpen}
      />
    </>
  );
}

/**
 * Allows us to conditionally keep the screen awake, as we cannot use hooks conditionally
 */
function KeepAwake() {
  useKeepAwake();
  return <></>;
}

import { EditSessionScreen } from '@/components/presentation/history/edit/edit-session-screen';
import ConfirmationDialog from '@/components/presentation/foundation/confirmation-dialog';
import SessionMoreMenuComponent from '@/components/smart/session-more-menu-component';
import { useAddExercise } from '@/hooks/useAddExercise';
import { useFinishWorkout } from '@/hooks/useFinishWorkout';
import { useOnDismiss } from '@/hooks/useOnDismiss';
import { useStartWorkoutWithConfirmation } from '@/hooks/useStartWorkoutWithConfirmation';
import { useAppSelectorWithArg } from '@/store';
import { removeReactionsForEvents, addUnpublishedSessionId } from '@/store/feed';
import { deleteStoredSession, selectSession, sessionFinished, updateStoredSession } from '@/store/stored-sessions';
import { useTranslate } from '@tolgee/react';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function HistoryEditPage() {
  const dispatch = useDispatch();
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const session = useAppSelectorWithArg(selectSession, sessionId);
  const { dismissTo, push } = useRouter();
  const finishWorkout = useFinishWorkout(sessionId);
  const addExercise = useAddExercise(sessionId);
  const { t } = useTranslate();

  // Resuming hands the session back to the workout in progress, so leaving this screen must not also
  // finish it - that would immediately clear it as the active workout again.
  const resumed = useRef(false);
  // save()/confirmDelete() already dispatch sessionFinished through finishWorkout; the unmount
  // below must not dispatch it a second time (duplicate stats/exports work).
  const finished = useRef(false);
  useOnDismiss(() => {
    if (!resumed.current && !finished.current) {
      dispatch(sessionFinished(sessionId));
    }
  });
  const { start: resume, confirmationDialog } = useStartWorkoutWithConfirmation({
    onStarted: () => {
      resumed.current = true;
      dismissTo('/history');
    },
  });

  const save = async () => {
    finished.current = true;
    // Awaited: navigating before the finish is durable risks resurrecting the workout on restart.
    const hasDiff = await finishWorkout();
    dismissTo('/history');
    if (hasDiff) {
      push('/diff-save');
    }
  };

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const confirmDelete = () => {
    dispatch(deleteStoredSession(sessionId));
    dispatch(addUnpublishedSessionId(sessionId));
    dispatch(removeReactionsForEvents([sessionId]));
    finished.current = true;
    setDeleteConfirmOpen(false);
    dismissTo('/history');
  };

  // The row is gone if it was deleted from under this screen.
  if (!session) {
    return null;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <EditSessionScreen
        session={session}
        updateSession={(update) => dispatch(updateStoredSession({ sessionId, update }))}
        onSave={save}
        onCancel={() => dismissTo('/history')}
        onDelete={() => setDeleteConfirmOpen(true)}
        onAddExercise={addExercise}
        menu={
          <SessionMoreMenuComponent
            session={session}
            save={save}
            additionalItems={[
              {
                label: t('workout.resume.button'),
                icon: 'playCircle',
                systemImage: 'play.circle',
                onPress: () => resume(session),
              },
            ]}
          />
        }
      />
      {confirmationDialog}
      <ConfirmationDialog
        open={deleteConfirmOpen}
        headline={t('history.edit.delete_session.confirm.title', 'Delete this session?')}
        textContent={t(
          'history.edit.delete_session.confirm.message',
          'This session will be permanently deleted. This cannot be undone.',
        )}
        cancelText={t('generic.cancel.button', 'Cancel')}
        okText={t('history.edit.delete_session.confirm.button', 'Delete')}
        destructive
        onCancel={() => setDeleteConfirmOpen(false)}
        onOk={confirmDelete}
      />
    </>
  );
}

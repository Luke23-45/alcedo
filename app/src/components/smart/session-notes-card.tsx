import { SessionNotesCard } from '@/components/presentation/summary/session-notes-card/session-notes-card';
import { getSessionWorkoutEditorHref } from '@/components/smart/session-workout-editor';
import { useAppSelectorWithArg } from '@/store';
import { selectSession } from '@/store/stored-sessions';
import { useRouter } from 'expo-router';

/**
 * The post-workout notes card, wired to the store. Notes are the session's
 * blueprint notes (the only notes field the store has); Edit opens the
 * existing workout editor, which persists them via updateStoredSession.
 */
export function SmartSessionNotesCard({ sessionId }: { sessionId: string }) {
  const session = useAppSelectorWithArg(selectSession, sessionId);
  const { push } = useRouter();

  if (!session) {
    return null;
  }

  return (
    <SessionNotesCard notes={session.blueprint.notes} onEdit={() => push(getSessionWorkoutEditorHref(sessionId))} />
  );
}

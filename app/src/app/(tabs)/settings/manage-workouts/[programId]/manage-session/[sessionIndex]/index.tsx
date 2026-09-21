import { useLocalSearchParams } from 'expo-router';
import { SessionEditorScreen } from '@/components/presentation/settings/programs/session-editor-screen';

/**
 * The session (workout) editor. Thin wrapper; the UI lives in
 * components/presentation/settings/programs/.
 */
export default function ManageSession() {
  const { sessionIndex: sessionIndexStr, programId } = useLocalSearchParams<{
    sessionIndex: string;
    programId: string;
  }>();
  const location = { programId, sessionIndex: Number(sessionIndexStr) };
  return <SessionEditorScreen location={location} />;
}

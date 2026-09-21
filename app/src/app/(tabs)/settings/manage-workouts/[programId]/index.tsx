import { useLocalSearchParams } from 'expo-router';
import { ManageWorkoutsScreen } from '@/components/presentation/settings/programs/manage-workouts-screen';

/**
 * The program editor (rename plan, manage its sessions). Thin wrapper; the
 * UI lives in components/presentation/settings/programs/.
 */
export default function ManageWorkouts() {
  const { programId } = useLocalSearchParams<{ programId: string }>();
  return <ManageWorkoutsScreen programId={programId} />;
}

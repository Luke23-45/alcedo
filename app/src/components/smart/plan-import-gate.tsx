import { useIncomingPlanFile } from '@/hooks/useIncomingPlanFile';
import { useAppSelector } from '@/store';
import { usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';

/**
 * Watches for a plan parsed from an imported file (whether picked in-app or
 * opened from the OS) and routes to the import preview screen to confirm it.
 */
export function PlanImportGate() {
  useIncomingPlanFile();
  const hasPendingImport = useAppSelector((s) => !!s.program.pendingImport);
  const { navigate } = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    // The review screen is import-plan-info; import-plan is the paste-text parser.
    // Don't re-navigate while already on the review screen, or the gate would yank
    // the user back off it while the pending import is still set.
    if (hasPendingImport && pathname !== '/settings/import-plan-info') {
      navigate('/settings/import-plan-info');
    }
  }, [hasPendingImport, navigate, pathname]);
  return null;
}

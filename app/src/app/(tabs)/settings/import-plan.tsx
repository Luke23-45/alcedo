import { Stack } from 'expo-router';
import { useTranslate } from '@tolgee/react';
import { settingsKey } from '@/components/presentation/settings/shared/settings-i18n';
import { ImportPlanScreen } from '@/components/presentation/settings/programs/import-plan-screen';

/**
 * Screen 5 (bottom) — import a plan from pasted text. Thin wrapper; the UI
 * lives in components/presentation/settings/programs/.
 */
export default function ImportPlanPage() {
  const { t } = useTranslate();
  return (
    <>
      <Stack.Screen options={{ title: t(settingsKey('settings.programs.import.nav_title')) }} />
      <ImportPlanScreen />
    </>
  );
}

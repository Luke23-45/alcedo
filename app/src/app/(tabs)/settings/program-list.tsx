import { Stack } from 'expo-router';
import { useTranslate } from '@tolgee/react';
import { settingsKey } from '@/components/presentation/settings/shared/settings-i18n';
import { ProgramListScreen } from '@/components/presentation/settings/programs/program-list-screen';

/**
 * Screen 5 (top) — Programs. Thin wrapper; the UI lives in
 * components/presentation/settings/programs/.
 */
export default function ProgramListPage() {
  const { t } = useTranslate();
  return (
    <>
      <Stack.Screen options={{ title: t(settingsKey('settings.programs.nav_title')) }} />
      <ProgramListScreen />
    </>
  );
}

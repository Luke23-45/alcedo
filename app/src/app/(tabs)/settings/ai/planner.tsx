import { useTranslate } from '@tolgee/react';
import { Stack } from 'expo-router';
import { settingsKey } from '@/components/presentation/settings/shared/settings-i18n';
import { PlannerScreen } from '@/components/presentation/settings/planner/planner-screen';

/**
 * Screen 4 — AI Planner configuration. Thin wrapper; the UI lives in
 * components/presentation/settings/planner/. The chat UI that used to live
 * here moved to /settings/ai/planner-chat (linked from the screen footer).
 */
export default function AiPlanner() {
  const { t } = useTranslate();
  return (
    <>
      <Stack.Screen options={{ title: t(settingsKey('settings.planner.nav_title')) }} />
      <PlannerScreen />
    </>
  );
}

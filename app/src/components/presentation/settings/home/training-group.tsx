import { useAppSelector } from '@/store';
import { selectActiveProgram } from '@/store/program';
import { useTranslate } from '@tolgee/react';
import { useRouter } from 'expo-router';
import { SettingsGroup, SettingsRow } from '../shared/grouped-settings-list';
import { settingsKey } from '../shared/settings-i18n';

/**
 * YOUR TRAINING group (settings-dark.md Screen 1).
 *
 * Honest state mapping:
 * - Program: the real active program name. The program model tracks no week
 *   state, so the contract's "Week 3 of 6" sample is not shown.
 * - AI Planner: the coach is served by backend-v2 natively, so there is
 *   nothing to configure — it is always on.
 * - Exercise Library: real built-in + custom counts from the exercise store.
 * - Rest: no global preset model exists (rest durations are per-exercise), so
 *   the row reflects the real rest-timers switch and opens the Notifications
 *   screen where the rest-timer controls live.
 */
export function TrainingGroup() {
  const { t } = useTranslate();
  const { push } = useRouter();

  const program = useAppSelector((s) => (s.program.isHydrated ? selectActiveProgram(s) : undefined));
  const restTimersOn = useAppSelector((s) => s.settings.restTimersEnabled);

  const storedSessions = useAppSelector((s) => s.storedSessions);
  const builtInCount = Object.keys(storedSessions.builtInExercises).length;
  const customCount = Object.keys(storedSessions.savedExercises).filter(
    (id) => !(id in storedSessions.builtInExercises),
  ).length;

  return (
    <SettingsGroup label={t(settingsKey('settings.home.section.training'))}>
      <SettingsRow
        icon="fitnessCenter"
        wellHue="#FF2D55"
        iconColor="#FF6A88"
        title={t(settingsKey('settings.home.program.title'))}
        subtitle={program?.name ?? t(settingsKey('settings.home.program.fallback_name'))}
        onPress={() => push('/settings/program-list')}
      />
      <SettingsRow
        icon="bolt"
        wellHue="#AF52DE"
        iconColor="#C77DFF"
        title={t(settingsKey('settings.home.ai_planner.title'))}
        subtitle={t(settingsKey('settings.home.ai_planner.subtitle'))}
        badge={t(settingsKey('settings.home.ai_planner.badge'))}
        onPress={() => push('/settings/ai/planner')}
      />
      <SettingsRow
        icon="menuBook"
        wellHue="#0A84FF"
        iconColor="#5EB0FF"
        title={t(settingsKey('settings.home.library.title'))}
        subtitle={t(settingsKey('settings.home.library.subtitle'), { builtIn: builtInCount, custom: customCount })}
        onPress={() => push('/settings/manage-exercises')}
      />
      <SettingsRow
        icon="timer"
        wellHue="#00D9E9"
        iconColor="#5EDCF0"
        title={t(settingsKey('settings.home.rest.title'))}
        subtitle={t(settingsKey(restTimersOn ? 'settings.home.rest.timers_on' : 'settings.home.rest.timers_off'))}
        onPress={() => push('/settings/notifications')}
      />
    </SettingsGroup>
  );
}

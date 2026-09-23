import { useAppSelector } from '@/store';
import { accentSeedFor } from '@/styles/accent-seeds';
import { formatMinutesAsTime } from '@/services/notification-schedule';
import { supportedLanguages } from '@/services/tolgee';
import { useTranslate } from '@tolgee/react';
import { useRouter } from 'expo-router';
import { SettingsGroup, SettingsRow } from '../shared/grouped-settings-list';
import { settingsKey } from '../shared/settings-i18n';

/**
 * PREFERENCES group (settings-dark.md Screen 1). Every subtitle/value is
 * derived from real preference state:
 * - Appearance: theme mode + the real accent seed name.
 * - Units: the real unit prefs.
 * - Language: the real preferred-language label (no week-start pref exists).
 * - Notifications: the real workout-reminder toggle + its real fire time.
 */
export function PreferencesGroup() {
  const { t } = useTranslate();
  const { push } = useRouter();
  const settings = useAppSelector((s) => s.settings);

  const modeValue =
    settings.themeMode === 'dark'
      ? t(settingsKey('settings.home.appearance.value_dark'))
      : settings.themeMode === 'light'
        ? t(settingsKey('settings.home.appearance.value_light'))
        : t(settingsKey('settings.home.appearance.value_system'));
  const accentName = accentSeedFor(settings.colorSchemeSeed).id;
  const locale = settings.preferredLanguage ?? undefined;
  const accentLabel = accentName.charAt(0).toLocaleUpperCase(locale) + accentName.slice(1);
  const units = `${settings.unitWeight} · ${settings.unitDistance} · ${settings.unitHeight}`;
  const language =
    supportedLanguages.find((x) => x.code === settings.preferredLanguage)?.label ??
    t(settingsKey('settings.home.language.value_default'));
  const notificationsOn = settings.notifyWorkoutReminders;
  const reminderTime = formatMinutesAsTime(
    settings.workoutReminderTimeMinutes,
    settings.use24HourTime,
    settings.preferredLanguage ?? undefined,
  );

  return (
    <SettingsGroup label={t(settingsKey('settings.home.section.preferences'))}>
      <SettingsRow
        icon="palette"
        wellHue="#AF52DE"
        iconColor="#C77DFF"
        title={t(settingsKey('settings.home.appearance.title'))}
        subtitle={t(settingsKey('settings.home.appearance.subtitle'), { mode: modeValue, accent: accentLabel })}
        value={modeValue}
        onPress={() => push('/settings/app-configuration')}
      />
      <SettingsRow
        icon="straighten"
        wellHue="#FF9F0A"
        iconColor="#FFB84D"
        title={t(settingsKey('settings.home.units.title'))}
        subtitle={units}
        value={units}
        onPress={() => push('/settings/localization')}
      />
      <SettingsRow
        icon="language"
        wellHue="#0A84FF"
        iconColor="#5EB0FF"
        title={t(settingsKey('settings.home.language.title'))}
        // The placeholder must not be named `language`: Tolgee reads a param
        // literally called `language` as its language *override* option, strips
        // it from the params object, and then throws "Missing parameter".
        subtitle={t(settingsKey('settings.home.language.subtitle'), { languageName: language })}
        value={language}
        onPress={() => push('/settings/localization')}
      />
      <SettingsRow
        icon="notifications"
        wellHue="#FF3B30"
        iconColor="#FF6B60"
        title={t(settingsKey('settings.home.notifications.title'))}
        subtitle={t(settingsKey('settings.home.notifications.subtitle'), { time: reminderTime })}
        value={t(
          settingsKey(
            notificationsOn ? 'settings.home.notifications.value_on' : 'settings.home.notifications.value_off',
          ),
        )}
        valueActive={notificationsOn}
        onPress={() => push('/settings/notifications')}
      />
    </SettingsGroup>
  );
}

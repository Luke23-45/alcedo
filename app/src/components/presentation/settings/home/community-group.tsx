import { useAppSelector } from '@/store';
import { useTranslate } from '@tolgee/react';
import { useRouter } from 'expo-router';
import { SettingsGroup, SettingsRow } from '../shared/grouped-settings-list';
import { settingsKey } from '../shared/settings-i18n';

/**
 * COMMUNITY group (settings-dark.md Screen 1). The Privacy & Social subtitle
 * is the real visibility + PR pref state. Community Guidelines has no
 * destination in the app, so it renders as a static row (spec copy, no fake
 * navigation affordance).
 */
export function CommunityGroup() {
  const { t } = useTranslate();
  const { push } = useRouter();
  const visibility = useAppSelector((s) => s.settings.profileVisibility);
  const showPRs = useAppSelector((s) => s.settings.privacyShowPRs);

  const visibilityLabel = visibility.charAt(0).toUpperCase() + visibility.slice(1);

  return (
    <SettingsGroup label={t(settingsKey('settings.home.section.community'))}>
      <SettingsRow
        icon="shield"
        wellHue="#30D158"
        iconColor="#4ADE80"
        title={t(settingsKey('settings.home.privacy.title'))}
        subtitle={t(settingsKey('settings.home.privacy.subtitle'), {
          visibility: visibilityLabel,
          prs: t(settingsKey(showPRs ? 'settings.home.privacy.prs_shown' : 'settings.home.privacy.prs_hidden')),
        })}
        onPress={() => push('/feed/profile-editor')}
      />
      <SettingsRow
        icon="flag"
        wellHue="#AF52DE"
        iconColor="#C77DFF"
        title={t(settingsKey('settings.home.guidelines.title'))}
        subtitle={t(settingsKey('settings.home.guidelines.subtitle'))}
        hideChevron
      />
    </SettingsGroup>
  );
}

import { useAppSelector } from '@/store';
import { useTranslate } from '@tolgee/react';
import { useRouter } from 'expo-router';
import { SettingsGroup, SettingsRow } from '../shared/grouped-settings-list';
import { settingsKey } from '../shared/settings-i18n';

/**
 * ACCOUNT group on Settings home: the single entry point to sign-in.
 *
 * Shows the signed-in Google identity (name/email) or "Not signed in".
 * Tapping navigates to the Account screen — the only sign-in UI in the app.
 * Auth state never gates any other feature; everything works offline.
 */
export function AccountGroup() {
  const { t } = useTranslate();
  const { push } = useRouter();
  const status = useAppSelector((s) => s.auth.status);
  const profile = useAppSelector((s) => s.auth.profile);

  const signedIn = status === 'signed-in' && profile;
  const value = signedIn
    ? (profile.name ?? profile.email ?? undefined)
    : status === 'unknown'
      ? undefined
      : t(settingsKey('settings.home.account.signed_out'));

  return (
    <SettingsGroup label={t(settingsKey('settings.home.section.account'))}>
      <SettingsRow
        icon="personFill"
        wellHue="#0A84FF"
        iconColor="#5EB0FF"
        title={t(settingsKey('settings.home.account.title'))}
        subtitle={t(settingsKey('settings.home.account.subtitle'))}
        value={value}
        valueActive={!!signedIn}
        onPress={() => push('/settings/account')}
      />
    </SettingsGroup>
  );
}

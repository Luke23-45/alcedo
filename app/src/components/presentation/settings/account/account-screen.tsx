import FullHeightScrollView from '@/components/layout/full-height-scroll-view';
import { AuthError, signInWithGoogle, signOut } from '@/services/auth-service';
import { isGoogleAuthConfigured } from '@/services/auth-config';
import { signedIn, signedOut } from '@/store/auth';
import { useAppSelector } from '@/store';
import { useDispatch } from 'react-redux';
import { useTranslate } from '@tolgee/react';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, View } from 'react-native';
import { SettingsBackground } from '../shared/settings-background';
import { SettingsGroup, SettingsRow } from '../shared/grouped-settings-list';
import { settingsKey } from '../shared/settings-i18n';
import { alcedoApiBaseUrl } from '@/services/api-consts';
import * as S from './account-screen.styles';

/**
 * Account screen (Settings → Account): the only sign-in UI in the app.
 *
 * Google-only, matching backend-v2's Google-only auth. Signed-out shows a
 * single "Continue with Google" button; signed-in shows the Google profile
 * and a sign-out action. Nothing else in the app changes with auth state —
 * every feature works offline, and backend features simply stay dormant
 * without a session.
 */
export function AccountScreen() {
  const { t } = useTranslate();
  const { back } = useRouter();
  const dispatch = useDispatch();
  const status = useAppSelector((s) => s.auth.status);
  const profile = useAppSelector((s) => s.auth.profile);
  const [busy, setBusy] = useState(false);

  const configured = isGoogleAuthConfigured();

  async function handleSignIn() {
    if (busy) {
      return;
    }
    setBusy(true);
    try {
      const signedInProfile = await signInWithGoogle();
      dispatch(signedIn(signedInProfile));
    } catch (error) {
      if (error instanceof AuthError && error.code === 'cancelled') {
        return;
      }
      const message = error instanceof AuthError ? error.message : t(settingsKey('settings.account.signin_failed'));
      Alert.alert(t(settingsKey('settings.account.signin_error_title')), message);
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    if (busy) {
      return;
    }
    setBusy(true);
    try {
      await signOut();
      dispatch(signedOut());
      back();
    } finally {
      setBusy(false);
    }
  }

  return (
    <FullHeightScrollView screenBackground={<SettingsBackground variant="home" />}>
      <Stack.Screen options={{ title: t(settingsKey('settings.account.title')) }} />
      <S.AccountContent>
        {status === 'signed-in' && profile ? (
          <>
            <SettingsGroup label={t(settingsKey('settings.account.section.signed_in'))}>
              <SettingsRow
                icon="personFill"
                wellHue="#0A84FF"
                iconColor="#5EB0FF"
                title={profile.name ?? profile.email ?? t(settingsKey('settings.account.unknown_user'))}
                subtitle={profile.email ?? undefined}
                hideChevron
                trailing={
                  profile.photo ? (
                    <Image source={{ uri: profile.photo }} style={{ width: 40, height: 40, borderRadius: 20 }} />
                  ) : undefined
                }
              />
            </SettingsGroup>
            <SettingsGroup label={t(settingsKey('settings.account.section.session'))}>
              <SettingsRow
                icon="info"
                wellHue="#98989F"
                iconColor="#AEAEB2"
                title={t(settingsKey('settings.account.server.title'))}
                subtitle={alcedoApiBaseUrl}
                hideChevron
              />
              <SettingsRow
                icon="delete"
                wellHue="#FF3B30"
                iconColor="#FF6961"
                title={
                  busy ? t(settingsKey('settings.account.signing_out')) : t(settingsKey('settings.account.sign_out'))
                }
                onPress={() => {
                  void handleSignOut();
                }}
                hideChevron
                trailing={busy ? <ActivityIndicator /> : undefined}
              />
            </SettingsGroup>
            <S.Footnote>{t(settingsKey('settings.account.signed_in_note'))}</S.Footnote>
          </>
        ) : (
          <>
            <SettingsGroup label={t(settingsKey('settings.account.section.account'))}>
              {configured ? (
                <SettingsRow
                  icon="personFill"
                  wellHue="#0A84FF"
                  iconColor="#5EB0FF"
                  title={
                    busy
                      ? t(settingsKey('settings.account.signing_in'))
                      : t(settingsKey('settings.account.sign_in_google'))
                  }
                  subtitle={t(settingsKey('settings.account.sign_in_google_subtitle'))}
                  onPress={() => {
                    void handleSignIn();
                  }}
                  hideChevron
                  trailing={busy ? <ActivityIndicator /> : undefined}
                />
              ) : (
                <SettingsRow
                  icon="info"
                  wellHue="#FF9F0A"
                  iconColor="#FFB84D"
                  title={t(settingsKey('settings.account.not_configured_title'))}
                  subtitle={t(settingsKey('settings.account.not_configured_subtitle'))}
                  hideChevron
                />
              )}
            </SettingsGroup>
            <S.Footnote>{t(settingsKey('settings.account.signed_out_note'))}</S.Footnote>
            <View style={{ height: 8 }} />
            <S.Footnote>{t(settingsKey('settings.account.offline_note'))}</S.Footnote>
          </>
        )}
      </S.AccountContent>
    </FullHeightScrollView>
  );
}

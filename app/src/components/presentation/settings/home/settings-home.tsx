import FullHeightScrollView from '@/components/layout/full-height-scroll-view';
import { useTranslate } from '@tolgee/react';
import { Stack } from 'expo-router';
import { SettingsBackground } from '../shared/settings-background';
import { CommunityGroup } from './community-group';
import { DataSyncGroup } from './data-sync-group';
import { PreferencesGroup } from './preferences-group';
import { ProfileHeader } from './profile-header';
import { TrainingGroup } from './training-group';
import { SupportGroup } from './support-group';
import * as S from './settings-home.styles';
import { ScreenFooter } from '../shared/grouped-settings-list.styles';
import { settingsKey } from '../shared/settings-i18n';

/**
 * Settings home (settings-dark.md Screen 1): atmospheric background, profile
 * header, grouped-inset sections, footer.
 */
export function SettingsHome() {
  const { t } = useTranslate();
  return (
    <FullHeightScrollView screenBackground={<SettingsBackground variant="home" />}>
      <Stack.Screen options={{ title: t(settingsKey('settings.home.title')) }} />
      <S.SettingsHomeContent>
        <ProfileHeader />
        <TrainingGroup />
        <PreferencesGroup />
        <DataSyncGroup />
        <CommunityGroup />
        <SupportGroup />
        <ScreenFooter>{t(settingsKey('settings.home.footer'))}</ScreenFooter>
      </S.SettingsHomeContent>
    </FullHeightScrollView>
  );
}

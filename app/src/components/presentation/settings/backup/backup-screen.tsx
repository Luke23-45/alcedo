import FullHeightScrollView from '@/components/layout/full-height-scroll-view';
import { useAppSelector } from '@/store';
import { selectHasUnseenWhatsNew } from '@/store/settings';
import { useTranslate } from '@tolgee/react';
import * as Application from 'expo-application';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { SettingsBackground } from '../shared/settings-background';
import { GroupLabel, ScreenFooter } from '../shared/grouped-settings-list.styles';
import { settingsKey } from '../shared/settings-i18n';
import { AboutCard } from './about-card';
import { BackupCard } from './backup-card';
import { ImportFeedDialog } from './backup-dialogs';
import { ReleaseCard } from './release-card';
import { StorageCard } from './storage-card';
import * as S from './backup-screen.styles';
import { View } from 'react-native';

/**
 * Backup, storage backends & what's new (settings-dark.md Screen 6):
 * iCloud backup card, storage card, release card, about card, footer.
 */
export function BackupScreen() {
  const { t } = useTranslate();
  const { push } = useRouter();
  const [feedImportOpen, setFeedImportOpen] = useState(false);
  const hasUnseen = useAppSelector(selectHasUnseenWhatsNew);
  // Same real-version source as the settings home footer (SH01 class).
  const version = Application.nativeApplicationVersion ?? '1.0.0';
  const build = Application.nativeBuildVersion ?? '1';

  return (
    <FullHeightScrollView screenBackground={<SettingsBackground variant="backup" />}>
      <Stack.Screen options={{ title: t(settingsKey('settings.backup.title')) }} />
      <S.BackupScreenContent>
        <View>
          <GroupLabel>{t(settingsKey('settings.backup.section.backup'))}</GroupLabel>
          <BackupCard />
        </View>
        <View>
          <GroupLabel>{t(settingsKey('settings.backup.section.storage'))}</GroupLabel>
          <StorageCard />
        </View>
        <View>
          <GroupLabel>{t(settingsKey('settings.backup.section.whatsnew'))}</GroupLabel>
          <ReleaseCard isNew={hasUnseen} onViewAll={() => push('/settings/whats-new')} />
        </View>
        <View>
          <GroupLabel>{t(settingsKey('settings.backup.section.about'))}</GroupLabel>
          <AboutCard />
        </View>
        <ScreenFooter>{t(settingsKey('settings.backup.footer'), { version, build })}</ScreenFooter>
      </S.BackupScreenContent>
      <ImportFeedDialog open={feedImportOpen} setOpen={setFeedImportOpen} />
    </FullHeightScrollView>
  );
}

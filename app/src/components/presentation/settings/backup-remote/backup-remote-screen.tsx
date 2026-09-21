import FullHeightScrollView from '@/components/layout/full-height-scroll-view';
import { useTranslate } from '@tolgee/react';
import { Stack } from 'expo-router';
import { SettingsBackground } from '../shared/settings-background';
import { Caption } from './caption/caption';
import { DestinationCard } from './destination-card/destination-card';
import { HonestNotes } from './honest-notes/honest-notes';
import { LastTestedCard } from './last-tested-card/last-tested-card';
import { TestFooter } from './test-footer/test-footer';
import * as S from './backup-remote-screen.styles';

/**
 * Automatic remote backup (backup-redesign.md S1): caption, the destination
 * card (server picker row, feed-account toggle, "How it works" disclosure),
 * the last-tested card, honest notes, and a floating Test / Manage backends
 * footer. The dead documentation row and the inline backend picker are gone —
 * server selection lives on the choose-server screen.
 */
export function BackupRemoteScreen() {
  const { t } = useTranslate();

  return (
    <FullHeightScrollView
      screenBackground={<SettingsBackground variant="backup" />}
      floatingChildren={<TestFooter />}
    >
      <Stack.Screen options={{ title: t('backup.automatic_remote.title') }} />
      <S.BackupRemoteContent>
        <Caption />
        <DestinationCard />
        <LastTestedCard />
        <HonestNotes />
      </S.BackupRemoteContent>
    </FullHeightScrollView>
  );
}

import FullHeightScrollView from '@/components/layout/full-height-scroll-view';
import { useTranslate } from '@tolgee/react';
import { Stack } from 'expo-router';
import { SettingsBackground } from '../shared/settings-background';
import { NoneOption } from './none-option/none-option';
import { ServerList } from './server-list/server-list';
import * as S from './choose-server-screen.styles';

/**
 * Choose server (backup-redesign.md S2): the "None" option, the user's
 * backends (complete rows assign instantly; incomplete rows are greyed and
 * inert), and the dashed add-new row. The built-in backend never appears —
 * selectUserBackends already excludes it.
 */
export function ChooseServerScreen() {
  const { t } = useTranslate();

  return (
    <FullHeightScrollView screenBackground={<SettingsBackground variant="backup" />}>
      <Stack.Screen options={{ title: t('backup.remote.choose_server.title') }} />
      <S.ChooseServerContent>
        <NoneOption />
        <ServerList />
      </S.ChooseServerContent>
    </FullHeightScrollView>
  );
}

import ConfirmationDialog from '@/components/presentation/foundation/confirmation-dialog';
import FullHeightScrollView from '@/components/layout/full-height-scroll-view';
import { useDispatch } from 'react-redux';
import { switchFeedBackend } from '@/store/backends';
import { T, useTranslate } from '@tolgee/react';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { SettingsBackground } from '../shared/settings-background';
import { BackendServicesGroup } from './backend-services-group';
import { BackendsListGroup } from './backends-list-group';
import * as S from './backends-screen.styles';

/**
 * Backends (settings-dark.md Screen 6 family): feature assignments and the
 * backend list in the grouped-inset language. All real behavior is
 * preserved — the feed switch still confirms before the account is
 * re-issued.
 */
export function BackendsScreen() {
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const [pendingFeedBackend, setPendingFeedBackend] = useState<string | undefined>(undefined);

  return (
    <FullHeightScrollView screenBackground={<SettingsBackground variant="backup" />}>
      <Stack.Screen options={{ title: t('backends.title') }} />
      <S.BackendsScreenContent>
        <BackendServicesGroup onFeedChange={setPendingFeedBackend} />
        <BackendsListGroup />
      </S.BackendsScreenContent>
      <ConfirmationDialog
        open={pendingFeedBackend !== undefined}
        headline={t('backends.feed_switch.title')}
        textContent={<T keyName="backends.feed_switch.message" />}
        onCancel={() => setPendingFeedBackend(undefined)}
        onOk={() => {
          if (pendingFeedBackend) {
            dispatch(switchFeedBackend({ backendId: pendingFeedBackend }));
          }
          setPendingFeedBackend(undefined);
        }}
      />
    </FullHeightScrollView>
  );
}

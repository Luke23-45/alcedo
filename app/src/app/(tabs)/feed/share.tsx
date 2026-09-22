import FullHeightScrollView from '@/components/layout/full-height-scroll-view';
import LimitedHtml from '@/components/presentation/foundation/limited-html';
import { MsIconSrc } from '@/components/presentation/foundation/ms-icon-source';
import { Remote } from '@/components/presentation/foundation/remote';
import { SurfaceText } from '@/components/presentation/foundation/surface-text';
import { FeedShareComposer } from '@/components/smart/feed-share-composer';
import { useServices } from '@/components/smart/services-provider';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useTranslate } from '@tolgee/react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { Card } from 'react-native-paper';
import Button from '@/components/presentation/foundation/button';
import { shareRequestDisplayName, useShareRequestFlow } from '@/components/smart/share-request-flow';

/**
 * /feed/share serves two flows:
 * - with `?id=` — the profile share-request deep link: the sender's public
 *   profile loads over the network and the screen offers Accept (follow
 *   back) / Cancel;
 * - without params — the Share Composer (Screen 3), which hides the stack
 *   header and draws its own nav.
 */
export default function FeedSharePage() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { keyValueStore } = useServices();

  if (!id) {
    return <FeedShareComposer keyValueStore={keyValueStore} />;
  }
  return <FeedShareRequest id={id} />;
}

function FeedShareRequest({ id }: { id: string }) {
  const theme = useAppTheme();
  const { t } = useTranslate();
  const { name } = useLocalSearchParams<{ name?: string }>();
  const { sharedProfileRemote, fetchUser, handleAccept, handleCancel } = useShareRequestFlow(id, name ?? '');

  return (
    <FullHeightScrollView>
      <Stack.Screen options={{ title: t('feed.feed.title') }} />
      <Remote
        retry={fetchUser}
        value={sharedProfileRemote}
        success={(sharedProfile) => (
          <View style={{ padding: theme.layout.screenPadding }}>
            <Card mode="contained">
              <Card.Title
                left={({ size }) => <MsIconSrc name="personFill" size={size} />}
                title={t('feed.profile_share_request.title')}
                titleVariant="headlineSmall"
              />
              <Card.Content style={{ gap: theme.space.base }}>
                <SurfaceText style={{ textAlign: 'center' }}>
                  <LimitedHtml
                    value={t('feed.user_wants_to_share_profile.message', {
                      user: shareRequestDisplayName(sharedProfile.name, t('feed.anonymous_user.label')),
                    })}
                  />
                </SurfaceText>

                <SurfaceText style={{ textAlign: 'center' }} color="onSurfaceVariant">
                  {t('feed.accept_to_follow.explanation')}
                </SurfaceText>
              </Card.Content>

              <Card.Actions
                style={{
                  justifyContent: 'center',
                  padding: theme.space.base,
                }}
              >
                <Button mode="outlined" onPress={handleCancel} style={{ marginRight: theme.space.sm }}>
                  {t('generic.cancel.button')}
                </Button>
                <Button
                  testID="feed-share-accept-button"
                  mode="contained"
                  onPress={() => handleAccept(sharedProfile)}
                  icon="check"
                >
                  {t('generic.accept.button')}
                </Button>
              </Card.Actions>
            </Card>
          </View>
        )}
      />
    </FullHeightScrollView>
  );
}

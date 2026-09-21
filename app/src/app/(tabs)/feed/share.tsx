import FullHeightScrollView from '@/components/layout/full-height-scroll-view';
import LimitedHtml from '@/components/presentation/foundation/limited-html';
import { Remote } from '@/components/presentation/foundation/remote';
import { SurfaceText } from '@/components/presentation/foundation/surface-text';
import { FeedShareComposer } from '@/components/smart/feed-share-composer';
import { useAppTheme } from '@/hooks/useAppTheme';
import { PendingFeedUser } from '@/models/feed-models';
import { useAppSelector } from '@/store';
import { fetchAndSetSharedFeedUser, requestFollowUser, selectSharedFeedUser } from '@/store/feed';
import { useTranslate } from '@tolgee/react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { Card, Icon } from 'react-native-paper';
import Button from '@/components/presentation/foundation/button';
import { useDispatch } from 'react-redux';

/**
 * /feed/share serves two flows:
 * - with `?id=` — the existing profile share-request deep link (unchanged);
 * - without params — the Share Composer (Screen 3), which hides the stack
 *   header and draws its own nav.
 */
export default function FeedSharePage() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  if (!id) {
    return <FeedShareComposer />;
  }
  return <FeedShareRequest id={id} />;
}

function FeedShareRequest({ id }: { id: string }) {
  const theme = useAppTheme();
  const { t } = useTranslate();
  const { name } = useLocalSearchParams<{ name?: string }>();
  const dispatch = useDispatch();
  const { back } = useRouter();

  const fetchUser = useCallback(() => {
    dispatch(
      fetchAndSetSharedFeedUser({
        idOrLookup: id,
        name: name ?? '',
        fromUserAction: true,
      }),
    );
  }, [dispatch, id, name]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const sharedProfileRemote = useAppSelector(selectSharedFeedUser);

  const handleAcceptRequest = (user: PendingFeedUser) => {
    dispatch(requestFollowUser({ user, fromUserAction: true }));
    back();
  };

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
                left={({ size }) => <Icon source={'personFill'} size={size} />}
                title={t('feed.profile_share_request.title')}
                titleVariant="headlineSmall"
              />
              <Card.Content style={{ gap: theme.space.base }}>
                <SurfaceText style={{ textAlign: 'center' }}>
                  <LimitedHtml
                    value={t('feed.user_wants_to_share_profile.message', {
                      user: sharedProfile.name || 'Anonymous user',
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
                <Button mode="outlined" onPress={() => back()} style={{ marginRight: theme.space.sm }}>
                  {t('generic.cancel.button')}
                </Button>
                <Button
                  testID="feed-share-accept-button"
                  mode="contained"
                  onPress={() => handleAcceptRequest(sharedProfile)}
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

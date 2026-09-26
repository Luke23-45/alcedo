import { useServices } from '@/components/smart/services-provider';
import { FeedTimeline } from '@/components/presentation/feed/timeline/feed-timeline';
import { useTimelineT } from '@/components/presentation/feed/timeline/timeline-i18n';
import { PencilGlyph } from '@/components/presentation/feed/shared/feed-glyphs';
import { COMPOSE_CIRCLE, COMPOSE_PENCIL } from '@/components/presentation/feed/timeline/timeline-tokens';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Stack, useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

/**
 * Feed tab root — Screen 1: Feed Timeline.
 *
 * The native tab-bar stack supplies the title; the compose action pushes the
 * share screen (`../share`). No root back chevron: the reference renders a
 * back control, but the tab root is a leaf and must not offer one. The compose
 * target is 44×44 carrying the spec's 34pt translucent circle.
 */
export default function FeedIndexPage() {
  const t = useTimelineT();
  const router = useRouter();
  const theme = useAppTheme();
  const dark = theme.isDark;
  const { keyValueStore } = useServices();

  return (
    <>
      <Stack.Screen
        options={{
          title: t('feed.feed.title'),
          headerRight: () => (
            <Pressable
              onPress={() => router.push('/feed/share')}
              accessibilityRole="button"
              accessibilityLabel={t('feed.timeline.nav.compose.a11y', 'Compose')}
              hitSlop={5}
              style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
            >
              <View
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: dark ? COMPOSE_CIRCLE.dark : COMPOSE_CIRCLE.light,
                }}
              >
                <PencilGlyph size={16.5} color={dark ? COMPOSE_PENCIL.dark : COMPOSE_PENCIL.light} />
              </View>
            </Pressable>
          ),
        }}
      />
      <FeedTimeline keyValueStore={keyValueStore} />
    </>
  );
}

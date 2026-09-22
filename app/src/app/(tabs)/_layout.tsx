import { useAppSelector } from '@/store';
import { selectFollowRequestCount } from '@/store/feed';
import { useTranslate } from '@tolgee/react';
import { Tabs } from 'expo-router';
import { AppTabBar } from '@/components/presentation/navigation/tab-bar';

export default function TabsLayout() {
  const { t } = useTranslate();
  const followRequestCount = useAppSelector(selectFollowRequestCount);
  const showFeed = useAppSelector((x) => x.settings.showFeed);
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => (
        <AppTabBar {...props} hiddenRouteNames={showFeed ? [] : ['feed']} badgeCounts={{ feed: followRequestCount }} />
      )}
    >
      <Tabs.Screen name="(session)" options={{ title: t('workout.workout.label') }} />
      <Tabs.Screen name="feed" options={{ title: t('feed.feed.title') }} />
      <Tabs.Screen name="stats" options={{ title: t('stats.stats.title') }} />
      <Tabs.Screen name="history" options={{ title: t('generic.history.title') }} />
      <Tabs.Screen name="settings" options={{ title: t('settings.settings.title') }} />
    </Tabs>
  );
}

import { useAppTheme } from '@/hooks/useAppTheme';
import { alpha } from '@/styles/theme';
import { useAppSelector } from '@/store';
import { selectFollowRequestCount } from '@/store/feed';
import { useTranslate } from '@tolgee/react';
import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabsLayout() {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const followRequestCount = useAppSelector(selectFollowRequestCount);
  const showFeed = useAppSelector((x) => x.settings.showFeed);
  return (
    <NativeTabs
      indicatorColor={theme.color.fill.secondary}
      rippleColor={alpha(theme.color.content.primary, 0.1)}
      backgroundColor={theme.color.background.base}
      labelVisibilityMode="labeled"
      iconColor={{ default: theme.color.content.secondary, selected: theme.color.interactive.accent }}
      labelStyle={{
        default: { color: theme.color.content.secondary },
        selected: { color: theme.color.interactive.accent },
      }}
    >
      <NativeTabs.Trigger name="(session)">
        <NativeTabs.Trigger.Label>{t('workout.workout.label')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'dumbbell', selected: 'dumbbell.fill' }}
          md={{ default: 'fitness_center', selected: 'fitness_center' }}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="feed" hidden={!showFeed}>
        <NativeTabs.Trigger.Icon
          sf={{
            default: 'bubble.left.and.bubble.right',
            selected: 'bubble.left.and.bubble.right.fill',
          }}
          md={{ default: 'forum', selected: 'forum' }}
        />
        <NativeTabs.Trigger.Label>{t('feed.feed.title')}</NativeTabs.Trigger.Label>
        {followRequestCount && <NativeTabs.Trigger.Badge>{followRequestCount.toString()}</NativeTabs.Trigger.Badge>}
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="stats">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'chart.bar', selected: 'chart.bar.fill' }}
          md={{ default: 'bar_chart', selected: 'bar_chart' }}
        />
        <NativeTabs.Trigger.Label>{t('stats.stats.title')}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="history">
        <NativeTabs.Trigger.Icon sf="calendar" md={{ default: 'calendar_month', selected: 'calendar_month' }} />
        <NativeTabs.Trigger.Label>{t('generic.history.title')}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Icon sf="gear" md={{ default: 'settings', selected: 'settings' }} />
        <NativeTabs.Trigger.Label>{t('settings.settings.title')}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

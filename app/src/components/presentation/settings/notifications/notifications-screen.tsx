import FullHeightScrollView from '@/components/layout/full-height-scroll-view';
import { Stack } from 'expo-router';
import { useTranslate } from '@tolgee/react';
import { SettingsBackground } from '../shared/settings-background';
import { ScreenFooter } from '../shared/grouped-settings-list.styles';
import { settingsKey } from '../shared/settings-i18n';
import { WorkoutCard } from './workout-card';
import { ResultsCard } from './results-card';
import { SocialCard } from './social-card';
import { DeliveryCard } from './delivery-card';
import * as S from './notifications-screen.styles';

/**
 * NOTIFICATIONS (settings-dark.md Screen 3): workout reminders, results,
 * social, and delivery preferences. All toggles drive the real persisted
 * settings; the notification service reschedules on every change.
 */
export function NotificationsScreen() {
  const { t } = useTranslate();
  return (
    <FullHeightScrollView screenBackground={<SettingsBackground variant="notifications" />}>
      <Stack.Screen options={{ title: t(settingsKey('settings.notifications.screen_title'), 'Notifications') }} />
      <S.NotificationsContent>
        <WorkoutCard />
        <ResultsCard />
        <SocialCard />
        <DeliveryCard />
        <ScreenFooter>
          {t(settingsKey('settings.notifications.screen_subtitle'), 'Reminders, results, social and delivery')}
        </ScreenFooter>
      </S.NotificationsContent>
    </FullHeightScrollView>
  );
}

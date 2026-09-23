import { Platform } from 'react-native';
import { useTranslate } from '@tolgee/react';
import { OnboardingCard } from './onboarding-card';
import { OnboardingPageHeader } from './onboarding-page-header';
import { OnboardingRow } from './onboarding-row';
import { OnboardingSectionLabel } from './onboarding-section-label';
import { OnboardingSwitch } from './onboarding-switch';
import { CardsPad, CardSlot, PageBody, PageScroll } from './onboarding-pages.styles';

/**
 * Page 3: rest notifications, feed visibility, and the conditional health
 * export row. Presentational; the smart wizard owns the settings state.
 */
export function OnboardingNotificationsPage(props: {
  restNotifications: boolean;
  onToggleRest: () => void;
  showFeed: boolean;
  onToggleFeed: () => void;
  canExportHealth: boolean;
  exportToHealth: boolean;
  onToggleHealth: () => void;
}) {
  const { t } = useTranslate();

  return (
    <PageBody>
      <PageScroll>
        <OnboardingPageHeader
          title={t('onboarding.notifications_and_feed.title', 'Notifications & Feed')}
          subtitle={t('onboarding.notifications_and_feed.subtitle', 'Miscellaneous settings')}
        />
        <CardsPad>
          <CardSlot>
            <OnboardingSectionLabel>{t('settings.notifications.title')}</OnboardingSectionLabel>
            <OnboardingCard>
              <OnboardingRow
                tile="notifications"
                icon="notifications"
                label={t('rest.notifications.title')}
                supportingText={t('rest.notifications.subtitle')}
                right={<OnboardingSwitch value={props.restNotifications} />}
                onToggle={props.onToggleRest}
                toggled={props.restNotifications}
                divider={false}
                testID="onboardingRestNotifications"
              />
            </OnboardingCard>
          </CardSlot>
          <CardSlot>
            <OnboardingSectionLabel spaced>{t('feed.feed.title')}</OnboardingSectionLabel>
            <OnboardingCard>
              <OnboardingRow
                tile="feed"
                icon="forum"
                label={t('feed.show_feed.label')}
                supportingText={t('feed.show_feed.subtitle')}
                right={<OnboardingSwitch value={props.showFeed} />}
                onToggle={props.onToggleFeed}
                toggled={props.showFeed}
                divider={props.canExportHealth}
                testID="onboardingShowFeed"
              />
              {props.canExportHealth ? (
                <OnboardingRow
                  tile="health"
                  icon="heartCheck"
                  label={Platform.OS === 'ios' ? t('export.healthkit.title') : t('export.health_connect.title')}
                  supportingText={
                    Platform.OS === 'ios' ? t('export.healthkit.subtitle') : t('export.health_connect.subtitle')
                  }
                  right={<OnboardingSwitch value={props.exportToHealth} />}
                  onToggle={props.onToggleHealth}
                  toggled={props.exportToHealth}
                  divider={false}
                  testID="onboardingHealthExport"
                />
              ) : undefined}
            </OnboardingCard>
          </CardSlot>
        </CardsPad>
      </PageScroll>
    </PageBody>
  );
}

import { SelectPickerOption } from '@/components/presentation/foundation/select-picker';
import { OnboardingLocalisationPage } from '@/components/presentation/onboarding/onboarding-localisation-page';
import { OnboardingNotificationsPage } from '@/components/presentation/onboarding/onboarding-notifications-page';
import { OnboardingShell } from '@/components/presentation/onboarding/onboarding-shell';
import { OnboardingWelcomePage } from '@/components/presentation/onboarding/onboarding-welcome-page';
import { useAppSelector } from '@/store';
import {
  setColorSchemeSeed,
  setExportToHealthAggregator,
  setFirstDayOfWeek,
  setLastSeenWhatsNewId,
  setPreferredLanguage,
  setRestNotifications,
  setShowFeed,
  setThemeMode,
  setTrueBlackDarkTheme,
  setUseImperialUnits,
  setWelcomeWizardCompleted,
} from '@/store/settings';
import { supportedLanguages } from '@/services/tolgee';
import { useFormatDate } from '@/hooks/useFormatDate';
import { getDateOnDay } from '@/utils/format-date';
import { latestWhatsNewId } from '@/models/whats-new';
import { DayOfWeek } from '@js-joda/core';
import { useTranslate } from '@tolgee/react';
import { requestPermissionsAsync } from 'expo-notifications';
import { useMemo, useState } from 'react';
import { Portal } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { useCanExportHealth } from './health-export-switch';

/**
 * First-run onboarding: welcome, localisation/theme, notifications/feed.
 * Owns all settings state and the completion flow; the pages are pure
 * presentation of the new `docs/new_design/onboading` mocks.
 */
export function WelcomeWizard() {
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const settings = useAppSelector((state) => state.settings);
  const welcomeWizardCompleted = settings.welcomeWizardCompleted;
  const notificationsEnabled = useAppSelector((x) => x.settings.restNotifications);
  const exportToHealthAggregator = useAppSelector((x) => x.settings.exportToHealthAggregator);
  const canExportHealth = useCanExportHealth();
  const formatDate = useFormatDate();
  const [currentPage, setCurrentPage] = useState(0);

  const daysOfWeekOptions: SelectPickerOption<DayOfWeek>[] = [
    DayOfWeek.SUNDAY,
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY,
    DayOfWeek.SATURDAY,
  ].map((day) => ({
    value: day,
    label: formatDate(getDateOnDay(day), { weekday: 'long' }),
  }));

  const languageOptions: SelectPickerOption<string | undefined>[] = useMemo(
    () => [
      {
        value: undefined,
        label: t('settings.system_default.label'),
      },
      ...supportedLanguages.map((x) => ({ value: x.code, label: x.label })),
    ],
    [t],
  );

  const totalPages = 3;

  const handleNext = async () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      dispatch(setWelcomeWizardCompleted(true));
      dispatch(setLastSeenWhatsNewId(latestWhatsNewId));
      if (notificationsEnabled) {
        await requestPermissionsAsync();
      }
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (welcomeWizardCompleted) {
    return null;
  }

  return (
    <Portal>
      <OnboardingShell
        page={currentPage}
        onPageChange={setCurrentPage}
        onPrevious={handlePrevious}
        onNext={() => void handleNext()}
        onFinish={() => void handleNext()}
      >
        <OnboardingWelcomePage />
        <OnboardingLocalisationPage
          useImperialUnits={settings.useImperialUnits}
          onToggleUnits={() => dispatch(setUseImperialUnits(!settings.useImperialUnits))}
          firstDayOfWeek={settings.firstDayOfWeek}
          daysOfWeekOptions={daysOfWeekOptions}
          onChangeWeekday={(value) => dispatch(setFirstDayOfWeek(value))}
          preferredLanguage={settings.preferredLanguage}
          languageOptions={languageOptions}
          onChangeLanguage={(value) => dispatch(setPreferredLanguage(value))}
          seed={settings.colorSchemeSeed}
          trueBlack={settings.trueBlackDarkTheme}
          themeMode={settings.themeMode}
          onUpdateTheme={(x) => dispatch(setColorSchemeSeed(x))}
          setTrueBlack={(b) => dispatch(setTrueBlackDarkTheme(b))}
          setThemeMode={(m) => dispatch(setThemeMode(m))}
        />
        <OnboardingNotificationsPage
          restNotifications={settings.restNotifications}
          onToggleRest={() => dispatch(setRestNotifications(!settings.restNotifications))}
          showFeed={settings.showFeed}
          onToggleFeed={() => dispatch(setShowFeed(!settings.showFeed))}
          canExportHealth={canExportHealth}
          exportToHealth={exportToHealthAggregator}
          onToggleHealth={() => dispatch(setExportToHealthAggregator(!exportToHealthAggregator))}
        />
      </OnboardingShell>
    </Portal>
  );
}

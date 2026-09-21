import { PreferencesScreen } from '@/components/presentation/settings/preferences/preferences-screen';

/**
 * Localization — thin route wrapper. Units, language, region, first day of
 * week and 24-hour time all live on the Preferences screen (settings-dark.md
 * Screen 2); this route deep-links to the same screen.
 */
export default function LocalizationPage() {
  return <PreferencesScreen />;
}

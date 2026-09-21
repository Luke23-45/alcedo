import FullHeightScrollView from '@/components/layout/full-height-scroll-view';
import { Stack } from 'expo-router';
import { useRef } from 'react';
import { findNodeHandle, View } from 'react-native';
import { ScrollView as GestureScrollView } from 'react-native-gesture-handler';
import { useTranslate } from '@tolgee/react';
import { SettingsBackground } from '../shared/settings-background';
import { ScreenFooter } from '../shared/grouped-settings-list.styles';
import { settingsKey } from '../shared/settings-i18n';
import { AppearanceCard } from './appearance-card';
import { UnitsCard } from './units-card';
import { LanguageRegionCard } from './language-region-card';
import { LanguagePickerCard } from './language-picker-card';
import { DisplayCard } from './display-card';
import * as S from './preferences-screen.styles';

/**
 * PREFERENCES (settings-dark.md Screen 2): Appearance, Units, Language &
 * Region, and the choose-language list. This screen absorbs the old
 * app-configuration and localization routes — both deep-link here.
 */
export function PreferencesScreen() {
  const { t } = useTranslate();
  const scrollRef = useRef<GestureScrollView>(null);
  const pickerRef = useRef<View>(null);

  const scrollToPicker = () => {
    const scroll = scrollRef.current;
    const picker = pickerRef.current;
    if (!scroll || !picker) return;
    const handle = findNodeHandle(scroll);
    if (!handle) return;
    picker.measureLayout(
      handle,
      (_x, y) => scroll.scrollTo({ y: Math.max(0, y - 16), animated: true }),
      () => {},
    );
  };

  return (
    <FullHeightScrollView scrollRef={scrollRef} screenBackground={<SettingsBackground variant="preferences" />}>
      <Stack.Screen options={{ title: t(settingsKey('settings.preferences.title'), 'Preferences') }} />
      <S.PreferencesContent>
        <AppearanceCard />
        <UnitsCard />
        <LanguageRegionCard onSelectLanguage={scrollToPicker} />
        <LanguagePickerCard ref={pickerRef} />
        <DisplayCard />
        <ScreenFooter>
          {t(settingsKey('settings.preferences.subtitle'), 'Appearance, units, language and region')}
        </ScreenFooter>
      </S.PreferencesContent>
    </FullHeightScrollView>
  );
}

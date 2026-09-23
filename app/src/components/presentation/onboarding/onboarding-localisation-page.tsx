import { useTranslate } from '@tolgee/react';
import { DayOfWeek } from '@js-joda/core';
import SelectPicker, { SelectPickerOption } from '@/components/presentation/foundation/select-picker';
import { ColorSchemeSeed, ThemeMode } from '@/store/settings';
import { OnboardingCard } from './onboarding-card';
import { OnboardingPageHeader } from './onboarding-page-header';
import { OnboardingRow } from './onboarding-row';
import { OnboardingSwitch } from './onboarding-switch';
import { OnboardingThemeCard } from './onboarding-theme-card';
import { CardsPad, CardSlot, PageBody, PageScroll } from './onboarding-pages.styles';

/**
 * Page 2: localisation rows (units, first weekday, language) and the theme
 * card. Presentational; the smart wizard owns the settings state.
 */
export function OnboardingLocalisationPage(props: {
  useImperialUnits: boolean;
  onToggleUnits: () => void;
  firstDayOfWeek: DayOfWeek;
  daysOfWeekOptions: SelectPickerOption<DayOfWeek>[];
  onChangeWeekday: (value: DayOfWeek) => void;
  preferredLanguage: string | undefined;
  languageOptions: SelectPickerOption<string | undefined>[];
  onChangeLanguage: (value: string | undefined) => void;
  seed: ColorSchemeSeed;
  trueBlack: boolean;
  themeMode: ThemeMode;
  onUpdateTheme: (seed: ColorSchemeSeed) => void;
  setTrueBlack: (value: boolean) => void;
  setThemeMode: (mode: ThemeMode) => void;
}) {
  const { t } = useTranslate();

  return (
    <PageBody>
      <PageScroll>
        <OnboardingPageHeader
          title={t('settings.localisation.title', 'Localisation')}
          subtitle={t('settings.localisation.subtitle', 'Set language and units')}
        />
        <CardsPad>
          <CardSlot>
            <OnboardingCard>
              <OnboardingRow
                tile="units"
                icon="weight"
                label={t('settings.use_imperial_units.label')}
                supportingText={t('settings.use_imperial_units.subtitle')}
                right={<OnboardingSwitch value={props.useImperialUnits} />}
                onToggle={props.onToggleUnits}
                toggled={props.useImperialUnits}
                testID="onboardingUnits"
              />
              <OnboardingRow
                tile="schedule"
                icon="calendar"
                label={t('settings.first_day_of_week.label')}
                supportingText={t('settings.first_day_of_week.subtitle')}
                right={
                  <SelectPicker
                    value={props.firstDayOfWeek}
                    options={props.daysOfWeekOptions}
                    onChange={props.onChangeWeekday}
                    testID="onboardingFirstDayOfWeek"
                  />
                }
              />
              <OnboardingRow
                tile="language"
                icon="language"
                label={t('settings.set_language.button')}
                supportingText={t('settings.set_language.subtitle')}
                right={
                  <SelectPicker
                    value={props.preferredLanguage}
                    options={props.languageOptions}
                    onChange={props.onChangeLanguage}
                    testID="onboardingLanguage"
                  />
                }
                divider={false}
              />
            </OnboardingCard>
          </CardSlot>
          <CardSlot>
            <OnboardingThemeCard
              seed={props.seed}
              trueBlack={props.trueBlack}
              themeMode={props.themeMode}
              onUpdateTheme={props.onUpdateTheme}
              setTrueBlack={props.setTrueBlack}
              setThemeMode={props.setThemeMode}
            />
          </CardSlot>
        </CardsPad>
      </PageScroll>
    </PageBody>
  );
}

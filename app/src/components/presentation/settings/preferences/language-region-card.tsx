import SelectPicker from '@/components/presentation/foundation/select-picker';
import type { SelectPickerOption } from '@/components/presentation/foundation/select-picker/select-picker-props';
import Icon from '@/components/presentation/foundation/icon';
import { SettingsGroup, SettingsToggle, useChevronColor } from '../shared/grouped-settings-list';
import { settingsKey } from '../shared/settings-i18n';
import { useAppSelector } from '@/store';
import { setFirstDayOfWeek, setUse24HourTime } from '@/store/settings';
import { detectLanguageFromDateLocale } from '@/utils/language-detector';
import { supportedLanguages } from '@/services/tolgee';
import { DayOfWeek } from '@js-joda/core';
import { useTranslate } from '@tolgee/react';
import { useDispatch } from 'react-redux';
import { activeLanguageFor, languageRowValue } from './language-data';
import { PreferenceRow } from './preference-row';
import { RowSeparator } from './preference-row.styles';
import * as S from './language-region-card.styles';

/** Trailing chevron for the language row (theme-aware per SH06/PF05). */
function Chevron() {
  return <Icon source="chevronRight" size={18} color={useChevronColor()} />;
}

/** Monday-first list of all seven days for the native first-day menu. */
const WEEK_DAYS = [
  DayOfWeek.MONDAY,
  DayOfWeek.TUESDAY,
  DayOfWeek.WEDNESDAY,
  DayOfWeek.THURSDAY,
  DayOfWeek.FRIDAY,
  DayOfWeek.SATURDAY,
  DayOfWeek.SUNDAY,
];

/** Localized long day name ("Monday") for a fixed reference week. */
function dayName(day: DayOfWeek, locale: string | undefined): string {
  // 2026-01-05 was a Monday.
  const date = new Date(2026, 0, 5 + (day.value() - 1));
  return new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date);
}

/**
 * LANGUAGE & REGION card (settings-dark.md Screen 2).
 *
 * - Language opens the picker below (same screen, so the row scrolls to it).
 * - Region follows the language — no independent region setting exists, and
 *   region data only exists for the curated six, so the row renders only
 *   for those (scrolling to the picker is still honest: it switches to a
 *   curated language).
 * - The app ships more translation bundles than the curated six; when one
 *   of those is active (e.g. device-detected Russian) the Language row
 *   shows its real native label instead of claiming English.
 * - First day of week is the real stored setting, edited through a native
 *   menu. The stored default stays Monday (pinned by preference-service
 *   tests); the row always shows the actual value.
 * - 24-Hour Time is a real app-wide clock preference.
 */
export function LanguageRegionCard({ onSelectLanguage }: { onSelectLanguage: () => void }) {
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const preferredLanguage = useAppSelector((s) => s.settings.preferredLanguage);
  const firstDayOfWeek = useAppSelector((s) => s.settings.firstDayOfWeek);
  const use24HourTime = useAppSelector((s) => s.settings.use24HourTime);

  const effectiveCode =
    preferredLanguage ?? detectLanguageFromDateLocale(supportedLanguages.map((x) => x.code)) ?? 'en';
  const active = activeLanguageFor(effectiveCode);

  const dayOptions: SelectPickerOption<DayOfWeek>[] = WEEK_DAYS.map((day) => ({
    value: day,
    label: dayName(day, preferredLanguage ?? undefined),
  }));

  return (
    <SettingsGroup label={t(settingsKey('settings.preferences.language_region.header'), 'LANGUAGE & REGION')}>
      <S.Block>
        <PreferenceRow
          title={t(settingsKey('settings.preferences.language.label'), 'Language')}
          trailing={
            <S.ValueRow>
              <S.RowValue numberOfLines={1}>{languageRowValue(active)}</S.RowValue>
              <Chevron />
            </S.ValueRow>
          }
          onPress={onSelectLanguage}
          accessibilityLabel={t(settingsKey('settings.preferences.language.label'), 'Language')}
        />
        {active.curated ? (
          <>
            <RowSeparator />
            <PreferenceRow
              title={t(settingsKey('settings.preferences.region.label'), 'Region')}
              trailing={
                <S.ValueRow>
                  <S.RowValue numberOfLines={1}>{active.regionName}</S.RowValue>
                  <Chevron />
                </S.ValueRow>
              }
              onPress={onSelectLanguage}
              accessibilityLabel={t(settingsKey('settings.preferences.region.label'), 'Region')}
            />
          </>
        ) : undefined}
        <RowSeparator />
        <PreferenceRow
          title={t(settingsKey('settings.preferences.first_day.label'), 'First day of week')}
          trailing={
            <SelectPicker<DayOfWeek>
              value={firstDayOfWeek}
              options={dayOptions}
              onChange={(day) => dispatch(setFirstDayOfWeek(day))}
            />
          }
        />
        <RowSeparator />
        <PreferenceRow
          title={t(settingsKey('settings.preferences.time_24h.label'), '24-Hour Time')}
          subtitle={
            use24HourTime
              ? t(settingsKey('settings.preferences.time_24h.on_caption'), 'On · showing 13:04 style times')
              : t(settingsKey('settings.preferences.time_24h.off_caption'), 'Off · showing AM / PM')
          }
          trailing={
            <SettingsToggle
              value={use24HourTime}
              onValueChange={(v) => dispatch(setUse24HourTime(v))}
              accessibilityLabel={t(settingsKey('settings.preferences.time_24h.label'), '24-Hour Time')}
            />
          }
        />
      </S.Block>
    </SettingsGroup>
  );
}

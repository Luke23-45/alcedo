import { SettingsGroup, SettingsToggle } from '../shared/grouped-settings-list';
import { settingsKey } from '../shared/settings-i18n';
import { useAppSelector } from '@/store';
import {
  setCelebrationAnimations,
  setColorSchemeSeed,
  setReduceMotion,
  setThemeMode,
  setTrueBlackDarkTheme,
  type ThemeMode,
} from '@/store/settings';
import { ACCENT_SEEDS, ACCENT_SEED_IDS, accentSeedFor, type AccentSeed } from '@/styles/accent-seeds';
import { useTranslate } from '@tolgee/react';
import { useDispatch } from 'react-redux';
import { PreferenceRow } from './preference-row';
import { CardSectionLabel, RowSeparator } from './preference-row.styles';
import { PreferenceSegmented } from './preference-segmented';
import * as S from './appearance-card.styles';

/**
 * APPEARANCE card (settings-dark.md Screen 2): theme segmented control,
 * accent swatches (the Ember seed is the real palette.ember[650] = #CE4A08,
 * and selecting a swatch rewrites the app-wide accent ramp), celebration
 * animations, reduce motion, and true black (existing setting, kept reachable).
 */
export function AppearanceCard() {
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const settings = useAppSelector((s) => s.settings);
  const selectedSeed = accentSeedFor(settings.colorSchemeSeed);

  const onSelectSeed = (seed: AccentSeed) => {
    dispatch(setColorSchemeSeed(seed.swatch));
  };

  return (
    <SettingsGroup label={t(settingsKey('settings.preferences.appearance.header'), 'APPEARANCE')}>
      <S.Block>
        <CardSectionLabel>{t(settingsKey('settings.preferences.theme.label'), 'Theme')}</CardSectionLabel>
        <S.SegmentedWrap>
          <PreferenceSegmented<ThemeMode>
            size="large"
            accessibilityLabel={t(settingsKey('settings.preferences.theme.label'), 'Theme')}
            options={[
              { value: 'light', label: t(settingsKey('settings.preferences.theme.light'), 'Light') },
              { value: 'dark', label: t(settingsKey('settings.preferences.theme.dark'), 'Dark') },
              { value: 'system', label: t(settingsKey('settings.preferences.theme.auto'), 'Auto') },
            ]}
            value={settings.themeMode}
            onChange={(mode) => dispatch(setThemeMode(mode))}
          />
        </S.SegmentedWrap>

        <S.AccentLabelWrap>
          <CardSectionLabel>{t(settingsKey('settings.preferences.accent.label'), 'Accent')}</CardSectionLabel>
        </S.AccentLabelWrap>
        <S.SwatchRow
          accessibilityRole="radiogroup"
          accessibilityLabel={t(settingsKey('settings.preferences.accent.label'), 'Accent')}
        >
          {ACCENT_SEED_IDS.map((id) => {
            const seed = ACCENT_SEEDS[id];
            const selected = seed.id === selectedSeed.id;
            const name = t(
              settingsKey(`settings.preferences.accent.${seed.id}`),
              seed.id.charAt(0).toUpperCase() + seed.id.slice(1),
            );
            return (
              <S.SwatchButton
                key={id}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                accessibilityLabel={name}
                onPress={() => onSelectSeed(seed)}
              >
                <S.SwatchVisual>
                  {selected ? <S.SwatchRing /> : undefined}
                  {seed.gradient ? (
                    <S.SwatchGradient colors={[...seed.gradient]} />
                  ) : (
                    <S.SwatchCircle $color={seed.swatch} />
                  )}
                </S.SwatchVisual>
              </S.SwatchButton>
            );
          })}
        </S.SwatchRow>

        <S.RowsBlock>
          <RowSeparator />
          <PreferenceRow
            title={t(settingsKey('settings.preferences.celebrations.label'), 'Celebration animations')}
            subtitle={t(settingsKey('settings.preferences.celebrations.subtitle'), 'Kudos bursts and earned moments')}
            trailing={
              <SettingsToggle
                value={settings.celebrationAnimations}
                onValueChange={(v) => dispatch(setCelebrationAnimations(v))}
                accessibilityLabel={t(settingsKey('settings.preferences.celebrations.label'), 'Celebration animations')}
              />
            }
          />
          <RowSeparator />
          <PreferenceRow
            title={t(settingsKey('settings.preferences.reduce_motion.label'), 'Reduce motion')}
            subtitle={t(settingsKey('settings.preferences.reduce_motion.subtitle'), 'Calms animation across the app')}
            trailing={
              <SettingsToggle
                value={settings.reduceMotion}
                onValueChange={(v) => dispatch(setReduceMotion(v))}
                accessibilityLabel={t(settingsKey('settings.preferences.reduce_motion.label'), 'Reduce motion')}
              />
            }
          />
          <RowSeparator />
          <PreferenceRow
            title={t(settingsKey('settings.preferences.true_black.label'), 'True black dark theme')}
            subtitle={t(settingsKey('settings.preferences.true_black.subtitle'), 'Pure black backgrounds in dark mode')}
            trailing={
              <SettingsToggle
                value={settings.trueBlackDarkTheme}
                onValueChange={(v) => dispatch(setTrueBlackDarkTheme(v))}
                accessibilityLabel={t(settingsKey('settings.preferences.true_black.label'), 'True black dark theme')}
              />
            }
          />
        </S.RowsBlock>
      </S.Block>
    </SettingsGroup>
  );
}

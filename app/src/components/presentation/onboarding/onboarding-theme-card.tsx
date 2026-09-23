import ColorPickerDialog from '@/components/presentation/foundation/editors/color-picker-dialog';
import FocusRing, { ANIMATION_DURATION } from '@/components/presentation/foundation/focus-ring';
import SelectPicker, { SelectPickerOption } from '@/components/presentation/foundation/select-picker';
import { useAppTheme } from '@/hooks/useAppTheme';
import { ColorSchemeSeed, ThemeMode } from '@/store/settings';
import { hsvToHex, type HexColor } from '@/utils/color';
import { sleep } from '@/utils/sleep';
import { T, useTranslate } from '@tolgee/react';
import { useState } from 'react';
import Svg, { Path } from 'react-native-svg';
import { OnboardingCard } from './onboarding-card';
import { OnboardingSwitch } from './onboarding-switch';
import { RowLabel } from './onboarding-row.styles';
import { onboardingColors } from './onboarding-tokens';
import * as S from './onboarding-theme-card.styles';

/**
 * The theme section of the onboarding localisation page, in the new card
 * design. Behaviour mirrors `ThemeChooser` (delayed seed apply so the
 * selection ring can animate, custom hue via `ColorPickerDialog`).
 */

const PRESET_SEEDS = ['#0A76C2', '#0B2CC8', '#35E0D6', '#CE4A08', '#FFAE3C', '#2FD25C', '#FF4D3D', '#02040A'] as const;

function SeedBall(props: { selected: boolean; seed: `#${string}`; onSelect: () => void }) {
  return (
    <FocusRing isSelected={props.selected}>
      <S.SeedBall
        $color={props.seed}
        onPress={props.onSelect}
        accessibilityRole="radio"
        accessibilityState={{ checked: props.selected }}
      />
    </FocusRing>
  );
}

/** A ball hinting "any color" via a hue ring, or filled with the active custom color when one is set. */
function CustomBall(props: { active: boolean; color: HexColor | undefined; onPress: () => void }) {
  const size = 28;
  const count = 180;
  const step = (2 * Math.PI) / count;
  const r = size / 2;
  const wedges = Array.from({ length: count }, (_, i) => {
    const a0 = i * step - step;
    const a1 = (i + 1) * step + step;
    return {
      d: `M ${r} ${r} L ${r + r * Math.cos(a0)} ${r + r * Math.sin(a0)} A ${r} ${r} 0 0 1 ${r + r * Math.cos(a1)} ${r + r * Math.sin(a1)} Z`,
      fill: hsvToHex((i / count) * 360, 0.85, 1),
    };
  });

  return (
    <FocusRing isSelected={props.active}>
      <S.SeedBall $color={props.active && props.color ? props.color : '#00000000'} onPress={props.onPress}>
        <S.CustomBallClip>
          {props.active && props.color ? (
            <S.CustomBallFill $color={props.color} />
          ) : (
            <Svg width={size} height={size}>
              {wedges.map((w, i) => (
                <Path key={i} d={w.d} fill={w.fill} />
              ))}
            </Svg>
          )}
        </S.CustomBallClip>
      </S.SeedBall>
    </FocusRing>
  );
}

export function OnboardingThemeCard(props: {
  seed: ColorSchemeSeed;
  trueBlack: boolean;
  themeMode: ThemeMode;
  onUpdateTheme: (seed: ColorSchemeSeed) => void;
  setTrueBlack: (t: boolean) => void;
  setThemeMode: (mode: ThemeMode) => void;
}) {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const colors = onboardingColors(theme, 0);
  const [selectedSeed, setSelectedSeed] = useState(props.seed);
  const [pickerOpen, setPickerOpen] = useState(false);

  const updateSeed = async (seed: ColorSchemeSeed) => {
    setSelectedSeed(seed);
    await sleep(ANIMATION_DURATION);
    props.onUpdateTheme(seed);
  };

  const isCustom = selectedSeed !== 'default' && !(PRESET_SEEDS as readonly string[]).includes(selectedSeed);
  const themeModeOptions: SelectPickerOption<ThemeMode>[] = [
    { value: 'system', label: t('settings.theme.mode.system') },
    { value: 'light', label: t('settings.theme.mode.light') },
    { value: 'dark', label: t('settings.theme.mode.dark') },
  ];

  return (
    <>
      <OnboardingCard>
        <S.ThemeRow>
          <S.ThemeLabel>{t('settings.theme.title')}</S.ThemeLabel>
          <S.SwatchLine>
            <S.DefaultPill
              style={{ backgroundColor: colors.defaultPillFill }}
              onPress={() => void updateSeed('default')}
              accessibilityRole="radio"
              accessibilityState={{ checked: selectedSeed === 'default' }}
              testID="onboardingDefaultSeed"
            >
              {selectedSeed === 'default' ? (
                <S.DefaultPillRing $color={colors.defaultPillRing} pointerEvents="none" />
              ) : undefined}
              <S.DefaultPillLabel>
                <T keyName="generic.default.label" />
              </S.DefaultPillLabel>
            </S.DefaultPill>
            <S.SwatchScrollerWrap>
              <S.SeedScroller>
                {PRESET_SEEDS.map((seed) => (
                  <SeedBall
                    key={seed}
                    selected={selectedSeed === seed}
                    seed={seed}
                    onSelect={() => void updateSeed(seed)}
                  />
                ))}
                <CustomBall
                  active={isCustom}
                  color={isCustom ? (selectedSeed as HexColor) : undefined}
                  onPress={() => setPickerOpen(true)}
                />
              </S.SeedScroller>
              <S.FadeOverlay pointerEvents="none">
                <S.FadeGradient
                  colors={[`${colors.scrollerFadeFrom}00`, colors.scrollerFadeFrom]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </S.FadeOverlay>
            </S.SwatchScrollerWrap>
          </S.SwatchLine>
        </S.ThemeRow>
        <S.ThemeDivider $color={colors.divider} />
        <S.PlainRow>
          <S.PlainRowText>
            <RowLabel>{t('settings.theme.mode.label')}</RowLabel>
          </S.PlainRowText>
          <SelectPicker
            testID="setThemeMode"
            value={props.themeMode}
            options={themeModeOptions}
            onChange={props.setThemeMode}
          />
        </S.PlainRow>
        <S.ThemeDivider $color={colors.divider} />
        <S.PlainRowPressable
          onPress={() => props.setTrueBlack(!props.trueBlack)}
          accessibilityRole="switch"
          accessibilityState={{ checked: props.trueBlack }}
          testID="onboardingTrueBlack"
        >
          <S.PlainRowText>
            <RowLabel>{t('settings.app_configuration.true_black_dark_theme.title')}</RowLabel>
            <S.PlainRowSupporting $color={colors.supporting}>
              {t('settings.app_configuration.true_black_dark_theme.subtitle')}
            </S.PlainRowSupporting>
          </S.PlainRowText>
          <OnboardingSwitch value={props.trueBlack} />
        </S.PlainRowPressable>
      </OnboardingCard>
      <ColorPickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        initialSeed={selectedSeed}
        onConfirm={(seed) => void updateSeed(seed)}
      />
    </>
  );
}

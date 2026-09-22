import Button from '@/components/presentation/foundation/button';
import ColorPickerDialog from '@/components/presentation/foundation/editors/color-picker-dialog';
import FocusRing, { ANIMATION_DURATION } from '@/components/presentation/foundation/focus-ring';
import { SegmentedGroup, SegmentListFormElement } from '@/components/presentation/foundation/segmented-list';
import { SegmentedListSelect } from '@/components/presentation/foundation/segmented-list-select';
import { SegmentedListSwitch } from '@/components/presentation/foundation/segmented-list-switch';
import { SelectPickerOption } from '@/components/presentation/foundation/select-picker';
import { useAppTheme } from '@/hooks/useAppTheme';
import { ColorSchemeSeed, ThemeMode } from '@/store/settings';
import { hsvToHex, type HexColor } from '@/utils/color';
import { sleep } from '@/utils/sleep';
import { T, useTranslate } from '@tolgee/react';
import { useState } from 'react';
import Svg, { Path } from 'react-native-svg';
import * as S from './theme-chooser.styles';

interface ThemeChooserProps {
  seed: ColorSchemeSeed;
  trueBlack: boolean;
  setTrueBlack: (t: boolean) => void;
  onUpdateTheme: (seed: ColorSchemeSeed) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

function ColorBall(props: {
  selectedSeed: ColorSchemeSeed;
  seed: `#${string}`;
  onUpdateTheme: (seed: ColorSchemeSeed) => void | Promise<void>;
}) {
  const isSelected = props.seed === props.selectedSeed;

  return (
    <FocusRing isSelected={isSelected}>
      <S.BallClip>
        <S.BallSurface
          $color={props.seed}
          onPress={() => {
            void props.onUpdateTheme(props.seed);
          }}
        >
          <></>
        </S.BallSurface>
      </S.BallClip>
    </FocusRing>
  );
}

/** A ball hinting "any color" via a hue ring, or filled with the active custom color when one is set. */
function CustomBall(props: { active: boolean; color: HexColor | undefined; onPress: () => void }) {
  const theme = useAppTheme();
  const size = theme.space.xxl;
  // Many thin wedges make the hue transitions blend into a smooth conic gradient (SVG has no conic).
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
      <S.CustomBallClip>
        <S.CustomBallSurface onPress={props.onPress}>
          {props.active && props.color ? (
            <S.BallFill $color={props.color} />
          ) : (
            <Svg width={size} height={size}>
              {wedges.map((w, i) => (
                <Path key={i} d={w.d} fill={w.fill} />
              ))}
            </Svg>
          )}
        </S.CustomBallSurface>
      </S.CustomBallClip>
    </FocusRing>
  );
}

const PRESET_SEEDS = [
  '#0A76C2', // kingfisher600
  '#0B2CC8', // cobalt600
  '#35E0D6', // turquoise400
  '#CE4A08', // ember650
  '#FFAE3C', // ember300
  '#2FD25C', // success
  '#FF4D3D', // danger
  '#02040A', // trench ink
] as const;

export function ThemeChooser(props: ThemeChooserProps) {
  const { t } = useTranslate();
  const [selectedSeed, setSelectedSeed] = useState(props.seed);
  const [pickerOpen, setPickerOpen] = useState(false);

  const updateSeed = async (seed: ColorSchemeSeed) => {
    setSelectedSeed(seed);
    await sleep(ANIMATION_DURATION);
    props.onUpdateTheme(seed);
  };

  const colorSeeds = PRESET_SEEDS;
  const isCustom = selectedSeed !== 'default' && !colorSeeds.includes(selectedSeed as (typeof PRESET_SEEDS)[number]);

  const themeModeOptions: SelectPickerOption<ThemeMode>[] = [
    { value: 'system', label: t('settings.theme.mode.system') },
    { value: 'light', label: t('settings.theme.mode.light') },
    { value: 'dark', label: t('settings.theme.mode.dark') },
  ];

  return (
    <>
      <SegmentedGroup>
        <SegmentListFormElement
          label={t('settings.theme.title')}
          line2={
            <S.SwatchRow>
              <FocusRing isSelected={selectedSeed === 'default'}>
                <Button style={{ position: 'relative' }} onPress={() => void updateSeed('default')}>
                  <T keyName="generic.default.label" />
                </Button>
              </FocusRing>
              <S.SwatchScroller>
                {colorSeeds.map((seed) => (
                  <ColorBall key={seed} selectedSeed={selectedSeed} seed={seed} onUpdateTheme={updateSeed} />
                ))}
                <CustomBall
                  active={isCustom}
                  color={isCustom ? selectedSeed : undefined}
                  onPress={() => setPickerOpen(true)}
                />
              </S.SwatchScroller>
            </S.SwatchRow>
          }
        />
        <SegmentedListSelect
          label={t('settings.theme.mode.label')}
          testID="setThemeMode"
          value={props.themeMode}
          options={themeModeOptions}
          onChange={props.setThemeMode}
        />
        <SegmentedListSwitch
          label={t('settings.app_configuration.true_black_dark_theme.title')}
          value={props.trueBlack}
          onValueChange={props.setTrueBlack}
        />
      </SegmentedGroup>
      <ColorPickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        initialSeed={selectedSeed}
        onConfirm={(seed) => void updateSeed(seed)}
      />
    </>
  );
}

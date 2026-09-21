import { LinearGradient } from 'expo-linear-gradient';
import { CheckGlyph } from '../../shared/feed-glyphs';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useComposerT } from '../composer-i18n';
import type { ComposerTheme } from '../composer-types';
import * as S from './theme-swatches.styles';

interface SwatchDef {
  key: ComposerTheme;
  /** Gradient stops for the swatch face (and the SharePoster). */
  colors: [string, string] | [string, string, string];
  locations: [number, number] | [number, number, number];
  glossOpacity: number;
  edge: boolean;
  labelKey: string;
  fallback: string;
}

const SWATCHES: SwatchDef[] = [
  {
    key: 'ember',
    colors: ['#FFB03A', '#FF5A3C', '#C1143C'],
    locations: [0, 0.45, 1],
    glossOpacity: 0.4,
    edge: false,
    labelKey: 'feed.composer.style.ember',
    fallback: 'Ember',
  },
  {
    key: 'aurora',
    colors: ['#8E7BFF', '#0E7490'],
    locations: [0, 1],
    glossOpacity: 0.28,
    edge: false,
    labelKey: 'feed.composer.style.aurora',
    fallback: 'Aurora',
  },
  {
    key: 'slate',
    colors: ['#4A4A50', '#1C1C1E'],
    locations: [0, 1],
    glossOpacity: 0,
    edge: true,
    labelKey: 'feed.composer.style.slate',
    fallback: 'Slate',
  },
];

interface ThemeSwatchesProps {
  theme: ComposerTheme;
  onThemeChange: (theme: ComposerTheme) => void;
  /** Mini hero number drawn inside each swatch, e.g. "8,420". */
  heroLabel: string;
}

export function ThemeSwatches({ theme, onThemeChange, heroLabel }: ThemeSwatchesProps) {
  const appTheme = useAppTheme();
  const t = useComposerT();
  const ringColors: readonly [string, string, string] | readonly [string, string] = appTheme.isDark
    ? ['#FFB03A', '#FF6A3D', '#FF2D55']
    : ['#FF9500', '#D70015'];

  return (
    <S.Section>
      <S.SectionHeader>{t('feed.composer.style.title', 'CARD STYLE')}</S.SectionHeader>
      <S.SwatchRow>
        {SWATCHES.map((swatch) => {
          const selected = swatch.key === theme;
          return (
            <S.SwatchPress
              key={swatch.key}
              onPress={() => onThemeChange(swatch.key)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={t(swatch.labelKey, swatch.fallback)}
            >
              <S.SwatchHit>
                {selected ? (
                  <S.RingFill>
                    <LinearGradient colors={ringColors} start={{ x: 0, y: 0 }} end={{ x: 0.6, y: 1 }} style={S.fill} />
                  </S.RingFill>
                ) : null}
                <S.SwatchShadow>
                  <S.Swatch>
                    <LinearGradient
                      colors={[...swatch.colors]}
                      locations={[...swatch.locations]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0.7, y: 1 }}
                      style={S.fill}
                    />
                    {swatch.glossOpacity > 0 ? (
                      <S.SwatchGloss
                        $opacity={swatch.glossOpacity}
                        colors={['rgba(255,255,255,0.32)', 'rgba(255,255,255,0)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                      />
                    ) : null}
                    <S.SwatchValue>{heroLabel}</S.SwatchValue>
                    {swatch.edge ? <S.SwatchEdge /> : null}
                  </S.Swatch>
                </S.SwatchShadow>
                {selected ? (
                  <S.CheckBadge>
                    <LinearGradient colors={ringColors} start={{ x: 0, y: 0 }} end={{ x: 0.6, y: 1 }} style={S.fill} />
                    <CheckGlyph size={11} color="#FFFFFF" strokeWidth={2.2} />
                  </S.CheckBadge>
                ) : null}
              </S.SwatchHit>
              <S.SwatchLabel $selected={selected}>{t(swatch.labelKey, swatch.fallback)}</S.SwatchLabel>
            </S.SwatchPress>
          );
        })}
      </S.SwatchRow>
    </S.Section>
  );
}

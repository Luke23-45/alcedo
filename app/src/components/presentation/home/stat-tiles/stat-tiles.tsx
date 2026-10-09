import { useTranslate } from '@tolgee/react';
import Svg, { Path, Rect } from 'react-native-svg';
import { fontWeight } from '@/styles/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { HomeCard } from '../shared/home-card';
import { HomeText } from '../shared/home-text';
import * as S from './stat-tiles.styles';

/**
 * Reference tile geometry (dark SVG + light deltas):
 * - tiles 112×82, rx 24, 12pt gaps → each flexes to (361−24)/3 in the row
 * - label 9/700/+0.95, value 20/700/−0.6, unit 10.5/600
 * - HR sparkline stroke #FF2D55; steps "+8%" + five mini bars; calories
 *   ember flame with white-hot core (all glyphs top-left, aligned with labels)
 */
const SPARKLINE_D = 'M0 9 L5 9 L8 1 L12 15 L15 5 L19 9 L25 9 L28 0 L32 13 L35 7 L38 7';
const STEP_BARS = [
  { x: 0, y: 7, h: 7, o: 0.3 },
  { x: 7.5, y: 3, h: 11, o: 0.38 },
  { x: 15, y: 5, h: 9, o: 0.3 },
  { x: 22.5, y: 0, h: 14, o: 0.55 },
  { x: 30, y: 2, h: 12, o: 1 },
];

function SparklineGlyph() {
  return (
    <Svg width={40} height={16} viewBox="0 0 40 16">
      <Path
        d={SPARKLINE_D}
        fill="none"
        stroke="#FF2D55"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function StepBarsGlyph({ color }: { color: string }) {
  return (
    <Svg width={36} height={15} viewBox="0 0 36 15">
      {STEP_BARS.map((bar, i) => (
        <Rect key={i} x={bar.x} y={bar.y} width={4} height={bar.h} rx={2} fill={color} fillOpacity={bar.o} />
      ))}
    </Svg>
  );
}

/**
 * Calories flame: ember body with a white-hot core. Pure filled silhouette —
 * no strokes, so there are no joins or caps to get wrong at 15pt. Left notch,
 * tall right tongue, round base; the core sits low-center inside the body.
 */
function FlameGlyph() {
  return (
    <Svg width={15} height={19} viewBox="0 0 16 20">
      <Path
        d="M8 19.5 C5 19.5 3 17.2 3 14.2 C3 11.5 4.6 10.2 4.6 10.2 C4.6 10.2 4.9 12 6.3 12 C7.7 12 7.6 9.3 8.2 7.2 C8.6 5.7 9.4 4.2 9.4 4.2 C9.4 4.2 9.5 6.4 10.8 6.4 C12.1 6.4 11.6 3.4 12.6 1.2 C12.6 1.2 15 5.4 15 10.2 C15 15.4 11.5 19.5 8 19.5 Z"
        fill="#FF9F0A"
      />
      <Path
        d="M8 16.5 C6.2 16.5 4.8 15 4.8 12.9 C4.8 11.4 5.7 10.6 5.7 10.6 C5.7 10.6 5.9 11.7 6.8 11.7 C7.7 11.7 8.2 10.2 8.6 8.9 C9.4 10.4 11.2 11.6 11.2 13.2 C11.2 15.1 9.8 16.5 8 16.5 Z"
        fill="#FFFFFF"
        fillOpacity={0.9}
      />
    </Svg>
  );
}

interface TileDatum {
  key: 'hr' | 'cal' | 'steps';
  labelKey: 'home.stats.heart_rate' | 'home.stats.calories' | 'home.stats.steps';
  value: string;
  unit?: string;
  delta?: string;
}

const TILES: TileDatum[] = [
  { key: 'hr', labelKey: 'home.stats.heart_rate', value: '62', unit: 'bpm' },
  { key: 'cal', labelKey: 'home.stats.calories', value: '520', unit: 'kcal' },
  { key: 'steps', labelKey: 'home.stats.steps', value: '8,412', delta: '+8%' },
];

export function StatTiles() {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const labelColor = theme.isDark ? '#86868B' : '#8E8E93';
  const valueColor = theme.isDark ? '#FFFFFF' : '#1C1C1E';
  const unitColor = theme.isDark ? '#6C6C70' : '#AEAEB2';
  const deltaColor = theme.isDark ? '#30D158' : '#248A3D';

  return (
    <S.TilesRow>
      {TILES.map((tile) => (
        <HomeCard key={tile.key} elev="tile" pad={10} style={{ flex: 1, minHeight: 82 }}>
          <S.TileBody>
            <S.TileTop>
              {tile.key === 'hr' && <SparklineGlyph />}
              {tile.key === 'cal' && <FlameGlyph />}
              {tile.key === 'steps' && (
                <S.ValueRow style={{ marginTop: 0, alignItems: 'center', gap: 4 }}>
                  <HomeText weight={fontWeight.bold} style={{ fontSize: 9.5, lineHeight: 12, color: deltaColor }}>
                    {tile.delta}
                  </HomeText>
                  <StepBarsGlyph color={deltaColor} />
                </S.ValueRow>
              )}
            </S.TileTop>
            <S.TileBottom>
              <HomeText
                weight={fontWeight.bold}
                micro
                tracking={0.95}
                numberOfLines={1}
                style={{ fontSize: 9, lineHeight: 11, color: labelColor }}
              >
                {t(tile.labelKey).toLocaleUpperCase()}
              </HomeText>
              <S.ValueRow>
                <HomeText
                  weight={fontWeight.bold}
                  tabular
                  tracking={-0.6}
                  numberOfLines={1}
                  style={{ fontSize: 20, lineHeight: 24, color: valueColor, flexShrink: 1 }}
                >
                  {tile.value}
                </HomeText>
                {tile.unit && (
                  <HomeText weight={fontWeight.semibold} style={{ fontSize: 10.5, lineHeight: 13, color: unitColor }}>
                    {tile.unit}
                  </HomeText>
                )}
              </S.ValueRow>
            </S.TileBottom>
          </S.TileBody>
        </HomeCard>
      ))}
    </S.TilesRow>
  );
}

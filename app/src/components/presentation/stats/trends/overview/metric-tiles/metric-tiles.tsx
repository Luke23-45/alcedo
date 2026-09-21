import { Path, Svg } from 'react-native-svg';
import { fontWeight } from '@/styles/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { HomeText } from '@/components/presentation/home/shared/home-text';
import { MetricTile } from '../trends-overview-data';
import { trendsPalette } from '../trends-colors';
import { layoutSeries } from '../shared/chart-math';
import { HeroMetricKey } from '../hero-chart/hero-chart';
import { TilePressable, TileRow, ValueRow } from './metric-tiles.styles';

const SPARK_COLORS = ['#FF6A88', '#FFB84D', '#5EDCF0'];

/** Straight-segment sparkline path for a tile. */
function sparkPath(values: number[], width: number, height: number): string {
  const pts = layoutSeries(values, 1, width - 1, 1.5, height - 1.5);
  return pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');
}

/**
 * Three 104pt tiles — Volume · 7D, {lift} e1RM, Bodyweight — each with a
 * sparkline of its trailing window. Tapping a tile selects that metric
 * in the hero chart above.
 */
export function MetricTiles({
  tiles,
  onSelect,
}: {
  tiles: [MetricTile, MetricTile, MetricTile];
  onSelect: (metric: HeroMetricKey) => void;
}) {
  const theme = useAppTheme();
  const palette = trendsPalette(theme.isDark);
  const keys: HeroMetricKey[] = ['volume', 'e1rm', 'bodyweight'];

  return (
    <TileRow>
      {tiles.map((tile, index) => {
        const spark = SPARK_COLORS[index]!;
        const deltaColor =
          tile.deltaTone === 'up'
            ? palette.deltaUp
            : tile.deltaTone === 'down'
              ? palette.deltaDown
              : palette.deltaNeutral;
        return (
          <TilePressable
            key={keys[index]}
            onPress={() => onSelect(keys[index]!)}
            accessibilityRole="button"
            accessibilityLabel={`${tile.label} ${tile.value}`}
          >
            <HomeCard radius={24} elev="tile" pad={14} style={{ height: 104 }}>
              <HomeText
                weight={fontWeight.bold}
                micro
                tracking={0.8}
                numberOfLines={1}
                style={{
                  fontSize: 8.5,
                  lineHeight: 11,
                  color: palette.secondary,
                }}
              >
                {index === 0 ? `${tile.label} · 7D` : tile.label}
              </HomeText>
              <ValueRow>
                <HomeText
                  weight={fontWeight.bold}
                  tracking={-0.6}
                  tabular
                  numberOfLines={1}
                  style={{
                    fontSize: 19,
                    lineHeight: 23,
                    color: palette.primary,
                  }}
                >
                  {tile.value}
                </HomeText>
                {tile.unit ? (
                  <HomeText
                    weight={fontWeight.semibold}
                    style={{
                      fontSize: 10.5,
                      lineHeight: 13,
                      marginLeft: 4,
                      color: palette.tertiary,
                    }}
                  >
                    {tile.unit}
                  </HomeText>
                ) : null}
              </ValueRow>
              <HomeText
                weight={fontWeight.bold}
                numberOfLines={1}
                style={{
                  fontSize: 10,
                  lineHeight: 13,
                  marginTop: 6,
                  color: deltaColor,
                }}
              >
                {tile.delta}
              </HomeText>
              {tile.spark.length > 1 ? (
                <Svg
                  width={84}
                  height={12}
                  viewBox="0 0 84 12"
                  style={{ marginTop: 6 }}
                >
                  <Path
                    d={sparkPath(tile.spark, 84, 16)}
                    fill="none"
                    stroke={spark}
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              ) : null}
            </HomeCard>
          </TilePressable>
        );
      })}
    </TileRow>
  );
}

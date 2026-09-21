import {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Stop,
  Svg,
  Text,
} from 'react-native-svg';
import { useTranslate } from '@tolgee/react';
import { fontWeight } from '@/styles/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { HomeText } from '@/components/presentation/home/shared/home-text';
import { SampleBadge } from '@/components/presentation/home/shared/sample-badge';
import { HeroMetric } from '../trends-overview-data';
import { trendsPalette } from '../trends-colors';
import { CardAura } from '../shared/card-aura';
import {
  layoutSeries,
  smoothAreaPath,
  smoothLinePath,
} from '../shared/chart-math';
import {
  ActivePill,
  ChartWrap,
  DeltaPill,
  MetricTab,
  SwitcherRow,
  ValueRow,
} from './hero-chart.styles';

export type HeroMetricKey = 'volume' | 'e1rm' | 'bodyweight';

const METRICS: HeroMetricKey[] = ['volume', 'e1rm', 'bodyweight'];

/* SVG-local geometry (card-local y minus the 112pt above the chart block). */
const W = 321;
const H = 164;
const X0 = 4;
const X1 = 317;
const Y_TOP = 45.3;
const Y_BASE = 120;
const GRID_Y = [36, 78, 120];

const ACCENTS: Record<
  HeroMetricKey,
  { stroke: string; node: string; label: string }
> = {
  volume: { stroke: '#FF6A3D', node: '#FF2D55', label: '#FF6A88' },
  e1rm: { stroke: '#FFB84D', node: '#FFB84D', label: '#FFB84D' },
  bodyweight: { stroke: '#5EDCF0', node: '#5EDCF0', label: '#5EDCF0' },
};

/**
 * The 361×276 hero card: metric tabs, headline value, and the smooth
 * brand-gradient line chart with quartiles-free min/max scaling,
 * glowing end node, and x-axis labels (first · second-to-last · Today).
 */
export function HeroChart({
  active,
  onChange,
  volume,
  e1rm,
  bodyweight,
  sampled,
}: {
  active: HeroMetricKey;
  onChange: (metric: HeroMetricKey) => void;
  volume: HeroMetric;
  e1rm: HeroMetric;
  bodyweight: HeroMetric;
  sampled: boolean;
}) {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const palette = trendsPalette(theme.isDark);
  const metric =
    active === 'volume' ? volume : active === 'e1rm' ? e1rm : bodyweight;
  const accent = ACCENTS[active];

  const tabLabels: Record<HeroMetricKey, string> = {
    volume: t('trends.hero.tab.volume'),
    e1rm: t('trends.hero.tab.e1rm'),
    bodyweight: t('trends.hero.tab.bodyweight'),
  };

  const deltaBg =
    metric.deltaTone === 'up'
      ? palette.deltaUpBg
      : metric.deltaTone === 'down'
        ? palette.deltaDownBg
        : palette.deltaNeutralBg;
  const deltaColor =
    metric.deltaTone === 'up'
      ? palette.deltaUp
      : metric.deltaTone === 'down'
        ? palette.deltaDown
        : palette.deltaNeutral;

  const pts = layoutSeries(
    metric.points.map((p) => p.value),
    X0,
    X1,
    Y_TOP,
    Y_BASE,
  );
  const line = smoothLinePath(pts);
  const area = smoothAreaPath(pts, Y_BASE);
  const last = pts[pts.length - 1];
  const midLabel =
    metric.points.length >= 3
      ? metric.points[metric.points.length - 2]
      : undefined;

  return (
    <HomeCard hero style={{ height: 276 }}>
      <CardAura
        width={361}
        height={276}
        stops={[{ cx: 44, cy: 40, r: 300, color: '#FF2D55', opacity: 0.1 }]}
      />
      <SwitcherRow>
        {METRICS.map((key) => (
          <MetricTab
            key={key}
            $width={key === 'bodyweight' ? 88 : 66}
            onPress={() => onChange(key)}
            hitSlop={{ top: 9, bottom: 9, left: 4, right: 4 }}
            accessibilityRole="tab"
            accessibilityState={{ selected: key === active }}
          >
            {key === active ? (
              <ActivePill
                $fill={palette.segmentedThumb}
                $border={palette.segmentedThumbBorder}
              />
            ) : null}
            <HomeText
              weight={key === active ? fontWeight.semibold : fontWeight.medium}
              tracking={-0.15}
              style={{
                fontSize: 11.5,
                lineHeight: 14,
                color: key === active ? palette.primary : palette.secondary,
              }}
            >
              {tabLabels[key]}
            </HomeText>
          </MetricTab>
        ))}
        {sampled ? <SampleBadge compact /> : null}
        {metric.deltaText ? (
          <DeltaPill $bg={deltaBg}>
            <HomeText
              weight={fontWeight.bold}
              tracking={-0.15}
              style={{ fontSize: 11, lineHeight: 13, color: deltaColor }}
            >
              {metric.deltaText}
            </HomeText>
          </DeltaPill>
        ) : null}
      </SwitcherRow>

      <ValueRow>
        <HomeText
          variant="largeTitle"
          weight={fontWeight.bold}
          tracking={-1.4}
          tabular
          style={{ fontSize: 36, lineHeight: 42, color: palette.primary }}
        >
          {metric.bigValue}
        </HomeText>
        {metric.unit ? (
          <HomeText
            weight={fontWeight.semibold}
            style={{
              fontSize: 15,
              lineHeight: 18,
              marginLeft: 8,
              color: palette.secondary,
            }}
          >
            {metric.unit}
          </HomeText>
        ) : null}
      </ValueRow>
      {metric.caption ? (
        <HomeText
          weight={fontWeight.medium}
          style={{
            fontSize: 11.5,
            lineHeight: 15,
            marginTop: 2,
            color: palette.secondary,
          }}
        >
          {metric.caption}
        </HomeText>
      ) : null}

      <ChartWrap>
        <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <Defs>
            <LinearGradient id="trendLine" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor={palette.lineStart} />
              <Stop offset="1" stopColor={palette.lineEnd} />
            </LinearGradient>
            <LinearGradient
              id="trendArea"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1={Y_TOP}
              x2="0"
              y2={Y_BASE}
            >
              <Stop
                offset="0"
                stopColor={accent.stroke}
                stopOpacity={palette.areaOpacity}
              />
              <Stop offset="1" stopColor={accent.stroke} stopOpacity={0} />
            </LinearGradient>
            <LinearGradient
              id="trendNodeHalo"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <Stop offset="0" stopColor={accent.node} stopOpacity={0.45} />
              <Stop offset="1" stopColor={accent.node} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <G>
            {GRID_Y.map((y) => (
              <Line
                key={y}
                x1={0}
                y1={y}
                x2={W}
                y2={y}
                stroke={palette.chartGrid}
                strokeWidth={1}
              />
            ))}
            {pts.length > 0 ? (
              <G>
                {/* Fewer than two points: points only, never an implied trend. */}
                {pts.length >= 2 ? (
                  <>
                    <Path d={area} fill="url(#trendArea)" />
                    <Path
                      d={line}
                      fill="none"
                      stroke="url(#trendLine)"
                      strokeWidth={2.6}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </>
                ) : null}
                {pts.slice(0, -1).map((p, i) => (
                  <Circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r={3.4}
                    fill={palette.nodeHalo}
                    stroke={accent.stroke}
                    strokeWidth={2}
                  />
                ))}
                {last ? (
                  <G>
                    <Circle
                      cx={last.x}
                      cy={last.y}
                      r={11}
                      fill="url(#trendNodeHalo)"
                    />
                    <Circle
                      cx={last.x}
                      cy={last.y}
                      r={5.6}
                      fill={accent.node}
                      stroke={palette.nodeHalo}
                      strokeWidth={2.4}
                    />
                    <Text
                      x={X1}
                      y={34}
                      fontSize={9.5}
                      fontWeight={fontWeight.bold}
                      letterSpacing={-0.1}
                      fill={accent.label}
                      textAnchor="end"
                    >
                      {metric.endLabel}
                    </Text>
                  </G>
                ) : null}
              </G>
            ) : (
              <Text
                x={W / 2}
                y={82}
                fontSize={11}
                fontWeight={fontWeight.medium}
                fill={palette.tertiary}
                textAnchor="middle"
              >
                {t('trends.hero.empty')}
              </Text>
            )}
            {pts.length > 0 ? (
              <G
                fontSize={9}
                fontWeight={fontWeight.semibold}
                letterSpacing={0.2}
              >
                <Text x={X0} y={140} fill={palette.tertiary} textAnchor="start">
                  {metric.points[0]!.label}
                </Text>
                {midLabel ? (
                  <Text
                    x={pts[pts.length - 2]!.x}
                    y={140}
                    fill={palette.tertiary}
                    textAnchor="middle"
                  >
                    {midLabel.label}
                  </Text>
                ) : null}
                <Text x={X1} y={140} fill={palette.dim} textAnchor="end">
                  {t('trends.hero.today')}
                </Text>
              </G>
            ) : null}
            {metric.footer ? (
              <Text
                x={0}
                y={158}
                fontSize={10}
                fontWeight={fontWeight.medium}
                fill={palette.quaternary}
              >
                {metric.footer}
              </Text>
            ) : null}
          </G>
        </Svg>
      </ChartWrap>
    </HomeCard>
  );
}

import { LegendList } from '@legendapp/list';
import { LinearGradient } from 'expo-linear-gradient';
import { useWindowDimensions } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient as SvgGradient,
  Path,
  RadialGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import Menu, { type MenuItem } from '@/components/presentation/foundation/menu';
import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { HomeScreenBackground } from '@/components/presentation/home/shared/home-auras';
import { useAppTheme } from '@/hooks/useAppTheme';
import { type as typeHelper } from '@/styles/theme';
import type { ReactNode } from 'react';
import * as S from './exercise-history-list.styles';

/* Model ------------------------------------------------------------------- */

export interface ExerciseHistoryPr {
  heading: string;
  valueLine: string;
  subLine: string;
}

export interface ExerciseHistoryChartPoint {
  /** Numeric value in the display unit, for geometry. */
  value: number;
  /** Value as drawn above the dot, e.g. "102.5". */
  valueLabel: string;
  /** X-axis label, e.g. "Apr 21". */
  dateLabel: string;
  sessionId: string;
  isToday: boolean;
}

export interface ExerciseHistoryRow {
  key: string;
  sessionId: string;
  month: string;
  day: string;
  headline: string;
  subline: string;
  isPr: boolean;
  prLabel: string;
}

/* Screen chrome ------------------------------------------------------------ */

/**
 * The home screen background plus the single gold aura the reference puts
 * behind this screen (radial #FFD60A at 90,150 r260).
 */
export function ExerciseHistoryBackground() {
  const theme = useAppTheme();
  return (
    <S.AuraWrap pointerEvents="none">
      <HomeScreenBackground />
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 393 852"
        preserveAspectRatio="xMidYMin slice"
        style={{ position: 'absolute', left: 0, top: 0 }}
      >
        <Defs>
          <RadialGradient id="ehAura" cx={90} cy={150} r={260} gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#FFD60A" stopOpacity={theme.exerciseHistory.auraOpacity} />
            <Stop offset="1" stopColor="#FFD60A" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={90} cy={150} r={260} fill="url(#ehAura)" />
      </Svg>
    </S.AuraWrap>
  );
}

export function ExerciseHistoryBottomFade() {
  const theme = useAppTheme();
  const [, , screenBottom] = theme.home.screenBackground.colors;
  return (
    <LinearGradient
      colors={['rgba(0, 0, 0, 0)', screenBottom]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      pointerEvents="none"
      style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 44 }}
    />
  );
}

function BackChevronGlyph() {
  return (
    <Svg width={10} height={14} viewBox="-4 -6 8 12">
      <Path
        d="M2 -5 L-2.6 0 L2 5"
        stroke="#8E8E93"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

function OverflowGlyph() {
  return (
    <Svg width={18} height={4} viewBox="-2 -2 18 4">
      <Circle cx={0} cy={0} r={2} fill="#8E8E93" />
      <Circle cx={7} cy={0} r={2} fill="#8E8E93" />
      <Circle cx={14} cy={0} r={2} fill="#8E8E93" />
    </Svg>
  );
}

export function ExerciseHistoryNavBar({
  title,
  onBack,
  menuItems,
}: {
  title: string;
  onBack: () => void;
  menuItems: MenuItem[];
}) {
  return (
    <S.NavBar>
      <S.NavButton onPress={onBack} accessibilityRole="button">
        <BackChevronGlyph />
      </S.NavButton>
      <S.NavTitleWrap>
        <S.NavTitle numberOfLines={1} ellipsizeMode="tail">
          {title}
        </S.NavTitle>
      </S.NavTitleWrap>
      {menuItems.length > 0 ? (
        <Menu
          trigger={(open) => (
            <S.NavButton onPress={open} accessibilityRole="button">
              <OverflowGlyph />
            </S.NavButton>
          )}
          items={menuItems}
        />
      ) : (
        <S.NavSpacer />
      )}
    </S.NavBar>
  );
}

/* PR banner ----------------------------------------------------------------- */

/** Gold body of the PR banner: #FFE9A8 → #FFD84D → #D9A441, stops 0/0.45/1. */
function PrGradientLayer() {
  const theme = useAppTheme();
  return (
    <LinearGradient
      colors={[...theme.exerciseHistory.gold.gradient]}
      locations={[0, 0.45, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.7, y: 1 }}
      style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
    />
  );
}

export function ExerciseHistoryPrBanner({ pr }: { pr: ExerciseHistoryPr | undefined }) {
  const theme = useAppTheme();
  if (!pr) {
    return null;
  }
  return (
    <S.PrCard>
      <PrGradientLayer />
      <S.PrGloss />
      <S.PrContent>
        <S.PrMedal>
          <Svg width={19} height={19} viewBox="-10 -10 20 20">
            <Path
              d="M0 -9 L2.23 -3.07 L8.56 -2.78 L3.61 1.17 L5.29 7.28 L0 3.8 L-5.29 7.28 L-3.61 1.17 L-8.56 -2.78 L-2.23 -3.07 Z"
              fill={theme.exerciseHistory.gold.star}
              transform="scale(0.95)"
            />
          </Svg>
        </S.PrMedal>
        <S.PrTexts>
          <S.PrHeading>{pr.heading}</S.PrHeading>
          <S.PrValue>{pr.valueLine}</S.PrValue>
          <S.PrSub>{pr.subLine}</S.PrSub>
        </S.PrTexts>
      </S.PrContent>
    </S.PrCard>
  );
}

/* Chart --------------------------------------------------------------------- */

const PLOT_H = 64;
const PAD_X = 4;
/** Headroom above the plot so the peak dot and its value label sit inside the
 *  SVG viewport (the reference draws them above the top gridline). */
const PLOT_TOP_PAD = 20;
const LABEL_BASELINE = PLOT_TOP_PAD + 84;
const SVG_H = PLOT_TOP_PAD + 88;

const round1 = (n: number) => Math.round(n * 10) / 10;

/**
 * A smooth curve through every point: quadratic segments through the segment
 * midpoints, with the data points as control points.
 */
function smoothLinePath(points: { x: number; y: number }[]): string {
  const first = points[0];
  const last = points[points.length - 1];
  if (!first || !last || points.length < 2) {
    return first ? `M ${round1(first.x)} ${round1(first.y)}` : '';
  }
  let d = `M ${round1(first.x)} ${round1(first.y)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]!;
    const b = points[i + 1]!;
    d += ` Q ${round1(a.x)} ${round1(a.y)} ${round1((a.x + b.x) / 2)} ${round1((a.y + b.y) / 2)}`;
  }
  return `${d} L ${round1(last.x)} ${round1(last.y)}`;
}

export function ExerciseHistoryChart({
  points,
  prSessionId,
  title,
  subtitle,
  sessionsLabel,
  todayLabel,
}: {
  points: ExerciseHistoryChartPoint[];
  prSessionId: string | undefined;
  title: string;
  subtitle: string;
  sessionsLabel: string;
  todayLabel: string;
}) {
  const theme = useAppTheme();
  const { width: windowWidth } = useWindowDimensions();
  if (points.length === 0) {
    return null;
  }

  const tokens = theme.exerciseHistory;
  const contentWidth = windowWidth - 32 - 40;
  const plotWidth = contentWidth - PAD_X * 2;
  const lastIndex = points.length - 1;

  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min;
  // The reference pads the vertical scale asymmetrically: 16% of the span
  // below the minimum, ~1% above the maximum, so the peak nearly kisses the
  // top gridline while the trough floats above the bottom one. (Flat data
  // falls back to a ±0.5 window, as before.)
  const vLo = span > 0 ? min - span * 0.16 : min - 0.5;
  const vHi = span > 0 ? max + span * 0.0104 : max + 0.5;
  const x = (i: number) => (points.length === 1 ? contentWidth / 2 : PAD_X + (plotWidth * i) / lastIndex);
  const y = (v: number) => PLOT_TOP_PAD + PLOT_H * (1 - (v - vLo) / (vHi - vLo));

  const coords = points.map((p, i) => ({ x: x(i), y: y(p.value) }));
  const linePath = smoothLinePath(coords);
  const plotBottom = PLOT_TOP_PAD + PLOT_H;
  const areaPath = `${linePath} L ${round1(x(lastIndex))} ${plotBottom} L ${round1(x(0))} ${plotBottom} Z`;

  const prIndex = prSessionId ? points.findIndex((p) => p.sessionId === prSessionId) : -1;
  const ring = theme.home.card.colors[2];
  // SF Pro for the SVG labels, via the sanctioned text-style resolver (no legacy font shim).
  const fontFamily = typeHelper(theme, 'caption2').fontFamily;

  // points is non-empty, so the first/last lookups below always hit; the guards
  // are for the type checker, not for a state the UI can reach.
  const firstPoint = points[0];
  const lastPoint = points[lastIndex];
  const lastCoord = coords[lastIndex];
  if (!firstPoint || !lastPoint || !lastCoord) {
    return null;
  }
  const prPoint = prIndex >= 0 ? points[prIndex] : undefined;
  const prCoord = prIndex >= 0 ? coords[prIndex] : undefined;

  const prLabelX =
    prCoord && prIndex > 0 && prIndex < lastIndex ? Math.min(Math.max(prCoord.x, 30), contentWidth - 30) : 0;

  return (
    <HomeCard radius={30} pad={0} style={{ height: 184 }}>
      <S.ChartPad>
        <S.ChartHeader>
          <S.ChartTitleBlock>
            <S.ChartTitle>{title}</S.ChartTitle>
            <S.ChartSub>{subtitle}</S.ChartSub>
          </S.ChartTitleBlock>
          <S.ChartChip>
            <S.ChartChipText>{sessionsLabel}</S.ChartChipText>
          </S.ChartChip>
        </S.ChartHeader>
        <S.ChartPlotWrap>
          <Svg width={contentWidth} height={SVG_H}>
            <Defs>
              <SvgGradient id="ehLine" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={tokens.line.start} />
                <Stop offset="1" stopColor={tokens.line.end} />
              </SvgGradient>
              <SvgGradient id="ehArea" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={tokens.line.area} stopOpacity={tokens.line.areaOpacity} />
                <Stop offset="1" stopColor={tokens.line.area} stopOpacity={0} />
              </SvgGradient>
              <RadialGradient id="ehGlow" cx="50%" cy="50%" r="50%">
                <Stop offset="0" stopColor={tokens.line.end} stopOpacity={0.55} />
                <Stop offset="0.55" stopColor={tokens.line.end} stopOpacity={0.22} />
                <Stop offset="1" stopColor={tokens.line.end} stopOpacity={0} />
              </RadialGradient>
            </Defs>
            {[0, PLOT_H / 2, PLOT_H].map((gy) => (
              <Line
                key={gy}
                x1={0}
                y1={PLOT_TOP_PAD + gy}
                x2={contentWidth}
                y2={PLOT_TOP_PAD + gy}
                stroke={tokens.grid}
                strokeWidth={1}
              />
            ))}
            <Path d={areaPath} fill="url(#ehArea)" />
            <Path
              d={linePath}
              fill="none"
              stroke="url(#ehLine)"
              strokeWidth={2.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {prCoord && (
              <Circle cx={prCoord.x} cy={prCoord.y} r={6} fill={tokens.prValue} stroke={ring} strokeWidth={2.4} />
            )}
            {lastIndex !== prIndex && (
              <>
                <Circle cx={lastCoord.x} cy={lastCoord.y} r={11} fill="url(#ehGlow)" />
                <Circle
                  cx={lastCoord.x}
                  cy={lastCoord.y}
                  r={5.4}
                  fill={tokens.line.end}
                  stroke={ring}
                  strokeWidth={2.2}
                />
              </>
            )}
            {prCoord && prPoint && (
              <SvgText
                x={prLabelX}
                y={prCoord.y - 12}
                textAnchor="middle"
                fontFamily={fontFamily}
                fontSize={9.5}
                fontWeight="700"
                letterSpacing={-0.1}
                fill={tokens.prValue}
              >
                {prPoint.valueLabel}
              </SvgText>
            )}
            {lastIndex !== prIndex && (
              <SvgText
                x={contentWidth - PAD_X}
                y={lastCoord.y - 10}
                textAnchor="end"
                fontFamily={fontFamily}
                fontSize={9.5}
                fontWeight="700"
                letterSpacing={-0.1}
                fill={tokens.line.end}
              >
                {lastPoint.valueLabel}
              </SvgText>
            )}
            <SvgText
              x={PAD_X}
              y={LABEL_BASELINE}
              fontFamily={fontFamily}
              fontSize={9}
              fontWeight="600"
              letterSpacing={0.2}
              fill={tokens.xOld}
            >
              {firstPoint.dateLabel}
            </SvgText>
            {prCoord && prPoint && prIndex > 0 && prIndex < lastIndex && (
              <SvgText
                x={prLabelX}
                y={LABEL_BASELINE}
                textAnchor="middle"
                fontFamily={fontFamily}
                fontSize={9}
                fontWeight="600"
                letterSpacing={0.2}
                fill={tokens.xPr}
              >
                {prPoint.dateLabel}
              </SvgText>
            )}
            <SvgText
              x={contentWidth - PAD_X}
              y={LABEL_BASELINE}
              textAnchor="end"
              fontFamily={fontFamily}
              fontSize={9}
              fontWeight="600"
              letterSpacing={0.2}
              fill={tokens.xCurrent}
            >
              {lastPoint.isToday ? todayLabel : lastPoint.dateLabel}
            </SvgText>
          </Svg>
        </S.ChartPlotWrap>
      </S.ChartPad>
    </HomeCard>
  );
}

/* Section header -------------------------------------------------------------- */

export function ExerciseHistorySectionHeader({
  label,
  actionLabel,
  onAction,
}: {
  label: string;
  actionLabel: string;
  onAction: (() => void) | undefined;
}) {
  return (
    <S.SectionHead>
      <S.SectionLabel>{label}</S.SectionLabel>
      {onAction && (
        <S.SeeAllHit onPress={onAction} accessibilityRole="button">
          <S.SeeAllText>{actionLabel}</S.SeeAllText>
        </S.SeeAllHit>
      )}
    </S.SectionHead>
  );
}

/* Rows ------------------------------------------------------------------------ */

function HistoryRow({ row, onPress }: { row: ExerciseHistoryRow; onPress: () => void }) {
  const theme = useAppTheme();
  return (
    <S.RowPress onPress={onPress} accessibilityRole="button">
      <HomeCard radius={22} pad={0} elev="tile">
        <S.RowInner>
          <S.DateTile $pr={row.isPr}>
            <S.TileMonth $pr={row.isPr}>{row.month}</S.TileMonth>
            <S.TileDay $pr={row.isPr}>{row.day}</S.TileDay>
          </S.DateTile>
          <S.RowMiddle>
            <S.RowHeadline numberOfLines={1} ellipsizeMode="tail">
              {row.headline}
            </S.RowHeadline>
            <S.RowSubline numberOfLines={1} ellipsizeMode="tail">
              {row.subline}
            </S.RowSubline>
          </S.RowMiddle>
          {row.isPr && (
            <S.PrChip>
              <S.PrChipText>{row.prLabel}</S.PrChipText>
            </S.PrChip>
          )}
          <Svg width={8} height={12} viewBox="-4 -6 8 12">
            <Path
              d="M-2 -4 L2 0 L-2 4"
              stroke={theme.exerciseHistory.chevron}
              strokeWidth={1.9}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
        </S.RowInner>
      </HomeCard>
    </S.RowPress>
  );
}

export function ExerciseHistoryList({
  rows,
  onRowPress,
  banner,
  chart,
  sectionHeader,
  empty,
}: {
  rows: ExerciseHistoryRow[];
  onRowPress: (sessionId: string) => void;
  banner?: ReactNode;
  chart?: ReactNode;
  sectionHeader?: ReactNode;
  empty?: ReactNode;
}) {
  return (
    <LegendList
      testID="exercise-history-list"
      data={rows}
      keyExtractor={(row) => row.key}
      renderItem={({ item }) => <HistoryRow row={item} onPress={() => onRowPress(item.sessionId)} />}
      ItemSeparatorComponent={() => <S.RowSeparator />}
      ListHeaderComponent={
        <S.HeaderStack>
          {banner}
          {chart}
          {sectionHeader}
        </S.HeaderStack>
      }
      ListEmptyComponent={empty ? <S.EmptyWrap>{empty}</S.EmptyWrap> : undefined}
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 6, paddingBottom: 64 }}
      showsVerticalScrollIndicator={false}
    />
  );
}

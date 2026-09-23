import { useState } from 'react';
import { Pressable } from 'react-native';
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
import { useTranslate } from '@tolgee/react';
import type { TranslationKey } from '@tolgee/web';
import { LocalDate } from '@js-joda/core';
import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { useAppSelector } from '@/store';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useFormatDate } from '@/hooks/useFormatDate';
import { type as typeHelper } from '@/styles/theme';
import { DetailSession, formatBare, formatDeltaPercent } from '../exercise-detail-model';
import * as S from './progress-chart.styles';

type ChartMode = 'weight' | 'volume' | 'e1rm' | 'sets';

/** Trailing window, matching the reference's 8-session chart window. */
const CHART_WINDOW = 8;

const PLOT_TOP_PAD = 16;
const PLOT_H = 84;
const SVG_H = PLOT_TOP_PAD + PLOT_H;
const PAD_X = 4;

const round1 = (n: number) => Math.round(n * 10) / 10;

/**
 * The reference's smoothing: a straight lead-in to the first midpoint, then
 * each data point becomes the quadratic control for the segment ending at the
 * next midpoint, with a straight run-out to the last point.
 * (M p0 · L mid(p0,p1) · Q p_i mid(p_i,p_{i+1}) · L p_{n-1})
 */
function smoothLinePath(points: { x: number; y: number }[]): string {
  const first = points[0];
  if (!first) {
    return '';
  }
  if (points.length === 1) {
    return `M ${round1(first.x)} ${round1(first.y)}`;
  }
  const mid = (a: { x: number; y: number }, b: { x: number; y: number }) => ({
    x: round1((a.x + b.x) / 2),
    y: round1((a.y + b.y) / 2),
  });
  let d = `M ${round1(first.x)} ${round1(first.y)}`;
  const m01 = mid(points[0]!, points[1]!);
  d += ` L ${m01.x} ${m01.y}`;
  for (let i = 1; i < points.length - 1; i++) {
    const p = points[i]!;
    const m = mid(p, points[i + 1]!);
    d += ` Q ${round1(p.x)} ${round1(p.y)} ${m.x} ${m.y}`;
  }
  const last = points[points.length - 1]!;
  return `${d} L ${round1(last.x)} ${round1(last.y)}`;
}

/**
 * js-joda text patterns (MMM/MMMM/EEEE) throw without the locale plugin, which
 * we don't ship — month names go through the cached Intl formatters instead.
 */
function monthDay(formatDate: (date: LocalDate, opts: Intl.DateTimeFormatOptions) => string, date: LocalDate): string {
  return formatDate(date, { month: 'short', day: 'numeric' });
}

const MODES: {
  key: ChartMode;
  labelKey: TranslationKey;
  titleKey: TranslationKey;
  value: (s: DetailSession) => number;
}[] = [
  {
    key: 'weight',
    labelKey: 'stats.exercise_detail.chart.weight',
    titleKey: 'stats.exercise_detail.chart.weight.title',
    value: (s) => s.topSet,
  },
  {
    key: 'volume',
    labelKey: 'stats.exercise_detail.chart.volume',
    titleKey: 'stats.exercise_detail.chart.volume.title',
    value: (s) => s.volume,
  },
  {
    key: 'e1rm',
    labelKey: 'stats.exercise_detail.chart.e1rm',
    titleKey: 'stats.exercise_detail.chart.e1rm.title',
    value: (s) => s.e1rm,
  },
  {
    key: 'sets',
    labelKey: 'stats.exercise_detail.chart.sets',
    titleKey: 'stats.exercise_detail.chart.sets.title',
    value: (s) => s.setCount,
  },
];

export function ProgressChart({
  sessions,
  bestE1rm,
  latestBodyweight,
  unitLabel,
}: {
  /** All sessions, newest first. */
  sessions: DetailSession[];
  bestE1rm: number;
  latestBodyweight: number | null;
  unitLabel: string;
}) {
  const theme = useAppTheme();
  const { t } = useTranslate();
  const formatDate = useFormatDate();
  const locale = useAppSelector((x) => x.settings.preferredLanguage);
  const [mode, setMode] = useState<ChartMode>('weight');
  const { width: windowWidth } = useWindowDimensions();

  const windowed = sessions.slice(0, CHART_WINDOW).reverse();
  const modeSpec = MODES.find((m) => m.key === mode)!;
  const values = windowed.map(modeSpec.value);
  const first = windowed[0];
  const last = windowed[windowed.length - 1];
  if (!first || !last) {
    return null;
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min;
  // Reference padding: 16% of span below the min, 12% above the max, so the
  // peak nearly kisses the top gridline and the trough floats above the
  // bottom one. Flat data falls back to a ±0.5 window.
  const vLo = span > 0 ? min - span * 0.16 : min - 0.5;
  const vHi = span > 0 ? max + span * 0.12 : max + 0.5;

  const contentWidth = Math.min(windowWidth, 393) - 32 - 40;
  const plotWidth = contentWidth - PAD_X * 2;
  const lastIndex = windowed.length - 1;
  const x = (i: number) => (windowed.length === 1 ? contentWidth / 2 : PAD_X + (plotWidth * i) / lastIndex);
  const y = (v: number) => PLOT_TOP_PAD + PLOT_H * (1 - (v - vLo) / (vHi - vLo));

  const coords = values.map((v, i) => ({ x: x(i), y: y(v) }));
  const linePath = smoothLinePath(coords);
  const plotBottom = PLOT_TOP_PAD + PLOT_H;
  const areaPath = `${linePath} L ${round1(x(lastIndex))} ${plotBottom} L ${round1(x(0))} ${plotBottom} Z`;

  // The gold PR node exists only in Weight mode, and only for the session
  // that set the all-time top-set record (earliest on ties) when it lies in
  // the displayed window. Every other mode renders ordinary truthful nodes.
  const weightPrIndex = mode === 'weight' ? windowed.findIndex((s) => s.holdsWeightPr) : -1;
  const prCoord = weightPrIndex >= 0 ? coords[weightPrIndex] : undefined;
  const lastCoord = coords[lastIndex];
  const prIsLast = weightPrIndex === lastIndex;

  const tokens = theme.exerciseHistory;
  const halo = theme.isDark ? '#131316' : '#FFFFFF';
  const fontFamily = typeHelper(theme, 'caption2').fontFamily;
  const prLabelX = prCoord ? Math.min(Math.max(prCoord.x, 44), contentWidth - 44) : 0;

  const delta = formatDeltaPercent(values[0]!, values[lastIndex]!, locale);
  const deltaColor = theme.isDark
    ? delta?.startsWith('−')
      ? '#FF453A'
      : '#4ADE80'
    : delta?.startsWith('−')
      ? '#D70015'
      : '#248A3D';
  const strengthRatio = latestBodyweight && latestBodyweight > 0 ? (bestE1rm / latestBodyweight).toFixed(2) : null;

  const selectedIndex = MODES.findIndex((m) => m.key === mode);
  const segmentPitch = contentWidth / MODES.length;

  return (
    <HomeCard radius={30} pad={0}>
      <S.ChartInner>
        <S.SegmentTrack>
          <S.SegmentThumb $left={2 + selectedIndex * segmentPitch} $width={segmentPitch - 4} />
          {MODES.map((m, i) => (
            <Pressable
              key={m.key}
              onPress={() => setMode(m.key)}
              accessibilityRole="button"
              accessibilityState={{ selected: i === selectedIndex }}
              hitSlop={{ top: 6, bottom: 6 }}
              style={S.segmentHit}
            >
              <S.SegmentLabel $selected={i === selectedIndex}>{t(m.labelKey)}</S.SegmentLabel>
            </Pressable>
          ))}
        </S.SegmentTrack>

        <S.ChartTitle>{t(modeSpec.titleKey)}</S.ChartTitle>
        <S.ChartSubtitle>
          {monthDay(formatDate, first.date)} – {monthDay(formatDate, last.date)} · {windowed.length}{' '}
          {t('stats.exercise_detail.chart.sessions')}
          {delta ? (
            <>
              {' · '}
              <S.DeltaText $color={deltaColor}>{delta}</S.DeltaText>
            </>
          ) : null}
        </S.ChartSubtitle>

        <S.SvgWrap>
          <Svg width={contentWidth} height={SVG_H}>
            <Defs>
              <SvgGradient id="edLine" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={tokens.line.start} />
                <Stop offset="1" stopColor={tokens.line.end} />
              </SvgGradient>
              <SvgGradient id="edArea" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#FF6A3D" stopOpacity={tokens.line.areaOpacity} />
                <Stop offset="1" stopColor="#FF6A3D" stopOpacity={0} />
              </SvgGradient>
              <RadialGradient id="edGlow" cx="50%" cy="50%" r="50%">
                <Stop offset="0" stopColor={tokens.line.end} stopOpacity={0.55} />
                <Stop offset="0.55" stopColor={tokens.line.end} stopOpacity={0.22} />
                <Stop offset="1" stopColor={tokens.line.end} stopOpacity={0} />
              </RadialGradient>
              <SvgGradient id="edGold" x1="0.2" y1="0" x2="0.8" y2="1">
                <Stop offset="0" stopColor="#FFF0BE" />
                <Stop offset="1" stopColor="#D9A441" />
              </SvgGradient>
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
            {/* Fewer than two sessions: nodes only, never an implied trend. */}
            {coords.length >= 2 ? (
              <>
                <Path d={areaPath} fill="url(#edArea)" />
                <Path
                  d={linePath}
                  fill="none"
                  stroke="url(#edLine)"
                  strokeWidth={2.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            ) : null}
            {coords.map((c, i) =>
              i === weightPrIndex || i === lastIndex ? null : (
                <Circle key={i} cx={c.x} cy={c.y} r={3.4} fill={halo} stroke="#FF6A3D" strokeWidth={2} />
              ),
            )}
            {prCoord && (
              <>
                <Circle cx={prCoord.x} cy={prCoord.y} r={6.4} fill="url(#edGold)" stroke={halo} strokeWidth={2.4} />
                <Path
                  d="M0 -9 L2.23 -3.07 L8.56 -2.78 L3.61 1.17 L5.29 7.28 L0 3.8 L-5.29 7.28 L-3.61 1.17 L-8.56 -2.78 L-2.23 -3.07 Z"
                  transform={`translate(${prCoord.x},${prCoord.y}) scale(0.34)`}
                  fill="#5C4300"
                />
                <SvgText
                  x={prLabelX}
                  y={prCoord.y - 11}
                  textAnchor="middle"
                  fontFamily={fontFamily}
                  fontSize={9.5}
                  fontWeight="700"
                  letterSpacing={-0.1}
                  fill="#FFD84D"
                >
                  {formatBare(values[weightPrIndex]!)} PR
                </SvgText>
              </>
            )}
            {lastCoord && !prIsLast && (
              <>
                <Circle cx={lastCoord.x} cy={lastCoord.y} r={11} fill="url(#edGlow)" />
                <Circle
                  cx={lastCoord.x}
                  cy={lastCoord.y}
                  r={5.4}
                  fill={tokens.line.end}
                  stroke={halo}
                  strokeWidth={2.2}
                />
                <SvgText
                  x={contentWidth - PAD_X}
                  y={lastCoord.y + 19}
                  textAnchor="end"
                  fontFamily={fontFamily}
                  fontSize={9.5}
                  fontWeight="700"
                  letterSpacing={-0.1}
                  fill={theme.isDark ? '#FF6A88' : tokens.line.end}
                >
                  {formatBare(values[lastIndex]!)}
                </SvgText>
              </>
            )}
          </Svg>
        </S.SvgWrap>

        <S.XLabels>
          <S.XLabelStart>{monthDay(formatDate, first.date)}</S.XLabelStart>
          <S.XLabelMid>{monthDay(formatDate, windowed[Math.ceil(lastIndex / 2)]!.date)}</S.XLabelMid>
          <S.XLabelEnd $current>
            {last.date.equals(LocalDate.now())
              ? t('stats.exercise_detail.chart.today')
              : monthDay(formatDate, last.date)}
          </S.XLabelEnd>
        </S.XLabels>

        <S.Divider />

        <S.Footer>
          {t('stats.exercise_detail.chart.footer', {
            value: `${formatBare(bestE1rm)} ${unitLabel}`,
          })}
          {strengthRatio ? ` · ${t('stats.exercise_detail.chart.strength_ratio', { ratio: strengthRatio })}` : ''}
        </S.Footer>
      </S.ChartInner>
    </HomeCard>
  );
}

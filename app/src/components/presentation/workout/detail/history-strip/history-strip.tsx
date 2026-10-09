import React, { useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient as SvgLinearGradient, Path, Stop } from 'react-native-svg';
import { useAppTheme } from '@/hooks/useAppTheme';
import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { detailPalette } from '../detail-tokens';
import * as S from './history-strip.styles';

export interface HistoryPoint {
  weight: number;
  date?: string;
}

export interface HistoryStripProps {
  exerciseName: string;
  history: HistoryPoint[];
  unit?: string;
  onPress?: () => void;
}

/**
 * LAST 8 SESSIONS sparkline card (§4.2.5 / P4.5).
 * Renders top-set weight per session with a 2-stop gradient line,
 * dashed average guide (dasharray 2 5), data dots, and PR ringed in gold.
 */
export function HistoryStrip({
  exerciseName,
  history,
  unit = 'kg',
  onPress,
}: HistoryStripProps) {
  const theme = useAppTheme();
  const pal = detailPalette(theme.isDark);
  const [width, setWidth] = useState(320);

  const handleLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) setWidth(w);
  };

  const points = history.slice(-8);
  const hasData = points.length >= 2;

  // Domain math
  const weights = points.map((p) => p.weight);
  const minW = Math.min(...weights);
  const maxW = Math.max(...weights);
  const maxIndex = weights.indexOf(maxW);
  const avgW = weights.reduce((a, b) => a + b, 0) / (weights.length || 1);

  const chartH = 64;
  const padTop = 10;
  const padBottom = 12;
  const plotH = chartH - padTop - padBottom;
  const padX = 16;
  const plotW = Math.max(1, width - padX * 2);

  const range = maxW - minW || 1;
  const getY = (w: number) => padTop + plotH - ((w - minW) / range) * plotH;
  const getX = (idx: number) => padX + (idx / Math.max(1, points.length - 1)) * plotW;

  const coords = points.map((p, i) => ({ x: getX(i), y: getY(p.weight) }));
  const pathD = coords.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');

  const avgY = getY(avgW);

  return (
    <HomeCard radius={24} pad={16}>
      <S.Container onPress={onPress}>
        <S.HeaderRow>
          <S.Title>LAST 8 SESSIONS</S.Title>
          <S.ChevronHint>History ›</S.ChevronHint>
        </S.HeaderRow>

        <S.ChartBox onLayout={handleLayout}>
          {hasData ? (
            <Svg width={width} height={chartH}>
              <Defs>
                <SvgLinearGradient id="historyLineGrad" x1="0" y1="0" x2="1" y2="0">
                  <Stop offset="0" stopColor={pal.detail.history.chartLineFrom} />
                  <Stop offset="1" stopColor={pal.detail.history.chartLineTo} />
                </SvgLinearGradient>
              </Defs>

              {/* Dashed Average Guide Line */}
              <Line
                x1={padX}
                y1={avgY}
                x2={padX + plotW}
                y2={avgY}
                stroke={pal.detail.history.guideDashed}
                strokeWidth={1}
                strokeDasharray="2 5"
              />

              {/* Gradient Sparkline */}
              <Path
                d={pathD}
                fill="none"
                stroke="url(#historyLineGrad)"
                strokeWidth={2.4}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Dots per session */}
              {coords.map((pt, i) => {
                const isBest = i === maxIndex;
                return (
                  <React.Fragment key={i}>
                    {isBest && (
                      <Circle
                        cx={pt.x}
                        cy={pt.y}
                        r={6}
                        fill="none"
                        stroke={pal.detail.history.dotBestRing}
                        strokeWidth={1.8}
                      />
                    )}
                    <Circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isBest ? 3.5 : 2.5}
                      fill={isBest ? pal.detail.history.dotBestRing : pal.detail.history.dotFill}
                    />
                  </React.Fragment>
                );
              })}
            </Svg>
          ) : (
            <S.EmptyBox>
              <S.EmptyText>Log more workouts to see strength trends</S.EmptyText>
            </S.EmptyBox>
          )}
        </S.ChartBox>
      </S.Container>
    </HomeCard>
  );
}

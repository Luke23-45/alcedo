import {
  Defs,
  G,
  Line,
  LinearGradient as SvgLinearGradient,
  Path,
  Rect,
  Stop,
  Svg,
  Text as SvgText,
  Circle,
} from 'react-native-svg';
import { useState } from 'react';
import { useTranslate } from '@tolgee/react';
import { useAppTheme } from '@/hooks/useAppTheme';
import { alpha, fontWeight } from '@/styles/theme';
import { formatGrouped } from '../shared/home-format';
import { HomeCard } from '../shared/home-card';
import { HomeText } from '../shared/home-text';
import type { HomeData } from '../use-home-data';
import * as S from './weekly-volume.styles';

type WeeklyVolumeData = HomeData['weeklyVolume'];

/**
 * Reference chart geometry on a 393pt canvas (dark SVG + light deltas):
 * - 7 columns on a 46pt pitch, 20pt bars, 60pt tall tracks (white@0.055 / #787880@0.13)
 * - fills #4A4A50 / #C7C7CC; today uses gToday (red→amber) with gloss + dot
 * - zero days render a 4pt nub (white@0.10)
 * - AVG dashed line (white@0.18 / #3C3C43@0.22) with 8/700/+0.7 label
 * - day labels 10/600/+0.2, today in primary 700
 *
 * The pitch is derived from the measured row width (bar width and insets
 * stay at reference values) so bars never clip on 320pt or drift on 430pt.
 */
const COLS = 7;
const FIRST_X = 17;
const BAR_W = 20;
const TRACK_H = 60;
const LABEL_H = 22;

function ChevronGlyph({ color }: { color: string }) {
  return (
    <Svg width={10} height={7} viewBox="312 668 12 9">
      <Path
        d="M315 675.5 L318.6 670.8 L322.2 675.5"
        fill="none"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function WeeklyVolume({ data }: { data: WeeklyVolumeData }) {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const dark = theme.isDark;

  const trackFill = dark ? alpha('#FFFFFF', 0.055) : alpha('#787880', 0.13);
  const barFill = dark ? '#4A4A50' : '#C7C7CC';
  const nubFill = dark ? alpha('#FFFFFF', 0.1) : alpha('#787880', 0.2);
  const avgStroke = dark ? alpha('#FFFFFF', 0.18) : alpha('#3C3C43', 0.22);
  const avgLabel = dark ? '#6C6C70' : '#AEAEB2';
  const dayLabel = dark ? '#6C6C70' : '#AEAEB2';
  const todayLabel = dark ? '#FFFFFF' : '#1C1C1E';
  const deltaBase = dark ? '#30D158' : '#34C759';
  const deltaText = dark ? '#30D158' : '#248A3D';
  const todayStops = dark ? ['#FF2D55', '#FF7A3D', '#FFC24A'] : ['#E8003F', '#FF6A2D', '#FFB03A'];
  const dotFill = dark ? '#FFC24A' : '#FFB03A';

  const maxValue = Math.max(1, ...data.days.map((d) => d.valueKg));
  const baseline = TRACK_H;
  const avgY = baseline - (data.averageKg / maxValue) * TRACK_H;
  const negative = (data.deltaPct ?? 0) < 0;
  const deltaLabel = data.deltaPct == null ? null : `${data.deltaPct > 0 ? '+' : ''}${data.deltaPct}%`;
  // Measured row width; falls back to the 393pt reference until layout.
  const [rowW, setRowW] = useState<number | null>(null);
  const chartW = rowW ?? FIRST_X * 2 + (COLS - 1) * 46 + BAR_W;
  const pitch = (chartW - FIRST_X * 2 - BAR_W) / (COLS - 1);
  const chartH = TRACK_H + LABEL_H;

  return (
    <HomeCard style={{ minHeight: 162 }}>
      <S.HeaderRow>
        <HomeText
          weight={fontWeight.semibold}
          tracking={-0.3}
          numberOfLines={1}
          style={{ fontSize: 15.5, lineHeight: 19, color: dark ? '#FFFFFF' : '#1C1C1E', flexShrink: 1 }}
        >
          {t('home.volume.title') /* en: "Weekly Volume" */}
        </HomeText>
        {deltaLabel != null && (
          <S.DeltaChip $color={deltaBase}>
            <ChevronGlyph color={deltaBase} />
            <HomeText
              weight={fontWeight.bold}
              tracking={-0.1}
              style={{ fontSize: 10.5, lineHeight: 13, color: deltaText }}
            >
              {deltaLabel}
            </HomeText>
          </S.DeltaChip>
        )}
      </S.HeaderRow>
      <HomeText
        weight={fontWeight.medium}
        style={{
          fontSize: 11,
          lineHeight: 14,
          color: dark ? '#86868B' : '#6E6E73',
          marginTop: 4,
        }}
      >
        {
          t('home.volume.subtitle', {
            total: formatGrouped(Math.round(data.totalKg)),
            sessions: data.sessionCount,
          }) /* en: "{total} kg lifted · {sessions} sessions" */
        }
      </HomeText>
      {data.hasData ? (
        <S.ChartWrap onLayout={(e) => setRowW(e.nativeEvent.layout.width)}>
          <Svg width={chartW} height={chartH} viewBox={`0 0 ${chartW} ${chartH}`}>
            <Defs>
              <SvgLinearGradient id="wvToday" x1="0" y1="1" x2="0" y2="0">
                <Stop offset="0" stopColor={todayStops[0]} />
                <Stop offset="0.6" stopColor={todayStops[1]} />
                <Stop offset="1" stopColor={todayStops[2]} />
              </SvgLinearGradient>
              <SvgLinearGradient id="wvGloss" x1="0.5" y1="0" x2="0.5" y2="1">
                <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.3} />
                <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
              </SvgLinearGradient>
            </Defs>
            <Line
              x1={FIRST_X - 5}
              y1={avgY}
              x2={chartW - 12}
              y2={avgY}
              stroke={avgStroke}
              strokeWidth={1}
              strokeDasharray="2 5"
              strokeLinecap="round"
            />
            <SvgText
              x={chartW}
              y={avgY - 3}
              textAnchor="end"
              fontSize={8}
              fontWeight="700"
              letterSpacing={0.7}
              fill={avgLabel}
            >
              {t('home.volume.avg') /* en: "AVG" */}
            </SvgText>
            {data.days.map((day, i) => {
              const x = FIRST_X + i * pitch;
              const cx = x + BAR_W / 2;
              const h = day.valueKg <= 0 ? 4 : Math.max(6, (day.valueKg / maxValue) * TRACK_H);
              const y = baseline - h;
              return (
                <G key={`${day.label}-${i}`}>
                  <Rect x={x} y={0} width={BAR_W} height={TRACK_H} rx={8} fill={trackFill} />
                  {day.isToday ? (
                    <Rect x={x} y={y} width={BAR_W} height={h} rx={8} fill="url(#wvToday)" />
                  ) : day.valueKg <= 0 ? (
                    <Rect x={x} y={y} width={BAR_W} height={h} rx={2} fill={nubFill} />
                  ) : (
                    <Rect x={x} y={y} width={BAR_W} height={h} rx={Math.min(8, h / 2)} fill={barFill} />
                  )}
                  {day.isToday && (
                    <>
                      <Rect x={x} y={y} width={BAR_W} height={Math.min(26, h)} rx={8} fill="url(#wvGloss)" />
                      <Circle cx={cx} cy={y - 7} r={2.6} fill={dotFill} />
                    </>
                  )}
                  <SvgText
                    x={cx}
                    y={baseline + 20}
                    textAnchor="middle"
                    fontSize={10}
                    fontWeight={day.isToday ? '700' : '600'}
                    letterSpacing={0.2}
                    fill={day.isToday ? todayLabel : dayLabel}
                  >
                    {day.label}
                  </SvgText>
                </G>
              );
            })}
          </Svg>
        </S.ChartWrap>
      ) : (
        <S.EmptyWrap>
          <HomeText variant="footnote" tone="secondary">
            {t('home.volume.empty') /* en: "Log a workout to see your weekly volume." */}
          </HomeText>
        </S.EmptyWrap>
      )}
    </HomeCard>
  );
}

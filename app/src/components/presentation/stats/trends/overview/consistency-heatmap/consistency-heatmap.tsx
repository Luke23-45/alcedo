import { LocalDate } from '@js-joda/core';
import { useState } from 'react';
import { useTranslate } from '@tolgee/react';
import { fontWeight } from '@/styles/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { HomeText } from '@/components/presentation/home/shared/home-text';
import { SampleBadge } from '@/components/presentation/home/shared/sample-badge';
import { TrendsSectionHeader } from '../shared/trends-section-header';
import { HeatCell } from '../trends-overview-data';
import { trendsPalette } from '../trends-colors';
import {
  CardInner,
  Cell,
  DayLabels,
  DaySlot,
  GridWrap,
  LegendNote,
  LegendRow,
  LegendSwatches,
  TodayRing,
  TitleRow,
  WeekColumn,
  WeeksRow,
  WindowPill,
} from './consistency-heatmap.styles';

/** Reference geometry until the grid measures itself: 17pt cells, 5pt gaps. */
const CELL_FALLBACK = 17;
const GAP = 5;

/**
 * 13-week training heatmap, Monday-first, ending today. L0 is rest;
 * L1–L4 are quartiles of the user's own non-zero daily volumes in the
 * window. Future cells are dimmed; today gets the hairline ring.
 */
export function ConsistencyHeatmap({
  heatmap,
  heatTrained,
  heatElapsed,
  heatPct,
  heatMonthLabel,
  sampled,
}: {
  heatmap: HeatCell[][];
  heatTrained: number;
  heatElapsed: number;
  heatPct: number;
  heatMonthLabel: string;
  sampled: boolean;
}) {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const dark = theme.isDark;
  const palette = trendsPalette(dark);

  const today = LocalDate.now().toString();
  let todayCol = -1;
  let todayRow = -1;
  heatmap.forEach((week, col) =>
    week.forEach((cell, row) => {
      if (cell.date.toString() === today) {
        todayCol = col;
        todayRow = row;
      }
    }),
  );

  const cellColor = (cell: HeatCell): string => {
    if (cell.future) return dark ? 'rgba(255,255,255,0.028)' : 'rgba(120,120,128,0.06)';
    if (cell.level === 0) return palette.heatRest;
    const base = palette.heatBase;
    const opacity = palette.heatOpacities[cell.level];
    // heatBase is a hex literal in both modes; apply the level opacity.
    const hex = base.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${opacity})`;
  };

  // 13 columns + 12 gaps must fit the measured row: cells shrink/grow from
  // the 17pt reference instead of overflowing on narrow screens.
  const [gridW, setGridW] = useState(0);
  const cell = gridW > 0 ? (gridW - GAP * 12) / 13 : CELL_FALLBACK;
  const pitch = cell + GAP;
  const radius = Math.max(2.5, (cell * 5) / CELL_FALLBACK);
  const ring = cell + 1.8;

  const dayNames = [t('trends.consistency.day_mon'), t('trends.consistency.day_wed'), t('trends.consistency.day_fri')];

  return (
    <>
      <TrendsSectionHeader
        label={t('trends.consistency.title')}
        badge={sampled ? <SampleBadge compact /> : undefined}
      />
      <HomeCard hero pad={0}>
        <CardInner>
          <TitleRow>
            <HomeText
              weight={fontWeight.semibold}
              tracking={-0.3}
              style={{ fontSize: 15.5, lineHeight: 20, color: palette.primary }}
            >
              {t('trends.consistency.card_title')}
            </HomeText>
            <WindowPill $bg={palette.segmentedTrack}>
              <HomeText
                weight={fontWeight.bold}
                micro
                tracking={0.8}
                style={{ fontSize: 8.5, lineHeight: 11, color: palette.dim }}
              >
                {heatMonthLabel}
              </HomeText>
            </WindowPill>
          </TitleRow>
          <HomeText weight={fontWeight.medium} style={{ fontSize: 11, lineHeight: 14, color: palette.secondary }}>
            {t('trends.consistency.subtitle', {
              trained: heatTrained,
              elapsed: heatElapsed,
              pct: heatPct,
            })}
          </HomeText>

          <GridWrap>
            <DayLabels>
              {[0, 1, 2, 3, 4, 5, 6].map((row) => (
                <DaySlot key={row} style={{ height: pitch }}>
                  {row % 2 === 0 && row < 6 ? (
                    <HomeText
                      weight={fontWeight.bold}
                      micro
                      tracking={0.6}
                      style={{
                        fontSize: 8.5,
                        lineHeight: 11,
                        color: palette.tertiary,
                      }}
                    >
                      {dayNames[row / 2]}
                    </HomeText>
                  ) : null}
                </DaySlot>
              ))}
            </DayLabels>
            <WeeksRow onLayout={(e) => setGridW(e.nativeEvent.layout.width)}>
              {heatmap.map((week, col) => (
                <WeekColumn key={col}>
                  {week.map((c, row) => (
                    <Cell key={row} $size={cell} $radius={radius} $bg={cellColor(c)} />
                  ))}
                </WeekColumn>
              ))}
              {todayCol >= 0 && todayRow >= 0 ? (
                <TodayRing
                  $left={todayCol * pitch - (ring - cell) / 2}
                  $top={todayRow * pitch - (ring - cell) / 2}
                  $size={ring}
                  $dark={dark}
                />
              ) : null}
            </WeeksRow>
          </GridWrap>

          <LegendRow>
            <HomeText
              weight={fontWeight.bold}
              micro
              tracking={0.8}
              style={{ fontSize: 8.5, lineHeight: 11, color: palette.tertiary }}
            >
              {t('trends.consistency.less')}
            </HomeText>
            <LegendSwatches>
              {[0, 1, 2, 3, 4].map((level) => (
                <Cell
                  key={level}
                  $size={9}
                  $radius={2.5}
                  $bg={
                    level === 0
                      ? palette.heatRest
                      : (() => {
                          const base = palette.heatBase.replace('#', '');
                          const r = parseInt(base.slice(0, 2), 16);
                          const g = parseInt(base.slice(2, 4), 16);
                          const b = parseInt(base.slice(4, 6), 16);
                          return `rgba(${r},${g},${b},${palette.heatOpacities[level]})`;
                        })()
                  }
                />
              ))}
            </LegendSwatches>
            <HomeText
              weight={fontWeight.bold}
              micro
              tracking={0.8}
              style={{ fontSize: 8.5, lineHeight: 11, color: palette.tertiary }}
            >
              {t('trends.consistency.more')}
            </HomeText>
          </LegendRow>
          <LegendNote>
            <HomeText
              weight={fontWeight.bold}
              micro
              tracking={0.8}
              style={{ fontSize: 8.5, lineHeight: 11, color: palette.tertiary }}
            >
              {t('feed.home.consistency.session_note') /* en: "Sessions only" */}
            </HomeText>
          </LegendNote>
        </CardInner>
      </HomeCard>
    </>
  );
}

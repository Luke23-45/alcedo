import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { HomeGradient } from '@/components/presentation/home/shared/home-gradient';
import { HomeText } from '@/components/presentation/home/shared/home-text';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useFormatDate } from '@/hooks/useFormatDate';
import { fontWeight } from '@/styles/theme';
import { getDateOnDay } from '@/utils/format-date';
import { DayOfWeek, LocalDate, YearMonth } from '@js-joda/core';
import { useHistoryTranslate } from '../history-i18n';
import { Circle, Path, Svg } from 'react-native-svg';
import { HISTORY_DESIGN, calendarGridRange, historyPalette, loadLevelForVolume } from '../history-design';
import {
  CalendarBody,
  CalendarHeader,
  ChevronTarget,
  DayCell,
  GridWrap,
  LegendCircles,
  LegendRow,
  MonthLabelWrap,
  RingArt,
  SelectedDisc,
  TodayPill,
  WeekdayCell,
  WeekdayRow,
  WeekRow,
} from './month-calendar.styles';

const { dayRadius, selectedOuterRadius, dayRingCircumference, selectedRingCircumference, levelFraction } =
  HISTORY_DESIGN;

function Chevron({ direction, disabled }: { direction: 'left' | 'right'; disabled?: boolean }) {
  const theme = useAppTheme();
  // Spec: next chevron dims to #3A3A3C at the current month; prev stays #8E8E93.
  const color = disabled ? '#3A3A3C' : theme.isDark ? '#8E8E93' : '#8E8E93';
  return (
    <Svg width={12} height={16} viewBox="-6 -8 12 16">
      <Path
        d={direction === 'left' ? 'M2 -5 L-2.6 0 L2 5' : 'M-2 -5 L2.6 0 L-2 5'}
        fill="none"
        stroke={color}
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function LoadRing({
  radius,
  circumference,
  fraction,
  arcOpacity,
  isDark,
}: {
  radius: number;
  circumference: number;
  fraction: number;
  arcOpacity: number;
  isDark: boolean;
}) {
  const palette = historyPalette(isDark);
  const size = radius * 2 + 6;
  const center = size / 2;
  const dash = fraction * circumference;
  const arcProps = fraction >= 1 ? {} : { strokeDasharray: `${dash.toFixed(2)} ${circumference.toFixed(2)}` };
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={palette.trackRing}
        strokeWidth={radius === dayRadius ? 2.6 : 2.4}
      />
      {fraction > 0 && (
        <Circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={palette.loadArc}
          strokeOpacity={arcOpacity}
          strokeWidth={radius === dayRadius ? 2.6 : 2.4}
          strokeLinecap="round"
          rotation={-90}
          originX={center}
          originY={center}
          {...arcProps}
        />
      )}
    </Svg>
  );
}

export function MonthCalendar({
  yearMonth,
  selectedDate,
  today,
  dayVolumes,
  onMonthChange,
  onDateSelect,
}: {
  yearMonth: YearMonth;
  selectedDate: LocalDate | undefined;
  today: LocalDate;
  /** ISO date → total volume kg that day, including the out-of-month spillover cells. */
  dayVolumes: Map<string, number>;
  onMonthChange: (ym: YearMonth) => void;
  onDateSelect: (date: LocalDate) => void;
}) {
  const theme = useAppTheme();
  const t = useHistoryTranslate();
  const formatDate = useFormatDate();
  const palette = historyPalette(theme.isDark);

  const isCurrentMonth = yearMonth.equals(YearMonth.from(today));
  const firstOfMonth = yearMonth.atDay(1);
  const { start: gridStart } = calendarGridRange(yearMonth);

  const weekdayNames = Array.from({ length: 7 }, (_, i) =>
    formatDate(getDateOnDay(DayOfWeek.of((i % 7) + 1)), { weekday: 'narrow' }),
  );

  const weeks = Array.from({ length: 6 }, (_, w) => Array.from({ length: 7 }, (_, d) => gridStart.plusDays(w * 7 + d)));

  const numeralColor = (date: LocalDate, level: number, selected: boolean): string => {
    if (selected) {
      return '#FFFFFF';
    }
    const inMonth = date.month().equals(yearMonth.month());
    const isFuture = date.isAfter(today);
    if (isFuture) {
      return inMonth ? palette.futureNumeral : palette.futureOutOfMonthNumeral;
    }
    if (!inMonth) {
      // Out-of-month days keep their data; only the numeral dims.
      return level > 0 ? palette.outOfMonthNumeral : palette.outOfMonthRestNumeral;
    }
    return level > 0 ? theme.color.content.primary : '#98989F';
  };

  return (
    <>
      <HomeCard radius={30} pad={0}>
        <CalendarBody>
          <CalendarHeader>
            <ChevronTarget
              onPress={() => onMonthChange(yearMonth.minusMonths(1))}
              accessibilityRole="button"
              accessibilityLabel={t('history.v2.calendar.previous_month.accessibility')}
              testID="calendar-nav-previous-month"
            >
              <Chevron direction="left" />
            </ChevronTarget>
            <MonthLabelWrap>
              <HomeText
                weight={fontWeight.semibold}
                tracking={-0.35}
                style={{
                  fontSize: 16,
                  lineHeight: 21,
                  color: theme.color.content.primary,
                }}
              >
                {formatDate(firstOfMonth, { month: 'long', year: 'numeric' })}
              </HomeText>
              {!isCurrentMonth && (
                <TodayPill
                  onPress={() => {
                    onMonthChange(YearMonth.now());
                    onDateSelect(today);
                  }}
                  accessibilityRole="button"
                  testID="calendar-today-pill"
                >
                  <HomeText
                    weight={fontWeight.semibold}
                    style={{
                      fontSize: 12,
                      lineHeight: 15,
                      color: theme.home.seeAll,
                    }}
                  >
                    {t('history.v2.calendar.today')}
                  </HomeText>
                </TodayPill>
              )}
            </MonthLabelWrap>
            <ChevronTarget
              onPress={() => onMonthChange(yearMonth.plusMonths(1))}
              disabled={isCurrentMonth}
              accessibilityRole="button"
              accessibilityLabel={t('history.v2.calendar.next_month.accessibility')}
              testID="calendar-nav-next-month"
            >
              <Chevron direction="right" disabled={isCurrentMonth} />
            </ChevronTarget>
          </CalendarHeader>

          <GridWrap>
            <WeekdayRow>
              {weekdayNames.map((name, i) => (
                <WeekdayCell key={i}>
                  <HomeText
                    weight={fontWeight.bold}
                    tracking={0.8}
                    style={{
                      fontSize: 9,
                      lineHeight: 12,
                      color: i >= 5 ? palette.weekendLabel : '#6C6C70',
                    }}
                  >
                    {name}
                  </HomeText>
                </WeekdayCell>
              ))}
            </WeekdayRow>

            {weeks.map((week, w) => (
              <WeekRow key={w}>
                {week.map((date) => {
                  const volume = dayVolumes.get(date.toString()) ?? 0;
                  const level = loadLevelForVolume(volume);
                  const selected = selectedDate?.isEqual(date) ?? false;
                  const isFuture = date.isAfter(today);
                  const showRings = selected || !isFuture;
                  const fraction = levelFraction[level];
                  return (
                    <DayCell
                      key={date.toString()}
                      onPress={() => onDateSelect(date)}
                      accessibilityRole="button"
                      accessibilityLabel={formatDate(date, {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                      testID={`calendar-day-${date.toString()}`}
                    >
                      {showRings &&
                        (selected ? (
                          <RingArt>
                            <LoadRing
                              radius={selectedOuterRadius}
                              circumference={selectedRingCircumference}
                              fraction={fraction}
                              arcOpacity={0.8}
                              isDark={theme.isDark}
                            />
                          </RingArt>
                        ) : (
                          <RingArt>
                            <LoadRing
                              radius={dayRadius}
                              circumference={dayRingCircumference}
                              fraction={fraction}
                              arcOpacity={level > 0 ? (palette.loadArcOpacity[level - 1] ?? 0) : 0}
                              isDark={theme.isDark}
                            />
                          </RingArt>
                        ))}
                      {selected && (
                        <RingArt>
                          <SelectedDisc>
                            <HomeGradient
                              variant="brand"
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                              }}
                            />
                          </SelectedDisc>
                        </RingArt>
                      )}
                      <HomeText
                        weight={selected ? fontWeight.bold : fontWeight.semibold}
                        style={{
                          fontSize: selected ? 13.5 : 13,
                          lineHeight: 16,
                          color: numeralColor(date, level, selected),
                          marginTop: 1,
                        }}
                      >
                        {date.dayOfMonth()}
                      </HomeText>
                    </DayCell>
                  );
                })}
              </WeekRow>
            ))}
          </GridWrap>
        </CalendarBody>
      </HomeCard>

      <LegendRow>
        <HomeText weight={fontWeight.bold} tracking={0.8} style={{ fontSize: 8.5, lineHeight: 11, color: '#6C6C70' }}>
          {t('history.v2.legend.less')}
        </HomeText>
        <LegendCircles>
          <Svg width={14} height={14} viewBox="0 0 14 14">
            <Circle cx={7} cy={7} r={5} fill="none" stroke={palette.legendTrack} strokeWidth={2.4} />
          </Svg>
          {[1, 2, 3, 4].map((level) => (
            <Svg key={level} width={14} height={14} viewBox="0 0 14 14" style={{ marginLeft: 8 }}>
              <Circle
                cx={7}
                cy={7}
                r={5}
                fill="none"
                stroke={palette.loadArc}
                strokeOpacity={palette.loadArcOpacity[level - 1]}
                strokeWidth={2}
              />
            </Svg>
          ))}
        </LegendCircles>
        <HomeText weight={fontWeight.bold} tracking={0.8} style={{ fontSize: 8.5, lineHeight: 11, color: '#6C6C70' }}>
          {t('history.v2.legend.more')}
        </HomeText>
      </LegendRow>
    </>
  );
}

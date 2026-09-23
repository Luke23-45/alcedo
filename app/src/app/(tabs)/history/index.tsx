import { DaySectionLabel, DaySummary } from '@/components/presentation/history/day-summary/day-summary';
import {
  EmptyMonth,
  EmptySelectedDay,
  NoFilterResults,
} from '@/components/presentation/history/empty-states/empty-states';
import {
  EMPTY_FILTERS,
  isFilterActive,
  sessionMatchesFilters,
  type HistoryFilters,
} from '@/components/presentation/history/filter-sheet/filter-logic';
import { FilterSheet } from '@/components/presentation/history/filter-sheet/filter-sheet';
import { HistoryHeader } from '@/components/presentation/history/history-header/history-header';
import { calendarGridRange } from '@/components/presentation/history/history-design';
import { sessionVolumeKg } from '@/components/presentation/history/history-stats';
import { MonthCalendar } from '@/components/presentation/history/month-calendar/month-calendar';
import { MonthSummary } from '@/components/presentation/history/month-summary/month-summary';
import { WeekList } from '@/components/presentation/history/week-list/week-list';
import { HomeGradient } from '@/components/presentation/home/shared/home-gradient';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useFormatDate } from '@/hooks/useFormatDate';
import { useToday } from '@/hooks/useToday';
import { Session } from '@/models/session-models';
import { useAppSelector, useAppSelectorWhenFocused, useAppSelectorWhenFocusedWithArg } from '@/store';
import {
  putStoredSession,
  selectHistoryPersonalRecords,
  selectSessions,
  selectSessionsBy,
  selectSessionsInMonth,
} from '@/store/stored-sessions';
import { LocalDate, YearMonth } from '@js-joda/core';
import { Stack, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { Defs, RadialGradient, Rect, Stop, Svg } from 'react-native-svg';
import { CalendarSection, EmptyDayWrap, Page, ScreenRoot, Section } from '@/components/presentation/history/history-screen.styles';

/** Ambient color fields behind the screen gradient — amber upper right, green lower left. */
function Aurora() {
  const { isDark } = useAppTheme();
  const dim = isDark ? 1 : 0.6;
  const amberOpacity = 0.1 * dim;
  const greenOpacity = 0.07 * dim;
  return (
    <Svg
      style={StyleSheet.absoluteFill}
      width="100%"
      height="100%"
      viewBox="0 0 393 852"
      preserveAspectRatio="xMidYMid slice"
      pointerEvents="none"
    >
      <Defs>
        <RadialGradient id="history-aurora-amber" cx="86%" cy="6%" r="42%">
          <Stop offset="0" stopColor="#FF9F0A" stopOpacity={amberOpacity} />
          <Stop offset="1" stopColor="#FF9F0A" stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="history-aurora-green" cx="8%" cy="92%" r="46%">
          <Stop offset="0" stopColor="#30D158" stopOpacity={greenOpacity} />
          <Stop offset="1" stopColor="#30D158" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x={0} y={0} width={393} height={852} fill="url(#history-aurora-amber)" />
      <Rect x={0} y={0} width={393} height={852} fill="url(#history-aurora-green)" />
    </Svg>
  );
}

export default function History() {
  const formatDate = useFormatDate();
  const { push, back, canGoBack } = useRouter();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const today = useToday();

  const [currentYearMonth, setCurrentYearMonth] = useState(() => YearMonth.from(today));
  const [selectedDate, setSelectedDate] = useState<LocalDate>(today);
  const [filters, setFilters] = useState<HistoryFilters>(EMPTY_FILTERS);
  const [filterVisible, setFilterVisible] = useState(false);

  const latesBodyweight = useAppSelector((x) =>
    x.program.upcomingSessions.map((x) => x.at(0)?.bodyweight).unwrapOr(undefined),
  );

  // These sweep history while the screen stays mounted under pushed routes, so
  // they must not recompute while a session is edited on top of it.
  const allSessions = useAppSelectorWhenFocused(selectSessions);
  const sessionsInMonth = useAppSelectorWhenFocusedWithArg(selectSessionsInMonth, currentYearMonth);
  const gridRange = useMemo(() => calendarGridRange(currentYearMonth), [currentYearMonth]);
  const sessionsInGrid = useAppSelectorWhenFocused((s) => selectSessionsBy(s, gridRange.start, gridRange.end));
  const sessionsOnSelectedDate = useAppSelectorWhenFocused((s) =>
    selectedDate ? selectSessionsBy(s, selectedDate, selectedDate) : undefined,
  );
  const prBySessionId = useAppSelectorWhenFocused(selectHistoryPersonalRecords);

  const filterActive = isFilterActive(filters);
  const matchesFilters = (session: Session): boolean =>
    !filterActive ||
    sessionMatchesFilters(
      session.blueprint.name,
      session.recordedExercises.map((e) => e.blueprint.name),
      (prBySessionId.get(session.id) ?? []).length > 0,
      filters,
    );

  const gridSessions = filterActive ? sessionsInGrid.filter(matchesFilters) : sessionsInGrid;
  const monthSessions = filterActive ? sessionsInMonth.filter(matchesFilters) : sessionsInMonth;
  // Copy before sorting: the selector results are memoized and must not be mutated.
  const dayBase = filterActive ? (sessionsOnSelectedDate ?? []).filter(matchesFilters) : (sessionsOnSelectedDate ?? []);
  const daySessions = [...dayBase].sort((a, b) => b.date.compareTo(a.date));

  // Calendar rings: day → summed volume, covering the out-of-month spillover.
  const dayVolumes = new Map<string, number>();
  for (const session of gridSessions) {
    const key = session.date.toString();
    dayVolumes.set(key, (dayVolumes.get(key) ?? 0) + sessionVolumeKg(session));
  }

  // "Earlier this week": Monday–Sunday of the selected day, excluding the day itself.
  const weekStart = selectedDate.minusDays(selectedDate.dayOfWeek().ordinal() % 7);
  const weekEnd = weekStart.plusDays(6);
  const weekSessions = [...gridSessions]
    .filter((s) => !s.date.isEqual(selectedDate) && !s.date.isBefore(weekStart) && !s.date.isAfter(weekEnd))
    .sort((a, b) => b.date.compareTo(a.date));
  const rangeLabel = weekStart.month().equals(weekEnd.month())
    ? `${formatDate(weekStart, { month: 'short', day: 'numeric' })} – ${formatDate(weekEnd, { day: 'numeric' })}`
    : `${formatDate(weekStart, { month: 'short', day: 'numeric' })} – ${formatDate(weekEnd, { month: 'short', day: 'numeric' })}`;

  // Distinct real workout names, newest first, for the filter chips.
  const latestByName = new Map<string, LocalDate>();
  for (const session of allSessions) {
    const prev = latestByName.get(session.blueprint.name);
    if (!prev || session.date.isAfter(prev)) {
      latestByName.set(session.blueprint.name, session.date);
    }
  }
  const workoutTypes = [...latestByName.entries()].sort((a, b) => b[1].compareTo(a[1])).map(([name]) => name);

  // Header: real lifetime total and the earliest logged month.
  let earliest: LocalDate | undefined;
  for (const session of allSessions) {
    if (!earliest || session.date.isBefore(earliest)) {
      earliest = session.date;
    }
  }

  // Empty selected day keeps the real add-workout path: a freeform session at
  // that date, opened in the editor.
  const createSessionAtDate = (date: LocalDate) => {
    const newSession = Session.freeformSession(date, latesBodyweight);
    dispatch(putStoredSession(newSession));
    push(`/history/edit?sessionId=${encodeURIComponent(newSession.id)}`);
  };

  const onSessionPress = (session: Session) => {
    push(`/history/post-workout?sessionId=${encodeURIComponent(session.id)}&source=history`);
  };

  const nothingMatches = filterActive && monthSessions.length === 0;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenRoot>
        <HomeGradient variant="screen" style={StyleSheet.absoluteFill} />
        <Aurora />
        <ScrollView
          contentContainerStyle={{
            paddingTop: insets.top,
            paddingBottom: insets.bottom + 32,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Page>
            <HistoryHeader
              totalSessions={allSessions.length}
              earliestMonth={earliest ? formatDate(earliest, { month: 'long', year: 'numeric' }) : undefined}
              filterActive={filterActive}
              canGoBack={canGoBack()}
              onBack={back}
              onFilter={() => setFilterVisible(true)}
            />
            <CalendarSection>
              <MonthCalendar
                yearMonth={currentYearMonth}
                selectedDate={selectedDate}
                today={today}
                dayVolumes={dayVolumes}
                onMonthChange={setCurrentYearMonth}
                onDateSelect={setSelectedDate}
              />
            </CalendarSection>
            {nothingMatches ? (
              <Section>
                <NoFilterResults onClear={() => setFilters(EMPTY_FILTERS)} />
              </Section>
            ) : (
              <>
                <Section>
                  {daySessions.length > 0 ? (
                    <DaySummary
                      date={selectedDate}
                      sessions={daySessions}
                      prBySessionId={prBySessionId}
                      onSessionPress={onSessionPress}
                    />
                  ) : (
                    <EmptyDayWrap>
                      <DaySectionLabel date={selectedDate} />
                      <EmptySelectedDay date={selectedDate} onAdd={() => createSessionAtDate(selectedDate)} />
                    </EmptyDayWrap>
                  )}
                </Section>
                {weekSessions.length > 0 && (
                  <Section>
                    <WeekList
                      sessions={weekSessions}
                      rangeLabel={rangeLabel}
                      prBySessionId={prBySessionId}
                      onSessionPress={onSessionPress}
                    />
                  </Section>
                )}
                <Section>
                  {monthSessions.length > 0 || filterActive ? (
                    <MonthSummary yearMonth={currentYearMonth} today={today} sessions={monthSessions} />
                  ) : (
                    <EmptyMonth onStartWorkout={() => createSessionAtDate(today)} />
                  )}
                </Section>
              </>
            )}
          </Page>
        </ScrollView>
        <FilterSheet
          visible={filterVisible}
          onClose={() => setFilterVisible(false)}
          filters={filters}
          onFiltersChange={setFilters}
          workoutTypes={workoutTypes}
          matchCount={monthSessions.length}
        />
      </ScreenRoot>
    </>
  );
}

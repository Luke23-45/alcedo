import FullHeightScrollView from '@/components/layout/full-height-scroll-view';
import { Remote, RemoteDefaultError } from '@/components/presentation/foundation/remote';
import {
  HomeAuras,
  HomeScreenBackground,
} from '@/components/presentation/home/shared/home-auras';
import { ConsistencyHeatmap } from '@/components/presentation/stats/trends/overview/consistency-heatmap/consistency-heatmap';
import { TrendRange } from '@/components/presentation/stats/trends/overview/constants';
import { ExportHealthData } from '@/components/presentation/stats/trends/overview/export-health-data/export-health-data';
import { TrendsHeader } from '@/components/presentation/stats/trends/overview/header/trends-header';
import {
  HeroChart,
  HeroMetricKey,
} from '@/components/presentation/stats/trends/overview/hero-chart/hero-chart';
import { MetricTiles } from '@/components/presentation/stats/trends/overview/metric-tiles/metric-tiles';
import { MuscleGroupLoad } from '@/components/presentation/stats/trends/overview/muscle-group-load/muscle-group-load';
import { PersonalBests } from '@/components/presentation/stats/trends/overview/personal-bests/personal-bests';
import { PrTimeline } from '@/components/presentation/stats/trends/overview/pr-timeline/pr-timeline';
import { RangeSelector } from '@/components/presentation/stats/trends/overview/range-selector/range-selector';
import { StreaksTotals } from '@/components/presentation/stats/trends/overview/streaks-totals/streaks-totals';
import { TrendInsights } from '@/components/presentation/stats/trends/overview/trend-insights/trend-insights';
import { TrendsEmpty } from '@/components/presentation/stats/trends/overview/trends-empty/trends-empty';
import {
  HeaderGroup,
  SectionGap12,
  SectionGap17,
} from '@/components/presentation/stats/trends/overview/trends-overview-screen.styles';
import { useTrendsOverviewData } from '@/components/presentation/stats/trends/overview/trends-overview-data';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAppSelector } from '@/store';
import {
  fetchOverallStats,
  GranularStatisticView,
  selectOverallView,
  setOverallViewTime,
} from '@/store/stats';
import { NO_SESSIONS_ERROR } from '@/store/stats/effects';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

/**
 * Trends Overview (Phase 3, Screen 1). All sections read the real stores:
 * session history, personal records, and the all-time stats view. The stats
 * query is forced to the all-time window on focus — bodyweight, streaks, and
 * the ALL range all need full history, which the old 90-day window cut off.
 * First run (no sessions yet) renders the TrendsEmpty state, not error chrome.
 */
export default function TrendsOverviewPage() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { push } = useRouter();
  // The reference design opens on 7D; keep the initial state identical.
  const [range, setRange] = useState<TrendRange>('7D');
  const [activeMetric, setActiveMetric] = useState<HeroMetricKey>('volume');

  useFocusEffect(() => {
    dispatch(setOverallViewTime('all-time'));
    dispatch(fetchOverallStats());
  });

  const stats = useAppSelector(selectOverallView);
  const retryStats = () => dispatch(fetchOverallStats());

  return (
    <FullHeightScrollView
      screenBackground={<HomeScreenBackground />}
      scrollStyle={{
        paddingHorizontal: theme.layout.screenPadding,
        paddingTop: insets.top + theme.space.sm,
      }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: theme.space.xxxl }}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <HomeAuras />
      <Remote
        value={stats}
        retry={retryStats}
        error={(err) =>
          // First run (no recorded sessions) is an empty state, not a failure.
          err === NO_SESSIONS_ERROR ? (
            <TrendsEmpty onStartWorkout={() => push('/(tabs)/(session)')} />
          ) : (
            <RemoteDefaultError value={err} retry={retryStats} />
          )
        }
        success={(stats) => (
          <Overview
            stats={stats}
            range={range}
            onRangeChange={setRange}
            activeMetric={activeMetric}
            onMetricChange={setActiveMetric}
          />
        )}
      />
    </FullHeightScrollView>
  );
}

function Overview({
  stats,
  range,
  onRangeChange,
  activeMetric,
  onMetricChange,
}: {
  stats: GranularStatisticView;
  range: TrendRange;
  onRangeChange: (range: TrendRange) => void;
  activeMetric: HeroMetricKey;
  onMetricChange: (metric: HeroMetricKey) => void;
}) {
  const data = useTrendsOverviewData(stats, range);
  // Every section below is real store data; nothing here is sampled.
  const sampled = false;

  return (
    <View>
      <HeaderGroup>
        <TrendsHeader subtitle={data.subtitle} />
        <RangeSelector range={range} onChange={onRangeChange} />
      </HeaderGroup>
      <SectionGap12>
        <HeroChart
          active={activeMetric}
          onChange={onMetricChange}
          volume={data.volume}
          e1rm={data.e1rm}
          bodyweight={data.bodyweight}
          sampled={sampled}
        />
      </SectionGap12>
      <SectionGap12>
        <MetricTiles tiles={data.tiles} onSelect={onMetricChange} />
      </SectionGap12>
      <SectionGap17>
        <PersonalBests rows={data.personalBests} sampled={sampled} />
      </SectionGap17>
      <SectionGap17>
        <MuscleGroupLoad
          rows={data.muscleRows}
          callout={data.muscleCallout}
          sampled={sampled}
        />
      </SectionGap17>
      <SectionGap17>
        <ConsistencyHeatmap
          heatmap={data.heatmap}
          heatTrained={data.heatTrained}
          heatElapsed={data.heatElapsed}
          heatPct={data.heatPct}
          heatMonthLabel={data.heatMonthLabel}
          sampled={sampled}
        />
      </SectionGap17>
      <SectionGap17>
        <StreaksTotals
          currentStreak={data.currentStreak}
          longestStreakLabel={data.longestStreakLabel}
          totalSessions={data.totalSessions}
          sessionsThisYear={data.sessionsThisYear}
          avgPerWeek={data.avgPerWeek}
          trainedToday={data.trainedToday}
          sampled={sampled}
        />
      </SectionGap17>
      <SectionGap17>
        <PrTimeline
          items={data.prTimeline}
          newCount={data.prNewCount}
          sampled={sampled}
        />
      </SectionGap17>
      <SectionGap12>
        <TrendInsights insights={data.insights} sampled={sampled} />
      </SectionGap12>
      <SectionGap12>
        <ExportHealthData />
      </SectionGap12>
    </View>
  );
}

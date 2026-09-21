import { Session } from '@/models/session-models';
import { useAppSelector, useAppSelectorWhenFocused } from '@/store';
import { fetchUpcomingSessions } from '@/store/program';
import { publishUnpublishedSessions } from '@/store/feed';
import { executeRemoteBackup } from '@/store/settings';
import { selectActiveSession } from '@/store/stored-sessions';
import FullHeightScrollView from '@/components/layout/full-height-scroll-view';
import Menu from '@/components/presentation/foundation/menu';
import Icon from '@/components/presentation/foundation/icon';
import { Remote } from '@/components/presentation/foundation/remote';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useStartWorkoutWithConfirmation } from '@/hooks/useStartWorkoutWithConfirmation';
import { usePlanNavigation } from '@/components/smart/plan-menu';
import { WelcomeWizard } from '@/components/smart/welcome-wizard';
import { WhatsNewBanner } from '@/components/smart/whats-new-banner';
import { useHomeData } from '@/components/presentation/home/use-home-data';
import { HomeAuras, HomeScreenBackground } from '@/components/presentation/home/shared/home-auras';
import { HomeDuoCell, HomeDuoRow } from '@/components/presentation/home/shared/home-duo-row';
import { GreetingHeader } from '@/components/presentation/home/greeting-header/greeting-header';
import { ActivityRings } from '@/components/presentation/home/activity-rings/activity-rings';
import { StatTiles } from '@/components/presentation/home/stat-tiles/stat-tiles';
import { TodaySession } from '@/components/presentation/home/today-session/today-session';
import { WeeklyVolume } from '@/components/presentation/home/weekly-volume/weekly-volume';
import { HrZones } from '@/components/presentation/home/hr-zones/hr-zones';
import { ProgramsSection } from '@/components/presentation/home/programs/programs';
import { RecentActivitySection } from '@/components/presentation/home/recent-activity/recent-activity';
import { AchievementsSection } from '@/components/presentation/home/achievements/achievements';
import { HydrationSection } from '@/components/presentation/home/hydration/hydration';
import { MacrosSection } from '@/components/presentation/home/macros/macros';
import { PersonalRecordsSection } from '@/components/presentation/home/personal-records/personal-records';
import { WeeklyChallengeSection } from '@/components/presentation/home/weekly-challenge/weekly-challenge';
import { CoachCard } from '@/components/presentation/home/coach-card/coach-card';
import { LocalDate } from '@js-joda/core';
import { useTranslate } from '@tolgee/react';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

export default function Index() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const upcomingSessions = useAppSelector((s) => s.program.upcomingSessions);
  const { start, confirmationDialog } = useStartWorkoutWithConfirmation();

  useFocusEffect(() => {
    dispatch(fetchUpcomingSessions());
    dispatch(publishUnpublishedSessions());
    // Automatic invocation: the effect runs it only when the backup mode is
    // Automatic (Off and Manual never auto-upload).
    dispatch(executeRemoteBackup({ reason: 'automatic' }));
  });

  return (
    <FullHeightScrollView
      screenBackground={<HomeScreenBackground />}
      scrollStyle={{ paddingHorizontal: theme.layout.screenPadding, paddingTop: insets.top + theme.space.sm }}
      contentContainerStyle={{ flexGrow: 1, gap: theme.space.md, paddingBottom: theme.space.xxl }}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <HomeAuras />
      <Remote value={upcomingSessions} success={(upcoming) => <HomeScreen upcoming={upcoming} onStart={start} />} />
      {confirmationDialog}
    </FullHeightScrollView>
  );
}

function HomeScreen({ upcoming, onStart }: { upcoming: readonly Session[]; onStart: (session: Session) => void }) {
  const theme = useAppTheme();
  const { t } = useTranslate();
  const { push } = useRouter();
  const data = useHomeData(upcoming);
  const activeSession = useAppSelectorWhenFocused(selectActiveSession);
  const { choosePlan, editWorkouts } = usePlanNavigation();

  const currentBodyweight = upcoming.at(0)?.bodyweight;
  const createFreeformSession = () => {
    onStart(Session.freeformSession(LocalDate.now(), currentBodyweight));
  };

  const session = activeSession ?? data.todaySession;
  const sessionTitle = session?.blueprint.name ?? t('workout.freeform.title');
  const sessionSubtitle =
    session != null
      ? t('home.today_session.subtitle', { count: session.recordedExercises.length }) // en: "{count} exercises"
      : t('home.today_session.empty_subtitle'); // en: "Start a freeform workout"
  const startLabel = t(session?.isStarted ? 'workout.resume.button' : 'workout.start.button');

  const planMenuItems = [
    {
      label: t('workout.freeform.title'),
      icon: 'fitnessCenter' as const,
      systemImage: 'dumbbell' as const,
      onPress: createFreeformSession,
    },
    {
      label: t('plan.choose.button'),
      icon: 'assignment' as const,
      systemImage: 'list.clipboard' as const,
      onPress: choosePlan,
    },
    {
      label: t('workout.edit_workouts.button'),
      icon: 'edit' as const,
      systemImage: 'pencil' as const,
      onPress: editWorkouts,
    },
  ];

  return (
    <>
      <GreetingHeader
        dateLabel={data.dateLabel}
        greeting={data.greeting}
        trailing={
          <Menu
            testID="home-plan-menu"
            trigger={(open) => (
              <Pressable
                onPress={open}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel={t('home.menu.label') /* en: "Workout options" */}
                style={{
                  width: 44,
                  height: 44,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon source="moreHoriz" size={24} color={theme.color.content.secondary} />
              </Pressable>
            )}
            items={planMenuItems}
          />
        }
      />
      <WhatsNewBanner />
      <ActivityRings />
      <StatTiles />
      <TodaySession
        title={sessionTitle}
        subtitle={sessionSubtitle}
        startLabel={startLabel}
        onStart={() => (session != null ? onStart(session) : createFreeformSession())}
      />
      <WeeklyVolume data={data.weeklyVolume} />
      <HrZones />
      <ProgramsSection programs={data.programs} onSeeAll={() => push('/settings/program-list')} />
      <CoachCard />
      <RecentActivitySection
        items={data.recentActivity}
        onSeeAll={() => push('/(tabs)/history')}
        onSessionPress={(sessionId) =>
          push(`/history/post-workout?sessionId=${encodeURIComponent(sessionId)}&source=history`)
        }
      />
      <AchievementsSection />
      <HomeDuoRow>
        <HomeDuoCell>
          <HydrationSection />
        </HomeDuoCell>
        <HomeDuoCell>
          <MacrosSection />
        </HomeDuoCell>
      </HomeDuoRow>
      <PersonalRecordsSection records={data.personalRecords} />
      <WeeklyChallengeSection />
      <WelcomeWizard />
    </>
  );
}

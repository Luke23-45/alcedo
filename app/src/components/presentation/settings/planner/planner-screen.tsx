import { Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useTranslate } from '@tolgee/react';
import { useAppTheme } from '@/hooks/useAppTheme';
import FullHeightScrollView from '@/components/layout/full-height-scroll-view';
import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { HomeGradient } from '@/components/presentation/home/shared/home-gradient';
import { SectionHeader } from '@/components/presentation/home/shared/section-header';
import { SettingsBackground } from '@/components/presentation/settings/shared/settings-background';
import { settingsKey } from '@/components/presentation/settings/shared/settings-i18n';
import { CoachHeader } from './coach-header';
import { NextSession } from './next-session';
import { Recovery } from './recovery';
import { SessionShape } from './session-shape';
import { TrainingDays } from './training-days';
import { WeeklyOverload } from './weekly-overload';
import { ChatIconWell, ChatRow, ChatRowCaption, ChatRowText, ChatRowTitle, PlannerPage } from './planner-screen.styles';

/**
 * Screen 4 — AI Planner configuration. The hero card carries the master
 * switch; everything below persists into the planner preference keys, so the
 * planner genuinely plans from these settings. The previous chat UI lives on
 * at /settings/ai/planner-chat, linked from the foot of this screen.
 */
export function PlannerScreen() {
  const { t } = useTranslate();
  const { push } = useRouter();
  const theme = useAppTheme();

  return (
    <FullHeightScrollView screenBackground={<SettingsBackground variant="planner" />}>
      <PlannerPage>
        <CoachHeader />
        <SectionHeader label={t(settingsKey('settings.planner.training_days.header'))} />
        <TrainingDays />
        <SectionHeader label={t(settingsKey('settings.planner.session_shape.header'))} />
        <SessionShape />
        <SectionHeader label={t(settingsKey('settings.planner.recovery.header'))} />
        <Recovery />
        <WeeklyOverload />
        <SectionHeader label={t(settingsKey('settings.planner.next_session.header'))} />
        <NextSession />
        <HomeCard radius={20} pad={16}>
          <Pressable
            onPress={() => push('/settings/ai/planner-chat')}
            accessibilityRole="button"
            accessibilityLabel={t(settingsKey('settings.planner.chat_row.title'))}
          >
            <ChatRow>
              <ChatIconWell>
                <HomeGradient
                  variant="brand"
                  style={{ width: 34, height: 34, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Svg width={16} height={16} viewBox="-6 -6 12 12">
                    <Path
                      d="M0 -5.2 L1.35 -1.35 L5.2 0 L1.35 1.35 L0 5.2 L-1.35 1.35 L-5.2 0 L-1.35 -1.35 Z"
                      fill="#FFFFFF"
                    />
                  </Svg>
                </HomeGradient>
              </ChatIconWell>
              <ChatRowText>
                <ChatRowTitle>{t(settingsKey('settings.planner.chat_row.title'))}</ChatRowTitle>
                <ChatRowCaption>{t(settingsKey('settings.planner.chat_row.caption'))}</ChatRowCaption>
              </ChatRowText>
              <Svg width={8} height={12} viewBox="0 0 8 12">
                <Path
                  d="M1.5 1.5 L6.5 6 L1.5 10.5"
                  fill="none"
                  stroke={theme.isDark ? '#636366' : '#AEAEB2'}
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </ChatRow>
          </Pressable>
        </HomeCard>
      </PlannerPage>
    </FullHeightScrollView>
  );
}

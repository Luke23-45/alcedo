import { LocalDate } from '@js-joda/core';
import { Pressable } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useAppSelector, useAppSelectorWithArg } from '@/store';
import { selectActiveProgram } from '@/store/program';
import { ProgramBlueprint } from '@/models/blueprint-models';
import { selectCompletedDistinctSessionNames, selectExercises, selectSessions } from '@/store/stored-sessions';
import { useTranslate } from '@tolgee/react';
import { settingsKey } from '@/components/presentation/settings/shared/settings-i18n';
import { translateExerciseMeta } from '@/utils/exercise-meta';
import { HomeGradient } from '@/components/presentation/home/shared/home-gradient';
import {
  formatMonthDay,
  formatWeekdayMonthDay,
  mondayOfWeek,
  muscleLoadThisWeek,
  nextSessionAvailability,
  nextSessionName,
  nextTrainingDay,
  resolveDeloadWeek,
  volumeChangePercent,
  weeklyVolumeKg,
} from './planner-data';
import {
  EmptyCaption,
  EmptyCta,
  EmptyCtaText,
  EmptyTitle,
  EmptyWrap,
  InsightRow,
  InsightText,
  MuscleChip,
  MuscleChipText,
  MuscleChips,
  NextCard,
  NextHeader,
  NextIcon,
  NextMeta,
  NextName,
  NextTitleBlock,
  RegenButton,
  RegenLabel,
} from './next-session.styles';

/** Dumbbell glyph (spec ic-db), drawn in a 24×24 box centred at (0,0). */
function DumbbellIcon() {
  return (
    <Svg width={24} height={24} viewBox="-14 -9 28 18">
      <Rect x={-13} y={-5.6} width={4.4} height={11.2} rx={1.8} fill="#FFF" />
      <Rect x={-7.6} y={-8} width={3.8} height={16} rx={1.7} fill="#FFF" />
      <Rect x={-7.6} y={-1.9} width={15.2} height={3.8} rx={0.6} fill="#FFF" />
      <Rect x={3.8} y={-8} width={3.8} height={16} rx={1.7} fill="#FFF" />
      <Rect x={8.6} y={-5.6} width={4.4} height={11.2} rx={1.8} fill="#FFF" />
    </Svg>
  );
}

/** Regenerate glyph (spec ic-regen): circular arrow. */
function RegenIcon() {
  return (
    <Svg width={16} height={16} viewBox="-9 -9 18 18">
      <Path
        d="M7 -2 A7 7 0 1 0 7 3.4 M7.5 -6.5 V-2 H3"
        fill="none"
        stroke="#FFF"
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Spark glyph for the insight line (spec: 5pt, amber). */
function SparkIcon() {
  return (
    <Svg width={6} height={6} viewBox="-6 -6 12 12" style={{ marginTop: 4 }}>
      <Path d="M0 -5.2 L1.35 -1.35 L5.2 0 L1.35 1.35 L0 5.2 L-1.35 1.35 L-5.2 0 L-1.35 -1.35 Z" fill="#FF9F0A" />
    </Svg>
  );
}

/**
 * NEXT SESSION: the next workout in the active program's rotation, the next
 * training day after today, its exercise count, the planner's target length,
 * this week's top muscle load, and the volume insight that feeds the deload
 * scheduler. Everything is derived from real sessions — the percentage is
 * computed, never hardcoded. The master switch gates the preview: when the
 * planner is off, or there is no program / no training days to plan from,
 * the section shows an honest empty card instead of a silent gap.
 */
export function NextSession() {
  const { t } = useTranslate();
  const { push } = useRouter();
  // selectActiveProgram asserts non-null, but deleting the active program
  // leaves savedPrograms[activePlanId] undefined at runtime.
  const program = useAppSelector(selectActiveProgram) as ProgramBlueprint | undefined;
  const enabled = useAppSelector((s) => s.settings.plannerEnabled);
  const trainingDays = useAppSelector((s) => s.settings.plannerTrainingDays);
  const targetMinutes = useAppSelector((s) => s.settings.plannerTargetSessionMinutes);
  const autoDeload = useAppSelector((s) => s.settings.plannerAutoDeload);
  const deloadWeekSetting = useAppSelector((s) => s.settings.plannerDeloadWeek);
  const descriptors = useAppSelector(selectExercises);
  const locale = useAppSelector((s) => s.settings.preferredLanguage);

  const today = LocalDate.now();
  // Names of sessions completed in the last 7 days, to rotate past them.
  const recentNames = useAppSelectorWithArg(selectCompletedDistinctSessionNames, today.minusDays(7));
  const allSessions = Object.values(useAppSelector(selectSessions));

  const availability = nextSessionAvailability(
    enabled,
    program !== undefined,
    trainingDays.length,
    program?.sessions.length ?? 0,
  );

  if (availability !== 'ready' || !program) {
    const copy =
      availability === 'planner-off'
        ? {
            title: t(settingsKey('settings.planner.next_session.off.title')),
            caption: t(settingsKey('settings.planner.next_session.off.caption')),
            cta: undefined as string | undefined,
          }
        : availability === 'no-program'
          ? {
              title: t(settingsKey('settings.planner.next_session.empty_program.title')),
              caption: t(settingsKey('settings.planner.next_session.empty_program.caption')),
              cta: t(settingsKey('settings.planner.next_session.empty_program.cta')),
            }
          : availability === 'no-sessions'
            ? {
                title: t(settingsKey('settings.planner.next_session.no_sessions.title')),
                caption: t(settingsKey('settings.planner.next_session.no_sessions.caption')),
                cta: undefined as string | undefined,
              }
            : {
                title: t(settingsKey('settings.planner.next_session.empty_days.title')),
                caption: t(settingsKey('settings.planner.next_session.empty_days.caption')),
                cta: undefined as string | undefined,
              };
    return (
      <NextCard>
        <EmptyWrap>
          <EmptyTitle>{copy.title}</EmptyTitle>
          <EmptyCaption>{copy.caption}</EmptyCaption>
          {copy.cta ? (
            <Pressable
              onPress={() => push('/settings/program-list')}
              accessibilityRole="button"
              accessibilityLabel={copy.cta}
            >
              <EmptyCta>
                <EmptyCtaText>{copy.cta}</EmptyCtaText>
              </EmptyCta>
            </Pressable>
          ) : undefined}
        </EmptyWrap>
      </NextCard>
    );
  }

  const sessionName = nextSessionName(program.sessions, recentNames) ?? program.sessions[0]!.name;
  const session = program.sessions.find((s) => s.name === sessionName);
  const exerciseCount = session?.exercises.length ?? 0;
  const nextDate = nextTrainingDay(today, trainingDays);

  const thisMonday = mondayOfWeek(today);
  const lastMonday = thisMonday.minusWeeks(1);
  const change = volumeChangePercent(weeklyVolumeKg(allSessions, thisMonday), weeklyVolumeKg(allSessions, lastMonday));
  const muscleLoad = muscleLoadThisWeek(allSessions, thisMonday, descriptors).slice(0, 2);
  const deloadDate = resolveDeloadWeek(deloadWeekSetting, today);

  const meta = t(settingsKey('settings.planner.next_session.meta'), {
    date: formatWeekdayMonthDay(nextDate, locale),
    count: exerciseCount,
    minutes: targetMinutes,
  });

  return (
    <>
      <NextCard>
        <NextHeader>
          <NextIcon>
            <HomeGradient
              variant="gloss"
              style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 22, opacity: 0.4 }}
            />
            <DumbbellIcon />
          </NextIcon>
          <NextTitleBlock>
            <NextName>{sessionName}</NextName>
            <NextMeta>{meta}</NextMeta>
          </NextTitleBlock>
        </NextHeader>
        {muscleLoad.length > 0 && (
          <MuscleChips>
            {muscleLoad.map(({ muscle, sets }) => (
              <MuscleChip key={muscle}>
                <MuscleChipText>
                  {translateExerciseMeta(t, 'muscle', muscle).toUpperCase()} · {sets}
                </MuscleChipText>
              </MuscleChip>
            ))}
          </MuscleChips>
        )}
        <Pressable
          onPress={() => push('/settings/ai/planner-chat')}
          accessibilityRole="button"
          accessibilityLabel={t(settingsKey('settings.planner.regenerate.button'))}
        >
          <RegenButton>
            <HomeGradient
              variant="gloss"
              style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 22, opacity: 0.35 }}
            />
            <RegenIcon />
            <RegenLabel>{t(settingsKey('settings.planner.regenerate.button'))}</RegenLabel>
          </RegenButton>
        </Pressable>
      </NextCard>
      {change !== undefined && autoDeload ? (
        <InsightRow>
          <SparkIcon />
          <InsightText>
            {t(settingsKey('settings.planner.volume_insight.message'), {
              change: Math.abs(change),
              direction: t(
                settingsKey(
                  change >= 0 ? 'settings.planner.volume_insight.up' : 'settings.planner.volume_insight.down',
                ),
              ),
              date: formatMonthDay(deloadDate, locale),
            })}
          </InsightText>
        </InsightRow>
      ) : null}
    </>
  );
}

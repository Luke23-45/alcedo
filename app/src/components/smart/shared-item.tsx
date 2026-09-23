import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ReactNode } from 'react';
import { T, useTranslate } from '@tolgee/react';
import { useDispatch } from 'react-redux';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAppSelector } from '@/store';
import { usePreferredWeightUnit } from '@/hooks/usePreferredWeightUnit';
import { useStartWorkoutWithConfirmation } from '@/hooks/useStartWorkoutWithConfirmation';
import { GlassBackground } from '@/components/presentation/foundation/glass-background';
import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { SharePoster } from '@/components/presentation/feed/shared/share-poster';
import { ChevronLeftGlyph } from '@/components/presentation/feed/post-detail/post-detail-glyphs';
import { ExerciseBreakdown } from '@/components/presentation/history/exercise-breakdown/exercise-breakdown';
import { formatClockDuration, sessionTotalSets } from '@/components/presentation/history/history-stats';
import { formatExerciseSummary } from '@/components/presentation/summary/format-exercise-summary';
import { SharedItem, SharedProgramBlueprint, SharedSession } from '@/models/feed-models';
import { Session } from '@/models/session-models';
import { localeFormatBigNumber } from '@/utils/locale-bignumber';
import { shortFormatWeightUnit } from '@/models/weight';
import { uuid } from '@/utils/uuid';
import { addProgramSession, savePlan } from '@/store/program';
import { showSnackbar } from '@/store/app';
import * as S from './shared-item.styles';

interface SharedItemProps {
  sharedItem: SharedItem;
}

/**
 * The public share-link landing chrome: the post-detail glass header (back +
 * title), always visible — including over the loading/error states the route
 * renders — so the landing never strands the viewer without a way back.
 */
export function SharedItemChrome({ children }: { children: ReactNode }) {
  const theme = useAppTheme();
  const { t } = useTranslate();
  const { back } = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <S.Screen>
      <Stack.Screen options={{ headerShown: false }} />
      <S.Header $topInset={insets.top}>
        <GlassBackground radius={0} color={theme.isDark ? 'rgba(8,8,10,0.90)' : 'rgba(255,255,255,0.90)'} />
        <S.HeaderRow>
          <S.SideSlot>
            <S.HeaderButton
              onPress={back}
              accessibilityRole="button"
              accessibilityLabel={t('feed.detail.back', 'Back')}
            >
              <ChevronLeftGlyph size={16} />
            </S.HeaderButton>
          </S.SideSlot>
          <S.Title>{t('feed.shared_item.title', 'Shared Item')}</S.Title>
          <S.SideSlot />
        </S.HeaderRow>
      </S.Header>
      <S.Body>{children}</S.Body>
    </S.Screen>
  );
}

function SharedProgramBlueprintContent({ sharedItem }: { sharedItem: SharedProgramBlueprint }) {
  const program = sharedItem.programBlueprint;
  const dispatch = useDispatch();
  const { t } = useTranslate();
  const { push } = useRouter();
  const insets = useSafeAreaInsets();
  const preferredWeightUnit = usePreferredWeightUnit();
  const bodyweightLabel = t('exercise.short_bodyweight.label');

  // Convert session blueprints to sessions for display (same as before).
  const sessions = program.sessions.map((sessionBlueprint) =>
    Session.getEmptySession(sessionBlueprint, preferredWeightUnit),
  );

  const handleSave = () => {
    const programId = uuid();
    dispatch(
      savePlan({
        programId,
        programBlueprint: program,
      }),
    );
    push(`/settings/program-list?focusprogramId=${programId}`, {
      withAnchor: true,
    });
    dispatch(
      showSnackbar({
        text: `"${program.name}" saved to your plans`,
      }),
    );
  };

  return (
    <S.ContentScroll
      contentContainerStyle={{
        paddingTop: 20,
        paddingHorizontal: 24,
        paddingBottom: 32 + insets.bottom,
      }}
    >
      <S.ProgramName>{program.name}</S.ProgramName>
      <S.ProgramMeta>
        {program.sessions.length} {program.sessions.length === 1 ? 'workout' : 'workouts'}
      </S.ProgramMeta>
      <S.SaveWrap>
        <S.PrimaryButton
          onPress={handleSave}
          accessibilityRole="button"
          accessibilityLabel={t('generic.save.button', 'Save')}
        >
          <LinearGradient
            colors={['#FFB03A', '#FF6A3D', '#FF2D55']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.6, y: 1 }}
            style={S.fill}
          />
          <S.CtaGloss
            colors={['rgba(255,255,255,0.32)', 'rgba(255,255,255,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
          <S.PrimaryLabel>
            <T keyName="generic.save.button" />
          </S.PrimaryLabel>
          <S.CtaEdge />
        </S.PrimaryButton>
      </S.SaveWrap>

      <S.SectionTitle>
        <T keyName="workout.all.title" />
      </S.SectionTitle>
      {sessions.length > 0 ? (
        sessions.map((session, index) => (
          <HomeCard key={index} elev="card" radius={24} pad={16} style={{ marginBottom: 12 }}>
            <S.SessionName>{session.blueprint.name}</S.SessionName>
            <S.SessionMeta>
              {t('plan.summary.exercises', '{count} exercises', {
                count: session.blueprint.exercises.length,
              })}
            </S.SessionMeta>
            {session.recordedExercises.map((exercise, exerciseIndex) => (
              <S.ExerciseRow key={exerciseIndex}>
                <S.ExerciseName numberOfLines={1}>{exercise.blueprint.name}</S.ExerciseName>
                <S.ExerciseSummary numberOfLines={2}>
                  {formatExerciseSummary(exercise, {
                    isFilled: false,
                    showWeight: false,
                    bodyweightLabel,
                  })}
                </S.ExerciseSummary>
              </S.ExerciseRow>
            ))}
          </HomeCard>
        ))
      ) : (
        <S.FallbackText>
          <T keyName="workout.no_workouts_in_plan.message" />
        </S.FallbackText>
      )}
    </S.ContentScroll>
  );
}

function SharedSessionContent({ sharedItem }: { sharedItem: SharedSession }) {
  const session = sharedItem.session;
  const dispatch = useDispatch();
  const { t } = useTranslate();
  const { push } = useRouter();
  const insets = useSafeAreaInsets();
  const preferredWeightUnit = usePreferredWeightUnit();
  const activeProgramId = useAppSelector((x) => x.program.activePlanId);
  const { start, confirmationDialog } = useStartWorkoutWithConfirmation();

  // The poster's figures are all real session aggregates — the same content
  // a workout post shows. PR pills stay empty: the sharer's records are not
  // on this device, so no pill is claimed.
  const volume = session.totalWeightLifted.convertTo(preferredWeightUnit);
  const date = session.date;
  const kickerDate = new Date(date.year(), date.monthValue() - 1, date.dayOfMonth());
  const kicker = `ALCEDO · ${kickerDate
    .toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
    .toUpperCase()}`;
  const notes = session.blueprint.notes.trim();

  const handleSaveToPlan = () => {
    dispatch(
      addProgramSession({
        programId: activeProgramId,
        sessionBlueprint: session.blueprint,
      }),
    );
    push(`/settings/manage-workouts/${activeProgramId}`);
  };

  return (
    <S.ContentScroll
      contentContainerStyle={{
        paddingTop: 20,
        paddingHorizontal: 24,
        paddingBottom: 32 + insets.bottom,
      }}
    >
      <S.PosterWrap>
        <SharePoster
          theme="ember"
          kicker={kicker}
          heroValue={localeFormatBigNumber(volume.value, 0)}
          heroUnit={shortFormatWeightUnit(preferredWeightUnit)}
          workoutName={session.blueprint.name}
          duration={formatClockDuration(session.duration)}
          sets={sessionTotalSets(session).toString()}
          prPills={[]}
        />
      </S.PosterWrap>

      {notes ? <S.Caption>{notes}</S.Caption> : null}

      <S.ActionRow>
        <S.SecondaryButton
          onPress={handleSaveToPlan}
          accessibilityRole="button"
          accessibilityLabel={t('feed.shared_session.save_to_plan.button', 'Save to plan')}
        >
          <S.SecondaryLabel>
            <T keyName="feed.shared_session.save_to_plan.button" />
          </S.SecondaryLabel>
        </S.SecondaryButton>
        <S.PrimaryButton
          onPress={() => start(session.with({ id: uuid() }))}
          accessibilityRole="button"
          accessibilityLabel={t('feed.shared_session.start_workout.button', 'Start workout')}
        >
          <LinearGradient
            colors={['#FFB03A', '#FF6A3D', '#FF2D55']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.6, y: 1 }}
            style={S.fill}
          />
          <S.CtaGloss
            colors={['rgba(255,255,255,0.32)', 'rgba(255,255,255,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
          <S.PrimaryLabel>
            <T keyName="feed.shared_session.start_workout.button" />
          </S.PrimaryLabel>
          <S.CtaEdge />
        </S.PrimaryButton>
      </S.ActionRow>

      <S.BreakdownWrap>
        <ExerciseBreakdown session={session} />
      </S.BreakdownWrap>
      {confirmationDialog}
    </S.ContentScroll>
  );
}

export default function SharedItemComponent({ sharedItem }: SharedItemProps) {
  if (sharedItem instanceof SharedProgramBlueprint) {
    return <SharedProgramBlueprintContent sharedItem={sharedItem} />;
  }
  if (sharedItem instanceof SharedSession) {
    return <SharedSessionContent sharedItem={sharedItem} />;
  }
  // Fallback for future shared item types
  return (
    <S.FallbackWrap>
      <S.FallbackText>Unsupported shared item type</S.FallbackText>
    </S.FallbackWrap>
  );
}

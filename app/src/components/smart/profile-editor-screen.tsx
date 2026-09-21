import { ProfileScreen, type ProfileEditorDraft } from '@/components/presentation/feed/profile/profile-screen';
import { useAppSelector } from '@/store';
import { resetFeedAccount, selectFeedIdentityRemote, updateFeedIdentity } from '@/store/feed';
import {
  setBlockedAccounts,
  setPrivacyAllowComments,
  setPrivacyShareSessions,
  setPrivacyShowHeartRate,
  setPrivacyShowLeaderboards,
  setPrivacyShowPRs,
  setProfileBio,
  setProfileUsername,
  setProfileVisibility,
  setRingGoalExercise,
  setRingGoalMove,
  setRingGoalStand,
  setUnitDistance,
  setUnitHeight,
  setUnitWeight,
  setUseImperialUnits,
  setWeeklyVolumeGoalKg,
} from '@/store/settings';
import { DEFAULT_PROFILE_BIO } from '@/store/settings/registry';
import { selectProfileStats } from '@/components/presentation/feed/profile/profile-stats';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';

/**
 * Smart container for Screen 4 — Profile Editor. Builds the editor draft from
 * the settings store + feed identity, and commits the whole draft on Save:
 * username/bio/visibility/units/privacy/blocked list to settings, the display
 * name to the feed identity. Changing Weight also flips the legacy
 * app-wide imperial toggle (it governs weight display), so the two never
 * disagree. Cancel discards the draft; nothing is written.
 */
export function ProfileEditorScreen({ focusPublish }: { focusPublish: boolean }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const settings = useAppSelector((state) => state.settings);
  const identityName = useAppSelector((state) =>
    selectFeedIdentityRemote(state)
      .map((identity) => identity.name ?? '')
      .unwrapOr(''),
  );
  const stats = useAppSelector(selectProfileStats);

  const goBack = () => router.back();

  const initial: ProfileEditorDraft = {
    name: identityName,
    username: settings.profileUsername ?? 'alexr',
    bio: settings.profileBio ?? DEFAULT_PROFILE_BIO,
    ringGoals: {
      move: settings.ringGoalMove,
      exercise: settings.ringGoalExercise,
      stand: settings.ringGoalStand,
    },
    volumeGoalKg: settings.weeklyVolumeGoalKg,
    units: {
      weight: settings.unitWeight,
      distance: settings.unitDistance,
      height: settings.unitHeight,
    },
    privacy: {
      visibility: settings.profileVisibility,
      shareSessions: settings.privacyShareSessions,
      showLeaderboards: settings.privacyShowLeaderboards,
      showPRs: settings.privacyShowPRs,
      allowComments: settings.privacyAllowComments,
      showHeartRate: settings.privacyShowHeartRate,
      blocked: settings.blockedAccounts,
    },
  };

  const onSave = (draft: ProfileEditorDraft) => {
    dispatch(setProfileUsername(draft.username));
    dispatch(setProfileBio(draft.bio));
    dispatch(setRingGoalMove(draft.ringGoals.move));
    dispatch(setRingGoalExercise(draft.ringGoals.exercise));
    dispatch(setRingGoalStand(draft.ringGoals.stand));
    dispatch(setWeeklyVolumeGoalKg(draft.volumeGoalKg));
    dispatch(setUnitWeight(draft.units.weight));
    dispatch(setUnitDistance(draft.units.distance));
    dispatch(setUnitHeight(draft.units.height));
    dispatch(setUseImperialUnits(draft.units.weight === 'lb'));
    dispatch(setProfileVisibility(draft.privacy.visibility));
    dispatch(setPrivacyShareSessions(draft.privacy.shareSessions));
    dispatch(setPrivacyShowLeaderboards(draft.privacy.showLeaderboards));
    dispatch(setPrivacyShowPRs(draft.privacy.showPRs));
    dispatch(setPrivacyAllowComments(draft.privacy.allowComments));
    dispatch(setPrivacyShowHeartRate(draft.privacy.showHeartRate));
    dispatch(setBlockedAccounts(draft.privacy.blocked));
    dispatch(updateFeedIdentity({ updates: { name: draft.name }, fromUserAction: true }));
    goBack();
  };

  const onDeleteAccount = () => {
    dispatch(resetFeedAccount({ fromUserAction: true }));
    goBack();
  };

  return (
    <ProfileScreen
      initial={initial}
      stats={{
        sessionCount: stats.sessionCount,
        streakDays: stats.streakDays,
        lifetimeKg: stats.lifetimeKg,
      }}
      thisWeekKg={stats.thisWeekKg}
      healthConnected={settings.exportToHealthAggregator}
      focusPrivacy={focusPublish}
      onCancel={goBack}
      onSave={onSave}
      onDeleteAccount={onDeleteAccount}
    />
  );
}

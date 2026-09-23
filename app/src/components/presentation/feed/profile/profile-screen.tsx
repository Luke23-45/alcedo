import { useAppTheme } from "@/hooks/useAppTheme";
import { useTranslate } from "@tolgee/react";
import { useEffect, useRef, useState } from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { feedKey } from "../shared/feed-i18n";
import { ownPersonInitial } from "../shared/own-person";
import { ProfileAvatar } from "./profile-avatar";
import { ProfileBackground } from "./profile-background";
import { ProfileConnected } from "./profile-connected";
import { ProfileFooter } from "./profile-footer";
import { ProfileGoals, type RingGoals } from "./profile-goals";
import { ProfileIdentity } from "./profile-identity";
import { ProfilePrivacy, type PrivacyDraft } from "./profile-privacy";
import { ProfileStatsStrip } from "./profile-stats-strip";
import {
  ProfileUnits,
  type DistanceUnitValue,
  type HeightUnitValue,
  type WeightUnitValue,
} from "./profile-units";
import { profilePalette } from "./profile-tokens";
import type { RingGoalKey } from "./ring-goal-sheet";
import * as S from "./profile-screen.styles";

export interface ProfileEditorDraft {
  name: string;
  username: string;
  bio: string;
  ringGoals: RingGoals;
  volumeGoalKg: number;
  units: {
    weight: WeightUnitValue;
    distance: DistanceUnitValue;
    height: HeightUnitValue;
  };
  privacy: PrivacyDraft;
}

interface ProfileScreenProps {
  initial: ProfileEditorDraft;
  stats: { sessionCount: number; streakDays: number; lifetimeKg: number };
  /** Real follower count from the feed store; 0 before anyone follows. */
  followersCount: number;
  thisWeekKg: number;
  healthConnected: boolean;
  /** Scrolls to the privacy card on mount (replaces the old focusPublish). */
  focusPrivacy?: boolean;
  onCancel: () => void;
  onSave: (draft: ProfileEditorDraft) => void;
  onDeleteAccount: () => void;
}

/**
 * Screen 4 — Profile Editor. Draft-first: every control edits a local draft
 * and nothing is persisted until Save; Cancel discards the draft untouched.
 */
export function ProfileScreen({
  initial,
  stats,
  followersCount,
  thisWeekKg,
  healthConnected,
  focusPrivacy,
  onCancel,
  onSave,
  onDeleteAccount,
}: ProfileScreenProps) {
  const theme = useAppTheme();
  const palette = profilePalette(theme.isDark);
  const { t } = useTranslate();
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState<ProfileEditorDraft>(initial);
  const scrollRef = useRef<ScrollView>(null);
  const privacyY = useRef(0);

  useEffect(() => {
    if (focusPrivacy) {
      const id = requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ y: Math.max(0, privacyY.current - 76), animated: false });
      });
      return () => cancelAnimationFrame(id);
    }
    return undefined;
  }, [focusPrivacy]);

  const setRingGoal = (key: RingGoalKey, value: number) =>
    setDraft((d) => ({ ...d, ringGoals: { ...d.ringGoals, [key]: value } }));

  return (
    <S.ScreenRoot>
      <ProfileBackground />
      <S.NavBar style={{ marginTop: insets.top }}>
        <S.NavButton
          accessibilityRole="button"
          accessibilityLabel={t(feedKey("feed.profile.nav.cancel"))}
          onPress={onCancel}
        >
          <S.NavCancel $color={palette.cancel}>{t(feedKey("feed.profile.nav.cancel"))}</S.NavCancel>
        </S.NavButton>
        <S.NavTitle $color={palette.navTitle}>{t(feedKey("feed.profile.nav.title"))}</S.NavTitle>
        <S.NavSpacer />
        <S.NavButton
          accessibilityRole="button"
          accessibilityLabel={t(feedKey("feed.profile.nav.save"))}
          onPress={() => onSave(draft)}
        >
          <S.NavSave $color={palette.save}>{t(feedKey("feed.profile.nav.save"))}</S.NavSave>
        </S.NavButton>
      </S.NavBar>
      <ScrollView
        ref={scrollRef}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
      >
        <S.Content>
          <S.AvatarBlock>
            <ProfileAvatar initial={ownPersonInitial(draft.name, draft.username)} />
          </S.AvatarBlock>
          <S.StatsWrap>
            <ProfileStatsStrip
              sessionCount={stats.sessionCount}
              streakDays={stats.streakDays}
              lifetimeKg={stats.lifetimeKg}
              followersCount={followersCount}
            />
          </S.StatsWrap>
          <S.IdentityWrap>
            <ProfileIdentity
              draft={{ name: draft.name, username: draft.username, bio: draft.bio }}
              onDraftChange={(identity) => setDraft((d) => ({ ...d, ...identity }))}
            />
          </S.IdentityWrap>
          <S.SectionWrap>
            <S.SectionLabel $color={palette.tertiary}>
              {t(feedKey("feed.profile.goals.section"))}
            </S.SectionLabel>
            <ProfileGoals
              ringGoals={draft.ringGoals}
              onRingGoalChange={setRingGoal}
              volumeGoalKg={draft.volumeGoalKg}
              thisWeekKg={thisWeekKg}
              onVolumeGoalChange={(volumeGoalKg) => setDraft((d) => ({ ...d, volumeGoalKg }))}
            />
          </S.SectionWrap>
          <S.SectionWrap>
            <S.SectionLabel $color={palette.tertiary}>
              {t(feedKey("feed.profile.units.section"))}
            </S.SectionLabel>
            <ProfileUnits
              weight={draft.units.weight}
              distance={draft.units.distance}
              height={draft.units.height}
              onWeightChange={(weight) =>
                setDraft((d) => ({ ...d, units: { ...d.units, weight } }))
              }
              onDistanceChange={(distance) =>
                setDraft((d) => ({ ...d, units: { ...d.units, distance } }))
              }
              onHeightChange={(height) =>
                setDraft((d) => ({ ...d, units: { ...d.units, height } }))
              }
            />
          </S.SectionWrap>
          <S.SectionWrap>
            <S.SectionLabel
              $color={palette.tertiary}
              onLayout={(event) => {
                privacyY.current = event.nativeEvent.layout.y;
              }}
            >
              {t(feedKey("feed.profile.privacy.section"))}
            </S.SectionLabel>
            <ProfilePrivacy
              draft={draft.privacy}
              onDraftChange={(privacy) => setDraft((d) => ({ ...d, privacy }))}
            />
          </S.SectionWrap>
          <S.SectionWrap>
            <S.SectionLabel $color={palette.tertiary}>
              {t(feedKey("feed.profile.connected.section"))}
            </S.SectionLabel>
            <ProfileConnected healthConnected={healthConnected} />
          </S.SectionWrap>
          <ProfileFooter onDeleteAccount={onDeleteAccount} />
        </S.Content>
      </ScrollView>
    </S.ScreenRoot>
  );
}

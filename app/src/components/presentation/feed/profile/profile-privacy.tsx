import { HomeCard } from "@/components/presentation/home/shared/home-card";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useTranslate } from "@tolgee/react";
import { useState } from "react";
import { feedKey } from "../shared/feed-i18n";
import { BlockedAccountsSheet } from "./blocked-accounts-sheet";
import { ChevronGlyph } from "./profile-glyphs";
import { ProfileToggle } from "./profile-toggle";
import { profilePalette, type VisibilityValue } from "./profile-tokens";
import { SegmentedControl, type SegmentedOption } from "./segmented-control";
import * as S from "./profile-privacy.styles";

export interface PrivacyDraft {
  visibility: VisibilityValue;
  shareSessions: boolean;
  showLeaderboards: boolean;
  showPRs: boolean;
  allowComments: boolean;
  showHeartRate: boolean;
  blocked: string[];
}

/**
 * PRIVACY & SOCIAL card, 380pt: visibility segmented, five persisted toggles,
 * and the blocked-accounts row opening a real add/unblock sheet. Every row is
 * a 44pt+ target; toggles are visual (the row is the switch).
 */
export function ProfilePrivacy({
  draft,
  onDraftChange,
}: {
  draft: PrivacyDraft;
  onDraftChange: (draft: PrivacyDraft) => void;
}) {
  const theme = useAppTheme();
  const palette = profilePalette(theme.isDark);
  const { t } = useTranslate();
  const [blockedOpen, setBlockedOpen] = useState(false);
  // The 3-option control scales to its measured wrap (spec 161 exact on 393);
  // the thumb keeps the spec's 2pt side insets per segment.
  const [segW, setSegW] = useState(0);
  const segWidth = segW > 0 ? segW : 161;
  const segThumb = segWidth / 3 - 4;

  const visibilityOptions: SegmentedOption<VisibilityValue>[] = [
    { value: "public", label: t(feedKey("feed.profile.privacy.public")) },
    { value: "friends", label: t(feedKey("feed.profile.privacy.friends")) },
    { value: "private", label: t(feedKey("feed.profile.privacy.private")) },
  ];

  const toggleRow = (
    key: "shareSessions" | "showLeaderboards" | "showPRs" | "allowComments" | "showHeartRate",
    labelKey: string,
  ) => (
    <S.ToggleRow
      accessibilityRole="switch"
      accessibilityState={{ checked: draft[key] }}
      accessibilityLabel={t(feedKey(labelKey))}
      onPress={() => onDraftChange({ ...draft, [key]: !draft[key] })}
    >
      <S.ToggleLabel $color={draft[key] ? palette.label : palette.tertiary} numberOfLines={2} ellipsizeMode="tail">
        {t(feedKey(labelKey))}
      </S.ToggleLabel>
      <ProfileToggle value={draft[key]} />
    </S.ToggleRow>
  );

  return (
    <HomeCard radius={30} pad={0}>
      <S.VisibilityRow
        accessibilityRole="radiogroup"
        accessibilityLabel={t(feedKey("feed.profile.privacy.visibility"))}
      >
        <S.VisibilityLabel $color={palette.label} numberOfLines={1} ellipsizeMode="tail">
          {t(feedKey("feed.profile.privacy.visibility"))}
        </S.VisibilityLabel>
        <S.VisibilityWrap
          onLayout={(e) => {
            const { width } = e.nativeEvent.layout;
            setSegW((prev) => (prev === width ? prev : width));
          }}
        >
          <SegmentedControl
            options={visibilityOptions}
            value={draft.visibility}
            onChange={(visibility) => onDraftChange({ ...draft, visibility })}
            width={segWidth}
            thumbWidth={segThumb}
            labelSize={11}
            testID="profile-visibility"
          />
        </S.VisibilityWrap>
      </S.VisibilityRow>
      {toggleRow("shareSessions", "feed.profile.privacy.share_sessions")}
      {toggleRow("showLeaderboards", "feed.profile.privacy.leaderboards")}
      {toggleRow("showPRs", "feed.profile.privacy.show_prs")}
      {toggleRow("allowComments", "feed.profile.privacy.allow_comments")}
      {toggleRow("showHeartRate", "feed.profile.privacy.show_heart_rate")}
      <S.BlockedRow
        accessibilityRole="button"
        accessibilityLabel={`${t(feedKey("feed.profile.privacy.blocked"))}, ${
          draft.blocked.length === 0
            ? t(feedKey("feed.profile.privacy.blocked_none"))
            : `${draft.blocked.length}`
        }`}
        onPress={() => setBlockedOpen(true)}
      >
        <S.BlockedLabel $color={palette.label}>
          {t(feedKey("feed.profile.privacy.blocked"))}
        </S.BlockedLabel>
        <S.BlockedValue $color={palette.tertiary}>
          {draft.blocked.length === 0
            ? t(feedKey("feed.profile.privacy.blocked_none"))
            : `${draft.blocked.length}`}
        </S.BlockedValue>
        <ChevronGlyph size={12} color={palette.chevron} />
      </S.BlockedRow>
      <S.Divider $color={palette.divider} $top={56} />
      <S.Divider $color={palette.divider} $top={108} />
      <S.Divider $color={palette.divider} $top={160} />
      <S.Divider $color={palette.divider} $top={212} />
      <S.Divider $color={palette.divider} $top={264} />
      <S.Divider $color={palette.divider} $top={316} />
      {blockedOpen && (
        <BlockedAccountsSheet
          blocked={draft.blocked}
          onBlock={(username) => onDraftChange({ ...draft, blocked: [...draft.blocked, username] })}
          onUnblock={(username) =>
            onDraftChange({ ...draft, blocked: draft.blocked.filter((name) => name !== username) })
          }
          onClose={() => setBlockedOpen(false)}
        />
      )}
    </HomeCard>
  );
}

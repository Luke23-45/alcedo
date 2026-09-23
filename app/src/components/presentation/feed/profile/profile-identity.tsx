import { HomeCard } from "@/components/presentation/home/shared/home-card";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useTranslate } from "@tolgee/react";
import { useState } from "react";
import { TextInput } from "react-native";
import { feedKey } from "../shared/feed-i18n";
import { ChevronGlyph } from "./profile-glyphs";
import { profilePalette, profileFontFamily } from "./profile-tokens";
import * as S from "./profile-identity.styles";

const BIO_MAX = 160;

/**
 * Reference (card-local): two 52pt rows (label 13/500 baseline +32, value
 * 14/600 baseline +32, chevron centered), hairlines at 52 and 104, bio
 * section 104..198 — kicker baseline +28, bio text 13/500 lh19, baselines
 * +54/+73. Card is fixed at 198; the bio field scrolls internally past
 * two lines.
 */

const inputStyle = (
  fontFamily: string,
  color: string,
  align: "right" | "left",
  multiline: boolean,
) => ({
  flex: 1,
  fontFamily,
  fontSize: 14,
  fontWeight: "600" as const,
  letterSpacing: -0.2,
  color,
  textAlign: align,
  marginRight: multiline ? 0 : 12,
  padding: 0,
});

export interface IdentityDraft {
  name: string;
  username: string;
  bio: string;
}

/**
 * Identity card: Name / Username rows and the bio block, all with real inline
 * editing. Edits flow into the draft; the screen's Save commits them (name to
 * the feed identity, username + bio to persisted settings), Cancel discards.
 */
export function ProfileIdentity({
  draft,
  onDraftChange,
}: {
  draft: IdentityDraft;
  onDraftChange: (draft: IdentityDraft) => void;
}) {
  const theme = useAppTheme();
  const palette = profilePalette(theme.isDark);
  const { t } = useTranslate();
  const [editing, setEditing] = useState<"name" | "username" | "bio" | null>(null);

  const cleanUsername = (raw: string) => raw.replace(/^@+/, "").replace(/\s+/g, "");

  const row = (
    key: "name" | "username",
    labelKey: string,
    value: string,
    placeholder: string,
    maxLength: number,
    format: (raw: string) => string,
  ) => (
    <S.Row
      accessibilityRole="button"
      accessibilityLabel={`${t(feedKey(labelKey))}, ${value}`}
      onPress={() => setEditing(key)}
    >
      <S.RowLabel $color={palette.secondary}>{t(feedKey(labelKey))}</S.RowLabel>
      {editing === key ? (
        <TextInput
          autoFocus
          value={value}
          placeholder={placeholder}
          placeholderTextColor={palette.faint}
          maxLength={maxLength}
          autoCapitalize={key === "username" ? "none" : "words"}
          autoCorrect={false}
          returnKeyType="done"
          onChangeText={(text) => onDraftChange({ ...draft, [key]: format(text) })}
          onBlur={() => setEditing(null)}
          onSubmitEditing={() => setEditing(null)}
          style={inputStyle(profileFontFamily(theme), palette.value, "right", false)}
        />
      ) : (
        <S.RowValue $color={palette.value} numberOfLines={1}>
          {value}
        </S.RowValue>
      )}
      <ChevronGlyph size={12} color={palette.chevron} />
    </S.Row>
  );

  return (
    <HomeCard radius={28} pad={0}>
      {row(
        "name",
        "feed.profile.identity.name",
        draft.name,
        t(feedKey("feed.profile.identity.name_placeholder")),
        50,
        (text) => text,
      )}
      {row(
        "username",
        "feed.profile.identity.username",
        draft.username ? `@${draft.username}` : "",
        t(feedKey("feed.profile.identity.username_placeholder")),
        30,
        cleanUsername,
      )}
      <S.Divider $color={palette.divider} $top={52} />
      <S.Divider $color={palette.divider} $top={104} />
      <S.BioSection
        accessibilityRole="button"
        accessibilityLabel={`${t(feedKey("feed.profile.identity.bio"))}, ${draft.bio}`}
        onPress={() => setEditing("bio")}
      >
        <S.BioHeader>
          <S.BioKicker $color={palette.tertiary}>
            {t(feedKey("feed.profile.identity.bio"))}
          </S.BioKicker>
          <S.BioCounter $color={palette.faint} style={{ fontVariant: ["tabular-nums"] }}>
            {t(feedKey("feed.profile.identity.bio_counter"), { count: `${draft.bio.length}` })}
          </S.BioCounter>
        </S.BioHeader>
        {editing === "bio" ? (
          <TextInput
            autoFocus
            multiline
            scrollEnabled
            value={draft.bio}
            placeholder={t(feedKey("feed.profile.identity.bio_placeholder"))}
            placeholderTextColor={palette.faint}
            maxLength={BIO_MAX}
            onChangeText={(text) => onDraftChange({ ...draft, bio: text })}
            onBlur={() => setEditing(null)}
            style={{
              fontFamily: profileFontFamily(theme),
              fontSize: 13,
              fontWeight: "500",
              lineHeight: 19,
              color: palette.bio,
              padding: 0,
              height: 38,
              textAlignVertical: "top",
            }}
          />
        ) : (
          <S.BioText $color={palette.bio} numberOfLines={2}>
            {draft.bio}
          </S.BioText>
        )}
      </S.BioSection>
    </HomeCard>
  );
}

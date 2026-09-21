import { useAppTheme } from "@/hooks/useAppTheme";
import { useTranslate } from "@tolgee/react";
import { useState } from "react";
import { Modal, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as S from "./blocked-accounts-sheet.styles";
import { feedKey } from "../shared/feed-i18n";
import { PROFILE, profilePalette } from "./profile-tokens";

/**
 * The real local blocked list: add a username to block it, unblock to remove.
 * Persisted to settings with everything else on Save.
 */
export function BlockedAccountsSheet({
  blocked,
  onBlock,
  onUnblock,
  onClose,
}: {
  blocked: string[];
  onBlock: (username: string) => void;
  onUnblock: (username: string) => void;
  onClose: () => void;
}) {
  const theme = useAppTheme();
  const palette = profilePalette(theme.isDark);
  const { t } = useTranslate();
  const insets = useSafeAreaInsets();
  const [input, setInput] = useState("");

  const clean = (raw: string) => raw.replace(/^@+/, "").replace(/\s+/g, "").toLowerCase();
  const candidate = clean(input);
  const canBlock = candidate.length > 0 && !blocked.includes(candidate);

  const commit = () => {
    if (!canBlock) return;
    onBlock(candidate);
    setInput("");
  };

  return (
    <Modal transparent animationType="fade" onRequestClose={onClose}>
      <S.Backdrop
        accessibilityRole="button"
        accessibilityLabel={t(feedKey("feed.profile.blocked.dismiss"))}
        onPress={onClose}
      />
      <S.Sheet
        $surface={palette.card}
        $border={palette.border}
        style={{ paddingBottom: insets.bottom + 20 }}
      >
        <S.SheetTitle $color={palette.value}>
          {t(feedKey("feed.profile.blocked.title"))}
        </S.SheetTitle>
        <S.AddRow>
          <S.AddInput
            value={input}
            onChangeText={setInput}
            placeholder={t(feedKey("feed.profile.blocked.input_placeholder"))}
            placeholderTextColor={palette.faint}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={commit}
            maxLength={30}
            accessibilityLabel={t(feedKey("feed.profile.blocked.input_placeholder"))}
            style={{ backgroundColor: palette.stepperFill, color: palette.value }}
          />
          <S.BlockButton
            accessibilityRole="button"
            accessibilityLabel={t(feedKey("feed.profile.blocked.block"))}
            disabled={!canBlock}
            onPress={commit}
            style={{ opacity: canBlock ? 1 : 0.4 }}
          >
            <S.BlockFill
              colors={[
                PROFILE.brandGradient[0],
                PROFILE.brandGradient[1],
                PROFILE.brandGradient[2],
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <S.BlockLabel>{t(feedKey("feed.profile.blocked.block"))}</S.BlockLabel>
          </S.BlockButton>
        </S.AddRow>
        <ScrollView>
          {blocked.length === 0 ? (
            <>
              <S.EmptyTitle $color={palette.label}>
                {t(feedKey("feed.profile.blocked.empty_title"))}
              </S.EmptyTitle>
              <S.EmptyBody $color={palette.tertiary}>
                {t(feedKey("feed.profile.blocked.empty_body"))}
              </S.EmptyBody>
            </>
          ) : (
            blocked.map((name) => (
              <S.BlockedRow key={name}>
                <S.BlockedName $color={palette.value}>@{name}</S.BlockedName>
                <S.UnblockButton
                  accessibilityRole="button"
                  accessibilityLabel={`${t(feedKey("feed.profile.blocked.unblock"))} @${name}`}
                  onPress={() => onUnblock(name)}
                >
                  <S.UnblockLabel $color={palette.destructiveLabel}>
                    {t(feedKey("feed.profile.blocked.unblock"))}
                  </S.UnblockLabel>
                </S.UnblockButton>
              </S.BlockedRow>
            ))
          )}
        </ScrollView>
      </S.Sheet>
    </Modal>
  );
}

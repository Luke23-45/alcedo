import { useAppTheme } from "@/hooks/useAppTheme";
import { useTranslate } from "@tolgee/react";
import * as Application from "expo-application";
import { Alert } from "react-native";
import * as S from "./profile-footer.styles";
import { feedKey } from "../shared/feed-i18n";
import { profilePalette } from "./profile-tokens";

/**
 * Screen footer: real app version/build from expo-application (never the
 * reference's fabricated "(238)"), and Delete Account — a confirmed dispatch
 * of the real feed-identity deletion effect.
 *
 * The reference's Log Out card is intentionally omitted: this app has no
 * authentication or logout implementation, so rendering it would be a dead
 * button. The reference's fake iOS status bar and home indicator are likewise
 * not rendered.
 */
export function ProfileFooter({ onDeleteAccount }: { onDeleteAccount: () => void }) {
  const theme = useAppTheme();
  const palette = profilePalette(theme.isDark);
  const { t } = useTranslate();

  const version = Application.nativeApplicationVersion ?? "1.0.0";
  const build = Application.nativeBuildVersion ?? "1";

  const confirmDelete = () => {
    Alert.alert(
      t(feedKey("feed.profile.footer.delete_title")),
      t(feedKey("feed.profile.footer.delete_body")),
      [
        { text: t(feedKey("feed.profile.footer.delete_cancel")), style: "cancel" },
        {
          text: t(feedKey("feed.profile.footer.delete_confirm")),
          style: "destructive",
          onPress: onDeleteAccount,
        },
      ],
    );
  };

  return (
    <S.Footer>
      <S.DangerButton
        $fill="rgba(255,59,48,0.10)"
        $stroke="rgba(255,59,48,0.22)"
        accessibilityRole="button"
        onPress={confirmDelete}
      >
        <S.DangerLabel $color={palette.destructiveLabel} numberOfLines={2} ellipsizeMode="tail">
          {t(feedKey("feed.profile.footer.delete_account"))}
        </S.DangerLabel>
      </S.DangerButton>
      <S.Version>{t(feedKey("feed.profile.footer.version"), { version, build })}</S.Version>
    </S.Footer>
  );
}

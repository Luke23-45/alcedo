import { HomeCard } from "@/components/presentation/home/shared/home-card";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useTranslate } from "@tolgee/react";
import { HeartGlyph } from "../shared/feed-glyphs";
import { feedKey } from "../shared/feed-i18n";
import * as S from "./profile-connected.styles";
import { profilePalette } from "./profile-tokens";
import { WatchGlyph } from "./profile-glyphs";

/**
 * CONNECTED card: two display-only status rows. The Health row reflects the
 * real health-export preference; the Watch row names the paired watch, or
 * "Not paired" — there is no watch-pairing API, so the reference's "Series 9"
 * is not rendered as fact. Rows carry no chevron: they navigate nowhere.
 */
export function ProfileConnected({
  healthConnected,
  watchName,
}: {
  healthConnected: boolean;
  /** Paired watch model name, or undefined when none is paired. */
  watchName?: string;
}) {
  const theme = useAppTheme();
  const palette = profilePalette(theme.isDark);
  const { t } = useTranslate();

  return (
    <HomeCard radius={28} pad={0}>
      <S.Row>
        <S.IconBox $tile={palette.healthTile}>
          <HeartGlyph size={17} color={palette.healthGlyph} filled />
        </S.IconBox>
        <S.TextCol>
          <S.Title $color={palette.value}>
            {t(feedKey("feed.profile.connected.health_title"))}
          </S.Title>
          <S.Subtitle $color={palette.tertiary}>
            {t(feedKey("feed.profile.connected.health_subtitle"))}
          </S.Subtitle>
        </S.TextCol>
        <S.Status $color={healthConnected ? palette.connectedGreen : palette.tertiary}>
          {healthConnected
            ? t(feedKey("feed.profile.connected.health_status"))
            : t(feedKey("feed.profile.connected.health_disconnected"))}
        </S.Status>
      </S.Row>
      <S.Divider $color={palette.divider} />
      <S.Row>
        <S.IconBox $tile={palette.watchTile}>
          <WatchGlyph size={17} color={palette.watchGlyph} />
        </S.IconBox>
        <S.TextCol>
          <S.Title $color={palette.value}>
            {t(feedKey("feed.profile.connected.watch_title"))}
          </S.Title>
          <S.Subtitle $color={palette.tertiary}>
            {t(feedKey("feed.profile.connected.watch_subtitle"))}
          </S.Subtitle>
        </S.TextCol>
        <S.Status $color={palette.watchStatus}>
          {watchName ?? t(feedKey("feed.profile.connected.watch_unpaired"))}
        </S.Status>
      </S.Row>
    </HomeCard>
  );
}

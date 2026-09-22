import { HomeCard } from "@/components/presentation/home/shared/home-card";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAppSelector } from "@/store";
import { useTranslate } from "@tolgee/react";
import { feedKey } from "../shared/feed-i18n";
import { formatCompactVolume } from "./profile-formatters";
import { profilePalette } from "./profile-tokens";
import * as S from "./profile-stats-strip.styles";

/** Public stats strip: sessions · day streak · kg lifted · followers. */
export function ProfileStatsStrip({
  sessionCount,
  streakDays,
  lifetimeKg,
  followersCount,
}: {
  sessionCount: number;
  streakDays: number;
  lifetimeKg: number;
  /** Real follower count from the feed store; 0 before anyone follows. */
  followersCount: number;
}) {
  const theme = useAppTheme();
  const palette = profilePalette(theme.isDark);
  const { t } = useTranslate();
  const locale = useAppSelector((x) => x.settings.preferredLanguage);
  const hairline = theme.isDark ? "rgba(255,255,255,0.08)" : palette.divider;
  const cells: { value: string; label: string }[] = [
    { value: `${sessionCount}`, label: t(feedKey("feed.profile.stats.sessions")) },
    { value: `${streakDays}`, label: t(feedKey("feed.profile.stats.streak")) },
    { value: formatCompactVolume(lifetimeKg, locale), label: t(feedKey("feed.profile.stats.volume")) },
    { value: `${followersCount}`, label: t(feedKey("feed.profile.stats.followers")) },
  ];
  return (
    <HomeCard radius={24} pad={0}>
      <S.Strip>
        {cells.map((cell, index) => (
          <S.Cell key={cell.label}>
            {index > 0 && <S.Divider $color={hairline} />}
            <S.Value $color={palette.value}>{cell.value}</S.Value>
            <S.Label $color={palette.tertiary}>{cell.label}</S.Label>
          </S.Cell>
        ))}
      </S.Strip>
    </HomeCard>
  );
}

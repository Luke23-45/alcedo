import { HomeCard } from "@/components/presentation/home/shared/home-card";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useAppSelector } from "@/store";
import { useTranslate } from "@tolgee/react";
import { useState } from "react";
import { feedKey } from "../shared/feed-i18n";
import { ChevronGlyph } from "./profile-glyphs";
import { formatGoalPercent, formatGrouped } from "./profile-formatters";
import { PROFILE, profilePalette } from "./profile-tokens";
import * as S from "./profile-goals.styles";
import { RingGoalSheet, type RingGoalKey } from "./ring-goal-sheet";
import { VolumeSlider } from "./volume-slider";

/**
 * Reference vertical rhythm (card-local): header 46, three 52pt ring rows
 * (dot cy at row center, label baseline at +31), 8pt gap, hairline at 210,
 * 34pt label row (baseline 236), 44pt slider (track at +8, thumb cy +11,
 * range labels baseline +36), 24pt caption (baseline +10) = 312.
 * 46 + 156 + 8 + 34 + 44 + 24 = 312.
 */

export interface RingGoals {
  move: number;
  exercise: number;
  stand: number;
}

/**
 * GOALS card: Daily Rings rows (each opens a real stepper editor committed to
 * the draft on Save) and the weekly volume goal slider with the live "now"
 * tick. The reference's "Synced to Apple Watch" line is omitted: there is no
 * watch pairing API, so the claim can't be verified.
 */
export function ProfileGoals({
  ringGoals,
  onRingGoalChange,
  volumeGoalKg,
  thisWeekKg,
  onVolumeGoalChange,
}: {
  ringGoals: RingGoals;
  onRingGoalChange: (key: RingGoalKey, value: number) => void;
  volumeGoalKg: number;
  thisWeekKg: number;
  onVolumeGoalChange: (goalKg: number) => void;
}) {
  const theme = useAppTheme();
  const palette = profilePalette(theme.isDark);
  const { t } = useTranslate();
  const [editing, setEditing] = useState<RingGoalKey | null>(null);
  const locale = useAppSelector((x) => x.settings.preferredLanguage);

  const rows: { key: RingGoalKey; label: string; value: string }[] = [
    {
      key: "move",
      label: t(feedKey("feed.profile.goals.move")),
      value: t(feedKey("feed.profile.goals.kcal"), { value: `${ringGoals.move}` }),
    },
    {
      key: "exercise",
      label: t(feedKey("feed.profile.goals.exercise")),
      value: t(feedKey("feed.profile.goals.min"), { value: `${ringGoals.exercise}` }),
    },
    {
      key: "stand",
      label: t(feedKey("feed.profile.goals.stand")),
      value: t(feedKey("feed.profile.goals.hr"), { value: `${ringGoals.stand}` }),
    },
  ];

  const ringRow = (index: 0 | 1 | 2) => {
    const row = rows[index]!;
    return (
      <S.RingRow
        accessibilityRole="button"
        accessibilityLabel={`${row.label}, ${row.value}`}
        onPress={() => setEditing(row.key)}
      >
        <S.Dot
          colors={[PROFILE.ringDots[row.key][0], PROFILE.ringDots[row.key][1]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <S.RingLabel $color={palette.label} numberOfLines={1} ellipsizeMode="tail">
          {row.label}
        </S.RingLabel>
        <S.RingValue $color={palette.value} style={{ fontVariant: ["tabular-nums"] }} numberOfLines={1} ellipsizeMode="tail">
          {row.value}
        </S.RingValue>
        <ChevronGlyph size={12} color={palette.chevron} />
      </S.RingRow>
    );
  };

  return (
    <HomeCard radius={30} pad={0}>
      <S.Header>
        <S.HeaderTitle $color={palette.value}>
          {t(feedKey("feed.profile.goals.daily_rings"))}
        </S.HeaderTitle>
      </S.Header>
      {ringRow(0)}
      {ringRow(1)}
      {ringRow(2)}
      <S.Divider $color={palette.divider} $top={98} />
      <S.Divider $color={palette.divider} $top={150} />
      <S.RowsGap />
      <S.Divider $color={theme.isDark ? "rgba(255,255,255,0.08)" : palette.divider} $top={210} />
      <S.VolumeHeader>
        <S.VolumeLabel $color={palette.label} numberOfLines={1} ellipsizeMode="tail">
          {t(feedKey("feed.profile.goals.weekly_volume"))}
        </S.VolumeLabel>
        <S.VolumeValue
          $color={palette.value}
          style={{ fontVariant: ["tabular-nums"] }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {t(feedKey("feed.profile.goals.weekly_volume_value"), {
            value: formatGrouped(volumeGoalKg, locale),
          })}
        </S.VolumeValue>
      </S.VolumeHeader>
      <VolumeSlider
        goalKg={volumeGoalKg}
        thisWeekKg={thisWeekKg}
        onGoalChange={onVolumeGoalChange}
        testID="weekly-volume-slider"
      />
      <S.CaptionWrap>
        <S.Caption $color={palette.tertiary}>
          {t(feedKey("feed.profile.goals.this_week"), {
            kg: formatGrouped(thisWeekKg, locale),
            percent: `${formatGoalPercent(thisWeekKg, volumeGoalKg)}`,
          })}
        </S.Caption>
      </S.CaptionWrap>
      {editing && (
        <RingGoalSheet
          goalKey={editing}
          value={ringGoals[editing]}
          onChange={(value) => onRingGoalChange(editing, value)}
          onClose={() => setEditing(null)}
        />
      )}
    </HomeCard>
  );
}

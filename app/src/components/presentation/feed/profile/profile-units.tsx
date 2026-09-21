import { HomeCard } from "@/components/presentation/home/shared/home-card";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useTranslate } from "@tolgee/react";
import type { ReactNode } from "react";
import { feedKey } from "../shared/feed-i18n";
import { formatBodyweightValue } from "./profile-formatters";
import { PROFILE, profilePalette } from "./profile-tokens";
import * as S from "./profile-units.styles";
import { SegmentedControl, type SegmentedOption } from "./segmented-control";

export type WeightUnitValue = "kg" | "lb";
export type DistanceUnitValue = "km" | "mi";
export type HeightUnitValue = "cm" | "ft";

/**
 * Reference: three 56 rows (label baseline at rowTop+40, segmented at
 * rowTop+20), hairlines drawn 6pt below rows 1–2 (they overlap the next row's
 * top padding, exactly as the reference draws them), then the 18pt
 * bodyweight line. 168 + 18 = 186.
 */

/**
 * UNITS & MEASUREMENT card: independent Weight / Distance / Height segmented
 * controls, each persisted to its own setting on Save. Changing Weight also
 * flips the legacy app-wide imperial toggle (it governs weight display), so
 * the two never disagree.
 */
export function ProfileUnits({
  weight,
  distance,
  height,
  onWeightChange,
  onDistanceChange,
  onHeightChange,
}: {
  weight: WeightUnitValue;
  distance: DistanceUnitValue;
  height: HeightUnitValue;
  onWeightChange: (value: WeightUnitValue) => void;
  onDistanceChange: (value: DistanceUnitValue) => void;
  onHeightChange: (value: HeightUnitValue) => void;
}) {
  const theme = useAppTheme();
  const palette = profilePalette(theme.isDark);
  const { t } = useTranslate();

  const weightOptions: SegmentedOption<WeightUnitValue>[] = [
    { value: "kg", label: t(feedKey("feed.profile.units.kg")) },
    { value: "lb", label: t(feedKey("feed.profile.units.lb")) },
  ];
  const distanceOptions: SegmentedOption<DistanceUnitValue>[] = [
    { value: "km", label: t(feedKey("feed.profile.units.km")) },
    { value: "mi", label: t(feedKey("feed.profile.units.mi")) },
  ];
  const heightOptions: SegmentedOption<HeightUnitValue>[] = [
    { value: "cm", label: t(feedKey("feed.profile.units.cm")) },
    { value: "ft", label: t(feedKey("feed.profile.units.ft")) },
  ];

  const row = (labelKey: string, control: ReactNode) => (
    <S.Row>
      <S.RowLabel $color={palette.label}>{t(feedKey(labelKey))}</S.RowLabel>
      {control}
    </S.Row>
  );

  return (
    <HomeCard radius={30} pad={0}>
      {row(
        "feed.profile.units.weight",
        <SegmentedControl
          options={weightOptions}
          value={weight}
          onChange={onWeightChange}
          width={120}
          thumbWidth={56}
          labelSize={11.5}
          testID="weight-units"
        />,
      )}
      {row(
        "feed.profile.units.distance",
        <SegmentedControl
          options={distanceOptions}
          value={distance}
          onChange={onDistanceChange}
          width={120}
          thumbWidth={56}
          labelSize={11.5}
          testID="distance-units"
        />,
      )}
      {row(
        "feed.profile.units.height",
        <SegmentedControl
          options={heightOptions}
          value={height}
          onChange={onHeightChange}
          width={120}
          thumbWidth={56}
          labelSize={11.5}
          testID="height-units"
        />,
      )}
      <S.Divider $color={palette.divider} $top={62} />
      <S.Divider $color={palette.divider} $top={118} />
      <S.BodyweightRow>
        <S.Bodyweight $color={palette.faint}>
          {t(feedKey("feed.profile.units.bodyweight"), {
            value: formatBodyweightValue(PROFILE.bodyweightKg, weight),
            unit: t(feedKey(weight === "kg" ? "feed.profile.units.kg" : "feed.profile.units.lb")),
          })}
        </S.Bodyweight>
      </S.BodyweightRow>
    </HomeCard>
  );
}

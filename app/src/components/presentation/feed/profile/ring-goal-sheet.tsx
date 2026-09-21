import { useAppTheme } from "@/hooks/useAppTheme";
import { useTranslate } from "@tolgee/react";
import { Modal } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as S from "./ring-goal-sheet.styles";
import { feedKey } from "../shared/feed-i18n";
import { PROFILE, profilePalette } from "./profile-tokens";

export type RingGoalKey = "move" | "exercise" | "stand";

const RING_LIMITS: Record<
  RingGoalKey,
  { min: number; max: number; step: number; unitKey: string }
> = {
  move: { min: 100, max: 2000, step: 50, unitKey: "feed.profile.ring_editor.move_unit" },
  exercise: { min: 10, max: 180, step: 5, unitKey: "feed.profile.ring_editor.exercise_unit" },
  stand: { min: 6, max: 24, step: 1, unitKey: "feed.profile.ring_editor.stand_unit" },
};

/**
 * Bottom-sheet stepper for one daily-ring goal. Steps edit the draft (Save
 * commits, Cancel discards); Done just closes the sheet.
 */
export function RingGoalSheet({
  goalKey,
  value,
  onChange,
  onClose,
}: {
  goalKey: RingGoalKey;
  value: number;
  onChange: (value: number) => void;
  onClose: () => void;
}) {
  const theme = useAppTheme();
  const palette = profilePalette(theme.isDark);
  const { t } = useTranslate();
  const insets = useSafeAreaInsets();
  const limits = RING_LIMITS[goalKey];

  const step = (direction: 1 | -1) => {
    const next = Math.min(limits.max, Math.max(limits.min, value + direction * limits.step));
    onChange(next);
  };

  const title =
    goalKey === "move"
      ? t(feedKey("feed.profile.ring_editor.move_title"))
      : goalKey === "exercise"
        ? t(feedKey("feed.profile.ring_editor.exercise_title"))
        : t(feedKey("feed.profile.ring_editor.stand_title"));

  return (
    <Modal transparent animationType="fade" onRequestClose={onClose}>
      <S.Backdrop
        accessibilityRole="button"
        accessibilityLabel={t(feedKey("feed.profile.ring_editor.cancel"))}
        onPress={onClose}
      />
      <S.Sheet
        $surface={palette.card}
        $border={palette.border}
        style={{ paddingBottom: insets.bottom + 20 }}
      >
        <S.SheetTitle $color={palette.value}>{title}</S.SheetTitle>
        <S.SheetRange $color={palette.tertiary}>
          {t(feedKey("feed.profile.ring_editor.range"), {
            min: `${limits.min}`,
            max: `${limits.max}`,
            unit: t(feedKey(limits.unitKey)),
          })}
        </S.SheetRange>
        <S.StepperRow>
          <S.StepButton
            $fill={palette.stepperFill}
            accessibilityRole="button"
            accessibilityLabel={t(feedKey("feed.profile.ring_editor.decrease"))}
            onPress={() => step(-1)}
          >
            <S.StepGlyph $color={palette.value}>−</S.StepGlyph>
          </S.StepButton>
          <S.StepValue $color={palette.value} accessibilityLiveRegion="polite">
            {`${value} ${t(feedKey(limits.unitKey))}`}
          </S.StepValue>
          <S.StepButton
            $fill={palette.stepperFill}
            accessibilityRole="button"
            accessibilityLabel={t(feedKey("feed.profile.ring_editor.increase"))}
            onPress={() => step(1)}
          >
            <S.StepGlyph $color={palette.value}>+</S.StepGlyph>
          </S.StepButton>
        </S.StepperRow>
        <S.DoneButton accessibilityRole="button" onPress={onClose}>
          <S.DoneFill
            colors={[PROFILE.brandGradient[0], PROFILE.brandGradient[1], PROFILE.brandGradient[2]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <S.DoneLabel>{t(feedKey("feed.profile.ring_editor.done"))}</S.DoneLabel>
        </S.DoneButton>
        <S.CancelButton accessibilityRole="button" onPress={onClose}>
          <S.CancelLabel $color={palette.secondary}>
            {t(feedKey("feed.profile.ring_editor.cancel"))}
          </S.CancelLabel>
        </S.CancelButton>
      </S.Sheet>
    </Modal>
  );
}

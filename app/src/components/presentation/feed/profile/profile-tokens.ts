/**
 * Pixel-spec tokens for the Phase 5 Profile Editor, measured off
 * docs/new_design/social-dark.md (SCREEN 4) and its light-mode delta table.
 * Geometry is identical in both modes; only color ramps change.
 */
import { type as resolveType, type AppTheme } from "@/styles/theme";

/**
 * The profile editor's text family, sourced from the typed theme (`type()`),
 * never the legacy `theme.font` bag. Shared so every section stays on the
 * same stack without re-resolving per styled component.
 */
export function profileFontFamily(theme: AppTheme): string {
  return resolveType(theme, "body").fontFamily;
}

/** Profile visibility choices for the privacy segmented control. */
export type VisibilityValue = "public" | "friends" | "private";

export const PROFILE = {
  /** Screen side margin; every card is 361pt wide on a 393pt canvas. */
  margin: 16,
  cardWidth: 361,
  /** Inner content inset: text starts at x=36 on cards starting at x=16. */
  inset: 20,
  /** Section titles sit at x=24. */
  sectionX: 24,
  /** The 3-stop brand gradient (camera badge, slider fill, thumb core). Identical in both modes. */
  brandGradient: ["#FFB03A", "#FF6A3D", "#FF2D55"] as const,
  /** Avatar gradient (#5856D6→#BF5AF2) — an identity, not a surface; identical in both modes. */
  avatarGradient: ["#5856D6", "#BF5AF2"] as const,
  /**
   * The three dots are the exact home-ring hues. Home renders each ring as a
   * 2-stop gradient (see activity-rings.tsx RING_SPECS), so the dots use the
   * same gradient pairs rather than the flat approximations in the spec text.
   */
  ringDots: {
    move: ["#FF0A47", "#FF7A96"] as const,
    exercise: ["#8BE000", "#D6FF52"] as const,
    stand: ["#009DFF", "#2CE9F7"] as const,
  },
  /** Contract bodyweight shown under the Weight row. */
  bodyweightKg: 80.6,
  /** Slider geometry, measured off the reference (verification log ✓). */
  slider: {
    trackX: 36,
    trackWidth: 321,
    min: 20000,
    max: 50000,
    step: 500,
  },
} as const;

export interface ProfilePalette {
  navTitle: string;
  cancel: string;
  save: string;
  /** Screen base color and the 3-stop background wash (spec `#bg`). */
  screen: string;
  screenGradient: [string, string, string];
  value: string;
  label: string;
  secondary: string;
  tertiary: string;
  faint: string;
  bio: string;
  divider: string;
  chevron: string;
  toggleOn: string;
  toggleOff: string;
  segmentedTrack: string;
  segmentedThumb: string;
  segmentedThumbShadow: boolean;
  sliderTrack: string;
  sliderThumbShadow: string;
  destructiveLabel: string;
  connectedGreen: string;
  watchStatus: string;
  avatarKnockout: string;
  healthGlyph: string;
  healthTile: string;
  watchGlyph: string;
  watchTile: string;
  /** Sheet surface, hairline border, stepper/input fill. */
  card: string;
  border: string;
  stepperFill: string;
}

export function profilePalette(isDark: boolean): ProfilePalette {
  return isDark
    ? {
        navTitle: "#FFFFFF",
        cancel: "#8E8E93",
        save: "#FF9F0A",
        screen: "#08080B",
        screenGradient: ["#0B0B0E", "#050507", "#08080B"],
        value: "#FFFFFF",
        label: "#F5F5F7",
        secondary: "#98989F",
        tertiary: "#86868B",
        faint: "#6C6C70",
        bio: "#E5E5EA",
        divider: "rgba(255,255,255,0.06)",
        chevron: "#48484A",
        toggleOn: "#30D158",
        toggleOff: "rgba(255,255,255,0.14)",
        segmentedTrack: "rgba(255,255,255,0.06)",
        segmentedThumb: "rgba(255,255,255,0.14)",
        segmentedThumbShadow: false,
        sliderTrack: "rgba(255,255,255,0.09)",
        sliderThumbShadow: "black",
        destructiveLabel: "#FF6B60",
        connectedGreen: "#30D158",
        watchStatus: "#98989F",
        avatarKnockout: "#0B0B0E",
        healthGlyph: "#FF6A88",
        healthTile: "rgba(255,45,85,0.15)",
        watchGlyph: "#5EDCF0",
        watchTile: "rgba(0,217,233,0.15)",
        card: "#17171A",
        border: "rgba(255,255,255,0.08)",
        stepperFill: "rgba(255,255,255,0.09)",
      }
    : {
        navTitle: "#000000",
        cancel: "#007AFF",
        save: "#007AFF",
        screen: "#F2F2F7",
        screenGradient: ["#F7F7FA", "#F2F2F7", "#EDEDF2"],
        value: "#1C1C1E",
        label: "#1C1C1E",
        secondary: "#6E6E73",
        tertiary: "#8E8E93",
        faint: "#8E8E93",
        bio: "#1C1C1E",
        divider: "rgba(60,60,67,0.12)",
        chevron: "#C7C7CC",
        toggleOn: "#34C759",
        toggleOff: "rgba(120,120,128,0.20)",
        segmentedTrack: "rgba(120,120,128,0.12)",
        segmentedThumb: "#FFFFFF",
        segmentedThumbShadow: true,
        sliderTrack: "rgba(120,120,128,0.16)",
        sliderThumbShadow: "light",
        destructiveLabel: "#D70015",
        connectedGreen: "#34C759",
        watchStatus: "#6E6E73",
        avatarKnockout: "#F2F2F6",
        healthGlyph: "#FF6A88",
        healthTile: "rgba(255,45,85,0.15)",
        watchGlyph: "#5EDCF0",
        watchTile: "rgba(0,217,233,0.15)",
        card: "#FFFFFF",
        border: "rgba(60,60,67,0.12)",
        stepperFill: "rgba(120,120,128,0.14)",
      };
}

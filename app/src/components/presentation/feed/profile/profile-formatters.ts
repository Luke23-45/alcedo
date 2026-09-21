import { PROFILE } from "./profile-tokens";

/**
 * Compact volume for the stats strip: 1,284,600 → "1.28M" (contract ✓),
 * 8,420 → "8.4K", anything smaller renders whole.
 */
export function formatCompactVolume(kg: number): string {
  if (kg >= 1_000_000) return `${(kg / 1_000_000).toFixed(2)}M`;
  if (kg >= 1_000) return `${(kg / 1_000).toFixed(1)}K`;
  return `${Math.round(kg)}`;
}

/** Grouped thousands for the slider caption and goal label: 34,340. */
export function formatGrouped(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}

/** Whole percent for the slider caption: 34,340 / 35,000 → 98. */
export function formatGoalPercent(thisWeekKg: number, goalKg: number): number {
  if (goalKg <= 0) return 0;
  return Math.round((thisWeekKg / goalKg) * 100);
}

/** kg → lb is ×2.20462 (same factor as the Weight model). Renders with one decimal. */
export function formatBodyweightValue(kg: number, unit: "kg" | "lb"): string {
  const value = unit === "kg" ? kg : kg * 2.20462;
  return value.toFixed(1);
}

const { trackX, trackWidth, min, max, step } = PROFILE.slider;

/** Slider thumb center-x for a goal value, measured off the reference (x=196.5 at 35,000 ✓). */
export function sliderXForValue(valueKg: number): number {
  const clamped = Math.min(max, Math.max(min, valueKg));
  return trackX + ((clamped - min) / (max - min)) * trackWidth;
}

/** Goal value for a thumb center-x, clamped to 20k–50k and snapped to 500. */
export function sliderValueForX(x: number): number {
  const raw = min + ((x - trackX) / trackWidth) * (max - min);
  const clamped = Math.min(max, Math.max(min, raw));
  return Math.round(clamped / step) * step;
}

/** "Now" tick x for this week's volume: x=189.4 at 34,340 ✓. Clamped to the track. */
export function sliderXForNow(thisWeekKg: number): number {
  return sliderXForValue(thisWeekKg);
}

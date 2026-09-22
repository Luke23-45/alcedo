import { PROFILE } from "./profile-tokens";

/**
 * Locale-aware number formatters, cached per locale exactly like
 * useFormatNumber's formatterFor. Page 10 removed the last `en-US`
 * hard-codes from the composer; the profile follows the same rule —
 * preferredLanguage drives every rendered number.
 */
const groupedFormatters = new Map<string | undefined, Intl.NumberFormat>();
function groupedFormatter(locale: string | undefined): Intl.NumberFormat {
  let cached = groupedFormatters.get(locale);
  if (!cached) {
    cached = new Intl.NumberFormat(locale);
    groupedFormatters.set(locale, cached);
  }
  return cached;
}

const compactPartsFormatters = new Map<string, { m: Intl.NumberFormat; k: Intl.NumberFormat }>();
function compactPartsFor(locale: string | undefined): { m: Intl.NumberFormat; k: Intl.NumberFormat } {
  const key = locale ?? "system";
  let cached = compactPartsFormatters.get(key);
  if (!cached) {
    cached = {
      m: new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      k: new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
    };
    compactPartsFormatters.set(key, cached);
  }
  return cached;
}

/**
 * Compact volume for the stats strip: 1,284,600 → "1.28M" (contract ✓),
 * 8,420 → "8.4K", anything smaller renders whole. The design's M/K
 * thresholds stay fixed; the digits follow the user's locale.
 */
export function formatCompactVolume(kg: number, locale?: string): string {
  if (kg >= 1_000_000) return `${compactPartsFor(locale).m.format(kg / 1_000_000)}M`;
  if (kg >= 1_000) return `${compactPartsFor(locale).k.format(kg / 1_000)}K`;
  return groupedFormatter(locale).format(Math.round(kg));
}

/** Grouped thousands for the slider caption and goal label: 34,340. */
export function formatGrouped(value: number, locale?: string): string {
  return groupedFormatter(locale).format(Math.round(value));
}

/** Whole percent for the slider caption: 34,340 / 35,000 → 98. */
export function formatGoalPercent(thisWeekKg: number, goalKg: number): number {
  if (goalKg <= 0) return 0;
  return Math.round((thisWeekKg / goalKg) * 100);
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

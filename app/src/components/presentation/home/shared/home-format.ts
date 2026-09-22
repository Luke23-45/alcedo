/**
 * Device-locale grouped number formatting for home figures (volumes, grams,
 * kcal). Never hardcode `en-US` — German devices group with `.`, not `,`.
 * Fraction digits are always zero: home figures are whole units by design.
 */
export function formatGrouped(value: number): string {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value);
}

/** Device-locale litres with exactly two fractions (hydration readout). */
export function formatLitres(value: number): string {
  return new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

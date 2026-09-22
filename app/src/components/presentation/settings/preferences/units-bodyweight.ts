import type { Weight } from '@/models/weight';

/**
 * The formatted bodyweight for the Units card caption (e.g. "80.6kg"),
 * converted into the selected unit. Undefined when there is no recorded
 * bodyweight — the card then shows its unit-neutral caption instead of
 * inventing one.
 */
export function formatUnitsBodyweight(bodyweight: Weight | undefined, weightUnit: 'kg' | 'lb'): string | undefined {
  if (!bodyweight) {
    return undefined;
  }
  const unit = weightUnit === 'lb' ? 'pounds' : 'kilograms';
  return bodyweight.convertTo(unit).shortLocaleFormat(1);
}

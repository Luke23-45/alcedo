export type SegmentedSize = 'large' | 'small';

/**
 * Index of the selected option in a PreferenceSegmented control. A value
 * that matches no option clamps to the first segment rather than producing
 * a negative thumb offset.
 */
export function segmentedIndex<T extends string>(options: readonly { value: T }[], value: T): number {
  return Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );
}

/**
 * Sliding-thumb geometry for a PreferenceSegmented control.
 * Spec-measured fit: the large thumb overshoots its segment by 2pt per
 * side; the small thumb insets by 2pt.
 */
export function segmentedThumb(
  index: number,
  segmentWidth: number,
  size: SegmentedSize,
): { offset: number; width: number } {
  const thumbDelta = size === 'large' ? 4 : -4;
  return { offset: index * segmentWidth - thumbDelta / 2, width: segmentWidth + thumbDelta };
}

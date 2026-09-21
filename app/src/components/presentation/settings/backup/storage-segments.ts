/**
 * Storage bar segments (settings-dark.md Screen 6): exact proportions of the
 * 321pt bar, with dark/light colors. Pure data module so the proportions are
 * unit-testable (see storage-segments.spec.ts).
 *
 * The 2.9% remote-backup sliver is never inflated.
 */
export const STORAGE_SEGMENTS = [
  { flex: 9.6, dark: '#0A84FF', light: '#007AFF' },
  { flex: 252.3, dark: '#FF9F0A', light: '#E07800' },
  { flex: 59.1, dark: '#FF2D55', light: '#D70015' },
] as const;

/** Total bar width in points — the segments must sum to exactly this. */
export const STORAGE_BAR_WIDTH = 321;

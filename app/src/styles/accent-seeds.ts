import type { ColorSchemeSeed } from '@/store/settings/codecs';
import { palette } from './theme';

/**
 * Accent seed ramps for Preferences → Appearance (Phase 6, Screen 2).
 *
 * The stored `colorSchemeSeed` is a hex string (or 'default'), so the swatch
 * hex doubles as the persisted value — no codec changes needed. Swatch hues
 * are spec-exact (settings-dark.md Screen 2); pressed/bright steps are
 * computed by mixing toward black/white so every seed gets a physically
 * consistent ramp instead of eyeballed hexes. Ember reuses the real ember
 * ramp so the AA-tested CTA fill (#CE4A08) is unchanged.
 */

export type AccentSeedId = 'ember' | 'crimson' | 'blue' | 'green' | 'purple';

export interface AccentSeed {
  id: AccentSeedId;
  /** The swatch hex; also the persisted `colorSchemeSeed` value. */
  swatch: ColorSchemeSeed;
  /** The one high-energy fill (interactive.accent). */
  accent: string;
  accentPressed: string;
  /** Graphics only — gradients, glows, chart strokes. */
  accentBright: string;
  /** Three-stop gradient rendered for the Ember swatch. */
  gradient: readonly [string, string, string] | undefined;
}

function mix(hex: string, toward: string, amount: number): string {
  const px = (h: string, i: number) => parseInt(h.slice(i, i + 2), 16);
  const r = Math.round(px(hex, 1) + (px(toward, 1) - px(hex, 1)) * amount);
  const g = Math.round(px(hex, 3) + (px(toward, 3) - px(hex, 3)) * amount);
  const b = Math.round(px(hex, 5) + (px(toward, 5) - px(hex, 5)) * amount);
  const to = (n: number) =>
    Math.max(0, Math.min(255, n))
      .toString(16)
      .padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`.toUpperCase();
}

function rampFromSwatch(id: AccentSeedId, swatch: ColorSchemeSeed): AccentSeed {
  return {
    id,
    swatch,
    accent: swatch,
    accentPressed: mix(swatch, '#000000', 0.16),
    accentBright: mix(swatch, '#FFFFFF', 0.22),
    gradient: undefined,
  };
}

export const ACCENT_SEEDS: Record<AccentSeedId, AccentSeed> = {
  ember: {
    id: 'ember',
    swatch: palette.ember[650] as ColorSchemeSeed,
    accent: palette.ember[650],
    accentPressed: palette.ember[700],
    accentBright: palette.ember[500],
    // Spec-exact brand gradient for the Ember swatch.
    gradient: ['#FFB03A', '#FF6A3D', '#FF2D55'],
  },
  crimson: rampFromSwatch('crimson', '#FF2D55'),
  blue: rampFromSwatch('blue', '#0A84FF'),
  green: rampFromSwatch('green', '#30D158'),
  purple: rampFromSwatch('purple', '#AF52DE'),
};

export const ACCENT_SEED_IDS = Object.keys(ACCENT_SEEDS) as AccentSeedId[];

/** Resolves the stored hex (or 'default') to a seed; unknown values → ember. */
export function accentSeedFor(stored: string | undefined): AccentSeed {
  const normalized = stored?.toUpperCase();
  const found = ACCENT_SEED_IDS.find((id) => ACCENT_SEEDS[id].swatch.toUpperCase() === normalized);
  return found ? ACCENT_SEEDS[found] : ACCENT_SEEDS.ember;
}

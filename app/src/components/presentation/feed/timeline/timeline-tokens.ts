/**
 * Feed Timeline (Screen 1) design tokens.
 *
 * Exact values from docs/new_design/social-dark.md, centralised so no magic
 * literals are scattered across the timeline's paired style modules. These
 * are screen-specific by design: they intentionally do NOT come from the
 * global semantic theme, whose values differ (e.g. the theme's
 * `content.secondary` is blue-tinted, while the spec's meta grey is #86868B;
 * the theme's dark primary is #F4F8FD, the spec's title white is #FFFFFF).
 * Using global tokens here would break the pixel-perfect mandate.
 *
 * Conventions:
 * - `{ dark, light }` pairs resolve against the `$dark` prop in styles or the
 *   `useAppTheme().isDark` flag in components.
 * - Gradient stop arrays are `as const` tuples for expo-linear-gradient.
 * - Posters and the gold hero are images — they do not theme (per the spec's
 *   light-mode table), so their tokens are mode-independent.
 */

/* ── Card shell ─────────────────────────────────────────────────── */

export const TIMELINE_CARD_RADIUS = 28;
export const TIMELINE_CARD_HEIGHT = 388;

export const CARD_BODY_DARK = ['#1F1F23', '#17171A', '#131316'] as const;
export const CARD_BODY_LIGHT = ['#FFFFFF', '#FAFAFC'] as const;
export const CARD_BODY_LOCATIONS = [0, 0.55, 1] as const;

/** 1pt vertical edge gradient — the card's lit-from-above definition. */
export const CARD_EDGE_DARK = ['rgba(255,255,255,0.17)', 'rgba(255,255,255,0.06)', 'rgba(255,255,255,0.025)'] as const;
export const CARD_EDGE_LIGHT = ['rgba(0,0,0,0.045)', 'rgba(0,0,0,0.08)', 'rgba(0,0,0,0.115)'] as const;
export const CARD_EDGE_LOCATIONS = [0, 0.35, 1] as const;

/** The spec's `fc` drop filter (dy 10, blur 14, black 50%); softened in light. */
export const CARD_SHADOW = {
  dark: { color: '#000000', offsetY: 10, opacity: 0.5, radius: 14, elevation: 10 },
  light: { color: '#000000', offsetY: 8, opacity: 0.1, radius: 16, elevation: 6 },
} as const;

/* ── Ink ────────────────────────────────────────────────────────── */

export const INK_TITLE = { dark: '#FFFFFF', light: '#1C1C1E' } as const;
export const INK_BODY = { dark: '#E5E5EA', light: '#1C1C1E' } as const;
export const INK_META = { dark: '#86868B', light: '#8E8E93' } as const;
export const INK_FAINT = { dark: '#6C6C70', light: '#8E8E93' } as const;
export const INK_CHIP_LABEL = { dark: '#C7C7CC', light: '#3C3C43' } as const;
export const HAIRLINE = { dark: 'rgba(255,255,255,0.07)', light: 'rgba(0,0,0,0.08)' } as const;

/* ── Controls ───────────────────────────────────────────────────── */

export const CHIP_FILL = { dark: 'rgba(255,255,255,0.07)', light: 'rgba(120,120,128,0.12)' } as const;
export const CHIP_STROKE = { dark: 'rgba(255,255,255,0.09)', light: 'rgba(0,0,0,0.10)' } as const;
export const CHIP_SELECTED_FILL = { dark: '#FFFFFF', light: '#1C1C1E' } as const;
export const CHIP_SELECTED_INK = { dark: '#1C1C1E', light: '#FFFFFF' } as const;

/** 152×42 "Load earlier" pill. */
export const LOAD_FILL = { dark: 'rgba(255,255,255,0.07)', light: 'rgba(120,120,128,0.12)' } as const;
export const LOAD_STROKE = { dark: 'rgba(255,255,255,0.10)', light: 'rgba(0,0,0,0.08)' } as const;

/** Nav-bar compose target: 44pt hit area carrying a 34pt circle. */
export const COMPOSE_CIRCLE = { dark: 'rgba(255,255,255,0.07)', light: 'rgba(120,120,128,0.12)' } as const;
export const COMPOSE_PENCIL = { dark: '#E8E8ED', light: '#1C1C1E' } as const;

/* ── Challenge banner ───────────────────────────────────────────── */

export const CHALLENGE_GRADIENT = ['#FFB03A', '#FF6A3D', '#FF2D55'] as const;
export const CHALLENGE_GRADIENT_LOCATIONS = [0, 0.45, 1] as const;
export const CHALLENGE_RANK_INK = { dark: '#FFB84D', light: '#B26A00' } as const;
export const CHALLENGE_TRACK = { dark: 'rgba(255,255,255,0.10)', light: 'rgba(0,0,0,0.08)' } as const;

/** Gold medallion gradient (banner) — also the milestone hero's base. */
export const GOLD_GRADIENT = ['#FFF0BE', '#FFD84D', '#D9A441'] as const;
export const GOLD_GRADIENT_LOCATIONS = [0, 0.45, 1] as const;
export const MEDALLION_EDGE = 'rgba(255,255,255,0.35)';
export const MEDALLION_GLOW = '#FFD84D';

/* ── Gold milestone hero (poster — does not theme) ───────────────── */

export const HERO_EDGE = 'rgba(255,255,255,0.40)';
export const HERO_GLOSS = ['rgba(255,255,255,0.32)', 'rgba(255,255,255,0)'] as const;
export const HERO_INK_VALUE = '#2B1E00';
export const HERO_INK_UNIT = '#5C4300';
export const HERO_INK_SUB = '#7A5A00';
/** Poster drop shadow (dy 8, blur 12, black 45%). */
export const HERO_SHADOW = { color: '#000000', offsetY: 8, opacity: 0.45, radius: 12, elevation: 8 } as const;
/** Darkened medallion disc on the gold hero. */
export const HERO_MEDALLION_FILL = 'rgba(0,0,0,0.13)';

/* ── Atmospheric background ─────────────────────────────────────── */
export const FEED_BG_DARK = ['#0B0B0E', '#050507', '#08080B'] as const;
export const FEED_BG_LIGHT = ['#F8F8FC', '#F1F1F6', '#F3F3F8'] as const;
export const FEED_BG_LOCATIONS = [0, 0.5, 1] as const;

export interface FeedAura {
  id: string;
  color: string;
  opacity: number;
  cx: number;
  cy: number;
  r: number;
}

/** Red .16 / purple .12 / blue .10 auras at the spec's coordinates. */
export const FEED_AURAS_DARK: readonly FeedAura[] = [
  { id: 'feedAuraRed', color: '#FF2D55', opacity: 0.16, cx: 60, cy: 200, r: 300 },
  { id: 'feedAuraPurple', color: '#BF5AF2', opacity: 0.12, cx: 375, cy: 1000, r: 330 },
  { id: 'feedAuraBlue', color: '#0A84FF', opacity: 0.1, cx: 30, cy: 1700, r: 300 },
] as const;

export const FEED_AURAS_LIGHT: readonly FeedAura[] = [
  { id: 'feedAuraRed', color: '#FF2D55', opacity: 0.05, cx: 60, cy: 200, r: 300 },
  { id: 'feedAuraPurple', color: '#AF52DE', opacity: 0.045, cx: 375, cy: 1000, r: 330 },
  { id: 'feedAuraBlue', color: '#007AFF', opacity: 0.04, cx: 30, cy: 1700, r: 300 },
] as const;

/* ── Avatars & refresh ──────────────────────────────────────────── */

/** Avatar knockout stroke: #17171A dark, #FFFFFF light (spec light table). */
export const AVATAR_RING = { dark: '#17171A', light: '#FFFFFF' } as const;

/** Pull-to-refresh spinner tint. */
export const REFRESH_TINT = { dark: '#FFFFFF', light: '#8E8E93' } as const;

import type { AppTheme } from '@/styles/theme';

/**
 * Pixel specs for the onboarding flow, lifted from `docs/new_design/onboading`.
 * The SVGs are the visual contract; this module is the single place where raw
 * design values live so the style files stay theme-driven.
 */

export const ONBOARDING_PAGE_COUNT = 3;

/** Aura geometry per page, in the 393x852 reference space. */
export const ONBOARDING_AURAS = [
  {
    a: { cx: 60, cy: 160, r: 290 },
    b: { cx: 375, cy: 640, r: 320 },
  },
  {
    a: { cx: 330, cy: 200, r: 280 },
    b: { cx: 40, cy: 700, r: 280 },
  },
  {
    a: { cx: 60, cy: 180, r: 280 },
    b: { cx: 360, cy: 700, r: 300 },
  },
] as const;

export interface OnboardingAuraColor {
  color: string;
  opacity: number;
}

export interface OnboardingColors {
  backgroundStops: readonly [string, string, string];
  auraA: OnboardingAuraColor;
  auraB: OnboardingAuraColor;
  cardStops: readonly [string, string, string];
  cardEdgeStops: readonly [string, string, string];
  cardShadowColor: string;
  cardShadowOpacity: number;
  cardShadowOffsetY: number;
  cardShadowRadius: number;
  /** Secondary text: subtitles, "Previous", picker values. */
  secondary: string;
  /** Row supporting text and section labels. */
  supporting: string;
  sectionLabel: string;
  chevron: string;
  divider: string;
  switchOn: string;
  switchOff: string;
  knobShadowOpacity: number;
  defaultPillFill: string;
  defaultPillRing: string;
  /** Right-edge fade over the seed scroller, from card fill to transparent. */
  scrollerFadeFrom: string;
}

export function onboardingColors(theme: AppTheme, page: number): OnboardingColors {
  const dark = theme.isDark;
  const auraTable: Array<{ a: OnboardingAuraColor; b: OnboardingAuraColor }> = dark
    ? [
        { a: { color: '#FF2D55', opacity: 0.15 }, b: { color: '#0A84FF', opacity: 0.14 } },
        { a: { color: '#AF52DE', opacity: 0.14 }, b: { color: '#0A84FF', opacity: 0.14 } },
        { a: { color: '#FF3B30', opacity: 0.14 }, b: { color: '#0A84FF', opacity: 0.14 } },
      ]
    : [
        { a: { color: '#FF2D55', opacity: 0.09 }, b: { color: '#007AFF', opacity: 0.075 } },
        { a: { color: '#AF52DE', opacity: 0.075 }, b: { color: '#007AFF', opacity: 0.075 } },
        { a: { color: '#FF3B30', opacity: 0.07 }, b: { color: '#007AFF', opacity: 0.075 } },
      ];
  const auras = auraTable[page] ?? auraTable[0]!;
  return {
    backgroundStops: dark ? ['#0A0A0C', '#050507', '#08080A'] : ['#F8F8FC', '#F1F1F6', '#F3F3F8'],
    auraA: auras.a,
    auraB: auras.b,
    cardStops: dark ? ['#1F1F23', '#17171A', '#131316'] : ['#FFFFFF', '#FDFDFF', '#FAFAFC'],
    cardEdgeStops: dark
      ? ['rgba(255,255,255,0.17)', 'rgba(255,255,255,0.06)', 'rgba(255,255,255,0.025)']
      : ['rgba(0,0,0,0.045)', 'rgba(0,0,0,0.06)', 'rgba(0,0,0,0.115)'],
    cardShadowColor: dark ? '#000000' : '#14142B',
    cardShadowOpacity: dark ? 0.5 : 0.075,
    cardShadowOffsetY: dark ? 10 : 8,
    cardShadowRadius: dark ? 14 : 16,
    secondary: dark ? '#98989F' : '#636366',
    supporting: dark ? '#86868B' : '#8E8E93',
    sectionLabel: dark ? '#86868B' : '#8E8E93',
    chevron: dark ? '#86868B' : '#787880',
    divider: dark ? 'rgba(255,255,255,0.06)' : 'rgba(60,60,67,0.12)',
    switchOn: dark ? '#30D158' : '#34C759',
    switchOff: dark ? 'rgba(255,255,255,0.14)' : 'rgba(120,120,128,0.16)',
    knobShadowOpacity: dark ? 0.55 : 0.18,
    defaultPillFill: dark ? 'rgba(255,255,255,0.10)' : 'rgba(120,120,128,0.12)',
    defaultPillRing: dark ? 'rgba(255,255,255,0.85)' : 'rgba(28,28,30,0.85)',
    scrollerFadeFrom: dark ? '#17171A' : '#FDFDFF',
  };
}

export type OnboardingTileKind = 'units' | 'schedule' | 'language' | 'notifications' | 'feed' | 'health';

export interface OnboardingTile {
  /** Tinted tile fill. */
  tile: string;
  /** Glyph tint. */
  glyph: string;
}

/**
 * Icon-tile specs per row, from the mocks. Monochrome glyphs resolve to the
 * theme's primary content color (#F5F5F7-ish on dark, #1C1C1E-ish on light).
 */
export function onboardingTile(theme: AppTheme, kind: OnboardingTileKind): OnboardingTile {
  const dark = theme.isDark;
  const tileAlphas: Record<OnboardingTileKind, number> = dark
    ? { units: 0.15, schedule: 0.16, language: 0.16, notifications: 0.15, feed: 0.16, health: 0.15 }
    : { units: 0.12, schedule: 0.12, language: 0.12, notifications: 0.12, feed: 0.12, health: 0.12 };
  const tileFills: Record<OnboardingTileKind, [number, number, number]> = {
    units: [255, 159, 10],
    schedule: [10, 132, 255],
    language: [175, 82, 222],
    notifications: [255, 59, 48],
    feed: [10, 132, 255],
    health: [255, 45, 85],
  };
  const glyphs: Record<OnboardingTileKind, string> = dark
    ? {
        units: '#FFB84D',
        schedule: '#5EB0FF',
        language: '#C77DFF',
        notifications: '#FF6B60',
        feed: '#5EB0FF',
        health: '#FF6A88',
      }
    : {
        units: '#E07800',
        schedule: '#0A84FF',
        language: '#7B5CFF',
        notifications: '#E8003F',
        feed: '#0A84FF',
        health: '#E8003F',
      };
  const [r, g, b] = tileFills[kind]!;
  return { tile: `rgba(${r},${g},${b},${tileAlphas[kind]})`, glyph: glyphs[kind]! };
}

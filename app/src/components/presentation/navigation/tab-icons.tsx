import type { ReactElement } from 'react';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';

/**
 * Bottom tab bar glyphs — the custom Kinetic HIG icon system.
 *
 * Geometry is transcribed verbatim from the production symbols in
 * docs/new_design/tab-bar-icons.svg (24×24 viewport, centered at the origin).
 * Outline variants use the spec's 2.0pt continuous rounded stroke; filled
 * variants use true evenodd compound paths for cutouts so the tint shows
 * through — no fake white knockouts.
 */

export type TabIconName = 'workout' | 'feed' | 'stats' | 'history' | 'settings';

interface GlyphProps {
  color: string;
}

const VIEW_BOX = '-12 -12 24 24';

/* ------------------------------------------------------------------ *
 * 1. WORKOUT — Olympic barbell, graduated dual plates
 * ------------------------------------------------------------------ */

export function WorkoutOutlineGlyph({ color }: GlyphProps) {
  return (
    <G fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect x={-10} y={-8} width={4} height={16} rx={2} />
      <Rect x={-5.7} y={-5} width={3.4} height={10} rx={1.7} />
      <Rect x={2.3} y={-5} width={3.4} height={10} rx={1.7} />
      <Rect x={6} y={-8} width={4} height={16} rx={2} />
      <Path d="M-11.8 0 H-10 M-2.3 0 H2.3 M10 0 H11.8" />
    </G>
  );
}

export function WorkoutFilledGlyph({ color }: GlyphProps) {
  return (
    <G fill={color}>
      <Rect x={-10} y={-8} width={4} height={16} rx={2} />
      <Rect x={-5.7} y={-5} width={3.4} height={10} rx={1.7} />
      <Rect x={2.3} y={-5} width={3.4} height={10} rx={1.7} />
      <Rect x={6} y={-8} width={4} height={16} rx={2} />
      <Rect x={-12} y={-1.2} width={2} height={2.4} rx={1} />
      <Rect x={-2.3} y={-1.2} width={4.6} height={2.4} rx={1} />
      <Rect x={10} y={-1.2} width={2} height={2.4} rx={1} />
    </G>
  );
}

/* ------------------------------------------------------------------ *
 * 2. FEED — conversational social mesh (dual dialogue capsules)
 * ------------------------------------------------------------------ */

export function FeedOutlineGlyph({ color }: GlyphProps) {
  return (
    <G fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3.5 -9.5 H-6 Q-10 -9.5 -10 -5.5 V0.5" />
      <Rect x={-4} y={-3.5} width={15} height={11} rx={4} />
      <Path d="M1 7.5 L-3 10.8 L-1 7.5" />
    </G>
  );
}

export function FeedFilledGlyph({ color }: GlyphProps) {
  return (
    <G fill={color}>
      <Rect x={-10} y={-9.5} width={13} height={10} rx={4} />
      <Rect x={-4} y={-3.5} width={15} height={11} rx={4} />
      <Path d="M1 7 L-3.5 11 L-0.5 7 Z" />
    </G>
  );
}

/* ------------------------------------------------------------------ *
 * 3. STATS — 3-tier volume histogram on a continuous ground plane
 * ------------------------------------------------------------------ */

export function StatsOutlineGlyph({ color }: GlyphProps) {
  return (
    <G fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M-11 10 H11" />
      <Rect x={-9.5} y={2} width={4} height={8} rx={2} />
      <Rect x={-2} y={-2} width={4} height={12} rx={2} />
      <Rect x={5.5} y={-6} width={4} height={16} rx={2} />
    </G>
  );
}

export function StatsFilledGlyph({ color }: GlyphProps) {
  return (
    <G fill={color}>
      <Rect x={-11} y={8.8} width={22} height={2.4} rx={1.2} />
      <Rect x={-9.5} y={2} width={4} height={8} rx={2} />
      <Rect x={-2} y={-2} width={4} height={12} rx={2} />
      <Rect x={5.5} y={-6} width={4} height={16} rx={2} />
    </G>
  );
}

/* ------------------------------------------------------------------ *
 * 4. HISTORY — counter-clockwise temporal rewind chronometer
 * ------------------------------------------------------------------ */

export function HistoryOutlineGlyph({ color }: GlyphProps) {
  return (
    <G fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle r={7.5} />
      <Path d="M0 0 V-4 M0 0 L3.2 1.6" />
      <Path d="M0 -10.5 A10.5 10.5 0 0 0 -10.5 0" />
      <Path d="M-8.1 -1.4 L-10.5 0.2 L-11.7 -2.4" />
    </G>
  );
}

export function HistoryFilledGlyph({ color }: GlyphProps) {
  return (
    <G fill={color}>
      <Path
        fillRule="evenodd"
        d="M7.5 0 A7.5 7.5 0 1 1 -7.5 0 A7.5 7.5 0 1 1 7.5 0 Z M-1.1 -4.6 H1.1 V-1.1 H3.6 V1.1 H-1.1 Z"
      />
      <Path d="M0 -10.5 A10.5 10.5 0 0 0 -10.5 0" fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round" />
      <Path d="M-8.1 -1.4 L-10.5 0.2 L-11.7 -2.4 Z" />
    </G>
  );
}

/* ------------------------------------------------------------------ *
 * 5. SETTINGS — 6-tooth precision bevel gear with bored axle core
 * ------------------------------------------------------------------ */

export function SettingsOutlineGlyph({ color }: GlyphProps) {
  return (
    <G fill="none" stroke={color} strokeLinecap="round">
      <Circle r={5.6} strokeWidth={2} />
      <Circle r={2.2} strokeWidth={2} />
      <G strokeWidth={2.6}>
        <Path d="M5.6 0 H8.6 M-5.6 0 H-8.6" />
        <Path d="M2.8 4.85 L4.3 7.45 M-2.8 -4.85 L-4.3 -7.45" />
        <Path d="M-2.8 4.85 L-4.3 7.45 M2.8 -4.85 L4.3 -7.45" />
      </G>
    </G>
  );
}

const GEAR_TOOTH_ANGLES = [0, 60, 120, 180, 240, 300];

export function SettingsFilledGlyph({ color }: GlyphProps) {
  return (
    <G fill={color}>
      <Path
        fillRule="evenodd"
        d="M5.6 0 A5.6 5.6 0 1 1 -5.6 0 A5.6 5.6 0 1 1 5.6 0 Z M2.2 0 A2.2 2.2 0 1 0 -2.2 0 A2.2 2.2 0 1 0 2.2 0 Z"
      />
      {GEAR_TOOTH_ANGLES.map((angle) => (
        <Rect key={angle} x={5.2} y={-1.6} width={3.6} height={3.2} rx={1.6} transform={`rotate(${angle})`} />
      ))}
    </G>
  );
}

/* ------------------------------------------------------------------ *
 * Dispatcher
 * ------------------------------------------------------------------ */

const GLYPHS: Record<
  TabIconName,
  { outline: (p: GlyphProps) => ReactElement; filled: (p: GlyphProps) => ReactElement }
> = {
  workout: { outline: WorkoutOutlineGlyph, filled: WorkoutFilledGlyph },
  feed: { outline: FeedOutlineGlyph, filled: FeedFilledGlyph },
  stats: { outline: StatsOutlineGlyph, filled: StatsFilledGlyph },
  history: { outline: HistoryOutlineGlyph, filled: HistoryFilledGlyph },
  settings: { outline: SettingsOutlineGlyph, filled: SettingsFilledGlyph },
};

export interface TabIconProps {
  name: TabIconName;
  selected: boolean;
  color: string;
  size?: number;
}

/** 24pt runtime glyph. `selected` swaps the outline variant for the filled one. */
export function TabIcon({ name, selected, color, size = 24 }: TabIconProps) {
  const Glyph = selected ? GLYPHS[name].filled : GLYPHS[name].outline;
  return (
    <Svg width={size} height={size} viewBox={VIEW_BOX}>
      <Glyph color={color} />
    </Svg>
  );
}

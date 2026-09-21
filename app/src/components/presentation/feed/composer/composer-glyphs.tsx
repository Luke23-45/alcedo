import Svg, { Circle, G, Path, Rect } from 'react-native-svg';
import type { GlyphProps } from '../shared/feed-glyphs';

/**
 * Composer-only glyphs, traced 1:1 from the path defs in
 * docs/new_design/social-dark.md (SCREEN 3). Same 20×20 origin-centred box as
 * the shared feed glyphs; tint comes from the `color` prop.
 */

const DEFAULT_SIZE = 20;
const DEFAULT_COLOR = '#FFFFFF';

export function LockGlyph({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, strokeWidth = 1.7 }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="-10 -10 20 20">
      <G fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round">
        <Path d="M-3.2 -1.4 V-3.6 A3.2 3.2 0 0 1 3.2 -3.6 V-1.4" />
        <Rect x={-5.4} y={-1.4} width={10.8} height={8} rx={2.2} fill={color} stroke="none" />
      </G>
    </Svg>
  );
}

export function ChevronDownGlyph({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, strokeWidth = 1.7 }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="-10 -10 20 20">
      <Path
        d="M-3 -1.6 L0 1.6 L3 -1.6"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function TagGlyph({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, strokeWidth = 1.7 }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="-10 -10 20 20">
      <G fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M-1 -8.5 H-6 A2.5 2.5 0 0 0 -8.5 -6 V-1 L.5 8 L8 -.5 Z" />
        <Circle cx={-4} cy={-4} r={1.5} />
      </G>
    </Svg>
  );
}

export function CloseGlyph({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, strokeWidth = 1.8 }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="-10 -10 20 20">
      <G stroke={color} strokeWidth={strokeWidth} strokeLinecap="round">
        <Path d="M-4.5 -4.5 L4.5 4.5" />
        <Path d="M4.5 -4.5 L-4.5 4.5" />
      </G>
    </Svg>
  );
}

export function PlusGlyph({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, strokeWidth = 1.8 }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="-10 -10 20 20">
      <G stroke={color} strokeWidth={strokeWidth} strokeLinecap="round">
        <Path d="M-5 0 H5" />
        <Path d="M0 -5 V5" />
      </G>
    </Svg>
  );
}

export function GlobeGlyph({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, strokeWidth = 1.7 }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="-10 -10 20 20">
      <G fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round">
        <Circle cx={0} cy={0} r={7.5} />
        <Path d="M-7.5 0 H7.5" />
        <Path d="M0 -7.5 C3.5 -4.5 3.5 4.5 0 7.5 C-3.5 4.5 -3.5 -4.5 0 -7.5 Z" />
      </G>
    </Svg>
  );
}

export function PeopleGlyph({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, strokeWidth = 1.7 }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="-10 -10 20 20">
      <G fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Circle cx={-2.5} cy={-3} r={3.2} />
        <Path d="M-8.5 7.5 C-8.5 3.8 -5.8 1.5 -2.5 1.5 C0.8 1.5 3.5 3.8 3.5 7.5" />
        <Circle cx={5.5} cy={-2.5} r={2.5} />
        <Path d="M4.5 1.8 C7 1.8 8.8 3.6 8.8 6.5" />
      </G>
    </Svg>
  );
}

/** Hollow OFF-state ring for the stat chips — 12pt circle, 1.4pt stroke. */
export function HollowRingGlyph({ size = 12, color = '#6C6C70', strokeWidth = 1.4 }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="-10 -10 20 20">
      <Circle cx={0} cy={0} r={6.5} fill="none" stroke={color} strokeWidth={strokeWidth} />
    </Svg>
  );
}

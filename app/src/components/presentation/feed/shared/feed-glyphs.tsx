import Svg, { G, Path, Rect } from 'react-native-svg';

/**
 * Feed glyph set, traced 1:1 from the path defs in docs/new_design/social-dark.md.
 * Every glyph is drawn in a box centered on the origin with rounded joins/caps,
 * and takes its tint from the `color` prop (react-native-svg has no currentColor).
 */

export interface GlyphProps {
  /** Rendered width/height in pt. */
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const DEFAULT_SIZE = 20;
const DEFAULT_COLOR = '#FFFFFF';

interface FillableGlyphProps extends GlyphProps {
  /** Filled heart vs. outline heart. */
  filled?: boolean;
}

export function HeartGlyph({
  size = DEFAULT_SIZE,
  color = DEFAULT_COLOR,
  strokeWidth = 1.8,
  filled = false,
}: FillableGlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="-10 -10 20 20">
      <Path
        d="M0 6.4 C-7.2 1.7 -8.6 -2.7 -6.3 -5.3 C-4.5 -7.2 -1.6 -6.9 0 -4.6 C1.6 -6.9 4.5 -7.2 6.3 -5.3 C8.6 -2.7 7.2 1.7 0 6.4 Z"
        fill={filled ? color : 'none'}
        stroke={filled ? 'none' : color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function BubbleGlyph({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, strokeWidth = 1.8 }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="-10 -10 20 20">
      <Path
        d="M-9.5 -6.5 A3.5 3.5 0 0 1 -6 -10 H6 A3.5 3.5 0 0 1 9.5 -6.5 V1.5 A3.5 3.5 0 0 1 6 5 H-1.5 L-6.5 9.5 V5 H-6 A3.5 3.5 0 0 1 -9.5 1.5 Z"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ShareGlyph({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, strokeWidth = 1.8 }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="-10 -10 20 20">
      <G fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M-6.4 -1.4 H-7.6 A1.8 1.8 0 0 0 -9.4 .4 V7 A1.8 1.8 0 0 0 -7.6 8.8 H7.6 A1.8 1.8 0 0 0 9.4 7 V.4 A1.8 1.8 0 0 0 7.6 -1.4 H6.4" />
        <Path d="M0 -9.6 V3.4" />
        <Path d="M-4.2 -5.4 L0 -9.6 L4.2 -5.4" />
      </G>
    </Svg>
  );
}

export function StarGlyph({ size = DEFAULT_SIZE, color = DEFAULT_COLOR }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="-10 -10 20 20">
      <Path
        d="M0 -9 L2.23 -3.07 L8.56 -2.78 L3.61 1.17 L5.29 7.28 L0 3.8 L-5.29 7.28 L-3.61 1.17 L-8.56 -2.78 L-2.23 -3.07 Z"
        fill={color}
      />
    </Svg>
  );
}

export function CheckGlyph({ size = DEFAULT_SIZE, color = DEFAULT_COLOR, strokeWidth = 2.2 }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="-6 -5 12 10">
      <Path
        d="M-4 .3 L-1.2 3.2 L4.4 -3"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function DumbbellGlyph({ size = DEFAULT_SIZE, color = DEFAULT_COLOR }: GlyphProps) {
  return (
    <Svg width={size} height={(size * 18) / 28} viewBox="-14 -9 28 18">
      <G fill={color}>
        <Rect x={-13} y={-5.6} width={4.4} height={11.2} rx={1.8} />
        <Rect x={-7.6} y={-8} width={3.8} height={16} rx={1.7} />
        <Rect x={-7.6} y={-1.9} width={15.2} height={3.8} rx={0.6} />
        <Rect x={3.8} y={-8} width={3.8} height={16} rx={1.7} />
        <Rect x={8.6} y={-5.6} width={4.4} height={11.2} rx={1.8} />
      </G>
    </Svg>
  );
}

/** Three-dot "more" mark used by post headers (matches the reference #mt glyph). */
export function DotsGlyph({ size = 16, color = DEFAULT_COLOR }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <G fill={color}>
        <Rect x={3.2} y={10.2} width={3.6} height={3.6} rx={1.8} />
        <Rect x={10.2} y={10.2} width={3.6} height={3.6} rx={1.8} />
        <Rect x={17.2} y={10.2} width={3.6} height={3.6} rx={1.8} />
      </G>
    </Svg>
  );
}

/** Pencil used by the feed nav-bar compose action (matches the reference #cmp glyph). */
export function PencilGlyph({ size = 20, color = DEFAULT_COLOR, strokeWidth = 1.8 }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="-12 -12 24 24">
      <G fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M-8.5 8.5 L-9.2 4.4 L4.6 -9.4 A2.6 2.6 0 0 1 8.3 -5.7 L-5.5 8.1 Z" />
        <Path d="M2.8 -7.6 L6.5 -3.9" />
      </G>
    </Svg>
  );
}

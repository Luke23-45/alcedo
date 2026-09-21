import Svg, { G, Path, Circle } from 'react-native-svg';
import type { GlyphProps } from '../shared/feed-glyphs';

/**
 * Detail-local glyphs. The shared feed-glyphs set has no up-arrow or ellipsis;
 * both are traced from the SCREEN 2 path defs in social-dark.md.
 */

/** Send-arrow: shaft M0 8 V-6 plus head M-4.6 -1.6 L0 -6.4 L4.6 -1.6. */
export function UpArrowGlyph({ size = 20, color = '#FFFFFF', strokeWidth = 2 }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="-8 -9 16 18">
      <G fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M0 8 V-6" />
        <Path d="M-4.6 -1.6 L0 -6.4 L4.6 -1.6" />
      </G>
    </Svg>
  );
}

/** The ⋯ nav trigger: three 2pt dots, 7pt apart. */
export function EllipsisGlyph({ size = 20, color = '#8E8E93' }: GlyphProps) {
  const r = size / 10;
  const gap = size * 0.35;
  return (
    <Svg width={size} height={size} viewBox="-10 -10 20 20">
      <G fill={color}>
        <Circle cx={-gap} cy={0} r={r} />
        <Circle cx={0} cy={0} r={r} />
        <Circle cx={gap} cy={0} r={r} />
      </G>
    </Svg>
  );
}

/** iOS back chevron, 16pt. */
export function ChevronLeftGlyph({ size = 16, color = '#8E8E93', strokeWidth = 2.2 }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="-8 -8 16 16">
      <Path
        d="M2 -5 L-2.6 0 L2 5"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

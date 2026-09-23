import Svg, { Circle, G, Path, Rect } from "react-native-svg";

/**
 * Profile-editor glyphs, traced 1:1 from the path defs in
 * docs/new_design/social-dark.md (SCREEN 4). Drawn in a box centered on the
 * origin with rounded caps/joins, tinted via the `color` prop. The heart glyph
 * is shared from the feed glyph set.
 */

export interface ProfileGlyphProps {
  /** Rendered width/height in pt. */
  size?: number;
  color?: string;
}

const DEFAULT_COLOR = "#FFFFFF";

/** Watch glyph (spec `#wtch`, stroke 1.7, scale .82). */
export function WatchGlyph({ size = 20, color = DEFAULT_COLOR }: ProfileGlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="-11 -11 22 22">
      <G fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round" scale={1.15}>
        <Rect x={-6} y={-6.5} width={12} height={13} rx={4} />
        <Path d="M-3.4 -6.5 V-9.4 H3.4 V-6.5 M-3.4 6.5 V9.4 H3.4 V6.5" />
      </G>
    </Svg>
  );
}

/** iOS chevron-right (spec `#ch`, stroke 1.9). */
export function ChevronGlyph({ size = 12, color = "#48484A" }: ProfileGlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="-6 -8 12 16">
      <Path
        d="M-2 -4 L2 0 L-2 4"
        fill="none"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

import Svg, { Circle, G, Line, Path, Rect } from 'react-native-svg';

/**
 * Picker glyphs, drawn in the reference spec's <defs> geometry (24-unit box
 * centered at 0,0; 1.9-2.3pt rounded strokes). Sized per usage site.
 */

export function DumbbellGlyph({ color, width = 16.1, height = 9.9 }: { color: string; width?: number; height?: number }) {
  // Spec #ic-db at scale .62 → 16.1×9.9.
  return (
    <Svg width={width} height={height} viewBox="-13 -8 26 16">
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

export function LegGlyph({ color, width = 8.6, height = 13 }: { color: string; width?: number; height?: number }) {
  // Spec #ic-leg at scale .72 → 8.6×13.
  return (
    <Svg width={width} height={height} viewBox="-6 -9 12 18">
      <G fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M-5 -8 V-1 L-1 3 V8" />
        <Path d="M5 -8 V-1 L1 3" />
      </G>
    </Svg>
  );
}

export function PullGlyph({ color, width = 14, height = 9.4 }: { color: string; width?: number; height?: number }) {
  // Spec #ic-pull at scale .78 → 14×9.4.
  return (
    <Svg width={width} height={height} viewBox="-9 -6 18 12">
      <G fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M-8 -5 L-3 0 L-8 5" />
        <Path d="M8 -5 L3 0 L8 5" />
        <Line x1={-3} y1={0} x2={3} y2={0} />
      </G>
    </Svg>
  );
}

export function MagnifierGlyph({ color, size = 15 }: { color: string; size?: number }) {
  // Spec #mg at scale .95.
  return (
    <Svg width={size} height={size} viewBox="-8 -8 16 16">
      <G fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round">
        <Circle cx={-1.6} cy={-1.6} r={5.8} />
        <Line x1={2.6} y1={2.6} x2={7} y2={7} />
      </G>
    </Svg>
  );
}

export function CheckGlyph({ color, width = 10.2, height = 8.5 }: { color: string; width?: number; height?: number }) {
  // Spec #ck at scale .85 → 10.2×8.5.
  return (
    <Svg width={width} height={height} viewBox="-6 -5 12 10">
      <Path
        d="M-4.2 .4 L-1.3 3.4 L4.6 -3.2"
        fill="none"
        stroke={color}
        strokeWidth={2.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ExerciseGlyphIcon({
  glyph,
  color,
}: {
  glyph: 'dumbbell' | 'leg' | 'pull';
  color: string;
}) {
  switch (glyph) {
    case 'leg':
      return <LegGlyph color={color} />;
    case 'pull':
      return <PullGlyph color={color} />;
    default:
      return <DumbbellGlyph color={color} />;
  }
}

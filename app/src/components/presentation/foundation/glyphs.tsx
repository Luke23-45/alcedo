import type { ReactElement } from 'react';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';

/**
 * SF-style UI glyphs for the Apple-inspired redesigns.
 *
 * Same geometric language as the bottom tab icon system
 * (`components/presentation/navigation/tab-icons.tsx`): 24×24 viewport
 * centred at the origin, 2.0pt continuous rounded strokes, filled variants
 * only where the glyph reads better solid.
 */

const VIEW_BOX = '-12 -12 24 24';

interface GlyphProps {
  color: string;
  size?: number;
}

function Frame({ color, size = 24, children }: GlyphProps & { children: ReactElement }) {
  return (
    <Svg width={size} height={size} viewBox={VIEW_BOX}>
      <G
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </G>
    </Svg>
  );
}

function SolidFrame({ color, size = 24, children }: GlyphProps & { children: ReactElement }) {
  return (
    <Svg width={size} height={size} viewBox={VIEW_BOX}>
      <G fill={color}>{children}</G>
    </Svg>
  );
}

/** Send arrow — the composer send button. */
export function ArrowUpGlyph({ color, size }: GlyphProps) {
  return (
    <Frame color={color} size={size}>
      <Path d="M0 -7 V7 M-5.5 -1.5 L0 -7 L5.5 -1.5" strokeWidth={2.4} />
    </Frame>
  );
}

/** Stop square — shown while the coach is generating. */
export function StopGlyph({ color, size }: GlyphProps) {
  return (
    <SolidFrame color={color} size={size}>
      <Rect x={-5} y={-5} width={10} height={10} rx={2.5} />
    </SolidFrame>
  );
}

/** Share a program with the coach. */
export function ShareGlyph({ color, size }: GlyphProps) {
  return (
    <Frame color={color} size={size}>
      <>
        <Path d="M-7 1.5 H7 V9.5 H-7 Z" />
        <Path d="M0 -9.5 V3 M-4.5 -5 L0 -9.5 L4.5 -5" />
      </>
    </Frame>
  );
}

/** Start the conversation over. */
export function RestartGlyph({ color, size }: GlyphProps) {
  return (
    <Frame color={color} size={size}>
      <>
        <Path d="M7.8 -4.8 A9 9 0 1 0 8.6 3.6" />
        <Path d="M8.8 -5.2 V3.6 H0.4" />
      </>
    </Frame>
  );
}

/** Reveal a secret value. */
export function EyeGlyph({ color, size }: GlyphProps) {
  return (
    <Frame color={color} size={size}>
      <>
        <Path d="M-11 0 C-7.5 -5.5 -3.5 -8 0 -8 C3.5 -8 7.5 -5.5 11 0 C7.5 5.5 3.5 8 0 8 C-3.5 8 -7.5 5.5 -11 0 Z" />
        <Circle r={2.6} />
      </>
    </Frame>
  );
}

/** Hide a secret value. */
export function EyeOffGlyph({ color, size }: GlyphProps) {
  return (
    <Frame color={color} size={size}>
      <>
        <Path d="M-8.5 -2.5 C-6 -5.5 -3 -7.2 0 -7.2 C1.8 -7.2 3.6 -6.6 5.2 -5.5 M8.5 2.5 C6 5.5 3 7.2 0 7.2 C-1.8 7.2 -3.6 6.6 -5.2 5.5" />
        <Path d="M-10.5 10.5 L10.5 -10.5" />
      </>
    </Frame>
  );
}

/** HTTP header row key. */
export function KeyGlyph({ color, size }: GlyphProps) {
  return (
    <Frame color={color} size={size}>
      <>
        <Circle cx={-4.5} cy={-1} r={4.6} />
        <Path d="M-0.2 0.4 L11 0.4 M7.5 0.4 V4.4 M11 0.4 V3.4" />
      </>
    </Frame>
  );
}

/** Add-header affordance. */
export function PlusGlyph({ color, size }: GlyphProps) {
  return (
    <Frame color={color} size={size}>
      <Path d="M0 -8 V8 M-8 0 H8" strokeWidth={2.2} />
    </Frame>
  );
}

/** Successful probe result. */
export function CheckCircleGlyph({ color, size }: GlyphProps) {
  return (
    <Frame color={color} size={size}>
      <>
        <Circle r={10} />
        <Path d="M-4.5 0.5 L-1 4.2 L5 -4.5" />
      </>
    </Frame>
  );
}

/** Failed probe result. */
export function XCircleGlyph({ color, size }: GlyphProps) {
  return (
    <Frame color={color} size={size}>
      <>
        <Circle r={10} />
        <Path d="M-3.8 -3.8 L3.8 3.8 M3.8 -3.8 L-3.8 3.8" />
      </>
    </Frame>
  );
}

/** Delete affordance for a header row. */
export function DeleteCircleGlyph({ color, size }: GlyphProps) {
  return (
    <Frame color={color} size={size}>
      <>
        <Circle r={10} strokeWidth={1.6} />
        <Path d="M-3.8 -3.8 L3.8 3.8 M3.8 -3.8 L-3.8 3.8" strokeWidth={1.8} />
      </>
    </Frame>
  );
}

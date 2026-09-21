import { useId } from 'react';
import { Defs, RadialGradient, Rect, Stop, Svg } from 'react-native-svg';

export interface AuraStop {
  cx: number;
  cy: number;
  r: number;
  color: string;
  opacity: number;
}

/**
 * Card-local radial auras, clipped to the card by HomeCard's overflow.
 * Positioned against the card's top-left (countering the 20pt hero pad).
 */
export function CardAura({
  width,
  height,
  stops,
  top = -20,
  left = -20,
}: {
  width: number;
  height: number;
  stops: AuraStop[];
  top?: number;
  left?: number;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'absolute', top, left }}
      pointerEvents="none"
    >
      <Defs>
        {stops.map((s, i) => (
          <RadialGradient
            key={i}
            id={`cardAura${uid}${i}`}
            gradientUnits="userSpaceOnUse"
            cx={s.cx}
            cy={s.cy}
            r={s.r}
          >
            <Stop offset="0" stopColor={s.color} stopOpacity={s.opacity} />
            <Stop offset="1" stopColor={s.color} stopOpacity={0} />
          </RadialGradient>
        ))}
      </Defs>
      {stops.map((_, i) => (
        <Rect
          key={i}
          width={width}
          height={height}
          fill={`url(#cardAura${uid}${i})`}
        />
      ))}
    </Svg>
  );
}

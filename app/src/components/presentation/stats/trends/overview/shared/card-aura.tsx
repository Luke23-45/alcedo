import { useId } from 'react';
import { View } from 'react-native';
import { Defs, RadialGradient, Rect, Stop, Svg } from 'react-native-svg';

export interface AuraStop {
  cx: number;
  cy: number;
  r: number;
  color: string;
  opacity: number;
}

/**
 * Card-local radial auras, clipped to the card by HomeCard's overflow. The
 * fill view spans the whole card body (including pads) at any card size; the
 * SVG stretches its reference viewBox over it, so stop positions stay
 * proportional instead of freezing at the 361pt reference width. Soft radial
 * washes tolerate the non-uniform scale invisibly.
 */
export function CardAura({
  width,
  height,
  stops,
}: {
  width: number;
  height: number;
  stops: AuraStop[];
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <View
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      pointerEvents="none"
    >
      <Svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
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
    </View>
  );
}

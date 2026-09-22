import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { alpha, type AppTheme, type HomeGradientSpec } from '@/styles/theme';

export type HomeGradientVariant =
  | 'card'
  | 'breast'
  | 'crown'
  | 'wing'
  | 'gloss'
  | 'screen'
  | 'cardBody'
  | 'cardEdge'
  | 'brand'
  | 'water'
  | 'tile';

type GradientSpec = {
  colors: readonly [string, string, ...string[]];
  locations?: readonly [number, number, ...number[]];
  start: { x: number; y: number };
  end: { x: number; y: number };
};

function specFromHome(home: HomeGradientSpec): GradientSpec {
  return {
    colors: [...home.colors] as [string, string, string],
    start: { ...home.start },
    end: { ...home.end },
  };
}

function specFor(theme: AppTheme, variant: HomeGradientVariant): GradientSpec {
  switch (variant) {
    case 'screen':
      return specFromHome(theme.home.screenBackground);
    case 'cardBody':
      return specFromHome(theme.home.card);
    case 'cardEdge':
      return specFromHome(theme.home.cardEdge);
    case 'card':
      // Legacy alias: the reference card body.
      return specFromHome(theme.home.card);
    case 'crown': {
      const g = theme.gradient.crown;
      return {
        colors: [...g.colors] as [string, string, ...string[]],
        locations: [...g.locations] as [number, number, ...number[]],
        start: { ...g.start },
        end: { ...g.end },
      };
    }
    case 'water':
      // Reference gWater: dark #0A84FF→#5EDCF0, light #007AFF→#32ADE6.
      return {
        colors: theme.isDark ? (['#0A84FF', '#5EDCF0'] as const) : (['#007AFF', '#32ADE6'] as const),
        locations: [0, 1],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
      };
    case 'tile':
      // Reference tile surface (gTile): same vertical ramp as cards.
      return specFromHome(theme.home.card);
    case 'wing': {
      const g = theme.gradient.wing;
      return {
        colors: [...g.colors] as [string, string, ...string[]],
        locations: [...g.locations] as [number, number, ...number[]],
        start: { ...g.start },
        end: { ...g.end },
      };
    }
    case 'gloss':
      return {
        colors: [alpha('#FFFFFF', 0.3), alpha('#FFFFFF', 0)],
        locations: [0, 1],
        start: { x: 0.5, y: 0 },
        end: { x: 0.5, y: 1 },
      };
    case 'brand':
      // Reference gBrand: dark #FFB03A→#FF6A3D→#FF2D55, light #FFA312→#FF5A3C→#E8003F.
      return {
        colors: theme.isDark
          ? (['#FFB03A', '#FF6A3D', '#FF2D55'] as const)
          : (['#FFA312', '#FF5A3C', '#E8003F'] as const),
        locations: [0, 0.45, 1],
        start: { x: 0, y: 0 },
        end: { x: 0.6, y: 1 },
      };
    case 'breast':
    default: {
      const g = theme.gradient.breast;
      return {
        colors: [...g.colors] as [string, string, ...string[]],
        locations: [...g.locations] as [number, number, ...number[]],
        start: { ...g.start },
        end: { ...g.end },
      };
    }
  }
}

/**
 * Theme-driven gradient box. All props are optional so `styled(HomeGradient)`
 * never demands `colors` at the usage site — unlike `styled(LinearGradient)`,
 * whose required `colors` prop survives `.attrs()` in the v6 types.
 */
export function HomeGradient({
  variant = 'breast',
  colors,
  start,
  end,
  locations,
  children,
  style,
}: {
  variant?: HomeGradientVariant;
  /** Explicit stops; overrides the variant's colors. */
  colors?: readonly [string, string, ...string[]];
  /** Explicit direction; overrides the variant's direction. */
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  /** Explicit stop positions; overrides the variant's locations. */
  locations?: readonly [number, number, ...number[]];
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useAppTheme();
  const spec = specFor(theme, variant);
  return (
    <LinearGradient
      colors={colors ?? spec.colors}
      // An explicit `colors` override invalidates the variant's stop positions:
      // a 2-stop override with a 3-length `locations` (or vice versa) makes
      // expo-linear-gradient warn and mis-place the stops. Leaving `locations`
      // undefined lets it space the override's stops evenly.
      locations={locations ?? (colors ? undefined : spec.locations)}
      start={start ?? spec.start}
      end={end ?? spec.end}
      style={style}
    >
      {children}
    </LinearGradient>
  );
}

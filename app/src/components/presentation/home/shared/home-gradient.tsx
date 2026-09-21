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
      return {
        colors: ['#0A84FF', '#5EDCF0'],
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
      // Reference gBrand: #FFB03A → #FF6A3D → #FF2D55, stops 0/0.45/1.
      return {
        colors: ['#FFB03A', '#FF6A3D', '#FF2D55'],
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
      locations={locations ?? spec.locations}
      start={start ?? spec.start}
      end={end ?? spec.end}
      style={style}
    >
      {children}
    </LinearGradient>
  );
}

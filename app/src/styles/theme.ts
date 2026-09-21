/**
 * ALCEDO — design tokens
 * ----------------------------------------------------------------------------
 * Derived from the kingfisher icon: cobalt structure, ember action.
 *
 * Structure
 *   1. Primitives      raw ramps and scales — never reference these in a component
 *   2. Typography      Apple's iOS type scale (Large content size), verbatim
 *   3. Metrics         space, radius, layout, motion, z-index
 *   4. Semantic colors light + dark, same shape, enforced by interface
 *   5. Components      per-component metrics
 *   6. createTheme()   assembles a theme for a mode + platform
 *
 * Contrast: every foreground/background pair in `SemanticColors` meets WCAG AA
 * (4.5:1) for body text unless the token name says otherwise. Values were
 * measured, not eyeballed.
 *
 * Units are unitless numbers (React Native points). On web, multiply by 1px —
 * pass `platform: 'web'` to createTheme and use the `css` shadow strings.
 */

/* ========================================================================== *
 * 1. PRIMITIVES
 * ========================================================================== */

/** Raw brand ramps. Pulled from the icon; extended to 50–900 by hand. */
export const palette = {
  /** Neutral ink, tinted toward the icon's trench navy (hue ~218°). */
  ink: {
    0: '#FFFFFF',
    25: '#F7F9FC',
    50: '#F1F4F9',
    100: '#E6EBF3',
    200: '#D3DAE6',
    300: '#B3BECF',
    400: '#8B99AE',
    500: '#68778F',
    600: '#4C5B72',
    700: '#37445A',
    800: '#233046',
    850: '#1A2537',
    900: '#111A29',
    950: '#0A1120',
    975: '#060C18',
    1000: '#02040A',
  },

  /** Kingfisher — the bird's back. Primary structural blue. */
  kingfisher: {
    50: '#E8F6FE',
    100: '#C9ECFD',
    200: '#93DAFB',
    300: '#57C3F5',
    400: '#2AAAEE',
    500: '#1194E4', // icon: back, mid
    600: '#0A76C2',
    700: '#0A5C9C',
    800: '#0D4B7D',
    900: '#0E3E67',
  },

  /** Cobalt — the folded wing coverts. Depth, never a surface. */
  cobalt: {
    50: '#ECF0FF',
    100: '#D8E0FF',
    200: '#B0C0FF',
    300: '#7F97FF',
    400: '#4A66FA',
    500: '#1F3FE8',
    600: '#0B2CC8', // icon: wing, light edge
    700: '#0A24A3',
    800: '#081E86',
    900: '#051A80', // icon: wing, dark edge
  },

  /** Turquoise — the crown. Recovery, freshness, "ready". */
  turquoise: {
    50: '#E4FBF8',
    100: '#BFF6F0',
    200: '#85EDE4',
    300: '#4FE4D9',
    400: '#35E0D6', // icon: crown
    500: '#17C3BA',
    600: '#0E9E98',
    700: '#0E7D79',
    800: '#0F6360',
    900: '#0F5250',
  },

  /** Ember — the breast and beak. Effort, intensity, the single CTA. */
  ember: {
    50: '#FFF3E6',
    100: '#FFE2C2',
    200: '#FFC98A',
    300: '#FFAE3C', // icon: beak
    400: '#FF8A1E',
    500: '#F0670F', // icon: breast core — graphics only, fails AA as a fill
    600: '#E0550A',
    650: '#CE4A08', // CTA fill: 4.56:1 with white
    700: '#B92403', // icon: breast shadow
    800: '#8F1D05',
    900: '#6E1906',
  },
} as const;

/**
 * Genuine iOS system colors, for the places where platform convention must win
 * over brand: destructive rows in action sheets, system alerts, Apple-style
 * switches. Do not use these for brand surfaces.
 */
export const systemColors = {
  red: { light: '#FF3B30', dark: '#FF453A' },
  orange: { light: '#FF9500', dark: '#FF9F0A' },
  yellow: { light: '#FFCC00', dark: '#FFD60A' },
  green: { light: '#34C759', dark: '#30D158' },
  mint: { light: '#00C7BE', dark: '#63E6E2' },
  teal: { light: '#30B0C7', dark: '#40C8E0' },
  cyan: { light: '#32ADE6', dark: '#64D2FF' },
  blue: { light: '#007AFF', dark: '#0A84FF' },
  indigo: { light: '#5856D6', dark: '#5E5CE6' },
  purple: { light: '#AF52DE', dark: '#BF5AF2' },
  pink: { light: '#FF2D55', dark: '#FF375F' },
  brown: { light: '#A2845E', dark: '#AC8E68' },
  gray: { light: '#8E8E93', dark: '#8E8E93' },
  gray2: { light: '#AEAEB2', dark: '#636366' },
  gray3: { light: '#C7C7CC', dark: '#48484A' },
  gray4: { light: '#D1D1D6', dark: '#3A3A3C' },
  gray5: { light: '#E5E5EA', dark: '#2C2C2E' },
  gray6: { light: '#F2F2F7', dark: '#1C1C1E' },
} as const;

/* ========================================================================== *
 * 2. TYPOGRAPHY
 * ========================================================================== */

export type Platform = 'ios' | 'android' | 'web';

const FONT_STACKS: Record<Platform, { text: string; display: string; rounded: string; mono: string }> = {
  ios: {
    // 'System' resolves to SF Pro and switches Text→Display at 20pt automatically.
    text: 'System',
    display: 'System',
    // Requires the font to be linked (expo-font / Info.plist). Falls back to SF Pro.
    rounded: 'SF Pro Rounded',
    mono: 'SF Mono',
  },
  android: {
    text: 'Roboto',
    display: 'Roboto',
    rounded: 'Roboto',
    mono: 'Roboto Mono',
  },
  web: {
    text: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    display: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    rounded: "ui-rounded, 'SF Pro Rounded', -apple-system, system-ui, sans-serif",
    mono: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
  },
};

/** SF weights. React Native accepts these strings directly. */
export const fontWeight = {
  ultraLight: '100',
  thin: '200',
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
  black: '900',
} as const;

export type FontWeight = (typeof fontWeight)[keyof typeof fontWeight];

export interface TextStyle {
  fontSize: number;
  /** Apple's specified line height for this style at the Large content size. */
  lineHeight: number;
  fontWeight: FontWeight;
  /** Apple's tracking table, in points. Negative tightens. */
  letterSpacing: number;
  /** Which stack to resolve. SF switches optical size at 20pt on its own. */
  family: 'text' | 'display' | 'rounded' | 'mono';
}

/**
 * iOS type scale at the default (Large) Dynamic Type size.
 * Sizes, line heights and tracking are Apple's published values.
 * Scale these with the OS setting — see `scaleType()` at the bottom.
 */
export const textStyles = {
  largeTitle: { fontSize: 34, lineHeight: 41, fontWeight: fontWeight.regular, letterSpacing: 0.37, family: 'display' },
  title1: { fontSize: 28, lineHeight: 34, fontWeight: fontWeight.regular, letterSpacing: 0.36, family: 'display' },
  title2: { fontSize: 22, lineHeight: 28, fontWeight: fontWeight.regular, letterSpacing: 0.35, family: 'display' },
  title3: { fontSize: 20, lineHeight: 25, fontWeight: fontWeight.regular, letterSpacing: 0.38, family: 'display' },
  headline: { fontSize: 17, lineHeight: 22, fontWeight: fontWeight.semibold, letterSpacing: -0.43, family: 'text' },
  body: { fontSize: 17, lineHeight: 22, fontWeight: fontWeight.regular, letterSpacing: -0.43, family: 'text' },
  callout: { fontSize: 16, lineHeight: 21, fontWeight: fontWeight.regular, letterSpacing: -0.32, family: 'text' },
  subheadline: { fontSize: 15, lineHeight: 20, fontWeight: fontWeight.regular, letterSpacing: -0.23, family: 'text' },
  footnote: { fontSize: 13, lineHeight: 18, fontWeight: fontWeight.regular, letterSpacing: -0.08, family: 'text' },
  caption1: { fontSize: 12, lineHeight: 16, fontWeight: fontWeight.regular, letterSpacing: 0, family: 'text' },
  caption2: { fontSize: 11, lineHeight: 13, fontWeight: fontWeight.regular, letterSpacing: 0.06, family: 'text' },

  /* --- Alcedo additions: the numbers a gym app actually shows --------------- */

  /** Hero metric — the number on a rest timer or a 1RM. */
  metricXL: { fontSize: 64, lineHeight: 68, fontWeight: fontWeight.bold, letterSpacing: -1.6, family: 'rounded' },
  /** Card metric — set volume, weekly tonnage. */
  metricL: { fontSize: 40, lineHeight: 44, fontWeight: fontWeight.semibold, letterSpacing: -0.9, family: 'rounded' },
  /** Inline metric — reps × weight in a set row. */
  metricM: { fontSize: 22, lineHeight: 26, fontWeight: fontWeight.semibold, letterSpacing: -0.3, family: 'rounded' },
  /** Unit suffix sitting next to a metric. */
  metricUnit: { fontSize: 15, lineHeight: 20, fontWeight: fontWeight.medium, letterSpacing: 0, family: 'rounded' },
} as const satisfies Record<string, TextStyle>;

export type TextStyleName = keyof typeof textStyles;

/**
 * Always on for anything numeric that changes in place — a timer counting down
 * with proportional figures jitters. Spread into the style, don't fight it later.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const tabularNumbers = { fontVariant: ['tabular-nums'] as any };

/* ========================================================================== *
 * 3. METRICS
 * ========================================================================== */

/** 4pt base grid. iOS lives on 4 and 8, not on a 10-step ramp. */
export const space = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 56,
  giant: 72,
} as const;

/**
 * Corner radii. Pair every one of these with `borderCurve: 'continuous'` on
 * iOS — a circular corner next to an iOS squircle reads as wrong immediately.
 */
export const radius = {
  none: 0,
  xs: 6,
  sm: 8,
  md: 10,
  lg: 12,
  xl: 16,
  xxl: 20,
  xxxl: 28,
  /** Sheets and cards that run to the screen edge. */
  sheet: 24,
  full: 9999,
} as const;

export const borderWidth = {
  /** Replace with StyleSheet.hairlineWidth at the call site on React Native. */
  hairline: 0.5,
  thin: 1,
  thick: 2,
  focus: 3,
} as const;

/** iOS layout metrics, in points. These are platform constants, not preferences. */
export const layout = {
  /** HIG minimum tappable area. Nothing interactive goes below this. */
  touchTarget: 44,
  navBar: 44,
  navBarLargeTitle: 96,
  tabBar: 49,
  toolbar: 44,
  searchBar: 36,
  listRow: 44,
  listRowComfortable: 56,
  listRowTwoLine: 60,
  /** Leading inset where a separator starts under an avatar/icon row. */
  separatorInset: 16,
  /** Screen margin: compact width vs regular width. */
  screenPadding: 16,
  screenPaddingRegular: 20,
  /** Gap above a grouped list section header. */
  sectionGap: 32,
  /** Widest comfortable measure for body copy, in points. */
  maxReadableWidth: 640,
} as const;

export const zIndex = {
  base: 0,
  raised: 10,
  sticky: 100,
  header: 200,
  drawer: 300,
  modal: 400,
  popover: 500,
  toast: 600,
  tooltip: 700,
} as const;

export const opacity = {
  /** TouchableOpacity activeOpacity for filled controls. */
  pressed: 0.72,
  /** For plain text buttons, which need more feedback. */
  pressedText: 0.4,
  disabled: 0.4,
  ghost: 0.08,
} as const;

/**
 * Motion. iOS is spring-driven, not curve-driven — reach for `spring` first and
 * only use `duration` for opacity crossfades and colour transitions.
 * Always gate on AccessibilityInfo.isReduceMotionEnabled().
 */
export const motion = {
  duration: {
    instant: 0,
    fast: 150,
    base: 250,
    slow: 350,
    slower: 500,
  },
  /** Reanimated withSpring configs. */
  spring: {
    /** Button press / release. Fast, no visible overshoot. */
    press: { damping: 18, stiffness: 420, mass: 0.6 },
    /** Element entering or leaving the screen. */
    enter: { damping: 24, stiffness: 260, mass: 1 },
    /** Modal sheets and large surfaces. Heavier, settles cleanly. */
    sheet: { damping: 32, stiffness: 240, mass: 1 },
    /** Celebratory only — a PR banner, a completed ring. */
    bouncy: { damping: 14, stiffness: 220, mass: 0.9 },
  },
  /** CSS equivalents for web / Animated.timing easing. */
  easing: {
    standard: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
    emphasized: 'cubic-bezier(0.32, 0.72, 0, 1)',
  },
} as const;

/* ========================================================================== *
 * 4. SEMANTIC COLORS
 * ========================================================================== */

export interface Tone {
  /** Solid fill. Pair with `content.inverse` in dark mode, white in light. */
  base: string;
  /** The colour as text or an icon on a neutral background. AA on `surface`. */
  content: string;
  /** Tinted background for banners and chips. */
  surface: string;
  border: string;
}

export interface SemanticColors {
  background: {
    base: string;
    secondary: string;
    tertiary: string;
    /** Grouped-table backgrounds — the inset-list pattern. */
    grouped: string;
    groupedSecondary: string;
    groupedTertiary: string;
    /** Sheets, popovers, anything floating above the base layer. */
    elevated: string;
    scrim: string;
  };
  content: {
    primary: string;
    secondary: string;
    tertiary: string;
    quaternary: string;
    /** Text on a surface of the opposite mode. */
    inverse: string;
    onAccent: string;
    onTint: string;
  };
  interactive: {
    /** Links, icons, selected segments, switches. The calm blue. */
    tint: string;
    tintPressed: string;
    /** The one high-energy fill. Use once per screen. */
    accent: string;
    accentPressed: string;
    /** Graphics only — gradients, glows, chart strokes. Fails AA as a fill. */
    accentBright: string;
    disabled: string;
  };
  /** Control backgrounds: segmented tracks, search fields, progress trails. */
  fill: {
    primary: string;
    secondary: string;
    tertiary: string;
    quaternary: string;
  };
  border: {
    hairline: string;
    opaque: string;
    strong: string;
    focus: string;
  };
  status: {
    success: Tone;
    warning: Tone;
    danger: Tone;
    info: Tone;
  };
  /** Effort zones, cool to hot. Drives HR charts, RPE, set intensity. */
  zone: {
    recovery: string;
    endurance: string;
    tempo: string;
    threshold: string;
    max: string;
  };
  graph: {
    grid: string;
    axis: string;
    /** Categorical series, ordered for maximum separation. */
    series: readonly string[];
  };
}

const lightColors: SemanticColors = {
  background: {
    base: palette.ink[0],
    secondary: palette.ink[50],
    tertiary: palette.ink[0],
    grouped: palette.ink[50],
    groupedSecondary: palette.ink[0],
    groupedTertiary: palette.ink[25],
    elevated: palette.ink[0],
    scrim: 'rgba(6, 12, 24, 0.36)',
  },
  content: {
    primary: palette.ink[950],
    secondary: 'rgba(28, 42, 64, 0.62)',
    tertiary: 'rgba(28, 42, 64, 0.34)',
    quaternary: 'rgba(28, 42, 64, 0.20)',
    inverse: palette.ink[0],
    onAccent: '#FFFFFF', // on accent #CE4A08 → 4.56:1
    onTint: '#FFFFFF', // on tint   #0A76C2 → 4.79:1
  },
  interactive: {
    tint: palette.kingfisher[600],
    tintPressed: palette.kingfisher[700],
    accent: palette.ember[650],
    accentPressed: palette.ember[700],
    accentBright: palette.ember[500],
    disabled: 'rgba(28, 42, 64, 0.24)',
  },
  fill: {
    primary: 'rgba(104, 119, 143, 0.18)',
    secondary: 'rgba(104, 119, 143, 0.14)',
    tertiary: 'rgba(104, 119, 143, 0.10)',
    quaternary: 'rgba(104, 119, 143, 0.06)',
  },
  border: {
    hairline: 'rgba(28, 42, 64, 0.16)',
    opaque: palette.ink[200],
    strong: 'rgba(28, 42, 64, 0.28)',
    focus: palette.kingfisher[600],
  },
  status: {
    success: { base: '#1B7C3A', content: '#146331', surface: '#E8F6EC', border: 'rgba(27, 124, 58, 0.26)' },
    warning: { base: '#8A5A00', content: '#7A4F00', surface: '#FFF4E0', border: 'rgba(138, 90, 0, 0.26)' },
    danger: { base: '#C81E14', content: '#A5140C', surface: '#FDECEA', border: 'rgba(200, 30, 20, 0.26)' },
    info: { base: palette.kingfisher[600], content: palette.kingfisher[700], surface: '#E8F4FD', border: 'rgba(10, 118, 194, 0.26)' },
  },
  zone: {
    recovery: palette.turquoise[500],
    endurance: palette.kingfisher[600],
    tempo: palette.ember[300],
    threshold: palette.ember[650],
    max: palette.ember[700],
  },
  graph: {
    grid: 'rgba(28, 42, 64, 0.10)',
    axis: 'rgba(28, 42, 64, 0.34)',
    series: [
      palette.kingfisher[600],
      palette.turquoise[500],
      palette.ember[650],
      palette.cobalt[600],
      palette.ember[300],
      palette.ink[600],
    ],
  },
};

const darkColors: SemanticColors = {
  background: {
    base: palette.ink[1000],
    secondary: palette.ink[950],
    tertiary: palette.ink[900],
    grouped: palette.ink[1000],
    groupedSecondary: palette.ink[950],
    groupedTertiary: palette.ink[900],
    elevated: '#141E2F',
    scrim: 'rgba(0, 0, 0, 0.62)',
  },
  content: {
    primary: '#F4F8FD',
    secondary: 'rgba(210, 224, 242, 0.64)',
    tertiary: 'rgba(210, 224, 242, 0.38)',
    quaternary: 'rgba(210, 224, 242, 0.20)',
    inverse: palette.ink[1000],
    onAccent: '#FFFFFF', // accent stays #CE4A08 across modes → 4.56:1
    onTint: '#04121D', // on tint #57C3F5 → dark label, 9.1:1
  },
  interactive: {
    tint: palette.kingfisher[300],
    tintPressed: palette.kingfisher[200],
    accent: palette.ember[650],
    // On dark, pressed brightens rather than darkens.
    accentPressed: palette.ember[600],
    accentBright: palette.ember[500],
    disabled: 'rgba(210, 224, 242, 0.22)',
  },
  fill: {
    primary: 'rgba(120, 140, 176, 0.32)',
    secondary: 'rgba(120, 140, 176, 0.26)',
    tertiary: 'rgba(120, 140, 176, 0.18)',
    quaternary: 'rgba(120, 140, 176, 0.12)',
  },
  border: {
    hairline: 'rgba(140, 162, 196, 0.24)',
    opaque: '#1F2B3F',
    strong: 'rgba(140, 162, 196, 0.38)',
    focus: palette.kingfisher[300],
  },
  status: {
    success: { base: '#2FD25C', content: '#4FE07A', surface: 'rgba(47, 210, 92, 0.14)', border: 'rgba(47, 210, 92, 0.32)' },
    warning: { base: '#FFC24A', content: '#FFD27A', surface: 'rgba(255, 194, 74, 0.14)', border: 'rgba(255, 194, 74, 0.32)' },
    danger: { base: '#FF4D3D', content: '#FF7A6E', surface: 'rgba(255, 77, 61, 0.14)', border: 'rgba(255, 77, 61, 0.32)' },
    info: { base: palette.kingfisher[300], content: palette.kingfisher[200], surface: 'rgba(87, 195, 245, 0.14)', border: 'rgba(87, 195, 245, 0.32)' },
  },
  zone: {
    recovery: palette.turquoise[400],
    endurance: '#35BDF5',
    tempo: palette.ember[300],
    threshold: palette.ember[500],
    max: '#E2350A',
  },
  graph: {
    grid: 'rgba(140, 162, 196, 0.14)',
    axis: 'rgba(210, 224, 242, 0.38)',
    series: [
      '#35BDF5',
      palette.turquoise[400],
      palette.ember[500],
      palette.cobalt[400],
      palette.ember[300],
      palette.ink[400],
    ],
  },
};

/* --- Elevation ------------------------------------------------------------ *
 * On light, shadow carries elevation. On dark, shadow is nearly invisible, so
 * elevation is carried by a lighter surface plus a hairline — that is why the
 * dark shadows below are almost flat and `background.elevated` is lifted.
 * ------------------------------------------------------------------------- */

export interface Shadow {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  /** Android only. */
  elevation: number;
  /** Web / styled-components box-shadow. */
  css: string;
}

const shadow = (
  color: string,
  y: number,
  blur: number,
  alpha: number,
  elevation: number,
  rgba: string,
): Shadow => ({
  shadowColor: color,
  shadowOffset: { width: 0, height: y },
  shadowOpacity: alpha,
  shadowRadius: blur / 2,
  elevation,
  css: `0px ${y}px ${blur}px ${rgba}`,
});

const lightElevation = {
  none: shadow('transparent', 0, 0, 0, 0, 'transparent'),
  xs: shadow('#0A1930', 1, 3, 0.06, 1, 'rgba(10, 25, 48, 0.06)'),
  sm: shadow('#0A1930', 2, 8, 0.08, 2, 'rgba(10, 25, 48, 0.08)'),
  md: shadow('#0A1930', 6, 16, 0.1, 6, 'rgba(10, 25, 48, 0.10)'),
  lg: shadow('#0A1930', 12, 32, 0.14, 12, 'rgba(10, 25, 48, 0.14)'),
  xl: shadow('#0A1930', 24, 56, 0.18, 24, 'rgba(10, 25, 48, 0.18)'),
} as const;

const darkElevation = {
  none: shadow('transparent', 0, 0, 0, 0, 'transparent'),
  xs: shadow('#000000', 1, 3, 0.3, 1, 'rgba(0, 0, 0, 0.30)'),
  sm: shadow('#000000', 2, 8, 0.36, 2, 'rgba(0, 0, 0, 0.36)'),
  md: shadow('#000000', 6, 16, 0.44, 6, 'rgba(0, 0, 0, 0.44)'),
  lg: shadow('#000000', 12, 32, 0.52, 12, 'rgba(0, 0, 0, 0.52)'),
  xl: shadow('#000000', 24, 56, 0.6, 24, 'rgba(0, 0, 0, 0.60)'),
} as const;

/* --- Materials ------------------------------------------------------------ *
 * Maps to UIBlurEffect. `intensity` feeds expo-blur; `fallback` is what you
 * render when blur is unavailable (Android, reduce-transparency, web).
 * ------------------------------------------------------------------------- */

export interface Material {
  intensity: number;
  fallback: string;
}

export type MaterialKey = 'ultraThin' | 'thin' | 'regular' | 'thick' | 'chrome';
/** Structural, not `as const` — light and dark must be the same type so
 *  `AppTheme.material` can hold either without TS narrowing on the literal
 *  fallback colour of whichever one was declared first. */
export type Materials = Record<MaterialKey, Material>;

const lightMaterials: Materials = {
  ultraThin: { intensity: 20, fallback: 'rgba(255, 255, 255, 0.60)' },
  thin: { intensity: 40, fallback: 'rgba(255, 255, 255, 0.72)' },
  regular: { intensity: 60, fallback: 'rgba(255, 255, 255, 0.82)' },
  thick: { intensity: 80, fallback: 'rgba(255, 255, 255, 0.92)' },
  /** Nav bars and tab bars. */
  chrome: { intensity: 100, fallback: 'rgba(241, 244, 249, 0.94)' },
};

const darkMaterials: Materials = {
  ultraThin: { intensity: 20, fallback: 'rgba(10, 17, 32, 0.60)' },
  thin: { intensity: 40, fallback: 'rgba(10, 17, 32, 0.72)' },
  regular: { intensity: 60, fallback: 'rgba(6, 12, 24, 0.82)' },
  thick: { intensity: 80, fallback: 'rgba(2, 4, 10, 0.92)' },
  chrome: { intensity: 100, fallback: 'rgba(2, 4, 10, 0.94)' },
};

/* --- Gradients ------------------------------------------------------------ *
 * Taken straight off the icon. Shape matches expo-linear-gradient / SVG.
 * ------------------------------------------------------------------------- */

export interface Gradient {
  colors: readonly string[];
  locations: readonly number[];
  start: { x: number; y: number };
  end: { x: number; y: number };
}

export const gradients = {
  /** The bird's back: cobalt into turquoise. Headers, hero surfaces. */
  crown: {
    colors: [palette.cobalt[600], palette.kingfisher[500], palette.turquoise[400]],
    locations: [0, 0.44, 1],
    start: { x: 0.02, y: 0.88 },
    end: { x: 0.98, y: 0.02 },
  },
  /** The breast: rust into amber. Progress fills, effort bars. */
  breast: {
    colors: [palette.ember[700], palette.ember[500], palette.ember[300]],
    locations: [0, 0.5, 1],
    start: { x: 0.04, y: 0.94 },
    end: { x: 0.96, y: 0.06 },
  },
  /** The wing coverts. Deep, recessive — behind content, never on it. */
  wing: {
    colors: [palette.cobalt[900], palette.cobalt[600]],
    locations: [0, 1],
    start: { x: 0, y: 0.92 },
    end: { x: 1, y: 0 },
  },
  /** The icon background. Splash, onboarding, empty states. */
  trench: {
    colors: ['#0E1B30', '#060C18', '#02040A'],
    locations: [0, 0.54, 1],
    start: { x: 0.12, y: 0 },
    end: { x: 0.88, y: 1 },
  },
} as const satisfies Record<string, Gradient>;

/* --- Home screen (Kinetic reference) -------------------------------------- *
 * Pixel-spec tokens for the redesigned home screen, measured off
 * docs/new_design/home_page_screen1.svg (dark) and home_screen_light_mode.svg.
 * These are the Apple-style surface treatments (diagonal 3-stop card bodies,
 * gradient edge strokes); they intentionally differ from the app-wide
 * semantic background tokens, so they live here rather than being hardcoded.
 * ------------------------------------------------------------------------- */

export interface HomeGradientSpec {
  colors: readonly [string, string, string];
  start: { x: number; y: number };
  end: { x: number; y: number };
}

export interface HomeTokens {
  screenBackground: HomeGradientSpec;
  /** Diagonal 3-stop card body, lit from above. */
  card: HomeGradientSpec;
  /** 1pt edge stroke, white fading downward (dark) / black (light). */
  cardEdge: HomeGradientSpec;
  radius: { hero: number; tile: number; row: number; duo: number; program: number };
  /** Accent text colors that shift between modes for contrast. */
  seeAll: string;
  amber: string;
  delta: string;
}

function homeTokens(mode: ThemeMode): HomeTokens {
  const diagonal = { start: { x: 0, y: 0 }, end: { x: 0.45, y: 1 } };
  const vertical = { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } };
  const radius = { hero: 30, tile: 24, row: 22, duo: 28, program: 26 };
  return mode === 'dark'
    ? {
        screenBackground: {
          colors: ['#0B0B0E', '#050507', '#08080B'] as const,
          start: { x: 0, y: 0 },
          end: { x: 0.25, y: 1 },
        },
        card: { colors: ['#1F1F23', '#17171A', '#131316'] as const, ...diagonal },
        cardEdge: {
          colors: [alpha('#FFFFFF', 0.17), alpha('#FFFFFF', 0.06), alpha('#FFFFFF', 0.025)] as const,
          ...vertical,
        },
        radius,
        seeAll: '#FF9F0A',
        amber: '#FFB84D',
        delta: '#30D158',
      }
    : {
        screenBackground: {
          colors: ['#F8F8FC', '#F1F1F6', '#F3F3F8'] as const,
          start: { x: 0, y: 0 },
          end: { x: 0.25, y: 1 },
        },
        card: { colors: ['#FFFFFF', '#FDFDFF', '#FAFAFC'] as const, ...diagonal },
        cardEdge: {
          colors: [alpha('#000000', 0.045), alpha('#000000', 0.06), alpha('#000000', 0.115)] as const,
          ...vertical,
        },
        radius,
        seeAll: '#C93400',
        amber: '#C93400',
        delta: '#248A3D',
      };
}

/* --- Exercise history screen ------------------------------------------------ *
 * Pixel-spec tokens for the Exercise History screen, measured off
 * docs/new_design/workout-flow-dark.md (Exercise History section) and its
 * light-mode table. The gold PR treatment is identical in both modes: an
 * earned-celebration moment, not a theme surface.
 * ------------------------------------------------------------------------- */

export interface ExerciseHistoryTokens {
  /** The gold PR banner and its ink: identical in light and dark. */
  gold: {
    gradient: readonly [string, string, string];
    heading: string;
    value: string;
    star: string;
  };
  /** Top-set trend line and its area wash. */
  line: { start: string; end: string; area: string; areaOpacity: number };
  grid: string;
  /** X-axis labels: oldest session, the PR session, the latest session. */
  xOld: string;
  xPr: string;
  xCurrent: string;
  /** Gold annotation above the peak dot (the "102.5" label) and the peak dot
   *  itself: gold stays gold in both modes, like the PR banner. */
  prValue: string;
  /** Date tile and the PR day numeral. */
  tile: string;
  tilePrDay: string;
  chevron: string;
  auraOpacity: number;
}

function exerciseHistoryTokens(mode: ThemeMode): ExerciseHistoryTokens {
  return {
    gold: {
      gradient: ['#FFE9A8', '#FFD84D', '#D9A441'] as const,
      heading: '#7A5A00',
      value: '#2B1E00',
      star: '#5C4300',
    },
    line:
      mode === 'dark'
        ? { start: '#FF9F0A', end: '#FF2D55', area: '#FF6A3D', areaOpacity: 0.34 }
        : { start: '#E07800', end: '#D70015', area: '#FF6A3D', areaOpacity: 0.2 },
    grid: mode === 'dark' ? alpha('#FFFFFF', 0.05) : alpha('#3C3C43', 0.1),
    xOld: mode === 'dark' ? '#6C6C70' : '#8E8E93',
    xPr: '#A08000',
    xCurrent: mode === 'dark' ? '#98989F' : '#AEAEB2',
    prValue: '#FFD84D',
    tile: mode === 'dark' ? alpha('#FFFFFF', 0.06) : alpha('#787880', 0.12),
    tilePrDay: mode === 'dark' ? '#FFD84D' : '#8A6D00',
    chevron: mode === 'dark' ? '#48484A' : '#C7C7CC',
    auraOpacity: mode === 'dark' ? 0.14 : 0.07,
  };
}

/* ========================================================================== *
 * 5. COMPONENT METRICS
 * ========================================================================== */

export const components = {
  button: {
    height: { sm: 32, md: 44, lg: 50 },
    paddingX: { sm: space.md, md: space.lg, lg: space.xl },
    radius: { sm: radius.sm, md: radius.lg, lg: radius.xl },
    gap: space.sm,
    textStyle: { sm: 'subheadline', md: 'headline', lg: 'headline' } as Record<'sm' | 'md' | 'lg', TextStyleName>,
  },
  input: {
    height: 44,
    paddingX: space.md,
    radius: radius.md,
    textStyle: 'body' as TextStyleName,
  },
  card: {
    padding: space.base,
    paddingCompact: space.md,
    radius: radius.xl,
    gap: space.md,
  },
  listRow: {
    height: layout.listRow,
    heightTwoLine: layout.listRowTwoLine,
    paddingX: space.base,
    gap: space.md,
    chevronSize: 14,
  },
  sheet: {
    radius: radius.sheet,
    handleWidth: 36,
    handleHeight: 5,
    paddingX: space.lg,
    paddingTop: space.md,
  },
  tabBar: {
    height: layout.tabBar,
    iconSize: 26,
    labelStyle: 'caption2' as TextStyleName,
  },
  avatar: {
    size: { xs: 24, sm: 32, md: 40, lg: 56, xl: 88 },
  },
  /** Effort/progress rings, Fitness-app style. */
  ring: {
    strokeWidth: { sm: 6, md: 10, lg: 16 },
    size: { sm: 44, md: 96, lg: 180 },
    trackOpacity: 0.18,
  },
} as const;

/* ========================================================================== *
 * 6. THEME ASSEMBLY
 * ========================================================================== */

export type ThemeMode = 'light' | 'dark';

export interface AppTheme {
  mode: ThemeMode;
  isDark: boolean;
  platform: Platform;
  color: SemanticColors;
  /** Raw ramps, for charts and one-off brand moments. Prefer `color`. */
  palette: typeof palette;
  system: typeof systemColors;
  font: { text: string; display: string; rounded: string; mono: string };
  weight: typeof fontWeight;
  text: typeof textStyles;
  space: typeof space;
  radius: typeof radius;
  borderWidth: typeof borderWidth;
  layout: typeof layout;
  zIndex: typeof zIndex;
  opacity: typeof opacity;
  motion: typeof motion;
  elevation: typeof lightElevation;
  material: Materials;
  gradient: typeof gradients;
  components: typeof components;
  home: HomeTokens;
  exerciseHistory: ExerciseHistoryTokens;
}

export function createTheme(mode: ThemeMode = 'dark', platform: Platform = 'ios'): AppTheme {
  const isDark = mode === 'dark';
  return {
    mode,
    isDark,
    platform,
    color: isDark ? darkColors : lightColors,
    palette,
    system: systemColors,
    font: FONT_STACKS[platform],
    weight: fontWeight,
    text: textStyles,
    space,
    radius,
    borderWidth,
    layout,
    zIndex,
    opacity,
    motion,
    elevation: isDark ? darkElevation : lightElevation,
    material: isDark ? darkMaterials : lightMaterials,
    gradient: gradients,
    components,
    home: homeTokens(mode),
    exerciseHistory: exerciseHistoryTokens(mode),
  };
}

export const lightTheme = createTheme('light', 'ios');
export const darkTheme = createTheme('dark', 'ios');

/* ========================================================================== *
 * HELPERS
 * ========================================================================== */

/**
 * Resolve a named text style into a style object, with the right font stack.
 * Set `tabular` for any number that mutates in place.
 */
export function type(
  theme: AppTheme,
  name: TextStyleName,
  options: { weight?: FontWeight; tabular?: boolean } = {},
) {
  const style = theme.text[name];
  return {
    fontFamily: theme.font[style.family],
    fontSize: style.fontSize,
    lineHeight: style.lineHeight,
    fontWeight: options.weight ?? style.fontWeight,
    letterSpacing: style.letterSpacing,
    ...(options.tabular ? tabularNumbers : null),
  };
}

/**
 * Scale a text style by the OS Dynamic Type multiplier.
 * Feed it PixelRatio.getFontScale() and clamp — unbounded scaling breaks
 * fixed-height rows, and a 44pt button is a hard floor.
 */
export function scaleType(style: TextStyle, fontScale: number, max = 1.6): TextStyle {
  const factor = Math.min(fontScale, max);
  return {
    ...style,
    fontSize: Math.round(style.fontSize * factor),
    lineHeight: Math.round(style.lineHeight * factor),
  };
}

/** Expand a 44pt touch target around a control that renders smaller. */
export function hitSlopFor(renderedSize: number, target = layout.touchTarget) {
  const pad = Math.max(0, Math.round((target - renderedSize) / 2));
  return { top: pad, bottom: pad, left: pad, right: pad };
}

/** Hex + alpha → rgba(). For one-off tints only; prefer a `fill` token. */
export function alpha(hex: string, value: number): string {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${value})`;
}

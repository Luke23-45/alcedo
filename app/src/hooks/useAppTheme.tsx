import { useAppSelector } from '@/store';
import React, { createContext, ReactNode, useContext, useEffect, useMemo } from 'react';
import { Appearance, Platform, useColorScheme } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { DarkTheme, ThemeProvider as NavigationThemeProvider, DefaultTheme } from 'expo-router';
import { MsIconSrc } from '@/components/presentation/foundation/ms-icon-source';
import { createTheme, type AppTheme, type Platform as AlcedoPlatform } from '@/styles/theme';

// Pure Alcedo ground truth — no legacy Material3, spacing, font, or HCT ramp.
// Source: app/styles/theme.ts (palette, SemanticColors, space/radius/layout, etc.)
// Re-export for call sites that want the type directly.
export type { AppTheme } from '@/styles/theme';

// Deprecated shim — kept one release so files not yet migrated in Phases 4-8 still compile.
// New code must use `theme.space` / `theme.radius` / `theme.color` / `type(theme, ...)` directly.
// These re-exports will be removed after all 147 importers are migrated (Phase 9).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const spacing: any = {
  0: 0,
  0.5: 2,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  6: 24,
  8: 32,
  12: 48,
  pageHorizontalMargin: 16,
} as const;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const font: any = {
  'text-2xs': {},
  'text-xs': {},
  'text-sm': {},
  'text-base': {},
  'text-lg': {},
  'text-xl': {},
  'text-2xl': {},
  'text-4xl': {},
} as const;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const rounding: any = {
  roundedRectangleRadius: 10,
  segmentedBetweenRadius: 4,
} as const;
export type ColorChoice = string;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppThemeColors = any;

const AppThemeContext = createContext<(AppTheme & { colors: any; spacing: any; font: any; rounding: any }) | undefined>(undefined);

export const useAppTheme = (): AppTheme & { colors: any; spacing: any; font: any; rounding: any } => {
  const context = useContext(AppThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a AppThemeProvider');
  }
  return context;
};

interface AppThemeProviderProps {
  children: ReactNode;
}

export const AppThemeProvider: React.FC<AppThemeProviderProps> = ({ children }) => {
  const trueBlack = useAppSelector((state) => state.settings.trueBlackDarkTheme);
  const themeMode = useAppSelector((state) => state.settings.themeMode);

  const systemColorScheme = useColorScheme();

  useEffect(() => {
    Appearance.setColorScheme(themeMode === 'system' ? 'unspecified' : themeMode);
  }, [themeMode]);

  const colorScheme = themeMode === 'system' ? (systemColorScheme === 'dark' ? 'dark' : 'light') : themeMode;
  const isDark = colorScheme === 'dark';

  const alcedoTheme = useMemo(() => {
    const platform = (Platform.OS === 'web' ? 'web' : Platform.OS === 'android' ? 'android' : 'ios') as AlcedoPlatform;
    let t = createTheme(colorScheme, platform);
    if (trueBlack && isDark) {
      t = {
        ...t,
        color: {
          ...t.color,
          background: {
            ...t.color.background,
            base: '#000000',
            grouped: '#000000',
            groupedSecondary: '#000000',
            groupedTertiary: '#000000',
            elevated: '#000000',
          },
        },
      };
    }
    return t;
  }, [colorScheme, isDark, trueBlack]);

  const paperTheme = useMemo(() => {
    const base = isDark ? MD3DarkTheme : MD3LightTheme;
    const a = alcedoTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: a.color.interactive.tint,
        onPrimary: a.color.content.onTint,
        primaryContainer: a.color.interactive.tint,
        onPrimaryContainer: a.color.content.onTint,
        secondary: a.color.interactive.tint,
        onSecondary: a.color.content.onTint,
        secondaryContainer: a.color.fill.secondary,
        onSecondaryContainer: a.color.content.primary,
        tertiary: a.color.interactive.accent,
        onTertiary: a.color.content.onAccent,
        tertiaryContainer: a.color.fill.tertiary,
        onTertiaryContainer: a.color.content.primary,
        error: a.color.status.danger.base,
        onError: a.color.content.inverse,
        errorContainer: a.color.status.danger.surface,
        onErrorContainer: a.color.status.danger.content,
        background: a.color.background.base,
        onBackground: a.color.content.primary,
        surface: a.color.background.base,
        onSurface: a.color.content.primary,
        surfaceVariant: a.color.fill.primary,
        onSurfaceVariant: a.color.content.secondary,
        outline: a.color.border.hairline,
        outlineVariant: a.color.border.hairline,
        surfaceContainer: a.color.background.secondary,
        surfaceContainerHigh: a.color.background.elevated,
        surfaceContainerHighest: a.color.background.tertiary,
        scrim: a.color.background.scrim,
        inverseSurface: a.color.content.primary,
        inverseOnSurface: a.color.background.base,
      },
    };
  }, [alcedoTheme, isDark]);

  const navigationTheme = useMemo(() => {
    const base = isDark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        background: paperTheme.colors.background,
        border: paperTheme.colors.outline,
        card: paperTheme.colors.surfaceContainer,
        notification: paperTheme.colors.surface,
        primary: paperTheme.colors.primary,
        text: paperTheme.colors.onSurface,
      },
    };
  }, [isDark, paperTheme]);

  const legacyValue: AppTheme & { colors: any; spacing: any; font: any; rounding: any } = {
    ...alcedoTheme,
    colors: { ...alcedoTheme.color, ...alcedoTheme.color, elevation: (paperTheme as any).colors.elevation, onSurface: alcedoTheme.color.content.primary, onSurfaceVariant: alcedoTheme.color.content.secondary, primary: alcedoTheme.color.interactive.tint, secondary: alcedoTheme.color.interactive.tint, secondaryContainer: alcedoTheme.color.fill.secondary, tertiary: alcedoTheme.color.interactive.accent, tertiaryContainer: alcedoTheme.color.fill.tertiary, onTertiaryContainer: alcedoTheme.color.content.primary, surface: alcedoTheme.color.background.base, surfaceVariant: alcedoTheme.color.fill.primary, surfaceContainer: alcedoTheme.color.background.secondary, surfaceContainerHigh: alcedoTheme.color.background.elevated, surfaceContainerHighest: alcedoTheme.color.background.tertiary, outline: alcedoTheme.color.border.hairline, outlineVariant: alcedoTheme.color.border.hairline, error: alcedoTheme.color.status.danger.base, onError: alcedoTheme.color.content.inverse, seedColor: alcedoTheme.color.interactive.tint, scheme: alcedoTheme.mode },
    spacing,
    font,
    rounding,
  } as any;
  return (
    <AppThemeContext.Provider value={legacyValue}>
      <PaperProvider
        theme={paperTheme}
        settings={{
          icon: (props) => <MsIconSrc {...props} color={props.color ?? alcedoTheme.color.content.primary} />,
        }}
      >
        <NavigationThemeProvider value={navigationTheme}>{children}</NavigationThemeProvider>
      </PaperProvider>
    </AppThemeContext.Provider>
  );
};

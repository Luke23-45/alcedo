import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, Text as RNText, View } from 'react-native';
import Reanimated from 'react-native-reanimated';
import { useAppTheme } from '@/hooks/useAppTheme';

/**
 * Bottom tab bar chrome — the runtime rig from docs/new_design/tab-bar-icons.svg §3.
 * Glass gradient surface, 0.5pt top hairline, 24pt glyphs, 10pt labels.
 *
 * NOTE: Previously implemented with styled-components/native, which crashes on
 * Hermes (ReferenceError: Property 'document' doesn't exist) because the library
 * touches `document` at import time. Reimplemented with plain RN primitives +
 * useAppTheme() so the tab bar — on the critical path of every route — never
 * pulls a web-only dependency. Keep this file free of styled-components.
 */

export const Bar = LinearGradient;

export function Hairline() {
  const theme = useAppTheme();
  return React.createElement(View, { style: { height: StyleSheet.hairlineWidth, backgroundColor: theme.color.tabBar.hairline } });
}

export function Row({ $padBottom, children, style, ...rest }: { $padBottom: number; children?: React.ReactNode; style?: any }) {
  return React.createElement(View, { style: [{ flexDirection: 'row', paddingBottom: $padBottom } as any, style], ...(rest as any) }, children);
}

export function TabButton({ children, style, ...rest }: any) {
  return React.createElement(
    Pressable,
    { style: [{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 10, minHeight: 56 } as any, style as any], ...rest },
    children,
  );
}

export function IconSlot({ children, style, ...rest }: { children?: React.ReactNode; style?: any }) {
  return React.createElement(View, { style: [{ width: 24, height: 24 } as any, style], ...(rest as any) }, children);
}

/** Absolute glyph layer for the selected-state cross-fade; opacity is animated. */
export function IconLayer({ children, style, ...rest }: any) {
  return React.createElement(Reanimated.View, { style: [{ position: 'absolute', left: 0, top: 0 } as any, style as any], ...rest }, children);
}

export function Badge({ children, style, ...rest }: { children?: React.ReactNode; style?: any }) {
  const theme = useAppTheme();
  return React.createElement(
    View,
    {
      style: [
        {
          position: 'absolute',
          top: -5,
          right: -9,
          minWidth: 18,
          height: 18,
          paddingHorizontal: 5,
          borderRadius: 9,
          backgroundColor: theme.color.status.danger.base,
          alignItems: 'center',
          justifyContent: 'center',
        } as any,
        style,
      ],
      ...(rest as any),
    },
    children,
  );
}

export function BadgeText({ children, style, ...rest }: { children?: React.ReactNode; style?: any }) {
  const theme = useAppTheme();
  return React.createElement(
    RNText,
    { style: [{ color: '#ffffff', fontSize: 11, lineHeight: 13, fontWeight: theme.weight.semibold } as any, style], ...(rest as any) },
    children,
  );
}

/**
 * Spec §5: 10pt, semibold when selected / medium when resting,
 * −0.1 tracking. No named text style covers 10pt, so this is explicit.
 */
export function TabLabel({ selected, children, style, ...rest }: { selected: boolean; children?: React.ReactNode; style?: any }) {
  const theme = useAppTheme();
  return React.createElement(
    RNText,
    {
      style: [
        {
          marginTop: 4,
          fontSize: 10,
          lineHeight: 12,
          letterSpacing: -0.1,
          fontWeight: selected ? theme.weight.semibold : theme.weight.medium,
          color: selected ? theme.color.tabBar.selected : theme.color.tabBar.unselected,
        } as any,
        style,
      ],
      ...(rest as any),
    },
    children,
  );
}

/**
 * ALCEDO — how the theme is meant to be consumed.
 * React Native + styled-components/native. Web swaps noted inline.
 */
import React from 'react';
import { useColorScheme, Pressable, Platform, StyleSheet } from 'react-native';
import styled, { ThemeProvider, css } from 'styled-components/native';
import { createTheme, type, hitSlopFor, type AppTheme } from './theme';

/* -------------------------------------------------------------------------- *
 * Root
 * -------------------------------------------------------------------------- */

export function AppProviders({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  // Memoise — createTheme builds new objects and styled-components diffs by identity.
  const theme = React.useMemo(
    () => createTheme(scheme === 'light' ? 'light' : 'dark', Platform.OS as 'ios' | 'android'),
    [scheme],
  );
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

/* -------------------------------------------------------------------------- *
 * Screen scaffolding
 * -------------------------------------------------------------------------- */

export const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.color.background.base};
`;

export const Content = styled.View`
  padding-horizontal: ${({ theme }) => theme.layout.screenPadding}px;
  gap: ${({ theme }) => theme.space.base}px;
`;

/* -------------------------------------------------------------------------- *
 * Text
 *
 * One component, one `variant` prop. Don't hand-set fontSize anywhere else —
 * that is how a codebase ends up with 14 slightly different body sizes.
 * -------------------------------------------------------------------------- */

type TextVariant = keyof AppTheme['text'];
type Tone = 'primary' | 'secondary' | 'tertiary' | 'tint' | 'accent' | 'inverse';

export const Text = styled.Text<{
  variant?: TextVariant;
  tone?: Tone;
  tabular?: boolean;
}>`
  ${({ theme, variant = 'body', tabular }) => {
    const t = type(theme, variant, { tabular });
    return css`
      font-family: ${t.fontFamily};
      font-size: ${t.fontSize}px;
      line-height: ${t.lineHeight}px;
      font-weight: ${t.fontWeight};
      letter-spacing: ${t.letterSpacing}px;
    `;
  }}
  color: ${({ theme, tone = 'primary' }) =>
    tone === 'tint'
      ? theme.color.interactive.tint
      : tone === 'accent'
        ? theme.color.interactive.accent
        : theme.color.content[tone as 'primary' | 'secondary' | 'tertiary' | 'inverse']};
`;

// fontVariant isn't expressible in the css`` string, so it rides as a style prop.
export const Metric = (props: React.ComponentProps<typeof Text>) => (
  <Text variant="metricL" tabular style={[{ fontVariant: ['tabular-nums'] }, props.style]} {...props} />
);

/* -------------------------------------------------------------------------- *
 * Button
 *
 * `accent` is the single high-energy action on a screen — Start workout, Log
 * set. `tint` is everything else. If two accent buttons are visible at once,
 * one of them is wrong.
 * -------------------------------------------------------------------------- */

type ButtonVariant = 'accent' | 'tint' | 'subtle' | 'plain';
type ButtonSize = 'sm' | 'md' | 'lg';

const ButtonSurface = styled.View<{ $variant: ButtonVariant; $size: ButtonSize; $disabled?: boolean }>`
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: ${({ theme }) => theme.components.button.gap}px;
  height: ${({ theme, $size }) => theme.components.button.height[$size]}px;
  padding-horizontal: ${({ theme, $size }) => theme.components.button.paddingX[$size]}px;
  border-radius: ${({ theme, $size }) => theme.components.button.radius[$size]}px;
  opacity: ${({ theme, $disabled }) => ($disabled ? theme.opacity.disabled : 1)};
  background-color: ${({ theme, $variant }) =>
    $variant === 'accent'
      ? theme.color.interactive.accent
      : $variant === 'tint'
        ? theme.color.interactive.tint
        : $variant === 'subtle'
          ? theme.color.fill.secondary
          : 'transparent'};
`;

export function Button({
  label,
  variant = 'tint',
  size = 'md',
  disabled,
  onPress,
}: {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  onPress?: () => void;
}) {
  const tone: Tone =
    variant === 'accent' ? 'inverse' : variant === 'tint' ? 'inverse' : variant === 'plain' ? 'tint' : 'primary';

  return (
    <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button">
      {({ pressed }) => (
        // borderCurve gives the iOS squircle; a circular corner reads as wrong.
        <ButtonSurface
          $variant={variant}
          $size={size}
          $disabled={disabled}
          style={[{ borderCurve: 'continuous' }, pressed && !disabled ? { opacity: 0.72 } : null]}
        >
          <Text variant="headline" tone={tone}>
            {label}
          </Text>
        </ButtonSurface>
      )}
    </Pressable>
  );
}

/* -------------------------------------------------------------------------- *
 * Card — elevation reads differently per mode
 *
 * Light: shadow does the lifting.
 * Dark:  shadow is invisible on near-black, so a lighter surface plus a
 *        hairline does it instead. The theme already holds both; this just
 *        picks the right mechanism.
 * -------------------------------------------------------------------------- */

export const Card = styled.View`
  background-color: ${({ theme }) => (theme.isDark ? theme.color.background.elevated : theme.color.background.base)};
  border-radius: ${({ theme }) => theme.components.card.radius}px;
  padding: ${({ theme }) => theme.components.card.padding}px;
  gap: ${({ theme }) => theme.components.card.gap}px;
  border-width: ${({ theme }) => (theme.isDark ? theme.borderWidth.thin : 0)}px;
  border-color: ${({ theme }) => theme.color.border.hairline};
  ${({ theme }) =>
    theme.isDark
      ? ''
      : css`
          shadow-color: ${theme.elevation.sm.shadowColor};
          shadow-offset: 0px ${theme.elevation.sm.shadowOffset.height}px;
          shadow-opacity: ${theme.elevation.sm.shadowOpacity};
          shadow-radius: ${theme.elevation.sm.shadowRadius}px;
          elevation: ${theme.elevation.sm.elevation};
        `}
`;

/* -------------------------------------------------------------------------- *
 * Separator — true hairline, inset like a grouped list
 * -------------------------------------------------------------------------- */

export const Separator = styled.View<{ inset?: boolean }>`
  height: ${StyleSheet.hairlineWidth}px;
  background-color: ${({ theme }) => theme.color.border.hairline};
  margin-left: ${({ theme, inset }) => (inset ? theme.layout.separatorInset : 0)}px;
`;

/* -------------------------------------------------------------------------- *
 * Effort chip — Tone tokens in practice
 * -------------------------------------------------------------------------- */

export function StatusChip({ status, label }: { status: 'success' | 'warning' | 'danger' | 'info'; label: string }) {
  return (
    <ChipSurface $status={status} style={{ borderCurve: 'continuous' }}>
      <ChipLabel $status={status}>{label}</ChipLabel>
    </ChipSurface>
  );
}

const ChipSurface = styled.View<{ $status: 'success' | 'warning' | 'danger' | 'info' }>`
  align-self: flex-start;
  padding-horizontal: ${({ theme }) => theme.space.sm}px;
  padding-vertical: ${({ theme }) => theme.space.xs}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme, $status }) => theme.color.status[$status].surface};
  border-width: ${({ theme }) => theme.borderWidth.thin}px;
  border-color: ${({ theme, $status }) => theme.color.status[$status].border};
`;

const ChipLabel = styled.Text<{ $status: 'success' | 'warning' | 'danger' | 'info' }>`
  ${({ theme }) => {
    const t = type(theme, 'footnote', { weight: theme.weight.semibold });
    return css`
      font-family: ${t.fontFamily};
      font-size: ${t.fontSize}px;
      line-height: ${t.lineHeight}px;
      font-weight: ${t.fontWeight};
      letter-spacing: ${t.letterSpacing}px;
    `;
  }}
  color: ${({ theme, $status }) => theme.color.status[$status].content};
`;

/* -------------------------------------------------------------------------- *
 * Small controls still need 44pt of touch
 * -------------------------------------------------------------------------- */

export function IconButton({
  size = 24,
  onPress,
  children,
}: {
  size?: number;
  onPress?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Pressable onPress={onPress} hitSlop={hitSlopFor(size)} accessibilityRole="button">
      {children}
    </Pressable>
  );
}

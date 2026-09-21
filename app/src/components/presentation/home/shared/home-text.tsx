import styled, { css } from 'styled-components/native';
import { type as resolveType, type AppTheme, type FontWeight, type TextStyleName } from '@/styles/theme';
import type { StyleProp, TextStyle } from 'react-native';

export type HomeTextTone = 'primary' | 'secondary' | 'tertiary' | 'tint' | 'accent' | 'inverse' | 'onAccent';

function toneColor(theme: AppTheme, tone: HomeTextTone): string {
  switch (tone) {
    case 'tint':
      return theme.color.interactive.tint;
    case 'accent':
      return theme.color.interactive.accent;
    case 'onAccent':
      return theme.color.content.onAccent;
    case 'inverse':
      return theme.color.content.inverse;
    default:
      return theme.color.content[tone];
  }
}

const StyledText = styled.Text<{
  $variant: TextStyleName;
  $tone: HomeTextTone;
  $weight?: FontWeight;
  $tabular?: boolean;
  $micro?: boolean;
  $tracking?: number;
}>`
  ${({ theme, $variant, $weight, $tabular, $tracking }) => {
    const t = resolveType(theme, $variant, { weight: $weight, tabular: $tabular });
    return css`
      font-family: ${t.fontFamily};
      font-size: ${t.fontSize}px;
      line-height: ${t.lineHeight}px;
      font-weight: ${t.fontWeight};
      letter-spacing: ${$tracking ?? t.letterSpacing}px;
    `;
  }}
  color: ${({ theme, $tone }) => toneColor(theme, $tone)};
  ${({ $micro }) =>
    $micro
      ? css`
          text-transform: uppercase;
        `
      : ''}
`;

export function HomeText({
  variant = 'body',
  tone = 'primary',
  weight,
  tabular,
  micro,
  tracking,
  children,
  numberOfLines,
  ellipsizeMode,
  style,
}: {
  variant?: TextStyleName;
  tone?: HomeTextTone;
  weight?: FontWeight;
  tabular?: boolean;
  /** Uppercase micro-label (positive tracking set via `tracking`). */
  micro?: boolean;
  /** Letter-spacing override in px — display type takes negative, micro-labels positive. */
  tracking?: number;
  children: React.ReactNode;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  style?: StyleProp<TextStyle>;
}) {
  return (
    <StyledText
      $variant={variant}
      $tone={tone}
      $weight={weight}
      $tabular={tabular}
      $micro={micro}
      $tracking={tracking}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      style={[tabular ? { fontVariant: ['tabular-nums'] } : null, style]}
    >
      {children}
    </StyledText>
  );
}

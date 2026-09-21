import { Text, TextProps, TextStyle } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { type as typeHelper, type TextStyleName, type FontWeight, type AppTheme } from '@/styles/theme';

// Legacy compat — maps old FontChoice (text-*) to new TextStyleName
type LegacyFontChoice =
  | 'text-2xs'
  | 'text-xs'
  | 'text-sm'
  | 'text-base'
  | 'text-lg'
  | 'text-xl'
  | 'text-2xl'
  | 'text-3xl'
  | 'text-4xl';

const legacyFontToVariant: Record<LegacyFontChoice, TextStyleName> = {
  'text-2xs': 'caption2',
  'text-xs': 'caption1',
  'text-sm': 'footnote',
  'text-base': 'body',
  'text-lg': 'callout',
  'text-xl': 'title3',
  'text-2xl': 'title2',
  'text-3xl': 'title1',
  'text-4xl': 'metricL',
};

function resolveColor(theme: AppTheme, color: string | undefined): string {
  if (!color) return theme.color.content.primary;
  // New tones directly
  if (color === 'primary') return theme.color.content.primary;
  if (color === 'secondary') return theme.color.content.secondary;
  if (color === 'tertiary') return theme.color.content.tertiary;
  if (color === 'quaternary') return theme.color.content.quaternary;
  if (color === 'inverse') return theme.color.content.inverse;
  if (color === 'tint') return theme.color.interactive.tint;
  if (color === 'accent') return theme.color.interactive.accent;
  if (color === 'success') return theme.color.status.success.content;
  if (color === 'danger' || color === 'error') return theme.color.status.danger.content;
  if (color === 'warning') return theme.color.status.warning.content;
  if (color === 'info') return theme.color.status.info.content;
  // Legacy Material3 names
  switch (color) {
    case 'onSurface':
      return theme.color.content.primary;
    case 'onSurfaceVariant':
      return theme.color.content.secondary;
    case 'onSecondaryContainer':
    case 'onTertiaryContainer':
      return theme.color.content.primary;
    case 'primary':
      return theme.color.interactive.tint;
    case 'onPrimary':
      return theme.color.content.onTint;
    case 'secondary':
      return theme.color.content.secondary;
    case 'error':
      return theme.color.status.danger.content;
    case 'onError':
      return theme.color.content.inverse;
    default:
      // Fallback — try content keys, then raw hex
      if (color in theme.color.content) return (theme.color.content as any)[color];
      if (color in theme.color.interactive) return (theme.color.interactive as any)[color];
      return theme.color.content.primary;
  }
}

interface SurfaceTextProps extends TextProps {
  color?: string;
  tone?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'inverse' | 'tint' | 'accent';
  variant?: TextStyleName;
  // Legacy
  font?: LegacyFontChoice;
  weight?: TextStyle['fontWeight'] | FontWeight;
  tabular?: boolean;
}

export function SurfaceText(props: SurfaceTextProps) {
  const theme = useAppTheme();
  const { style, weight, font, variant, tone, color, tabular, ...rest } = props;

  const resolvedVariant: TextStyleName = variant ?? (font ? legacyFontToVariant[font] : 'body');
  const resolvedTone = tone ?? color;
  const textStyle = typeHelper(theme, resolvedVariant, { weight: weight as FontWeight | undefined, tabular });

  return (
    <Text
      {...rest}
      style={[
        {
          color: resolveColor(theme, resolvedTone as string),
          fontWeight: weight as any,
        },
        textStyle,
        style,
      ]}
    />
  );
}

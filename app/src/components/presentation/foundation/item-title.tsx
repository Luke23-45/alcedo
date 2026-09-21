import { Text, TextStyle } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { type as typeHelper } from '@/styles/theme';

interface ItemTitleProps {
  title: string;
  style?: TextStyle;
  testID?: string;
  color?: string;
  tone?: 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'tint' | 'accent';
}

export default function ItemTitle({ title, style, testID, color, tone }: ItemTitleProps) {
  const theme = useAppTheme();
  const textStyle = typeHelper(theme, 'title3');

  const resolveColor = (c: string | undefined, t: string | undefined) => {
    const key = t ?? c ?? 'primary';
    if (key === 'primary') return theme.color.content.primary;
    if (key === 'secondary') return theme.color.content.secondary;
    if (key === 'inverse') return theme.color.content.inverse;
    if (key === 'tint') return theme.color.interactive.tint;
    if (key === 'accent') return theme.color.interactive.accent;
    // legacy
    if (key === 'onSurface') return theme.color.content.primary;
    if (key === 'onSurfaceVariant') return theme.color.content.secondary;
    return theme.color.content.primary;
  };

  return (
    <Text
      style={[
        {
          ...textStyle,
          fontWeight: '700' as const,
          flexShrink: 1,
          minWidth: 0,
          textAlign: 'left',
          color: resolveColor(color, tone),
        },
        style,
      ]}
      testID={testID}
    >
      {title}
    </Text>
  );
}

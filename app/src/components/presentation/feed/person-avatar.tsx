import { SurfaceText } from '@/components/presentation/foundation/surface-text';
import Icon from '@/components/presentation/foundation/icon';
import { useAppTheme } from '@/hooks/useAppTheme';
import { AppTheme } from '@/styles/theme';
import { View } from 'react-native';

/**
 * Every one of these is harmonized with the Alcedo palette, so the ring of avatars stays in key whatever colour
 * the user picked. Red is left out: it reads as an error, and an avatar is never one.
 */
const AVATAR_COLORS = ['teal', 'purple', 'blue', 'pink', 'indigo', 'amber', 'green', 'cyan', 'brown', 'lime'] as const;

const DEFAULT_SIZE = 44;

interface PersonAvatarProps {
  userId: string;
  name?: string;
  size?: number;
}

export function PersonAvatar({ userId, name, size = DEFAULT_SIZE }: PersonAvatarProps) {
  const theme = useAppTheme();

  const color = AVATAR_COLORS[hash(userId) % AVATAR_COLORS.length]!;
  const initials = initialsOf(name);
  const backgroundColor = avatarBackground(theme, color);
  const foregroundColor = avatarForeground(theme, color);

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {initials ? (
        <SurfaceText font={size < 32 ? 'text-xs' : 'text-base'} weight="bold" style={{ color: foregroundColor }}>
          {initials}
        </SurfaceText>
      ) : (
        <Icon source="person" size={size / 2} color={foregroundColor} />
      )}
    </View>
  );
}

function avatarBackground(theme: AppTheme, color: (typeof AVATAR_COLORS)[number]): string {
  switch (color) {
    case 'teal':
      return theme.palette.turquoise[400];
    case 'purple':
      return theme.palette.cobalt[400];
    case 'blue':
      return theme.palette.kingfisher[600];
    case 'pink':
      return theme.palette.ember[300];
    case 'indigo':
      return theme.palette.cobalt[600];
    case 'amber':
      return theme.palette.ember[500];
    case 'green':
      return theme.color.status.success.base;
    case 'cyan':
      return theme.palette.kingfisher[400];
    case 'brown':
      return theme.palette.ember[700];
    case 'lime':
      return theme.palette.turquoise[300];
    default:
      return theme.palette.kingfisher[600];
  }
}

function avatarForeground(theme: AppTheme, color: (typeof AVATAR_COLORS)[number]): string {
  // Light swatches need dark ink for contrast; saturated swatches use white.
  switch (color) {
    case 'teal':
    case 'cyan':
    case 'lime':
    case 'pink':
      return theme.palette.ink[1000];
    default:
      return theme.color.content.onTint;
  }
}

function initialsOf(name: string | undefined): string | undefined {
  const words = name?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (words.length === 0) {
    return undefined;
  }

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}

function hash(value: string): number {
  let result = 0;
  for (let i = 0; i < value.length; i++) {
    result = (result * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(result);
}

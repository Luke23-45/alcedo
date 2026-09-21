import { AppTheme } from '@/styles/theme';
import { ActivityLevel } from '@/store/activity';

export interface LevelColors {
  background: string;
  foreground: string;
}

/** Alcedo kingfisher ramp: lightest → deepest, foreground ensures ≥4.5:1 contrast. */
export function levelColor(level: ActivityLevel, theme: AppTheme): LevelColors {
  if (level === 0) {
    return { background: 'transparent', foreground: theme.color.content.secondary };
  }

  if (level === 1) {
    return { background: theme.palette.kingfisher[100], foreground: theme.palette.ink[1000] };
  }
  if (level === 2) {
    return { background: theme.palette.kingfisher[300], foreground: theme.palette.ink[1000] };
  }
  if (level === 3) {
    return { background: theme.palette.kingfisher[600], foreground: theme.color.content.onTint };
  }
  // level 4
  return { background: theme.palette.kingfisher[700], foreground: theme.color.content.onTint };
}

/** Alcedo brand swatches for friend markers — deterministic per userId. */
const MARKER_PALETTE = (theme: AppTheme): string[] => [
  theme.palette.kingfisher[600],
  theme.palette.cobalt[600],
  theme.palette.turquoise[400],
  theme.palette.ember[600],
  theme.palette.kingfisher[400],
  theme.palette.cobalt[400],
  theme.palette.ember[300],
  theme.palette.kingfisher[700],
];

function hash(value: string): number {
  let result = 0;
  for (let i = 0; i < value.length; i++) {
    result = (result * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(result);
}

/** Deterministic per user, so the same person is the same colour on every day of the grid. */
export function markerColor(userId: string, theme: AppTheme): string {
  const palette = MARKER_PALETTE(theme);
  return palette[hash(userId) % palette.length]!;
}

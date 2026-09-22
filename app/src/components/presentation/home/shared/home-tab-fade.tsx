import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/hooks/useAppTheme';
import { alpha } from '@/styles/theme';

/**
 * 40pt fade-to-background pinned at the tab-bar boundary (skill §7): scroll
 * continuation dissolves instead of clipping. Pointer-transparent so the
 * rows beneath stay tappable. Colors track the screen-background ends:
 * dark `#08080B`, light `#F3F3F8`.
 */
export function HomeTabFade() {
  const theme = useAppTheme();
  const base = theme.isDark ? '#08080B' : '#F3F3F8';
  return (
    <LinearGradient
      colors={[alpha(base, 0), base]}
      locations={[0, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 40 }}
      pointerEvents="none"
    />
  );
}

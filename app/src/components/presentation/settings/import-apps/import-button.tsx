import { useAppTheme } from '@/hooks/useAppTheme';
import { useTranslate } from '@tolgee/react';
import { LinearGradient } from 'expo-linear-gradient';
import * as S from './import-button.styles';

/**
 * S5 §6: the sticky brand Import button (backup-redesign.md §5). One tap
 * opens the OS document picker immediately — no confirmation, no preview.
 * Success/failure feedback is snackbar-based and owned by the import effect.
 */
export function ImportButton({ onImport }: { onImport: () => void }) {
  const { t } = useTranslate();
  const { isDark } = useAppTheme();
  const label = t('backup.import_from_other_apps.import.button');

  return (
    <S.BarSurface>
      <S.ImportPressable
        onPress={onImport}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
      >
        <S.ImportGradientFill>
          <LinearGradient
            colors={isDark ? ['#FFB03A', '#FF6A3D', '#FF2D55'] : ['#FF9500', '#E8003F']}
            locations={isDark ? [0, 0.45, 1] : [0, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.6, y: 1 }}
            style={{ flex: 1 }}
          />
        </S.ImportGradientFill>
        <S.ImportGloss>
          <LinearGradient
            colors={['rgba(255,255,255,0.32)', 'rgba(255,255,255,0)']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{ flex: 1 }}
          />
        </S.ImportGloss>
        <S.ImportLabel>{label}</S.ImportLabel>
      </S.ImportPressable>
      <S.ImportCaption>{t('backup.import_from_other_apps.import.caption')}</S.ImportCaption>
    </S.BarSurface>
  );
}

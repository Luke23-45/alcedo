import { useAppTheme } from '@/hooks/useAppTheme';
import { PlaintextExportFormat, exportPlainText } from '@/store/settings';
import { alpha } from '@/styles/theme';
import { useTranslate } from '@tolgee/react';
import { useDispatch } from 'react-redux';
import * as S from './export-action.styles';

/**
 * Screen 10 of S4: the sticky brand Export pill (FullHeightScrollView
 * floatingChildren). Share-sheet cancellation is a silent no-op in the
 * effect — nothing to handle here.
 */
export function ExportAction({ format }: { format: PlaintextExportFormat }) {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const dispatch = useDispatch();
  const label = t('backup.plaintext_export.export.button');
  return (
    <S.ExportActionBar>
      <S.BarGradient
        colors={
          (theme.isDark
            ? [alpha('#15151A', 0.94), alpha('#0C0C10', 0.99)]
            : [alpha('#FBFBFD', 0.94), alpha('#F1F1F6', 0.99)]) as [string, string]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      <S.BarHairline />
      <S.ExportButton
        onPress={() => dispatch(exportPlainText({ format }))}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <S.ButtonGradient
          colors={['#FFB03A', '#FF6A3D', '#FF2D55']}
          locations={[0, 0.45, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.6, y: 1 }}
        />
        <S.GlossLayer
          colors={['rgba(255,255,255,0.32)', 'rgba(255,255,255,0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
        <S.ButtonEdge />
        <S.ButtonLabel>{label}</S.ButtonLabel>
      </S.ExportButton>
    </S.ExportActionBar>
  );
}

import { useAppTheme } from '@/hooks/useAppTheme';
import { ReactNode } from 'react';
import * as S from './card-shell.styles';

/** Backup-screen card shell (settings-dark.md Screen 6): rx28 default, rx26 for the about card. */
export function CardShell({ radius = 28, children }: { radius?: number; children: ReactNode }) {
  const theme = useAppTheme();
  return (
    <S.BackupCardEdgeBase
      $radius={radius}
      colors={
        theme.isDark
          ? ['rgba(255,255,255,0.17)', 'rgba(255,255,255,0.06)', 'rgba(255,255,255,0.025)']
          : ['rgba(0,0,0,0.045)', 'rgba(0,0,0,0.06)', 'rgba(0,0,0,0.115)']
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <S.BackupCardBodyBase
        $radius={radius}
        colors={[...theme.home.card.colors]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.45, y: 1 }}
      >
        {children}
      </S.BackupCardBodyBase>
    </S.BackupCardEdgeBase>
  );
}

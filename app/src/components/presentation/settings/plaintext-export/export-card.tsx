import { useAppTheme } from '@/hooks/useAppTheme';
import { ReactNode } from 'react';
import * as S from './export-card.styles';
import { ExportCardVariant } from './export-card.styles';

function edgeColors(theme: ReturnType<typeof useAppTheme>, variant: ExportCardVariant): readonly [string, string, string] {
  if (variant === 'danger') {
    return ['rgba(255,59,48,0.32)', 'rgba(255,59,48,0.13)', 'rgba(255,59,48,0.06)'];
  }
  if (variant === 'warning') {
    return ['rgba(255,159,10,0.30)', 'rgba(255,159,10,0.12)', 'rgba(255,159,10,0.06)'];
  }
  return theme.isDark
    ? ['rgba(255,255,255,0.17)', 'rgba(255,255,255,0.06)', 'rgba(255,255,255,0.025)']
    : ['rgba(0,0,0,0.045)', 'rgba(0,0,0,0.06)', 'rgba(0,0,0,0.115)'];
}

/**
 * Plaintext-export card shell (backup-redesign.md S4): rx24 default, smaller
 * radii for the filename and privacy cards. Carries the shared SectionLabel.
 */
export function ExportCard({
  variant = 'default',
  radius = 24,
  children,
}: {
  variant?: ExportCardVariant;
  radius?: number;
  children: ReactNode;
}) {
  const theme = useAppTheme();
  return (
    <S.CardEdge
      $radius={radius}
      colors={edgeColors(theme, variant)}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <S.CardBody
        $radius={radius}
        colors={theme.home.card.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.45, y: 1 }}
      >
        {variant === 'warning' ? <S.CardTint /> : undefined}
        <S.CardInner>{children}</S.CardInner>
      </S.CardBody>
    </S.CardEdge>
  );
}

export { SectionLabel } from './export-card.styles';

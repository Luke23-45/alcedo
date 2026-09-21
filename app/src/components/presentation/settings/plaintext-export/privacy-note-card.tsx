import { useAppTheme } from '@/hooks/useAppTheme';
import { useTranslate } from '@tolgee/react';
import Svg, { Path, Rect } from 'react-native-svg';
import { ExportCard } from './export-card';
import * as S from './privacy-note-card.styles';

function LockIcon() {
  const theme = useAppTheme();
  const color = theme.color.status.warning.base;
  return (
    <Svg width={20} height={20} viewBox="-10 -10 20 20">
      <Path
        d="M-3.5 -1.5 V-4 A3.5 3.5 0 0 1 3.5 -4 V-1.5"
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Rect x={-5.5} y={-1.5} width={11} height={8} rx={2} fill={color} />
    </Svg>
  );
}

/** Screen 9 of S4: the plaintext-health-data warning (backup-redesign.md §4).
 * No section label — the amber card speaks for itself, two-tone body. */
export function PrivacyNoteCard() {
  const { t } = useTranslate();
  return (
    <S.PrivacyWrap>
      <ExportCard variant="warning" radius={18}>
        <S.PrivacyRow>
          <S.LockIconWrap>
            <LockIcon />
          </S.LockIconWrap>
          <S.PrivacyBody accessibilityRole="text">
            <S.PrivacyLead>{t('backup.plaintext_export.privacy.body_lead')} </S.PrivacyLead>
            <S.PrivacyRest>{t('backup.plaintext_export.privacy.body_rest')}</S.PrivacyRest>
          </S.PrivacyBody>
        </S.PrivacyRow>
      </ExportCard>
    </S.PrivacyWrap>
  );
}

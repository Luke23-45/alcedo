import Icon from '@/components/presentation/foundation/icon';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAppSelector } from '@/store';
import { clearBackendAssignment, selectAssignedBackendId } from '@/store/backends';
import { alpha } from '@/styles/theme';
import { useTranslate } from '@tolgee/react';
import { useDispatch } from 'react-redux';
import * as S from './none-option.styles';

/**
 * The "None" option (backup-redesign.md S2): clears the backup assignment,
 * so auto-backup silently does nothing. Selected state gets the accent edge
 * and a checkmark, mirroring the mock.
 */
export function NoneOption() {
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const theme = useAppTheme();
  const assignedBackendId = useAppSelector((s) => selectAssignedBackendId(s, 'backup'));
  const selected = !assignedBackendId;

  const edgeColors: readonly [string, string, string] = selected
    ? [alpha('#FFB03A', 0.55), alpha('#FF6A3D', 0.55), alpha('#FF2D55', 0.55)]
    : theme.isDark
      ? ['rgba(255,255,255,0.17)', 'rgba(255,255,255,0.06)', 'rgba(255,255,255,0.025)']
      : ['rgba(0,0,0,0.045)', 'rgba(0,0,0,0.06)', 'rgba(0,0,0,0.115)'];

  return (
    <S.NonePressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={t('backup.remote.choose_server.none')}
      onPress={() => dispatch(clearBackendAssignment('backup'))}
    >
      {({ pressed }: { pressed: boolean }) => (
        <S.NoneCardEdge colors={edgeColors} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ opacity: pressed ? 0.7 : 1 }}>
          <S.NoneCardBody
            colors={theme.home.card.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.45, y: 1 }}
          >
            <S.NoneRow>
              <S.NoneText>
                <S.NoneTitle>{t('backup.remote.choose_server.none')}</S.NoneTitle>
                <S.NoneSubtitle>
                  {t('backup.remote.choose_server.none_subtitle')}
                </S.NoneSubtitle>
              </S.NoneText>
              {selected ? <Icon source="check" size={20} color="#FF9F0A" /> : undefined}
            </S.NoneRow>
          </S.NoneCardBody>
        </S.NoneCardEdge>
      )}
    </S.NonePressable>
  );
}

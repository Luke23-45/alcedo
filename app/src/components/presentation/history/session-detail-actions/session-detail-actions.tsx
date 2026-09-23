import { useAppTheme } from '@/hooks/useAppTheme';
import { useTranslate } from '@tolgee/react';
import Svg, { Path } from 'react-native-svg';
import * as S from './session-detail-actions.styles';

/** Reference: the ic-share upload glyph, scale .88. */
function ShareGlyph({ color }: { color: string }) {
  return (
    <Svg width={17} height={17} viewBox="-9.5 -9.7 19 18.6">
      <Path
        d="M-6.4 -1.4 H-7.6 A1.8 1.8 0 0 0 -9.4 .4 V7 A1.8 1.8 0 0 0 -7.6 8.8 H7.6 A1.8 1.8 0 0 0 9.4 7 V.4 A1.8 1.8 0 0 0 7.6 -1.4 H6.4"
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M0 -9.6 V3.4"
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M-4.2 -5.4 L0 -9.6 L4.2 -5.4"
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Reference: the ic-pen glyph, scale .86. */
function PenGlyph() {
  return (
    <Svg width={16} height={16} viewBox="-9 -9 18 18">
      <Path
        d="M-8 8 L-8.6 4.2 L4.4 -8.8 A2.6 2.6 0 0 1 8.1 -5.1 L-4.9 7.9 Z"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2.6 -7 L6.3 -3.3"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * The archival actions: Share (existing encrypted-share flow) and Edit Session
 * (brand-gradient primary → the edit route) side by side, Delete Session as a
 * destructive ghost beneath. Destructive state is confirmed by the screen.
 */
export function SessionDetailActions({
  onShare,
  onEdit,
  onDelete,
}: {
  onShare: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { t } = useTranslate();
  const theme = useAppTheme();

  return (
    <S.ActionsWrap>
      <S.Row>
        <S.ShareButton
          onPress={onShare}
          accessibilityRole="button"
          accessibilityLabel={t('workout.post_workout.share.button')}
          hitSlop={0}
        >
          <ShareGlyph color={theme.isDark ? '#C7C7CC' : theme.color.content.secondary} />
          <S.ShareLabel>{t('workout.post_workout.share.button')}</S.ShareLabel>
        </S.ShareButton>
        <S.EditButton
          onPress={onEdit}
          accessibilityRole="button"
          accessibilityLabel={t('history.session_detail.actions.edit', 'Edit Session')}
        >
          <S.EditFill />
          <S.EditGloss />
          <PenGlyph />
          <S.EditLabel>{t('history.session_detail.actions.edit', 'Edit Session')}</S.EditLabel>
        </S.EditButton>
      </S.Row>
      <S.DeleteButton
        onPress={onDelete}
        accessibilityRole="button"
        accessibilityLabel={t('history.session_detail.actions.delete', 'Delete Session')}
      >
        <S.DeleteLabel>{t('history.session_detail.actions.delete', 'Delete Session')}</S.DeleteLabel>
      </S.DeleteButton>
    </S.ActionsWrap>
  );
}

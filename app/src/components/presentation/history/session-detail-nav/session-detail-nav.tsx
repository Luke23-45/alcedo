import { DotsTrigger } from '@/components/presentation/workout/session/dots-trigger/dots-trigger';
import Menu, { MenuItem } from '@/components/presentation/foundation/menu';
import { useTranslate } from '@tolgee/react';
import Svg, { Path } from 'react-native-svg';
import * as S from './session-detail-nav.styles';

/**
 * The in-content navigation for the archival detail: a 44×44 back chevron,
 * the centered page title, and the 44×44 overflow menu. The native header
 * stays hidden so the record reads as one continuous surface.
 */
export function SessionDetailNav({ onBack, menuItems }: { onBack: () => void; menuItems: MenuItem[] }) {
  const { t } = useTranslate();

  return (
    <S.NavRow>
      <S.BackButton
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel={t('generic.back.button')}
        hitSlop={0}
      >
        <Svg width={12} height={18} viewBox="-5 -9 10 18">
          <Path
            d="M2 -5 L-2.6 0 L2 5"
            fill="none"
            stroke="#8E8E93"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </S.BackButton>
      <S.Title numberOfLines={1}>{t('history.session_detail.title', 'Session Detail')}</S.Title>
      <S.MenuSlot>
        <Menu items={menuItems} trigger={(open) => <DotsTrigger onPress={open} />} />
      </S.MenuSlot>
    </S.NavRow>
  );
}

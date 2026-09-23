import { useAppTheme } from '@/hooks/useAppTheme';
import { useTranslate } from '@tolgee/react';
import type { ReactNode } from 'react';
import Svg, { Path } from 'react-native-svg';
import { sessionPalette } from '../session-tokens';
import { BackButton, MenuSlot, NavRow, NavTitle } from './session-nav.styles';

/**
 * Active-session navigation: back chevron, centered workout title, and the
 * `⋯` menu slot. The native stack header stays hidden — the real iOS status
 * bar above is provided by the OS, not drawn here.
 */
export function SessionNav({ title, onBack, menu }: { title: string; onBack: () => void; menu?: ReactNode }) {
  const { isDark } = useAppTheme();
  const { t } = useTranslate();
  const colors = sessionPalette(isDark).nav;

  return (
    <NavRow>
      <BackButton
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel={t('generic.back.button')}
        testID="session-nav-back"
      >
        <Svg width={14} height={10} viewBox="-7 -5 14 10">
          <Path
            d="M-5 -2.5 L0 2.5 L5 -2.5"
            stroke={colors.chevron}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      </BackButton>
      <NavTitle numberOfLines={1} ellipsizeMode="tail">
        {title}
      </NavTitle>
      <MenuSlot>{menu ?? null}</MenuSlot>
    </NavRow>
  );
}

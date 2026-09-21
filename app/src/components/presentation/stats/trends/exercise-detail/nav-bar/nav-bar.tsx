import { Pressable } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import Menu from '@/components/presentation/foundation/menu';
import type { MenuItem } from '@/components/presentation/foundation/menu';
import * as S from './nav-bar.styles';

/**
 * In-content nav: 44pt back chevron, centered 15/600/−0.3 short-name title,
 * 44pt overflow trigger on the right. The ⋯ menu mirrors the screen's two
 * bottom actions (log session / edit details) so every control goes somewhere
 * real — no dead buttons.
 */
export function DetailNavBar({
  title,
  onBack,
  menuItems,
}: {
  title: string;
  onBack: () => void;
  menuItems: MenuItem[];
}) {
  return (
    <S.NavBar>
      <Pressable
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Back"
        hitSlop={0}
        style={S.navHit}
      >
        <Svg width={10} height={14} viewBox="-4 -6 8 12">
          <Path
            d="M2 -5 L-2.6 0 L2 5"
            fill="none"
            stroke="#8E8E93"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Pressable>
      <S.NavTitleWrap>
        <S.NavTitle numberOfLines={1} ellipsizeMode="tail">
          {title}
        </S.NavTitle>
      </S.NavTitleWrap>
      <Menu
        items={menuItems}
        trigger={(open) => (
          <Pressable
            onPress={open}
            accessibilityRole="button"
            accessibilityLabel="More options"
            hitSlop={0}
            style={S.navHit}
          >
            <Svg width={18} height={6} viewBox="0 0 18 6">
              <Circle cx={2} cy={3} r={2} fill="#8E8E93" />
              <Circle cx={9} cy={3} r={2} fill="#8E8E93" />
              <Circle cx={16} cy={3} r={2} fill="#8E8E93" />
            </Svg>
          </Pressable>
        )}
      />
    </S.NavBar>
  );
}

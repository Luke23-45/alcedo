import styled from 'styled-components/native';
import { ScrollView } from 'react-native';
import { alpha } from '@/styles/theme';
import { HomeGradient } from '../shared/home-gradient';

/**
 * Six 46pt badges scroll horizontally (same bleed pattern as the programs
 * carousel) so 320pt screens never crush them and wide screens never stretch
 * the gaps.
 */
export const BadgeRow = styled(ScrollView).attrs(({ theme }) => ({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: {
    gap: theme.space.md,
    paddingHorizontal: theme.layout.screenPadding,
    alignItems: 'center',
  },
}))`
  margin-horizontal: ${({ theme }) => -theme.layout.screenPadding}px;
`;

/** 46pt badge circle with gradient, shine, and centered glyph. */
export const Badge = styled(HomeGradient)`
  width: 46px;
  height: 46px;
  border-radius: 23px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const Shine = styled.View`
  position: absolute;
  top: -13px;
  width: 34px;
  height: 18px;
  border-radius: 9px;
  background-color: ${alpha('#FFFFFF', 0.22)};
`;

/**
 * Locked badge: dark recessed well in dark mode, grey wash in light mode so
 * locked reads locked (not selected) on white cards.
 */
export const LockedBadge = styled.View`
  width: 46px;
  height: 46px;
  border-radius: 23px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => (theme.isDark ? '#1E1E22' : alpha('#787880', 0.12))};
  border-width: 1px;
  border-color: ${({ theme }) => (theme.isDark ? alpha('#FFFFFF', 0.1) : alpha('#787880', 0.22))};
`;

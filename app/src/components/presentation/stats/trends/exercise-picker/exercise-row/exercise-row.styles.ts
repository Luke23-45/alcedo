import styled from 'styled-components/native';
import { HomeCard } from '@/components/presentation/home/shared/home-card';

/* Exercise row: 52pt card (HomeCard tile surface), 8pt gap baked in below.
   The parent list reserves the right gutter for the A-Z scrubber. */

export const RowPress = styled.Pressable`
  margin-bottom: 8px;
`;

export const RowCard = styled(HomeCard).attrs({ radius: 18, elev: 'tile', pad: 0 })``;

export const RowInner = styled.View`
  /* 50pt + the HomeCard edge layer's 1pt padding = 52pt total, per spec. */
  height: 50px;
  flex-direction: row;
  align-items: center;
  padding-left: 14px;
  padding-right: 12px;
  gap: 12px;
`;

export const IconTile = styled.View<{ $color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 11px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $color }) => $color};
`;

export const TextBlock = styled.View`
  flex: 1;
`;

export const SelectCircle = styled.View<{ $selected: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 11px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $selected }) => ($selected ? '#FF2D55' : 'transparent')};
  ${({ theme, $selected }) =>
    $selected
      ? ''
      : `border-width: 1.6px; border-color: ${
          theme.isDark ? 'rgba(255,255,255,0.16)' : 'rgba(60,60,67,0.3)'
        };`}
`;

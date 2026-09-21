import styled from 'styled-components/native';
import { alpha } from '@/styles/theme';
import { HomeGradient } from '../shared/home-gradient';

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

/** 76×21 "3 DAYS LEFT" chip, amber wash. */
export const DaysChip = styled.View`
  width: 76px;
  height: 21px;
  border-radius: 10.5px;
  background-color: ${alpha('#FF9F0A', 0.14)};
  align-items: center;
  justify-content: center;
`;

export const Rows = styled.View`
  margin-top: ${({ theme }) => theme.space.sm}px;
`;

/** 28pt leaderboard row. */
export const Row = styled.View`
  height: 28px;
  flex-direction: row;
  align-items: center;
`;

/** Highlight wash behind the "You" row: 337×26 rx13. */
export const YouHighlight = styled.View`
  position: absolute;
  left: 12px;
  right: 12px;
  top: 1px;
  height: 26px;
  border-radius: 13px;
  background-color: ${alpha('#FF375F', 0.09)};
`;

export const RankBox = styled.View`
  width: 16px;
  align-items: center;
`;

export const Avatar = styled.View<{ $color: string }>`
  width: 26px;
  height: 26px;
  border-radius: 13px;
  background-color: ${({ $color }) => $color};
  align-items: center;
  justify-content: center;
  margin-left: 12px;
`;

export const AvatarBrand = styled(HomeGradient).attrs({ variant: 'brand' as const })`
  width: 26px;
  height: 26px;
  border-radius: 13px;
  align-items: center;
  justify-content: center;
  margin-left: 12px;
`;

export const AvatarRing = styled.View`
  position: absolute;
  width: 29.2px;
  height: 29.2px;
  border-radius: 14.6px;
  border-width: 1.6px;
  border-color: ${alpha('#FF2D55', 0.55)};
`;

export const NameWrap = styled.View`
  flex: 1;
  margin-left: 10px;
`;

export const Divider = styled.View`
  height: 1px;
  background-color: ${alpha('#FFFFFF', 0.06)};
  margin-left: 20px;
`;

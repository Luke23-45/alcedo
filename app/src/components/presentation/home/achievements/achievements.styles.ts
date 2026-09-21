import styled from 'styled-components/native';
import { alpha } from '@/styles/theme';
import { HomeGradient } from '../shared/home-gradient';

export const BadgeRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
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

export const LockedBadge = styled.View`
  width: 46px;
  height: 46px;
  border-radius: 23px;
  align-items: center;
  justify-content: center;
  background-color: #1e1e22;
  border-width: 1px;
  border-color: ${alpha('#FFFFFF', 0.1)};
`;

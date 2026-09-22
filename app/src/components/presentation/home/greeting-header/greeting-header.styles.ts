import styled from 'styled-components/native';
import { alpha } from '@/styles/theme';
import { HomeGradient } from '../shared/home-gradient';

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const TextColumn = styled.View`
  gap: ${({ theme }) => (theme.space?.xs ?? 4)}px;
  flex-shrink: 1;
`;

export const TrailingGroup = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => (theme.space?.sm ?? 8)}px;
`;

/**
 * 44pt avatar (design spec) with the crown gradient. The white edge stroke is
 * an allowed alpha('#FFFFFF') usage — it reads as a lit rim, not a fill.
 */
export const Avatar = styled(HomeGradient).attrs({ variant: 'crown' as const })`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  align-items: center;
  justify-content: center;
  border-width: ${({ theme }) => theme.borderWidth.thin}px;
  border-color: ${alpha('#FFFFFF', 0.25)};
`;

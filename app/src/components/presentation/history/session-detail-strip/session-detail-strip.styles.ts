import styled from 'styled-components/native';
import { HomeCard } from '@/components/presentation/home/shared/home-card';

/* Reference: the strip is a 361×68 surface budget. Grows, never clips. */
export const StripCard = styled(HomeCard)`
  min-height: 68px;
`;

export const StripInner = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

export const Cell = styled.View`
  flex: 1;
  align-items: center;
  gap: 3px;
`;

export const Divider = styled.View`
  width: 1px;
  align-self: stretch;
  margin-vertical: 12px;
  /* Reference: white@.08 vertical dividers. */
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)')};
`;

export const Value = styled.Text`
  font-size: 15px;
  line-height: 19px;
  font-weight: 700;
  letter-spacing: -0.4px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const Label = styled.Text`
  font-size: 7.5px;
  line-height: 10px;
  font-weight: 700;
  letter-spacing: 0.7px;
  color: ${({ theme }) => theme.color.content.secondary};
`;

export const MaxBpmRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

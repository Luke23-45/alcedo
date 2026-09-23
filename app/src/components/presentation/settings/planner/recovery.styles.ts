import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { HomeCard } from '@/components/presentation/home/shared/home-card';

export const RecoveryCard = styled(HomeCard).attrs({ radius: 26, pad: 20 })``;

export const RecoveryRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const RecoveryText = styled.View`
  flex: 1;
  gap: 2px;
`;

export const RecoveryTitle = styled.Text`
  font-size: 13.5px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const RecoveryCaption = styled.Text`
  font-size: 10.5px;
  font-weight: 500;
  color: ${({ theme }) => (theme.isDark ? '#86868B' : '#8E8E93')};
`;

export const RecoveryDivider = styled.View`
  height: ${StyleSheet.hairlineWidth}px;
  margin-vertical: 16px;
  ${({ theme }) =>
    theme.isDark
      ? `
          background-color: rgba(255, 255, 255, 0.06);
        `
      : `
          background-color: rgba(0, 0, 0, 0.06);
        `}
`;

export const DeloadRow = styled.View`
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
`;

export const DeloadLabel = styled.Text`
  font-size: 13.5px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const DeloadDate = styled.Text`
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.home.amber};
`;

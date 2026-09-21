import styled from 'styled-components/native';

export const Rows = styled.View`
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 24px;
  gap: 4px;
`;

export const Row = styled.Pressable`
  flex-direction: row;
  align-items: center;
  min-height: 64px;
  border-radius: 18px;
  padding-left: 12px;
  padding-right: 16px;
  gap: 12px;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(120, 120, 128, 0.08)')};
`;

export const IconWell = styled.View`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(120, 120, 128, 0.12)')};
`;

export const RowText = styled.View`
  flex: 1;
  justify-content: center;
  gap: 2px;
`;

export const RowLabel = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 15px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.3px;
  color: ${({ theme }) => (theme.isDark ? '#FFFFFF' : '#1C1C1E')};
`;

export const RowDetail = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 12px;
  font-weight: ${({ theme }) => theme.weight.regular};
  letter-spacing: -0.1px;
  color: ${({ theme }) => (theme.isDark ? '#86868B' : '#8E8E93')};
`;

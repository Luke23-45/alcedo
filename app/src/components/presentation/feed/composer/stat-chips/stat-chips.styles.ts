import styled from 'styled-components/native';

export const Section = styled.View`
  margin-top: 32px;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
  padding-left: 24px;
  padding-right: 24px;
`;

export const SectionHeader = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 10px;
  font-weight: ${({ theme }) => theme.weight.bold};
  letter-spacing: 1.35px;
  color: ${({ theme }) => (theme.isDark ? '#86868B' : '#8E8E93')};
`;

export const ShownCount = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 10px;
  font-weight: ${({ theme }) => theme.weight.medium};
  letter-spacing: -0.1px;
  color: ${({ theme }) => (theme.isDark ? '#6C6C70' : '#8E8E93')};
`;

export const ChipRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  padding-left: 16px;
  padding-right: 16px;
  margin-top: 12px;
`;

export const Chip = styled.Pressable<{ $on: boolean; $width: number }>`
  min-width: ${({ $width }) => $width}px;
  height: 28px;
  border-radius: 14px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 7px;
  padding-left: 14px;
  padding-right: 14px;
  background-color: ${({ theme, $on }) =>
    $on
      ? theme.isDark
        ? 'rgba(48, 209, 88, 0.14)'
        : 'rgba(52, 199, 89, 0.16)'
      : theme.isDark
        ? 'rgba(255, 255, 255, 0.06)'
        : 'rgba(120, 120, 128, 0.12)'};
  border-width: 0.8px;
  border-color: ${({ theme, $on }) =>
    $on
      ? theme.isDark
        ? 'rgba(48, 209, 88, 0.3)'
        : 'rgba(52, 199, 89, 0.4)'
      : theme.isDark
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(120, 120, 128, 0.2)'};
`;

export const ChipLabel = styled.Text<{ $on: boolean }>`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 11.5px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.15px;
  color: ${({ theme, $on }) => ($on ? (theme.isDark ? '#4ADE80' : '#248A3D') : theme.isDark ? '#8E8E93' : '#6E6E73')};
`;

import styled from 'styled-components/native';

export const Section = styled.View`
  margin-top: 32px;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
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

export const LiveRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

export const LiveDot = styled.View`
  width: 6.4px;
  height: 6.4px;
  border-radius: 3.2px;
  background-color: ${({ theme }) => (theme.isDark ? '#30D158' : '#34C759')};
`;

export const LiveLabel = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 10px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: 0.2px;
  color: ${({ theme }) => (theme.isDark ? '#4ADE80' : '#248A3D')};
`;

export const PosterSlot = styled.View`
  padding-left: 16px;
  padding-right: 16px;
  margin-top: 12px;
`;

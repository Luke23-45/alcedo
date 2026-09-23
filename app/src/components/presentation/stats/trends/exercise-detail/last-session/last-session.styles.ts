import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';

export const CardInner = styled.View`
  padding-top: 14px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 11px;
`;

export const TitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  min-height: 20px;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 15.5px;
  line-height: 20px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.3px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const Subtitle = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 11px;
  line-height: 14px;
  font-weight: ${({ theme }) => theme.weight.medium};
  color: ${({ theme }) => theme.color.content.secondary};
  margin-top: 3px;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  margin-top: 10px;
  height: 10px;
`;

export const HCell = styled.Text<{ $flex: number; $right?: boolean }>`
  flex: ${({ $flex }) => $flex};
  font-family: ${({ theme }) => theme.font.text};
  font-size: 8px;
  line-height: 10px;
  font-weight: ${({ theme }) => theme.weight.bold};
  letter-spacing: 0.8px;
  text-transform: uppercase;
  text-align: ${({ $right }) => ($right ? 'right' : 'left')};
  color: ${({ theme }) => (theme.isDark ? '#6C6C70' : '#8E8E93')};
`;

export const HeaderDivider = styled.View`
  height: ${StyleSheet.hairlineWidth}px;
  margin-top: 5px;
  background-color: ${({ theme }) =>
    theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(60,60,67,0.12)'};
`;

export const SetRow = styled.View<{ $first: boolean }>`
  flex-direction: row;
  align-items: center;
  height: 26px;
  ${({ $first, theme }) =>
    $first
      ? ''
      : `border-top-width: ${StyleSheet.hairlineWidth}px; border-top-color: ${
           theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(60,60,67,0.08)'
         };`}
`;

export const SetNum = styled.Text<{ $flex: number }>`
  flex: ${({ $flex }) => $flex};
  font-family: ${({ theme }) => theme.font.text};
  font-size: 11px;
  line-height: 14px;
  font-weight: ${({ theme }) => theme.weight.bold};
  color: ${({ theme }) => (theme.isDark ? '#8E8E93' : '#636366')};
`;

export const Cell = styled.Text<{ $flex: number }>`
  flex: ${({ $flex }) => $flex};
  font-family: ${({ theme }) => theme.font.text};
  font-size: 12px;
  line-height: 15px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  color: ${({ theme }) => (theme.isDark ? '#F5F5F7' : theme.color.content.primary)};
`;

export const E1rmCell = styled(Cell)`
  font-weight: ${({ theme }) => theme.weight.bold};
`;

export const RpeCell = styled.Text<{ $flex: number }>`
  flex: ${({ $flex }) => $flex};
  text-align: right;
  font-family: ${({ theme }) => theme.font.text};
  font-size: 11px;
  line-height: 14px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  color: ${({ theme }) => (theme.isDark ? '#98989F' : '#636366')};
`;

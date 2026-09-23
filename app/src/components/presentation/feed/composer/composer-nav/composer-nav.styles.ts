import styled from 'styled-components/native';

export const NavRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  min-height: 52px;
  padding-left: 8px;
  padding-right: 8px;
`;

export const NavButton = styled.Pressable<{ $dimmed?: boolean }>`
  min-width: 44px;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  padding-left: 12px;
  padding-right: 12px;
  opacity: ${({ $dimmed }) => ($dimmed ? 0.5 : 1)};
`;

export const NavButtonText = styled.Text<{ $color: string; $tone: 'regular' | 'semibold' }>`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 16px;
  font-weight: ${({ theme, $tone }) => ($tone === 'semibold' ? theme.weight.semibold : theme.weight.regular)};
  letter-spacing: -0.3px;
  color: ${({ $color }) => $color};
`;

export const NavTitle = styled.Text`
  flex: 1;
  text-align: center;
  font-family: ${({ theme }) => theme.font.text};
  font-size: 15px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.3px;
  color: ${({ theme }) => (theme.isDark ? '#FFFFFF' : '#1C1C1E')};
`;

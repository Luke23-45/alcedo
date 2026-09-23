import styled from 'styled-components/native';

export const CardInner = styled.View`
  padding-top: 14px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 16px;
  min-height: 140px;
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

export const Row = styled.View<{ $first?: boolean }>`
  flex-direction: row;
  height: 30px;
  padding-top: 10px;
  ${({ $first }) => ($first ? 'margin-top: 8px;' : '')}
`;

export const Name = styled.Text`
  width: 104px;
  font-family: ${({ theme }) => theme.font.text};
  font-size: 12px;
  line-height: 15px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.15px;
  color: ${({ theme }) => (theme.isDark ? '#F5F5F7' : theme.color.content.primary)};
`;

export const Track = styled.View`
  flex: 1;
  height: 6px;
  margin-top: 4px;
  border-radius: 3px;
  overflow: hidden;
  background-color: ${({ theme }) =>
    theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(120,120,128,0.14)'};
`;

export const Fill = styled.View<{ $widthPct: number; $color: string }>`
  width: ${({ $widthPct }) => $widthPct}%;
  height: 6px;
  border-radius: 3px;
  background-color: ${({ $color }) => $color};
`;

export const Pct = styled.Text<{ $color: string }>`
  width: 37px;
  text-align: right;
  font-family: ${({ theme }) => theme.font.text};
  font-size: 11.5px;
  line-height: 14px;
  font-weight: ${({ theme }) => theme.weight.bold};
  letter-spacing: -0.2px;
  color: ${({ $color }) => $color};
`;

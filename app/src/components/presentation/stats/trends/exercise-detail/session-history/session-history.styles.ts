import styled from 'styled-components/native';
import type { StyleProp, ViewStyle } from 'react-native';

export const cardGap: StyleProp<ViewStyle> = { marginBottom: 10 };

export const Section = styled.View`
  margin-top: 4px;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 8px;
  padding-right: 4px;
  height: 20px;
  margin-bottom: 10px;
`;

export const Eyebrow = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 10px;
  line-height: 13px;
  font-weight: ${({ theme }) => theme.weight.bold};
  letter-spacing: 1.35px;
  color: ${({ theme }) => theme.color.content.secondary};
`;

export const TotalWrap = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

export const TotalText = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 11.5px;
  line-height: 15px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.1px;
  color: ${({ theme }) => theme.home.seeAll};
`;

export const RowInner = styled.View`
  flex-direction: row;
  align-items: center;
  height: 76px;
  padding-left: 16px;
  padding-right: 16px;
`;

export const DateTile = styled.View<{ $pr: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  align-items: center;
  padding-top: 10px;
  background-color: ${({ $pr }) => ($pr ? 'rgba(255,214,10,0.12)' : 'rgba(255,255,255,0.06)')};
`;

export const DateMonth = styled.Text<{ $pr: boolean }>`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 8px;
  line-height: 10px;
  font-weight: ${({ theme }) => theme.weight.bold};
  letter-spacing: 0.6px;
  color: ${({ $pr }) => ($pr ? '#A08000' : '#8E8E93')};
`;

export const DateDay = styled.Text<{ $pr: boolean }>`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 16px;
  line-height: 20px;
  font-weight: ${({ theme }) => theme.weight.bold};
  letter-spacing: -0.5px;
  color: ${({ $pr, theme }) => ($pr ? '#FFD84D' : theme.color.content.primary)};
`;

export const TextBlock = styled.View`
  flex: 1;
  justify-content: center;
  margin-left: 12px;
  margin-right: 8px;
`;

export const MainLine = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 13.5px;
  line-height: 17px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.2px;
  color: ${({ theme }) => (theme.isDark ? '#FFFFFF' : theme.color.content.primary)};
`;

export const SubLine = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 11px;
  line-height: 14px;
  font-weight: ${({ theme }) => theme.weight.medium};
  color: ${({ theme }) => theme.color.content.secondary};
  margin-top: 4px;
`;

export const PrBadge = styled.View`
  height: 18px;
  padding-horizontal: 8px;
  border-radius: 9px;
  border-width: 0.7px;
  border-color: rgba(255, 214, 10, 0.3);
  background-color: rgba(255, 214, 10, 0.18);
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

export const PrText = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 8.5px;
  line-height: 11px;
  font-weight: ${({ theme }) => theme.weight.bold};
  letter-spacing: 0.5px;
  color: #ffd84d;
`;

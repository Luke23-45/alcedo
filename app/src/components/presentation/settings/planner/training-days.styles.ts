import styled, { css } from 'styled-components/native';
import { HomeCard } from '@/components/presentation/home/shared/home-card';

export const DaysCard = styled(HomeCard).attrs({ radius: 26, pad: 20 })``;

export const DaysHeaderRow = styled.View`
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const DaysTitle = styled.Text`
  font-size: 13.5px;
  font-weight: 600;
  letter-spacing: -0.2px;
  flex-shrink: 1;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const DaysRestCaption = styled.Text`
  font-size: 11px;
  font-weight: 500;
  flex: 1;
  text-align: right;
  color: ${({ theme }) => (theme.isDark ? '#86868B' : '#8E8E93')};
`;

export const DayRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const DayCircle = styled.View<{ $selected: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  ${({ theme, $selected }) =>
    !$selected &&
    (theme.isDark
      ? css`
          background-color: rgba(255, 255, 255, 0.06);
          border-width: 0.8px;
          border-color: rgba(255, 255, 255, 0.08);
        `
      : css`
          background-color: rgba(0, 0, 0, 0.04);
          border-width: 0.8px;
          border-color: rgba(0, 0, 0, 0.08);
        `)}
`;

export const DayLetter = styled.Text<{ $selected: boolean }>`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme, $selected }) => ($selected ? '#FFFFFF' : theme.isDark ? '#6C6C70' : '#8E8E93')};
`;

export const SplitStrip = styled.Text`
  font-size: 9.5px;
  font-weight: 500;
  text-align: center;
  margin-top: 16px;
  color: ${({ theme }) => (theme.isDark ? '#6C6C70' : '#8E8E93')};
`;

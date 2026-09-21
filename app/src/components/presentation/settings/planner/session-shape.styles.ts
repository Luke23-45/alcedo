import styled from 'styled-components/native';
import { HomeCard } from '@/components/presentation/home/shared/home-card';

export const ShapeCard = styled(HomeCard).attrs({ radius: 26, pad: 20 })``;
export const FocusCard = styled(HomeCard).attrs({ radius: 24, pad: 20 })``;

export const FocusLabel = styled.Text`
  font-size: 13.5px;
  font-weight: 600;
  letter-spacing: -0.2px;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const FocusTrack = styled.View`
  flex-direction: row;
  height: 26px;
  border-radius: 13px;
  padding: 2px;
  ${({ theme }) =>
    theme.isDark
      ? `
          background-color: rgba(255, 255, 255, 0.06);
        `
      : `
          background-color: rgba(0, 0, 0, 0.05);
        `}
`;

export const FocusOption = styled.View<{ $selected: boolean }>`
  flex: 1;
  border-radius: 11px;
  align-items: center;
  justify-content: center;
  ${({ theme, $selected }) =>
    $selected
      ? theme.isDark
        ? `
            background-color: rgba(255, 255, 255, 0.14);
          `
        : `
            background-color: #ffffff;
            shadow-color: #000000;
            shadow-offset: 0px 2px;
            shadow-opacity: 0.12;
            shadow-radius: 4px;
            elevation: 2;
          `
      : ''}
`;

export const FocusOptionText = styled.Text<{ $selected: boolean }>`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: -0.15px;
  color: ${({ theme, $selected }) => ($selected ? theme.color.content.primary : theme.isDark ? '#8E8E93' : '#8E8E93')};
`;

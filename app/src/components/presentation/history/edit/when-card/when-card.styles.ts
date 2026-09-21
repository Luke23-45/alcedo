import styled, { css } from 'styled-components/native';
import { alpha, fontWeight } from '@/styles/theme';
import { HomeGradient } from '@/components/presentation/home/shared/home-gradient';

/* WHEN card · 361×132 rx28. Three 44pt rows: Start / End / Duration. */

export const WhenOuter = styled(HomeGradient).attrs({ variant: 'cardEdge' })<{
  $radius: number;
}>`
  border-radius: ${({ $radius }) => $radius}px;
  padding: 1px;
  ${({ theme }) =>
    theme.isDark
      ? css`
          shadow-color: #000000;
          shadow-offset: 0px 10px;
          shadow-opacity: 0.5;
          shadow-radius: 14px;
          elevation: 8;
        `
      : css`
          shadow-color: #14142b;
          shadow-offset: 0px 8px;
          shadow-opacity: 0.075;
          shadow-radius: 16px;
          elevation: 4;
        `}
`;

export const WhenBody = styled(HomeGradient).attrs({ variant: 'cardBody' })`
  border-radius: 27px;
  overflow: hidden;
  height: 130px;
`;

export const WhenRow = styled.Pressable`
  height: 43.33px;
  flex-direction: row;
  align-items: center;
  padding-horizontal: 20px;
`;

export const WhenLabel = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 13px;
  font-weight: ${fontWeight.medium};
  color: #98989f;
`;

export const WhenValue = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 13px;
  font-weight: ${fontWeight.semibold};
  letter-spacing: -0.2px;
  color: ${({ theme }) => (theme.isDark ? '#FFFFFF' : '#1C1C1E')};
`;

export const WhenValueWrap = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

export const WhenDivider = styled.View<{ $top: number }>`
  position: absolute;
  top: ${({ $top }) => $top}px;
  left: 20px;
  right: 20px;
  height: 1px;
  background-color: ${({ theme }) => (theme.isDark ? alpha('#FFFFFF', 0.06) : alpha('#000000', 0.06))};
`;

export const ChevronSlot = styled.View`
  margin-left: 10px;
  width: 8px;
  align-items: flex-end;
`;

export const AutoChip = styled.View`
  height: 16px;
  border-radius: 8px;
  padding-horizontal: 8px;
  margin-left: 8px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => (theme.isDark ? alpha('#FFFFFF', 0.07) : alpha('#000000', 0.05))};
`;

export const AutoChipText = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 7.5px;
  font-weight: ${fontWeight.bold};
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #8e8e93;
`;

import styled from 'styled-components/native';
import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { HomeGradient } from '@/components/presentation/home/shared/home-gradient';

export const NextCard = styled(HomeCard).attrs({ radius: 28, pad: 20 })``;

export const NextHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

export const NextIcon = styled(HomeGradient).attrs({ variant: 'brand' })`
  width: 44px;
  height: 44px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  shadow-color: #ff2d55;
  shadow-offset: 0px 7px;
  shadow-opacity: 0.5;
  shadow-radius: 12px;
  elevation: 6;
`;

export const NextTitleBlock = styled.View`
  flex: 1;
  margin-left: 12px;
  gap: 2px;
`;

export const NextName = styled.Text`
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.3px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const NextMeta = styled.Text`
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => (theme.isDark ? '#86868B' : '#8E8E93')};
`;

export const MuscleChips = styled.View`
  flex-direction: row;
  gap: 6px;
  margin-bottom: 16px;
`;

export const MuscleChip = styled.View`
  padding-horizontal: 12px;
  padding-vertical: 5px;
  border-radius: 11px;
  border-width: 0.8px;
  ${({ theme }) =>
    theme.isDark
      ? `
          background-color: rgba(255, 255, 255, 0.07);
          border-color: rgba(255, 255, 255, 0.09);
        `
      : `
          background-color: rgba(0, 0, 0, 0.04);
          border-color: rgba(0, 0, 0, 0.08);
        `}
`;

export const MuscleChipText = styled.Text`
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: ${({ theme }) => (theme.isDark ? '#C7C7CC' : '#636366')};
`;

export const RegenButton = styled(HomeGradient).attrs({ variant: 'brand' })`
  height: 44px;
  border-radius: 22px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.22);
  overflow: hidden;
  shadow-color: #ff2d55;
  shadow-offset: 0px 7px;
  shadow-opacity: 0.5;
  shadow-radius: 12px;
  elevation: 6;
`;

export const RegenLabel = styled.Text`
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.25px;
  color: #ffffff;
`;

export const InsightRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: 6px;
  margin-top: 12px;
  padding-horizontal: 8px;
`;

export const InsightText = styled.Text`
  flex: 1;
  font-size: 11px;
  font-weight: 500;
  line-height: 15px;
  color: ${({ theme }) => (theme.isDark ? '#86868B' : '#8E8E93')};
`;

export const EmptyWrap = styled.View`
  gap: 8px;
  padding-vertical: 4px;
`;

export const EmptyTitle = styled.Text`
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.3px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const EmptyCaption = styled.Text`
  font-size: 13px;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => (theme.isDark ? '#98989F' : '#636366')};
`;

export const EmptyCta = styled(HomeGradient).attrs({ variant: 'brand' })`
  height: 44px;
  border-radius: 22px;
  align-items: center;
  justify-content: center;
  margin-top: 4px;
  overflow: hidden;
  shadow-color: #ff2d55;
  shadow-offset: 0px 7px;
  shadow-opacity: 0.5;
  shadow-radius: 12px;
  elevation: 6;
`;

export const EmptyCtaText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.25px;
  color: #ffffff;
`;

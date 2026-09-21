import styled from 'styled-components/native';
import { HomeCard } from '@/components/presentation/home/shared/home-card';

export const OverloadCard = styled(HomeCard).attrs({ radius: 24, pad: 20 })`
  flex-direction: row;
  align-items: center;
`;

export const OverloadText = styled.View`
  flex: 1;
  gap: 2px;
`;

export const OverloadTitle = styled.Text`
  font-size: 13.5px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const OverloadCaption = styled.Text`
  font-size: 10.5px;
  font-weight: 500;
  color: ${({ theme }) => (theme.isDark ? '#86868B' : '#8E8E93')};
`;

export const Stepper = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

export const StepButton = styled.View`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  border-width: 0.8px;
  ${({ theme }) =>
    theme.isDark
      ? `
          background-color: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.1);
        `
      : `
          background-color: rgba(0, 0, 0, 0.04);
          border-color: rgba(0, 0, 0, 0.08);
        `}
`;

export const StepValue = styled.Text`
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.3px;
  min-width: 64px;
  text-align: center;
  color: ${({ theme }) => theme.color.content.primary};
`;

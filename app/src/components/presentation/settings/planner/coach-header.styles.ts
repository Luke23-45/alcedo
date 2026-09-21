import styled from 'styled-components/native';
import { HomeGradient } from '@/components/presentation/home/shared/home-gradient';

/**
 * The planner's hero card. The edge stroke is the spec's violet-tinted
 * gradient (settings spec Screen 4: #A78BFA .55 → #2CE9F7 .22 → #FF5AC8 .10),
 * and a violet aura sits top-right of the body.
 */
export const CoachEdge = styled(HomeGradient).attrs({
  colors: ['rgba(167,139,250,0.55)', 'rgba(44,233,247,0.22)', 'rgba(255,90,200,0.10)'] as [string, string, string],
  start: { x: 0, y: 0 },
  end: { x: 0, y: 1 },
})`
  border-radius: 28px;
  padding: 1.2px;
  shadow-color: #000000;
  shadow-offset: 0px 10px;
  shadow-opacity: 0.5;
  shadow-radius: 14px;
  elevation: 8;
`;

export const CoachBody = styled(HomeGradient).attrs({ variant: 'cardBody' })`
  border-radius: 27px;
  padding: 20px;
  overflow: hidden;
  flex-direction: row;
  align-items: center;
`;

export const CoachIcon = styled(HomeGradient).attrs({
  // Spec-exact violet (#8E7BFF → #FF5AC8) for the planner mark.
  colors: ['#8E7BFF', '#FF5AC8'] as [string, string],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  width: 40px;
  height: 40px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  shadow-color: #8e7bff;
  shadow-offset: 0px 6px;
  shadow-opacity: 0.55;
  shadow-radius: 10px;
  elevation: 6;
`;

export const CoachText = styled.View`
  flex: 1;
  margin-left: 12px;
  gap: 2px;
`;

export const CoachTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.35px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const CoachCaption = styled.Text`
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => (theme.isDark ? '#86868B' : '#8E8E93')};
`;

export const BetaBadge = styled.View`
  padding-horizontal: 8px;
  padding-vertical: 4px;
  border-radius: 10px;
  border-width: 0.7px;
  ${({ theme }) =>
    theme.isDark
      ? `
          background-color: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.09);
        `
      : `
          background-color: rgba(0, 0, 0, 0.05);
          border-color: rgba(0, 0, 0, 0.08);
        `}
`;

export const BetaBadgeText = styled.Text`
  font-size: 8.5px;
  font-weight: 700;
  letter-spacing: 0.8px;
  color: ${({ theme }) => (theme.isDark ? '#98989F' : '#8E8E93')};
`;

export const CoachRight = styled.View`
  align-items: flex-end;
  gap: 6px;
  margin-left: 8px;
`;

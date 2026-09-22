import { LinearGradient } from 'expo-linear-gradient';
import styled from 'styled-components/native';
import { type } from '@/styles/theme';

/** Coach purple for the plan CTA, lit from above. */
export const COACH_PURPLE = ['#8E7BFF', '#BF5AF2'] as const;

export const PlanCardBody = styled.View`
  gap: ${({ theme }) => theme.space.sm}px;
`;

export const PlanEyebrow = styled.Text`
  ${({ theme }) => type(theme, 'caption1', { weight: '700' })}
  color: #bf5af2;
  text-transform: uppercase;
  letter-spacing: 1.2px;
`;

export const PlanTitle = styled.Text`
  ${({ theme }) => type(theme, 'title2', { weight: '700' })}
  color: ${({ theme }) => theme.color.content.primary};
`;

export const PlanDescription = styled.Text`
  ${({ theme }) => type(theme, 'subheadline')}
  color: ${({ theme }) => theme.color.content.secondary};
`;

/** Full-width purple gradient CTA on plan cards. */
export const UsePlanTouch = styled.Pressable`
  border-radius: 26px;
  overflow: hidden;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

export const UsePlanGradient = styled(LinearGradient)`
  min-height: 52px;
  align-items: center;
  justify-content: center;
  padding-horizontal: 20px;
  padding-vertical: 14px;
`;

export const UsePlanLabel = styled.Text`
  ${({ theme }) => type(theme, 'headline')}
  color: #ffffff;
  text-align: center;
`;

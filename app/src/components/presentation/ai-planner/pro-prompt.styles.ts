import { LinearGradient } from 'expo-linear-gradient';
import styled from 'styled-components/native';
import { type } from '@/styles/theme';

/** Coach purple for the upgrade CTA, lit from above. */
export const PRO_PURPLE = ['#8E7BFF', '#BF5AF2'] as const;

export const ProBody = styled.View`
  gap: ${({ theme }) => theme.space.sm}px;
`;

export const ProEyebrow = styled.Text`
  ${({ theme }) => type(theme, 'caption1', { weight: '700' })}
  color: #bf5af2;
  text-transform: uppercase;
  letter-spacing: 1.2px;
`;

export const ProTitle = styled.Text`
  ${({ theme }) => type(theme, 'title2', { weight: '700' })}
  color: ${({ theme }) => theme.color.content.primary};
`;

export const ProDescription = styled.Text`
  ${({ theme }) => type(theme, 'subheadline')}
  color: ${({ theme }) => theme.color.content.secondary};
`;

export const ProPriceText = styled.Text`
  ${({ theme }) => type(theme, 'headline')}
  color: ${({ theme }) => theme.color.content.primary};
  text-align: center;
`;

/** Full-width purple gradient CTA. */
export const UpgradeTouch = styled.Pressable`
  border-radius: 26px;
  overflow: hidden;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

export const UpgradeGradient = styled(LinearGradient)`
  min-height: 52px;
  align-items: center;
  justify-content: center;
  padding-horizontal: 20px;
  padding-vertical: 14px;
`;

export const UpgradeLabel = styled.Text`
  ${({ theme }) => type(theme, 'headline')}
  color: #ffffff;
  text-align: center;
`;

export const ProPriceWrap = styled.View`
  align-items: center;
  padding-vertical: ${({ theme }) => theme.space.xs}px;
`;

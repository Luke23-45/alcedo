import styled from 'styled-components/native';
import type { StyleProp, ViewStyle } from 'react-native';

export const Actions = styled.View`
  gap: 12px;
`;

export const ctaButton: StyleProp<ViewStyle> = {
  minHeight: 54,
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 27,
  overflow: 'hidden',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.22)',
  shadowColor: '#FF2D55',
  shadowOffset: { width: 0, height: 7 },
  shadowOpacity: 0.5,
  shadowRadius: 12,
  elevation: 8,
};

export const ctaGloss: StyleProp<ViewStyle> = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  height: 27,
  opacity: 0.35,
  borderTopLeftRadius: 27,
  borderTopRightRadius: 27,
};

export const CtaLabel = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 16px;
  line-height: 20px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.3px;
  text-align: center;
  color: #ffffff;
`;

export const secondaryHit: StyleProp<ViewStyle> = {
  minHeight: 48,
};

export const SecondaryButton = styled.View`
  min-height: 48px;
  padding-vertical: 12px;
  padding-horizontal: 20px;
  border-radius: 24px;
  border-width: 1px;
  border-color: ${({ theme }) =>
    theme.isDark ? 'rgba(255,255,255,0.10)' : 'rgba(60,60,67,0.14)'};
  background-color: ${({ theme }) =>
    theme.isDark ? 'rgba(255,255,255,0.07)' : 'rgba(120,120,128,0.08)'};
  align-items: center;
  justify-content: center;
`;

export const SecondaryLabel = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 14.5px;
  line-height: 18px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.25px;
  color: ${({ theme }) => (theme.isDark ? '#C7C7CC' : '#636366')};
`;

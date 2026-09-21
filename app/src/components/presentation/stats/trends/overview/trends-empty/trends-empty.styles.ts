import { Pressable } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import { HomeText } from '@/components/presentation/home/shared/home-text';

export const EmptyInner = styled.View`
  padding-top: 44px;
  padding-bottom: 36px;
  padding-horizontal: 32px;
  align-items: center;
`;

export const GlyphWrap = styled.View<{ $bg: string }>`
  width: 64px;
  height: 64px;
  border-radius: 20px;
  background-color: ${({ $bg }) => $bg};
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
`;

export const EmptyTitle = styled(HomeText)`
  font-size: 19px;
  line-height: 24px;
  text-align: center;
`;

export const EmptyBody = styled(HomeText)`
  font-size: 13.5px;
  line-height: 18px;
  text-align: center;
  margin-top: 8px;
`;

export const CtaHit = styled(Pressable)`
  margin-top: 22px;
  min-width: 220px;
`;

/** 52pt brand-gradient pill; the Pressable owns the hit target. */
export const ctaFill: StyleProp<ViewStyle> = {
  height: 52,
  borderRadius: 26,
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

export const CtaLabel = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 16px;
  line-height: 22px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.3px;
  color: #ffffff;
`;

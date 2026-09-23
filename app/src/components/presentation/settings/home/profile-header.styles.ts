import { LinearGradient } from 'expo-linear-gradient';
import styled from 'styled-components/native';
import { type as typeStyle } from '@/styles/theme';

// Profile header card: 361×80 rx24 (settings-dark.md Screen 1). Colors are
// supplied by the wrappers in profile-header.tsx.
export const HeaderEdgeBase = styled(LinearGradient)`
  border-radius: 24px;
  padding: 1px;
  margin-horizontal: 16px;
  margin-bottom: 28px;
`;

export const HeaderBodyBase = styled(LinearGradient)`
  border-radius: 23px;
  overflow: hidden;
`;

export const HeaderPressable = styled.Pressable`
  min-height: 80px;
  flex-direction: row;
  align-items: center;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 20px;
  padding-right: 14px;
`;

// Avatar: r24 gradient #5856D6→#BF5AF2 with a hairline white .18 ring
// (settings-dark.md Screen 1 `avA`).
export const AvatarBase = styled(LinearGradient)`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.18);
  align-items: center;
  justify-content: center;
`;

export const AvatarInitial = styled.Text`
  ${({ theme }) => typeStyle(theme, 'subheadline', { weight: '600' })}
  font-size: 19px;
  color: #ffffff;
`;

export const HeaderText = styled.View`
  flex: 1;
  margin-left: 14px;
  gap: 3px;
`;

export const HeaderName = styled.Text`
  ${({ theme }) => typeStyle(theme, 'subheadline', { weight: '600' })}
  font-size: 15px;
  letter-spacing: -0.3px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const HeaderSubtitle = styled.Text`
  ${({ theme }) => typeStyle(theme, 'caption1', { weight: '500' })}
  font-size: 11.5px;
  color: #86868b;
`;

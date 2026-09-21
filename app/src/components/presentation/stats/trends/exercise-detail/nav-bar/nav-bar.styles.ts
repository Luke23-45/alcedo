import styled from 'styled-components/native';
import type { StyleProp, ViewStyle } from 'react-native';

export const NavBar = styled.View`
  flex-direction: row;
  align-items: center;
  height: 44px;
`;

export const navHit: StyleProp<ViewStyle> = {
  width: 44,
  height: 44,
  alignItems: 'center',
  justifyContent: 'center',
};

export const NavTitleWrap = styled.View`
  flex: 1;
  align-items: center;
  padding-horizontal: 4px;
`;

export const NavTitle = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 15px;
  line-height: 20px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.3px;
  color: ${({ theme }) => theme.color.content.primary};
`;

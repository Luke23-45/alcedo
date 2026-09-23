import styled from 'styled-components/native';
import { type as typeHelper } from '@/styles/theme';
import { sessionPalette } from '../session-tokens';

export const NavRow = styled.View`
  flex-direction: row;
  align-items: center;
  height: 52px;
  padding-horizontal: 16px;
`;

export const BackButton = styled.Pressable`
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  margin-left: -10px;
  /* Reference drop shadow under the dismiss chevron: dy 2, blur 3, black 45%. */
  shadow-color: #000000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.45;
  shadow-radius: 3px;
`;

export const NavTitle = styled.Text`
  flex: 1;
  text-align: center;
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 15px;
  line-height: 20px;
  font-weight: 600;
  letter-spacing: -0.3px;
  color: ${({ theme }) => sessionPalette(theme.isDark).nav.title};
`;

export const MenuSlot = styled.View`
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  margin-right: -10px;
`;

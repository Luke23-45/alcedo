import styled from 'styled-components/native';
import { sessionPalette } from '../session-tokens';

export const DotsPressable = styled.Pressable`
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
`;

export const DotsSvgColor = (isDark: boolean) => sessionPalette(isDark).nav.dots;

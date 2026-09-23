import styled, { css } from 'styled-components/native';
import { alpha, fontWeight, type as typeHelper } from '@/styles/theme';
import { HomeGradient } from '@/components/presentation/home/shared/home-gradient';

/* ------------------------------------------------------------------ *
 * Session notes (Edit Session spec): 361×118 rx28; focused brand edge
 * #FF6A3D @ .5 1.2pt; counter bottom-right 8.5px "0 / 500".
 * ------------------------------------------------------------------ */

export const NotesLabel = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 9px;
  font-weight: ${fontWeight.bold};
  letter-spacing: 1.3px;
  color: #86868b;
  padding-horizontal: 8px;
  margin-bottom: 12px;
`;

export const NotesOuter = styled(HomeGradient).attrs<{ $focused: boolean }>((props) => ({
  variant: 'cardEdge' as const,
  colors: props.$focused ? ([alpha('#FF6A3D', 0.5), alpha('#FF6A3D', 0.5), alpha('#FF6A3D', 0.5)] as const) : undefined,
}))<{ $focused: boolean }>`
  border-radius: 28px;
  padding: ${({ $focused }) => ($focused ? '1.2px' : '1px')};
  ${({ theme }) =>
    theme.isDark
      ? css`
          shadow-color: #000000;
          shadow-offset: 0px 10px;
          shadow-opacity: 0.42;
          shadow-radius: 14px;
          elevation: 5;
        `
      : css`
          shadow-color: #14142b;
          shadow-offset: 0px 10px;
          shadow-opacity: 0.07;
          shadow-radius: 14px;
          elevation: 3;
        `}
`;

export const NotesBody = styled(HomeGradient).attrs({ variant: 'cardBody' })`
  border-radius: 27px;
  height: 116px;
  padding-horizontal: 18px;
  padding-top: 16px;
  padding-bottom: 30px;
`;

export const NotesInput = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: theme.isDark ? '#3F3F46' : '#A7A7AB',
}))`
  flex: 1;
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 13px;
  font-weight: ${fontWeight.medium};
  letter-spacing: -0.2px;
  color: ${({ theme }) => (theme.isDark ? '#D4D4D8' : '#3A3A3C')};
  text-align-vertical: top;
`;

export const NotesCounter = styled.Text`
  position: absolute;
  right: 20px;
  bottom: 14px;
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 9px;
  font-weight: ${fontWeight.medium};
  letter-spacing: 0.2px;
  color: #6c6c70;
`;

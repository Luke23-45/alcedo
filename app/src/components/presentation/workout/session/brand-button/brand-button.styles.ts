import styled from 'styled-components/native';
import { type as typeHelper } from '@/styles/theme';
import { sessionPalette } from '../session-tokens';

export const BrandPressable = styled.Pressable<{ $width?: number; $height: number; $radius: number }>`
  ${({ $width }) => ($width ? `min-width: ${$width}px;` : 'width: 100%;')}
  min-height: ${({ $height }) => $height}px;
  border-radius: ${({ $radius }) => $radius}px;
`;

export const BrandLabel = styled.Text<{ $fontSize: number; $fontWeight?: number; $letterSpacing?: number }>`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: ${({ $fontSize }) => $fontSize}px;
  line-height: ${({ $fontSize }) => Math.round($fontSize * 1.375)}px;
  font-weight: ${({ $fontWeight }) => $fontWeight ?? 600};
  letter-spacing: ${({ $letterSpacing }) => $letterSpacing ?? -0.2}px;
  color: ${({ theme }) => sessionPalette(theme.isDark).brand.label};
`;

export const BrandContent = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

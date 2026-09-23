import styled from 'styled-components/native';
import { type as typeHelper } from '@/styles/theme';

export const FooterRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 31px;
  padding-right: 16px;
  min-height: 50px;
`;

export const PreviousPressable = styled.Pressable`
  min-height: 44px;
  justify-content: center;
  padding-right: 12px;
`;

export const PreviousLabel = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.3px;
  color: ${({ $color }) => $color};
`;

export const CtaWrap = styled.View`
  width: 177px;
`;

import styled, { css } from 'styled-components/native';
import { type as typeHelper } from '@/styles/theme';

const rowLayout = css`
  flex-direction: row;
  align-items: center;
  padding-left: 16px;
  padding-right: 20px;
  padding-top: 12px;
  padding-bottom: 12px;
`;

export const RowView = styled.View`
  ${rowLayout}
`;

export const RowPressable = styled.Pressable`
  ${rowLayout}
`;

export const Tile = styled.View<{ $fill: string }>`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background-color: ${({ $fill }) => $fill};
  align-items: center;
  justify-content: center;
`;

export const RowText = styled.View`
  flex: 1;
  margin-left: 12px;
  justify-content: center;
`;

export const RowLabel = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 13.5px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const RowSupporting = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 10.5px;
  font-weight: 500;
  margin-top: 2px;
  color: ${({ $color }) => $color};
`;

export const RowDivider = styled.View<{ $color: string }>`
  height: 1px;
  margin-left: 62px;
  margin-right: 20px;
  background-color: ${({ $color }) => $color};
`;

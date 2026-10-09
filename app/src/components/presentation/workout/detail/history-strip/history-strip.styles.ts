import styled from 'styled-components/native';
import { type } from '@/styles/theme';

export const Container = styled.Pressable`
  width: 100%;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space.xs}px;
`;

export const Title = styled.Text`
  ${({ theme }) => type(theme, 'caption2')};
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.content.tertiary};
`;

export const ChevronHint = styled.Text`
  ${({ theme }) => type(theme, 'caption1')};
  color: ${({ theme }) => theme.color.content.tertiary};
`;

export const ChartBox = styled.View`
  height: 72px;
  width: 100%;
  justify-content: center;
`;

export const EmptyBox = styled.View`
  height: 72px;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export const EmptyText = styled.Text`
  ${({ theme }) => type(theme, 'footnote')};
  color: ${({ theme }) => theme.color.content.tertiary};
`;

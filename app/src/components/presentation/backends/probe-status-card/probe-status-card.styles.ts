import styled from 'styled-components/native';
import { type } from '@/styles/theme';

export const Wrap = styled.View`
  margin-top: 24px;
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
`;

export const IconSlot = styled.View`
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
`;

export const TextSlot = styled.View`
  flex: 1;
`;

export const Title = styled.Text`
  ${({ theme }) => type(theme, 'headline')}
  color: ${({ theme }) => theme.color.content.primary};
`;

export const Body = styled.Text`
  ${({ theme }) => type(theme, 'footnote')}
  color: ${({ theme }) => theme.color.content.secondary};
  margin-top: 2px;
`;

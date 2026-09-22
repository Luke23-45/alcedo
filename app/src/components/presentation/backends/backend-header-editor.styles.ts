import styled from 'styled-components/native';
import { type } from '@/styles/theme';

export const SectionCaption = styled.Text`
  ${({ theme }) => type(theme, 'caption1', { weight: '600' })}
  color: ${({ theme }) => theme.color.content.secondary};
  text-transform: uppercase;
  margin: 24px 0px 6px 16px;
`;

export const Row = styled.Pressable`
  flex-direction: row;
  align-items: center;
  padding: 10px 8px 10px 16px;
  min-height: 60px;
`;

export const IconSlot = styled.View`
  width: 30px;
  align-items: center;
  margin-right: 10px;
`;

export const TextSlot = styled.View`
  flex: 1;
`;

export const RowTitle = styled.Text`
  ${({ theme }) => type(theme, 'body')}
  color: ${({ theme }) => theme.color.content.primary};
`;

export const RowSubtitle = styled.Text`
  ${({ theme }) => type(theme, 'footnote')}
  color: ${({ theme }) => theme.color.content.secondary};
  margin-top: 1px;
`;

export const AddRowTitle = styled.Text`
  ${({ theme }) => type(theme, 'body')}
  color: ${({ theme }) => theme.color.interactive.tint};
`;

export const DeleteButton = styled.Pressable`
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
`;

export const Hairline = styled.View`
  height: ${({ theme }) => theme.size.hairline}px;
  background-color: ${({ theme }) => theme.color.border.hairline};
  margin-left: 56px;
`;

export const Explanation = styled.Text`
  ${({ theme }) => type(theme, 'footnote')}
  color: ${({ theme }) => theme.color.content.secondary};
  margin-top: 8px;
  padding-horizontal: 16px;
`;

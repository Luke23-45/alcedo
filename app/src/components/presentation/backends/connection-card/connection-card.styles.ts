import styled from 'styled-components/native';
import { type } from '@/styles/theme';

export const FieldRow = styled.View`
  padding: 14px 16px 14px;
`;

export const FieldLabel = styled.Text`
  ${({ theme }) => type(theme, 'footnote', { weight: '600' })}
  color: ${({ theme }) => theme.color.content.secondary};
  margin-bottom: 2px;
`;

export const FieldInput = styled.TextInput`
  ${({ theme }) => type(theme, 'body')}
  color: ${({ theme }) => theme.color.content.primary};
  padding: 0px;
  margin: 0px;
`;

export const FieldError = styled.Text`
  ${({ theme }) => type(theme, 'caption1')}
  color: ${({ theme }) => theme.color.status.danger.content};
  margin-top: 6px;
`;

/** The 1.5pt red rounded outline around a field row that failed validation. */
export const ErrorOutline = styled.View`
  position: absolute;
  left: 8px;
  right: 8px;
  top: 8px;
  bottom: 8px;
  border-radius: 12px;
  border-width: 1.5px;
  border-color: ${({ theme }) => theme.color.status.danger.base};
`;

export const Hairline = styled.View`
  height: ${({ theme }) => theme.size.hairline}px;
  background-color: ${({ theme }) => theme.color.border.hairline};
  margin-left: 16px;
`;

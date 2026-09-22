import styled from 'styled-components/native';
import { alpha, type } from '@/styles/theme';

export const Backdrop = styled.Pressable`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: flex-end;
`;

export const Sheet = styled.View`
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  overflow: hidden;
  max-height: 92%;
  background-color: ${({ theme }) => theme.color.background.elevated};
`;

export const Grabber = styled.View`
  width: 36px;
  height: 5px;
  border-radius: 2.5px;
  background-color: ${({ theme }) => theme.color.content.tertiary};
  align-self: center;
  margin-top: 8px;
  margin-bottom: 4px;
`;

export const NavBar = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 8px 8px 4px;
`;

export const NavButton = styled.Pressable`
  min-width: 64px;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  padding-horizontal: 12px;
`;

export const NavButtonLabel = styled.Text<{ $primary?: boolean }>`
  ${({ theme }) => type(theme, 'body', { weight: '400' })}
  color: ${({ theme }) => theme.color.interactive.tint};
  font-weight: ${({ $primary }) => ($primary ? '600' : '400')};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
`;

export const NavTitle = styled.Text`
  ${({ theme }) => type(theme, 'headline')}
  color: ${({ theme }) => theme.color.content.primary};
  text-align: center;
`;

export const Content = styled.View`
  padding: 8px 16px 16px;
`;

export const SectionCaption = styled.Text`
  ${({ theme }) => type(theme, 'caption1', { weight: '600' })}
  color: ${({ theme }) => theme.color.content.secondary};
  text-transform: uppercase;
  margin: 16px 0px 6px 16px;
`;

export const FieldRow = styled.View`
  padding: 12px 16px;
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
  flex: 1;
`;

export const InputRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Hairline = styled.View`
  height: ${({ theme }) => theme.size.hairline}px;
  background-color: ${({ theme }) => theme.color.border.hairline};
  margin-left: 16px;
`;

export const RevealButton = styled.Pressable`
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  margin: -12px -8px -12px 0px;
`;

export const SuggestionRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

export const SuggestionPill = styled.Pressable<{ $selected: boolean }>`
  border-radius: 999px;
  padding: 8px 14px;
  background-color: ${({ theme, $selected }) =>
    $selected ? alpha(theme.color.interactive.tint, 0.14) : theme.color.fill.secondary};
`;

export const SuggestionLabel = styled.Text<{ $selected: boolean }>`
  ${({ theme }) => type(theme, 'subheadline')}
  color: ${({ theme, $selected }) => ($selected ? theme.color.interactive.tint : theme.color.content.primary)};
`;

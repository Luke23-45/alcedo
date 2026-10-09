import styled from 'styled-components/native';
import { type } from '@/styles/theme';
import { detailPalette } from '../detail-tokens';

export const Container = styled.View`
  width: 100%;
  gap: ${({ theme }) => theme.space.md}px;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const CardTitle = styled.Text`
  ${({ theme }) => type(theme, 'caption2')};
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.content.tertiary};
`;

export const ChipRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.sm}px;
  align-items: center;
`;

export const VerdictPill = styled.View`
  padding-horizontal: ${({ theme }) => theme.space.md}px;
  padding-vertical: ${({ theme }) => theme.space.xs}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => detailPalette(theme.isDark).detail.progression.chipBg};
  border-width: 1px;
  border-color: ${({ theme }) => detailPalette(theme.isDark).detail.progression.chipBorder};
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs}px;
`;

export const VerdictLabel = styled.Text`
  ${({ theme }) => type(theme, 'subheadline')};
  font-weight: 700;
  color: ${({ theme }) => detailPalette(theme.isDark).detail.progression.chipText};
`;

export const VerdictDetail = styled.Text`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.color.content.tertiary};
  text-transform: uppercase;
`;

export const SettingLine = styled.Pressable`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  min-height: 44px;
  padding-vertical: ${({ theme }) => theme.space.xs}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.color.border.hairline};
`;

export const SettingLabel = styled.Text`
  ${({ theme }) => type(theme, 'subheadline')};
  color: ${({ theme }) => theme.color.content.secondary};
`;

export const SettingValue = styled.Text`
  ${({ theme }) => type(theme, 'subheadline')};
  font-weight: 600;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const SupersetBadge = styled.View`
  padding-horizontal: ${({ theme }) => theme.space.sm}px;
  padding-vertical: ${({ theme }) => theme.space.xxs}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => theme.color.fill.quaternary};
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

export const SupersetText = styled.Text`
  ${({ theme }) => type(theme, 'caption1')};
  color: ${({ theme }) => theme.color.content.secondary};
`;

export const RulesBlock = styled.View`
  padding-vertical: ${({ theme }) => theme.space.xs}px;
  gap: ${({ theme }) => theme.space.xs}px;
`;

export const RuleLine = styled.Text`
  ${({ theme }) => type(theme, 'footnote')};
  color: ${({ theme }) => theme.color.content.secondary};
`;

export const NotesInput = styled.TextInput`
  min-height: 56px;
  padding: ${({ theme }) => theme.space.sm}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => theme.color.fill.quaternary};
  color: ${({ theme }) => theme.color.content.primary};
  ${({ theme }) => type(theme, 'footnote')};
`;

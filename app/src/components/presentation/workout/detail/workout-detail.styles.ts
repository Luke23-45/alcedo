import styled from 'styled-components/native';
import { type } from '@/styles/theme';

export const ScreenWrapper = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.color.background.base};
`;

export const ScrollContent = styled.View<{ $bottomInset: number }>`
  padding-horizontal: ${({ theme }) => theme.layout.screenPadding}px;
  padding-top: ${({ theme }) => theme.space.sm}px;
  padding-bottom: ${({ $bottomInset }) => $bottomInset + 160}px;
  gap: ${({ theme }) => theme.space.base}px;
`;

export const SectionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: ${({ theme }) => theme.space.xs}px;
`;

export const SectionTitle = styled.Text`
  ${({ theme }) => type(theme, 'caption2')};
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.content.tertiary};
`;

export const SetsContainer = styled.View`
  gap: ${({ theme }) => theme.space.xs}px;
`;

export const AddSetButton = styled.Pressable`
  min-height: 48px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  border-width: 1px;
  border-style: dashed;
  border-color: ${({ theme }) => theme.color.border.hairline};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space.sm}px;
`;

export const AddSetText = styled.Text`
  ${({ theme }) => type(theme, 'subheadline')};
  font-weight: 600;
  color: ${({ theme }) => theme.color.interactive.tint};
`;

export const DockedTimerContainer = styled.View<{ $bottomOffset: number }>`
  position: absolute;
  left: ${({ theme }) => theme.layout.screenPadding}px;
  right: ${({ theme }) => theme.layout.screenPadding}px;
  bottom: ${({ $bottomOffset }) => $bottomOffset}px;
`;

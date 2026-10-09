import styled from 'styled-components/native';
import { type } from '@/styles/theme';

export const ActionBarWrapper = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`;

export const BarBody = styled.View<{ $bottomInset: number }>`
  padding-horizontal: ${({ theme }) => theme.layout.screenPadding}px;
  padding-top: ${({ theme }) => theme.space.md}px;
  padding-bottom: ${({ $bottomInset }) => Math.max($bottomInset, 16)}px;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.space.md}px;
`;

export const PrimarySlot = styled.View`
  flex: 1;
`;

export const SecondaryPressable = styled.Pressable<{ $disabled?: boolean }>`
  min-height: 44px;
  min-width: 44px;
  padding-horizontal: ${({ theme }) => theme.space.sm}px;
  align-items: center;
  justify-content: center;
  opacity: ${({ $disabled }) => ($disabled ? 0.35 : 1)};
`;

export const SecondaryText = styled.Text`
  ${({ theme }) => type(theme, 'callout')};
  font-weight: 600;
  color: ${({ theme }) => theme.color.content.secondary};
`;

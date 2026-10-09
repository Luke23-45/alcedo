import styled from 'styled-components/native';
import { type as typeHelper } from '@/styles/theme';

export const ListContainer = styled.View`
  flex: 1;
`;

export const StickyHeaderWrap = styled.View<{ $topInset: number }>`
  padding-top: ${({ $topInset }) => $topInset}px;
  background-color: transparent;
`;

export const BodySection = styled.View`
  margin-top: 12px;
  gap: 12px;
`;

export const ExerciseList = styled.View`
  gap: 12px;
  margin-horizontal: ${({ theme }) => theme.layout.screenPadding}px;
`;

export const ProgressLineWrap = styled.View`
  align-items: center;
  justify-content: center;
  padding-vertical: 8px;
  margin-top: 4px;
`;

export const ProgressLineText = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'caption1').fontFamily};
  font-size: 13px;
  line-height: 18px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.color.content.secondary};
`;

export const AddExerciseButton = styled.Pressable`
  margin-horizontal: ${({ theme }) => theme.layout.screenPadding}px;
  margin-top: 12px;
  min-height: 48px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  border-width: 1px;
  border-style: dashed;
  border-color: ${({ theme }) => theme.color.border.hairline};
`;

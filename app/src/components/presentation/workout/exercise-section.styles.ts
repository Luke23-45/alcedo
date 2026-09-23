import styled from 'styled-components/native';
import { StyleSheet } from 'react-native';
import { type as typeHelper } from '@/styles/theme';
import { sessionPalette } from './session/session-tokens';

export const CardTop = styled.View`
  padding-top: 13px;
  padding-horizontal: 14px;
`;

export const CardHeader = styled.View`
  min-height: 22px;
  flex-direction: row;
  align-items: center;
`;

export const IndexTile = styled.View`
  width: 22px;
  height: 22px;
  border-radius: 7px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => sessionPalette(theme.isDark).card.indexTile};
  margin-right: 10px;
`;

export const IndexNumber = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 10px;
  line-height: 14px;
  font-weight: 700;
  font-variant: tabular-nums;
  color: ${({ theme }) => sessionPalette(theme.isDark).card.indexNumber};
`;

export const ExerciseName = styled.Text<{ $done: boolean }>`
  flex: 1;
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 14.5px;
  line-height: 20px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: ${({ theme, $done }) => ($done ? sessionPalette(theme.isDark).card.nameDone : sessionPalette(theme.isDark).card.name)};
  margin-right: 8px;
`;

export const ChipPill = styled.View<{ $done: boolean }>`
  height: 20px;
  min-width: ${({ $done }) => ($done ? 93 : 79)}px;
  padding-horizontal: 8px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, $done }) => {
    const c = sessionPalette(theme.isDark).card;
    return $done ? c.chipDoneBg : c.chipProgressBg;
  }};
`;

export const ChipText = styled.Text<{ $done: boolean }>`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 9.5px;
  line-height: 13px;
  font-weight: 700;
  letter-spacing: 0.3px;
  color: ${({ theme, $done }) => {
    const c = sessionPalette(theme.isDark).card;
    return $done ? c.chipDoneText : c.chipProgressText;
  }};
`;

export const DividerLine = styled.View`
  height: ${StyleSheet.hairlineWidth}px;
  margin-top: 11px;
  margin-horizontal: 14px;
  background-color: ${({ theme }) => sessionPalette(theme.isDark).card.divider};
`;

export const CardBody = styled.View`
  padding-horizontal: 14px;
  padding-top: 6px;
`;

export const AddSetRow = styled.Pressable`
  min-height: 26px;
  flex-direction: row;
  align-items: center;
  padding-left: 20px;
  padding-right: 6px;
  margin-top: 8px;
`;

export const AddSetLabel = styled.Text`
  flex: 1;
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 11.5px;
  line-height: 15px;
  font-weight: 600;
  color: ${({ theme }) => sessionPalette(theme.isDark).card.addLabel};
  margin-left: 9px;
`;

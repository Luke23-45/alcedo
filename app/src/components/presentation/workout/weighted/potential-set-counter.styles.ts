import styled from 'styled-components/native';
import { sessionPalette } from '../session/session-tokens';

export type SetRowState = 'done' | 'current' | 'upcoming';

function tileBg(theme: { isDark: boolean }, state: SetRowState): string {
  const c = sessionPalette(theme.isDark).card;
  return state === 'done' ? c.setTileDoneBg : state === 'current' ? c.setTileCurrentBg : c.setTileUpcomingBg;
}

function tileText(theme: { isDark: boolean }, state: SetRowState): string {
  const c = sessionPalette(theme.isDark).card;
  return state === 'done' ? c.setTileDoneText : state === 'current' ? c.setTileCurrentText : c.setTileUpcomingText;
}

export const SetRow = styled.View`
  height: 32px;
  flex-direction: row;
  align-items: flex-start;
`;

export const NumberTile = styled.View<{ $state: SetRowState }>`
  width: 22px;
  height: 22px;
  border-radius: 7px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, $state }) => tileBg(theme, $state)};
`;

export const NumberText = styled.Text<{ $state: SetRowState }>`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 10px;
  line-height: 14px;
  font-weight: 700;
  font-variant: tabular-nums;
  color: ${({ theme, $state }) => tileText(theme, $state)};
`;

export const WeightPressable = styled.Pressable`
  margin-left: 10px;
  margin-top: 2px;
  width: 78px;
  justify-content: center;
`;

export const WeightText = styled.Text<{ $state: SetRowState; $tracking?: number }>`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 14px;
  line-height: 18px;
  font-weight: ${({ $state }) => ($state === 'current' ? 700 : 600)};
  letter-spacing: ${({ $tracking }) => $tracking ?? -0.2}px;
  font-variant: tabular-nums;
  color: ${({ theme, $state }) => {
    const c = sessionPalette(theme.isDark).card;
    return $state === 'done' ? c.weightDone : $state === 'current' ? c.weightCurrent : c.weightUpcoming;
  }};
`;

export const RepsPressable = styled.Pressable`
  margin-top: 2px;
  width: 65px;
  justify-content: center;
`;

export const PrevText = styled.Text<{ $state: SetRowState }>`
  flex: 1;
  font-family: ${({ theme }) => theme.font.text};
  font-size: 10.5px;
  line-height: 14px;
  font-weight: 500;
  margin-top: 5px;
  margin-right: 4px;
  color: ${({ theme, $state }) =>
    $state === 'current' ? sessionPalette(theme.isDark).card.target : sessionPalette(theme.isDark).card.prev};
`;

export const CheckPressable = styled.Pressable`
  width: 22px;
  height: 22px;
  align-items: center;
  justify-content: center;
`;

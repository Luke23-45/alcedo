import styled from 'styled-components/native';

/**
 * Workout reminder editor (settings-dark.md Screen 3): 7 day chips
 * (28×22 r11) + the time pill (77×22 r11) in 44pt-tall press cells.
 */

export const Block = styled.View`
  padding-top: 8px;
  padding-bottom: 8px;
`;

export const ReminderArea = styled.View<{ $dimmed: boolean }>`
  padding-left: 20px;
  padding-right: 16px;
  margin-top: 4px;
  flex-direction: row;
  align-items: center;
  opacity: ${({ $dimmed }) => ($dimmed ? 0.45 : 1)};
`;

export const DayCells = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

export const DayCell = styled.Pressable`
  width: 34px;
  height: 44px;
  align-items: center;
  justify-content: center;
`;

// Active chip: #FF6A3D .16 fill, #FF6A3D .3 stroke. Inactive: white .06 / .08.
export const DayChip = styled.View<{ $active: boolean }>`
  width: 28px;
  height: 22px;
  border-radius: 11px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $active }) => ($active ? 'rgba(255,106,61,0.16)' : 'rgba(255,255,255,0.06)')};
  border-width: 0.8px;
  border-color: ${({ $active }) => ($active ? 'rgba(255,106,61,0.3)' : 'rgba(255,255,255,0.08)')};
`;

export const DayLetter = styled.Text<{ $active: boolean }>`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 10px;
  font-weight: ${({ theme }) => theme.weight.bold};
  color: ${({ $active }) => ($active ? '#FFB84D' : '#6C6C70')};
`;

export const TimeCell = styled.Pressable`
  height: 44px;
  align-items: center;
  justify-content: center;
`;

// 77×22 r11, white .08 fill, white .10 stroke, 10.5/600 white.
export const TimePill = styled.View`
  width: 77px;
  height: 22px;
  border-radius: 11px;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.08);
  border-width: 0.8px;
  border-color: rgba(255, 255, 255, 0.1);
`;

export const TimeText = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 10.5px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  color: #ffffff;
  font-variant: tabular-nums;
`;

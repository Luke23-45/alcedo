import styled from 'styled-components/native';
import { alpha, type as typeStyle } from '@/styles/theme';

/**
 * Workout reminder editor (settings-dark.md Screen 3): 7 day chips
 * (28×22 r11) + the time pill (77×22 r11) in 44pt-tall press cells.
 *
 * Spec colors (#FF6A3D active fill/stroke, #FFB84D active letter) are kept
 * for dark mode; inactive surfaces and all text derive from theme tokens
 * so the chips stay visible in light mode too.
 */

export const Block = styled.View`
  padding-top: 8px;
  padding-bottom: 8px;
`;

// NC01: chips (238) + pill (77) + padding (36) = 351 > 286 inner on 320.
// The area wraps: 393 keeps one spec-exact row (315 ≤ 323); 320 drops the
// pill to a second right-aligned line instead of clipping.
export const ReminderArea = styled.View<{ $dimmed: boolean }>`
  padding-left: 20px;
  padding-right: 16px;
  margin-top: 4px;
  flex-direction: row;
  flex-wrap: wrap;
  row-gap: 8px;
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

// Active chip: #FF6A3D .16 fill, #FF6A3D .3 stroke. Inactive: theme control
// fill + hairline, so the chips read in both modes.
export const DayChip = styled.View<{ $active: boolean }>`
  width: 28px;
  height: 22px;
  border-radius: 11px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, $active }) => ($active ? alpha('#FF6A3D', 0.16) : theme.color.fill.quaternary)};
  border-width: 0.8px;
  border-color: ${({ theme, $active }) => ($active ? alpha('#FF6A3D', 0.3) : theme.color.border.hairline)};
`;

export const DayLetter = styled.Text<{ $active: boolean }>`
  ${({ theme }) => typeStyle(theme, 'caption2', { weight: '700' })}
  font-size: 10px;
  color: ${({ theme, $active }) => ($active ? (theme.isDark ? '#FFB84D' : '#B26A00') : theme.color.content.tertiary)};
`;

export const TimeCell = styled.Pressable`
  height: 44px;
  align-items: center;
  justify-content: center;
  margin-left: auto;
`;

// 77×22 r11; theme control fill + hairline so the pill reads in both modes.
export const TimePill = styled.View`
  width: 77px;
  height: 22px;
  border-radius: 11px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.color.fill.quaternary};
  border-width: 0.8px;
  border-color: ${({ theme }) => theme.color.border.hairline};
`;

export const TimeText = styled.Text`
  ${({ theme }) => typeStyle(theme, 'caption2', { weight: '600' })}
  font-size: 10.5px;
  color: ${({ theme }) => theme.color.content.primary};
`;

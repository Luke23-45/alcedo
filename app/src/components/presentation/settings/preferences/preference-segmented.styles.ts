import styled, { css } from 'styled-components/native';
import { type as typeStyle } from '@/styles/theme';

/**
 * Segmented control (settings-dark.md Screens 2–3): quiet track with a
 * sliding thumb. `large` is the 44pt theme switch; `small` the 30pt unit
 * switch. The thumb glides on the standard curve and snaps when reduced
 * motion is on.
 */

export const Track = styled.View<{ $height: number }>`
  height: ${({ $height }) => $height}px;
  border-radius: ${({ $height }) => $height / 2}px;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)')};
  flex-direction: row;
  position: relative;
`;

export const Thumb = styled.View<{ $height: number }>`
  position: absolute;
  top: 2px;
  bottom: 2px;
  border-radius: ${({ $height }) => $height / 2 - 2}px;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255,255,255,0.13)' : '#FFFFFF')};
  ${({ theme }) =>
    theme.isDark
      ? css`
          border-width: 0.8px;
          border-color: rgba(255, 255, 255, 0.12);
        `
      : css`
          shadow-color: #000;
          shadow-offset: 0px 2px;
          shadow-opacity: 0.18;
          shadow-radius: 4px;
          elevation: 2;
        `}
`;

export const OptionPressable = styled.Pressable`
  flex: 1;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

export const OptionLabel = styled.Text<{ $selected: boolean; $large: boolean }>`
  ${({ theme }) => typeStyle(theme, 'caption1', { weight: '600' })}
  ${({ $large }) =>
    $large
      ? css`
          font-size: 12.5px;
        `
      : ''}
  color: ${({ theme, $selected }) =>
    $selected ? (theme.isDark ? '#FFFFFF' : '#1C1C1E') : theme.isDark ? '#98989F' : '#8E8E93'};
`;

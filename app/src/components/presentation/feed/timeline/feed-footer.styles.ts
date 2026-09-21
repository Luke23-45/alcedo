import styled from 'styled-components/native';
import { INK_CHIP_LABEL, INK_FAINT, LOAD_FILL, LOAD_STROKE } from './timeline-tokens';

export const Footer = styled.View`
  align-items: center;
  padding-top: 22px;
  padding-bottom: 40px;
`;

export const ShowingRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
`;

export const ShowingText = styled.Text<{ $dark: boolean }>`
  font-size: 11px;
  font-weight: 500;
  color: ${({ $dark }) => ($dark ? INK_FAINT.dark : INK_FAINT.light)};
`;

export const BadgeWrap = styled.View`
  margin-left: 8px;
`;

/** 152×42 pill — dispatches a real feed refresh, never a visual no-op. */
export const LoadButton = styled.Pressable<{ $dark: boolean }>`
  width: 152px;
  height: 42px;
  border-radius: 21px;
  border-width: 1px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $dark }) => ($dark ? LOAD_FILL.dark : LOAD_FILL.light)};
  border-color: ${({ $dark }) => ($dark ? LOAD_STROKE.dark : LOAD_STROKE.light)};
`;

export const LoadLabel = styled.Text<{ $dark: boolean }>`
  font-size: 13.5px;
  font-weight: 600;
  letter-spacing: -0.25px;
  color: ${({ $dark }) => ($dark ? INK_CHIP_LABEL.dark : INK_CHIP_LABEL.light)};
`;

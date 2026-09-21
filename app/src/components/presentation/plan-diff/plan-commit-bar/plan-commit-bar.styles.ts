import styled, { css } from 'styled-components/native';

/** Floating glass bar: hairline top edge, translucent material, 16px content padding. */
export const BarSurface = styled.View<{ $dark: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-top-width: 1px;
  border-top-color: ${({ $dark }) => ($dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)')};
  background-color: ${({ $dark }) => ($dark ? 'rgba(28,28,30,0.72)' : 'rgba(249,249,249,0.72)')};
`;

/** 110×54 ghost discard. */
export const DiscardButton = styled.Pressable<{ $dark: boolean }>`
  width: 110px;
  height: 54px;
  border-radius: 27px;
  border-curve: continuous;
  align-items: center;
  justify-content: center;
  background-color: ${({ $dark }) => ($dark ? 'rgba(255,255,255,0.10)' : 'rgba(120,120,128,0.12)')};
`;

export const DiscardLabel = styled.Text<{ $dark: boolean }>`
  font-size: 15px;
  line-height: 20px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: ${({ $dark }) => ($dark ? '#FFFFFF' : '#111111')};
`;

/** 54pt save: flex-fills beside discard, brand gradient, deep shadow. */
export const SaveButton = styled.Pressable<{ $dark: boolean; $disabled: boolean }>`
  flex: 1;
  height: 54px;
  border-radius: 27px;
  border-curve: continuous;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  ${({ $dark, $disabled }) =>
    $disabled
      ? css`
          background-color: ${$dark ? '#3A3A3C' : '#E5E5EA'};
        `
      : css`
          shadow-color: #000000;
          shadow-offset: 0px 4px;
          shadow-opacity: 0.3;
          shadow-radius: 10px;
          elevation: 6;
        `}
`;

export const SaveGradientFill = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const SaveContent = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

export const SaveLabel = styled.Text<{ $disabled: boolean }>`
  font-size: 15px;
  line-height: 20px;
  font-weight: 700;
  letter-spacing: -0.2px;
  color: ${({ $disabled }) => ($disabled ? '#8E8E93' : '#FFFFFF')};
`;

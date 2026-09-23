import styled, { css } from 'styled-components/native';
import { StyleSheet } from 'react-native';
import { HomeGradient } from '../../home/shared/home-gradient';

/** Floating bar: hairline top edge, near-opaque material per spec `tb`, 16px content padding. */
export const BarSurface = styled.View<{ $dark: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-top-width: ${StyleSheet.hairlineWidth}px;
  border-top-color: ${({ $dark }) => ($dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)')};
  background-color: ${({ $dark }) => ($dark ? 'rgba(21,21,26,0.94)' : 'rgba(251,251,253,0.93)')};
`;

/** 110×54 destructive ghost discard: red wash + hairline, red label. */
export const DiscardButton = styled.Pressable<{ $dark: boolean }>`
  width: 110px;
  height: 54px;
  border-radius: 27px;
  border-curve: continuous;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 59, 48, 0.1);
  border-width: 1px;
  border-color: rgba(255, 59, 48, 0.22);
`;

export const DiscardLabel = styled.Text<{ $dark: boolean }>`
  font-size: 15px;
  line-height: 20px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: ${({ $dark }) => ($dark ? '#FF6B60' : '#D70015')};
`;

/** 54pt save: flex-fills beside discard, diagonal brand gradient, gloss, white edge, brand shadow. */
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
          shadow-color: #ff2d55;
          shadow-offset: 0px 7px;
          shadow-opacity: ${$dark ? 0.5 : 0.35};
          shadow-radius: 12px;
          elevation: 8;
        `}
`;

export const SaveGradientFill = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const SaveGloss = styled(HomeGradient).attrs({ variant: 'gloss' as const })`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 27px;
  opacity: 0.35;
`;

export const SaveEdge = styled.View`
  position: absolute;
  top: 0.5px;
  left: 0.5px;
  right: 0.5px;
  bottom: 0.5px;
  border-radius: 26.5px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.22);
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
  letter-spacing: -0.25px;
  color: ${({ $disabled }) => ($disabled ? '#8E8E93' : '#FFFFFF')};
`;

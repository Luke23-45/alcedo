import styled, { css } from 'styled-components/native';

/** 361×44 segmented track, radius 22. The selected thumb sits inset 3pt. */
export const SegmentTrack = styled.View<{ $dark: boolean }>`
  height: 44px;
  border-radius: 22px;
  border-curve: continuous;
  flex-direction: row;
  background-color: ${({ $dark }) => ($dark ? 'rgba(255,255,255,0.06)' : 'rgba(120,120,128,0.12)')};
`;

export const SegmentButton = styled.Pressable`
  flex: 1;
  min-height: 44px;
  align-items: center;
  justify-content: center;
`;

export const SegmentThumb = styled.View<{ $selected: boolean; $dark: boolean }>`
  position: absolute;
  top: 3px;
  left: 3px;
  right: 3px;
  bottom: 3px;
  border-radius: 19px;
  border-curve: continuous;
  ${({ $selected, $dark }) =>
    !$selected
      ? css`
          background-color: transparent;
        `
      : $dark
        ? css`
            background-color: rgba(255, 255, 255, 0.13);
            border-width: 1px;
            border-color: rgba(255, 255, 255, 0.12);
          `
        : css`
            background-color: #ffffff;
            border-width: 1px;
            border-color: rgba(0, 0, 0, 0.04);
            shadow-color: #000000;
            shadow-offset: 0px 1px;
            shadow-opacity: 0.18;
            shadow-radius: 3px;
            elevation: 2;
          `}
`;

export const SegmentLabel = styled.Text<{ $selected: boolean; $dark: boolean }>`
  font-size: 12.5px;
  line-height: 16px;
  font-weight: 600;
  letter-spacing: -0.15px;
  color: ${({ $selected, $dark }) => ($selected ? ($dark ? '#FFFFFF' : '#111111') : '#8E8E93')};
`;

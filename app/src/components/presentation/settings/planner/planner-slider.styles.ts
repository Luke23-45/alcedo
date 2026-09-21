import styled, { css } from 'styled-components/native';

export const SliderRow = styled.View`
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
`;

export const SliderLabel = styled.Text`
  font-size: 13.5px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const SliderValue = styled.Text`
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.3px;
  color: ${({ theme }) => theme.home.amber};
`;

/** 44pt-tall touch zone; the visible track is vertically centred in it. */
export const SliderTouchZone = styled.View`
  height: 44px;
  justify-content: center;
`;

export const SliderTrack = styled.View`
  height: 6px;
  border-radius: 3px;
  overflow: hidden;
  ${({ theme }) =>
    theme.isDark
      ? css`
          background-color: rgba(255, 255, 255, 0.09);
        `
      : css`
          background-color: rgba(0, 0, 0, 0.08);
        `}
`;

export const SliderMinMaxRow = styled.View`
  position: relative;
  margin-top: 2px;
`;

export const SliderMinMax = styled.Text`
  font-size: 9px;
  font-weight: 600;
  color: ${({ theme }) => (theme.isDark ? '#6C6C70' : '#8E8E93')};
`;

export const SliderMinMaxLeft = styled(SliderMinMax)`
  position: absolute;
  left: 0;
  top: 0;
`;

export const SliderMinMaxRight = styled(SliderMinMax)`
  position: absolute;
  right: 0;
  top: 0;
`;

export const SliderMinMaxMid = styled(SliderMinMax)`
  align-self: center;
`;

export const SliderThumb = styled.View`
  position: absolute;
  width: 26px;
  height: 26px;
  border-radius: 13px;
  background-color: #ffffff;
  border-width: 0.8px;
  border-color: rgba(0, 0, 0, 0.08);
  align-items: center;
  justify-content: center;
  shadow-color: #000000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.35;
  shadow-radius: 4px;
  elevation: 4;
`;

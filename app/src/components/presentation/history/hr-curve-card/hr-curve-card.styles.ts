import styled from 'styled-components/native';
import Svg from 'react-native-svg';

export const CardInner = styled.View`
  gap: 4px;
`;

export const TitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const Title = styled.Text`
  font-size: 15.5px;
  line-height: 20px;
  font-weight: 600;
  letter-spacing: -0.3px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const Subtitle = styled.Text`
  /* Reference: title baseline 664 → subtitle baseline 682. */
  margin-bottom: 2px;
  font-size: 11px;
  line-height: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.content.secondary};
`;

export const Plot = styled.View`
  /* Reference: plot starts y=700, 18 below the subtitle baseline. */
  margin-top: 4px;
`;

export const PlotSvg = styled(Svg)`
  width: 100%;
  aspect-ratio: 321 / 128;
`;

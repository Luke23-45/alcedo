import styled from 'styled-components/native';

export const TopRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

export const IconWrap = styled.View`
  width: 52px;
  height: 52px;
  border-radius: 26px;
  shadow-color: #ff9f0a;
  shadow-offset: 0px 5px;
  shadow-opacity: 0.45;
  shadow-radius: 9px;
  elevation: 6;
`;

export const TitleCol = styled.View`
  flex: 1;
  justify-content: center;
  gap: 2px;
`;

export const Title = styled.Text`
  font-size: 17px;
  line-height: 22px;
  font-weight: 600; /* RN can't render 650 — falls back to 400; 600 is nearest representable. */
  letter-spacing: -0.35px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const Subtitle = styled.Text`
  font-size: 11.5px;
  line-height: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.content.secondary};
`;

export const DotsRow = styled.View`
  /* Reference: 16pt from the flame icon's bottom edge to the dot centers. */
  margin-top: 8px;
  flex-direction: row;
  align-items: center;
`;

export const Dots = styled.View`
  margin-left: 65px;
  flex-direction: row;
  align-items: center;
  gap: 22px;
`;

export const ThisWeek = styled.Text`
  margin-left: auto;
  font-size: 9.5px;
  line-height: 12px;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.content.tertiary};
`;

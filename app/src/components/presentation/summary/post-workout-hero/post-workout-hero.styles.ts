import styled from 'styled-components/native';

export const HeroWrap = styled.View`
  align-items: center;
  padding-top: ${({ theme }) => theme.space.lg}px;
  padding-bottom: 6px;
`;

export const Label = styled.Text`
  /* Reference: ring bottom 182 → label baseline 212. */
  margin-top: 20px;
  font-size: 9.5px;
  line-height: 12px;
  font-weight: 700;
  letter-spacing: 1.7px;
  text-transform: uppercase;
  color: #ff6a88;
`;

export const Duration = styled.Text`
  /* Reference: label baseline 212 → duration baseline 272. */
  margin-top: 4px;
  font-size: 62px;
  line-height: 68px;
  font-weight: 700;
  letter-spacing: -2.6px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const SplitLine = styled.View`
  /* Reference: duration baseline 272 → split baseline 296. */
  margin-top: 0px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

export const Split = styled.Text`
  font-size: 12px;
  line-height: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.content.secondary};
`;

export const DateLine = styled.Text`
  margin-top: 8px;
  font-size: 10.5px;
  line-height: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.content.tertiary};
`;

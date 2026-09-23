import styled from 'styled-components/native';

export const HeroWrap = styled.View`
  align-items: center;
  /* Reference: nav center 76 → date baseline 140. */
  padding-top: 40px;
  /* Reference: date-line baseline 246 → tiles top 274. */
  margin-bottom: 16px;
`;

export const DateLabel = styled.Text`
  font-size: 9.5px;
  line-height: 12px;
  font-weight: 700;
  letter-spacing: 1.6px;
  color: ${({ theme }) => theme.color.content.secondary};
`;

export const Duration = styled.Text`
  /* Reference: date baseline 140 → duration baseline 200. */
  margin-top: 34px;
  font-size: 56px;
  line-height: 62px;
  font-weight: 700;
  letter-spacing: -2.3px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const Split = styled.Text`
  /* Reference: duration baseline 200 → split baseline 224. */
  margin-top: 9px;
  font-size: 12px;
  line-height: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.content.secondary};
`;

export const DateLine = styled.Text`
  /* Reference: split baseline 224 → date-line baseline 246. */
  margin-top: 7px;
  font-size: 10.5px;
  line-height: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.content.tertiary};
`;

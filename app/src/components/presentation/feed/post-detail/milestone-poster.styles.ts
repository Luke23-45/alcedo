import styled from 'styled-components/native';

export const Medallion = styled.View`
  position: absolute;
  left: 16px;
  right: 16px;
  top: 0;
  bottom: 0;
  align-items: center;
  padding-top: 24px;
`;

export const StarDisc = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: rgba(0, 0, 0, 0.13);
  align-items: center;
  justify-content: center;
`;

const MedalText = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  text-align: center;
`;

export const MedalValue = styled(MedalText)`
  margin-top: 8px;
  font-size: 52px;
  font-weight: ${({ theme }) => theme.weight.bold};
  letter-spacing: -2.2px;
  color: #2b1e00;
`;

export const MedalUnit = styled(MedalText)`
  margin-top: 2px;
  font-size: 10px;
  font-weight: ${({ theme }) => theme.weight.bold};
  letter-spacing: 2.8px;
  color: #5c4300;
`;

export const MedalSubtitle = styled(MedalText)`
  margin-top: 8px;
  font-size: 11px;
  font-weight: ${({ theme }) => theme.weight.medium};
  color: #7a5a00;
`;

export const MedalRange = styled(MedalText)`
  margin-top: 4px;
  font-size: 8.5px;
  font-weight: ${({ theme }) => theme.weight.bold};
  letter-spacing: 1.2px;
  color: #7a5a00;
`;

/** 1pt white .40 edge, inset 0.5pt — the milestone's stronger key light. */
export const MilestoneEdge = styled.View`
  position: absolute;
  left: 0.5px;
  right: 0.5px;
  top: 0.5px;
  bottom: 0.5px;
  border-radius: 21.5px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.4);
`;

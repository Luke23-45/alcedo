import styled from 'styled-components/native';

export const SwitcherRow = styled.View`
  flex-direction: row;
  align-items: center;
  height: 26px;
`;

export const MetricTab = styled.Pressable`
  flex: 1;
  height: 26px;
  align-items: center;
  justify-content: center;
`;

export const ActivePill = styled.View<{ $fill: string; $border: string }>`
  position: absolute;
  left: 2px;
  right: 2px;
  top: 0;
  bottom: 0;
  border-radius: 13px;
  background-color: ${({ $fill }) => $fill};
  border-width: 0.8px;
  border-color: ${({ $border }) => $border};
`;

export const DeltaPill = styled.View<{ $bg: string }>`
  min-width: 56px;
  height: 26px;
  padding-horizontal: 10px;
  border-radius: 13px;
  background-color: ${({ $bg }) => $bg};
  align-items: center;
  justify-content: center;
  margin-left: auto;
`;

export const ValueRow = styled.View`
  flex-direction: row;
  align-items: baseline;
  margin-top: 13px;
`;

export const ChartWrap = styled.View`
  margin-top: -6px;
`;

import styled from 'styled-components/native';

export const NewPill = styled.View<{ $bg: string }>`
  min-width: 54px;
  height: 21px;
  padding-horizontal: 10px;
  border-radius: 10.5px;
  background-color: ${({ $bg }) => $bg};
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

export const TimelineBody = styled.View`
  position: relative;
  padding: 11px 20px;
`;

export const Spine = styled.View<{ $dark: boolean }>`
  position: absolute;
  left: 36px;
  top: 26px;
  width: 1.6px;
  height: 180px;
  background-color: ${({ $dark }) => ($dark ? 'rgba(255,255,255,0.10)' : 'rgba(60,60,67,0.14)')};
`;

export const PrRow = styled.View`
  flex-direction: row;
  align-items: center;
  height: 42px;
`;

export const NodeWrap = styled.View`
  width: 34px;
  align-items: center;
  justify-content: center;
`;

export const Medallion = styled.View`
  width: 18px;
  height: 18px;
  border-radius: 9px;
  shadow-color: #ffd84d;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.45;
  shadow-radius: 8px;
  elevation: 4;
`;

export const TextCol = styled.View`
  flex: 1;
  margin-left: 4px;
  justify-content: flex-start;
  padding-top: 9px;
`;

export const ValueCol = styled.View`
  align-items: flex-end;
  justify-content: center;
  padding-left: 8px;
`;

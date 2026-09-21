import styled from 'styled-components/native';

/** Section stack: header → rows, 10pt rhythm. */
export const WeekSection = styled.View`
  gap: 10px;
`;

/** "EARLIER THIS WEEK" + the orange range label. */
export const WeekHeader = styled.View`
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
  padding-left: 8px;
  padding-right: 8px;
`;

/** 64pt session row. */
export const SessionRowInner = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px 12px 10px 14px;
  min-height: 64px;
`;

/** Gold edge for PR rows — spec 20% stroke. */
export const GoldEdge = styled.View`
  position: absolute;
  top: 0.5px;
  left: 0.5px;
  right: 0.5px;
  bottom: 0.5px;
  border-radius: 19.5px;
  border-width: 1px;
  border-color: rgba(255, 214, 10, 0.2);
`;

/** 44×44 date tile, rx14. */
export const DateTile = styled.View<{ $pr: boolean; $dark: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $pr, $dark }) =>
    $pr ? 'rgba(255,214,10,0.12)' : $dark ? 'rgba(255,255,255,0.06)' : 'rgba(120,120,128,0.12)'};
`;

export const RowMiddle = styled.View`
  flex: 1;
  margin-left: 12px;
  margin-right: 8px;
  justify-content: center;
  gap: 3px;
`;

export const NameRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

export const PrBadge = styled.View`
  height: 16px;
  min-width: 30px;
  padding-horizontal: 7px;
  border-radius: 8px;
  background-color: rgba(255, 214, 10, 0.18);
  align-items: center;
  justify-content: center;
`;

export const RowRight = styled.View`
  align-items: flex-end;
  justify-content: center;
  gap: 3px;
  margin-right: 10px;
`;

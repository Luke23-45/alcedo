import styled from 'styled-components/native';

/** "MONDAY, JUNE 9" — 24pt page margin per the section-header convention. */
export const SectionLabel = styled.View`
  padding-left: 8px;
`;

/** Section stack: label → aggregate → session cards. */
export const DaySection = styled.View`
  gap: 12px;
`;

/** 68pt aggregate strip: 4 cells split by 1pt hairlines. */
export const AggregateRow = styled.View`
  flex-direction: row;
  height: 68px;
  align-items: stretch;
`;

export const AggregateCell = styled.View<{ $first?: boolean }>`
  flex: 1;
  align-items: center;
  justify-content: center;
  border-left-width: ${({ $first }) => ($first ? 0 : 1)}px;
  border-left-color: rgba(255, 255, 255, 0.08);
`;

/** Selected-day session card, 104pt. */
export const SessionCardRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  min-height: 104px;
`;

/** Coral-tinted edge for the featured (selected-day) card — spec 22%. */
export const CoralEdge = styled.View`
  position: absolute;
  top: 0.5px;
  left: 0.5px;
  right: 0.5px;
  bottom: 0.5px;
  border-radius: 25.5px;
  border-width: 1px;
  border-color: rgba(255, 45, 85, 0.22);
`;

/** 52×52 brand tile with gloss and a colored shadow (spec filter fb). */
export const IconTile = styled.View`
  width: 52px;
  height: 52px;
  border-radius: 18px;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  shadow-color: #ff2d55;
  shadow-offset: 0px 7px;
  shadow-opacity: 0.5;
  shadow-radius: 12px;
  elevation: 8;
`;

export const GlossHalf = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 26px;
  opacity: 0.45;
`;

export const CardMiddle = styled.View`
  flex: 1;
  margin-left: 16px;
  margin-right: 8px;
  justify-content: center;
  gap: 3px;
`;

export const ChipRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 5px;
  gap: 6px;
`;

export const PrChip = styled.View`
  flex-direction: row;
  align-items: center;
  height: 18px;
  padding-horizontal: 8px;
  border-radius: 9px;
  background-color: rgba(255, 214, 10, 0.16);
  border-width: 0.7px;
  border-color: rgba(255, 214, 10, 0.26);
  gap: 4px;
`;

export const CardRight = styled.View`
  align-items: flex-end;
  justify-content: center;
  gap: 3px;
  margin-right: 10px;
`;

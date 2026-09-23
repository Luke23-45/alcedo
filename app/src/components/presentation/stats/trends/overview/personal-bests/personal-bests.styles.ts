import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';

/** Tight 20/20/14 padding — the reference card is 252pt, not the hero 20pt. */
export const CardInner = styled.View`
  padding-top: 20px;
  padding-horizontal: 20px;
  padding-bottom: 14px;
`;

export const ColumnRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const LiftCell = styled.View`
  flex: 1;
  padding-right: 8px;
`;

export const RightCell = styled.View<{ $width: number }>`
  width: ${({ $width }) => $width}px;
  align-items: flex-end;
`;

export const HeaderDivider = styled.View<{ $dark: boolean }>`
  height: ${StyleSheet.hairlineWidth}px;
  margin-top: 6px;
  background-color: ${({ $dark }) => ($dark ? 'rgba(255,255,255,0.08)' : 'rgba(60,60,67,0.12)')};
`;

/** 42pt pitch: 16pt text + 10pt gap + divider + 15pt gap. */
export const DataRow = styled.View<{ $first: boolean }>`
  margin-top: ${({ $first }) => ($first ? 17 : 15)}px;
`;

export const RowDivider = styled.View<{ $dark: boolean }>`
  height: ${StyleSheet.hairlineWidth}px;
  margin-top: 10px;
  background-color: ${({ $dark }) => ($dark ? 'rgba(255,255,255,0.05)' : 'rgba(60,60,67,0.08)')};
`;

import styled from 'styled-components/native';
import { alpha } from '@/styles/theme';
import type { RecentActivityItem } from '../use-home-data';

export type ActivityKind = RecentActivityItem['kind'];

export const List = styled.View`
  gap: 10px;
`;

export const RowInner = styled.View`
  flex-direction: row;
  align-items: center;
  height: 40px;
`;

/** 40×40 kind-tinted tile, rx14. Legs → blue well, upper → purple well. */
export const Tile = styled.View<{ $kind: ActivityKind }>`
  width: 40px;
  height: 40px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $kind }) =>
    $kind === 'legs'
      ? alpha('#0A84FF', 0.16)
      : $kind === 'upper'
        ? alpha('#AF52DE', 0.16)
        : $kind === 'strength'
          ? alpha('#FF2D55', 0.16)
          : alpha('#30D158', 0.16)};
  margin-right: ${({ theme }) => theme.space.md}px;
`;

export const Middle = styled.View`
  flex: 1;
  justify-content: center;
`;

export const ValueBlock = styled.View`
  align-items: flex-end;
  justify-content: center;
  margin-right: ${({ theme }) => theme.space.sm}px;
`;

export const EmptyBox = styled.View`
  padding-horizontal: ${({ theme }) => theme.space.base}px;
  padding-vertical: ${({ theme }) => theme.space.md}px;
`;

import styled from 'styled-components/native';

export const TilesRow = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.space.md}px;
`;

/** 60pt = 82pt tile − 2pt edge − 20pt padding. Content pins to top and bottom. */
export const TileBody = styled.View`
  height: 60px;
  justify-content: space-between;
`;

/** Glyphs / chips ride top-right; the SampleBadge sits top-left. */
export const TileTop = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  height: 20px;
`;

export const TileBottom = styled.View``;

export const ValueRow = styled.View`
  flex-direction: row;
  align-items: baseline;
  gap: ${({ theme }) => theme.space.xs / 2}px;
  margin-top: 2px;
`;

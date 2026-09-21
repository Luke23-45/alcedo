import styled from 'styled-components/native';

export const TilesRow = styled.View`
  flex-direction: row;
  gap: 11px;
`;

export const TileBody = styled.View`
  height: 72px;
  justify-content: space-between;
`;

export const IconTile = styled.View<{ $tint: string }>`
  width: 20px;
  height: 20px;
  border-radius: 6.5px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $tint }) => $tint};
`;

export const Value = styled.Text`
  font-size: 17px;
  line-height: 21px;
  font-weight: 700;
  letter-spacing: -0.55px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const Unit = styled.Text`
  margin-top: 2px;
  font-size: 8px;
  line-height: 10px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.content.secondary};
`;

export const TopRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

export const Bottom = styled.View`
  justify-content: flex-end;
`;

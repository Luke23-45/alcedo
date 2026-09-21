import styled from 'styled-components/native';
import { HomeCard } from '@/components/presentation/home/shared/home-card';

/* Reference: tiles are 82×104 — flex fills the 361pt row across 11pt gaps. */
export const TileCard = styled(HomeCard)`
  flex: 1;
  height: 104px;
`;

export const TilesRow = styled.View`
  flex-direction: row;
  gap: 11px;
`;

export const TileBody = styled.View`
  flex: 1;
  justify-content: space-between;
`;

export const TopRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const IconTile = styled.View<{ $tint: string }>`
  width: 20px;
  height: 20px;
  border-radius: 6.5px;
  background-color: ${({ $tint }) => $tint};
  align-items: center;
  justify-content: center;
`;

/** The reps tile carries its own count inside the 20×20 icon tile. */
export const IconCount = styled.Text`
  font-size: 11px;
  line-height: 13px;
  font-weight: 700;
  color: #ffb84d;
`;

export const Bottom = styled.View`
  gap: 3px;
`;

export const Value = styled.Text`
  font-size: 17px;
  line-height: 21px;
  font-weight: 700;
  letter-spacing: -0.55px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const Unit = styled.Text`
  font-size: 8px;
  line-height: 10px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.content.secondary};
`;

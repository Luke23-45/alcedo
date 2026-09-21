import styled from 'styled-components/native';
import { HomeCard } from '@/components/presentation/home/shared/home-card';

export const RowCard = styled(HomeCard).attrs({ radius: 22, pad: 16 })`
  flex-direction: row;
  align-items: center;
`;

export const RowIconWell = styled.View<{ $tint: string }>`
  width: 36px;
  height: 36px;
  border-radius: 13px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $tint }) => $tint};
`;

export const RowText = styled.View`
  flex: 1;
  margin-left: 12px;
  gap: 2px;
`;

export const RowName = styled.Text`
  font-size: 13.5px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const RowCaption = styled.Text`
  font-size: 10.5px;
  font-weight: 500;
  color: ${({ theme }) => (theme.isDark ? '#86868B' : '#8E8E93')};
`;

export const RowHighlight = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 22px;
  border-width: 1.5px;
  border-color: rgba(255, 159, 10, 0.6);
`;

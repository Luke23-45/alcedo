import styled, { css } from 'styled-components/native';
import { type } from '@/styles/theme';
import { detailPalette } from '../detail-tokens';

export const Container = styled.View`
  width: 100%;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space.sm}px;
`;

export const CardTitle = styled.Text`
  ${({ theme }) => type(theme, 'caption2')};
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.content.tertiary};
`;

export const Subtitle = styled.Text`
  ${({ theme }) => type(theme, 'caption1')};
  color: ${({ theme }) => theme.color.content.secondary};
`;

export const MatrixTable = styled.View`
  gap: ${({ theme }) => theme.space.xs}px;
`;

export const MatrixRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  min-height: 36px;
  padding-horizontal: ${({ theme }) => theme.space.sm}px;
  padding-vertical: ${({ theme }) => theme.space.xxs}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => detailPalette(theme.isDark).detail.vsLastTime.rowBg};
`;

export const SetIndexText = styled.Text`
  ${({ theme }) => type(theme, 'caption1')};
  font-weight: 600;
  color: ${({ theme }) => theme.color.content.tertiary};
  width: 44px;
`;

export const LastValueText = styled.Text`
  ${({ theme }) => type(theme, 'footnote', { tabular: true })};
  color: ${({ theme }) => theme.color.content.secondary};
  flex: 1;
`;

export const ArrowText = styled.Text`
  ${({ theme }) => type(theme, 'caption1')};
  color: ${({ theme }) => theme.color.content.tertiary};
  margin-horizontal: ${({ theme }) => theme.space.xs}px;
`;

export const TodayValueText = styled.Text`
  ${({ theme }) => type(theme, 'footnote', { tabular: true })};
  font-weight: 600;
  color: ${({ theme }) => theme.color.content.primary};
  flex: 1;
`;

export const DeltaChip = styled.View<{ $sentiment: 'positive' | 'negative' | 'neutral' }>`
  min-width: 68px;
  align-items: flex-end;
  justify-content: center;
`;

export const DeltaChipText = styled.Text<{ $sentiment: 'positive' | 'negative' | 'neutral' }>`
  ${({ theme }) => type(theme, 'caption1', { tabular: true })};
  font-weight: 700;

  ${({ theme, $sentiment }) => {
    const pal = detailPalette(theme.isDark);
    switch ($sentiment) {
      case 'positive':
        return css`
          color: ${pal.detail.vsLastTime.positive};
        `;
      case 'negative':
        return css`
          color: ${pal.detail.vsLastTime.negative};
        `;
      default:
        return css`
          color: ${pal.detail.vsLastTime.neutral};
        `;
    }
  }}
`;

export const PrescriptionFallback = styled.View`
  padding-vertical: ${({ theme }) => theme.space.sm}px;
  gap: ${({ theme }) => theme.space.xs}px;
`;

export const PrescriptionText = styled.Text`
  ${({ theme }) => type(theme, 'subheadline')};
  color: ${({ theme }) => theme.color.content.secondary};
`;

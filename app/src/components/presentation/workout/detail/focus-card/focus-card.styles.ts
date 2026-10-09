import styled, { css } from 'styled-components/native';
import { type } from '@/styles/theme';
import { detailPalette } from '../detail-tokens';

export const CardContainer = styled.View`
  width: 100%;
  min-height: 180px;
  justify-content: center;
`;

export const MicroLabel = styled.Text`
  ${({ theme }) => type(theme, 'caption2')};
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.content.tertiary};
  margin-bottom: ${({ theme }) => theme.space.xs}px;
`;

export const HeroTitle = styled.Text`
  ${({ theme }) => type(theme, 'title2')};
  font-weight: 700;
  color: ${({ theme }) => theme.color.content.primary};
  margin-bottom: ${({ theme }) => theme.space.xs}px;
`;

export const MetricValue = styled.Text`
  ${({ theme }) => type(theme, 'metricL', { tabular: true })};
  color: ${({ theme }) => theme.color.content.primary};
`;

export const BodyText = styled.Text`
  ${({ theme }) => type(theme, 'subheadline')};
  color: ${({ theme }) => theme.color.content.secondary};
  margin-top: ${({ theme }) => theme.space.xs}px;
`;

export const DetailRow = styled.View`
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.sm}px;
  margin-top: ${({ theme }) => theme.space.sm}px;
`;

export const Chip = styled.View<{ $variant?: 'ready' | 'paused' | 'verdict' | 'neutral' }>`
  padding-horizontal: ${({ theme }) => theme.space.sm}px;
  padding-vertical: ${({ theme }) => theme.space.xxs}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs}px;

  ${({ theme, $variant }) => {
    const pal = detailPalette(theme.isDark);
    switch ($variant) {
      case 'ready':
        return css`
          background-color: ${pal.detail.hero.readyChipBg};
        `;
      case 'paused':
        return css`
          background-color: ${pal.detail.hero.pausedChipBg};
        `;
      case 'verdict':
        return css`
          background-color: ${pal.detail.progression.chipBg};
          border-width: 1px;
          border-color: ${pal.detail.progression.chipBorder};
        `;
      default:
        return css`
          background-color: ${theme.color.fill.quaternary};
        `;
    }
  }}
`;

export const ChipText = styled.Text<{ $variant?: 'ready' | 'paused' | 'verdict' | 'neutral' }>`
  ${({ theme }) => type(theme, 'caption1')};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;

  ${({ theme, $variant }) => {
    const pal = detailPalette(theme.isDark);
    switch ($variant) {
      case 'ready':
        return css`
          color: ${pal.detail.hero.readyChipText};
        `;
      case 'paused':
        return css`
          color: ${pal.detail.hero.pausedChipText};
        `;
      case 'verdict':
        return css`
          color: ${pal.detail.progression.chipText};
        `;
      default:
        return css`
          color: ${theme.color.content.secondary};
        `;
    }
  }}
`;

export const DeltaText = styled.Text`
  ${({ theme }) => type(theme, 'footnote')};
  color: ${({ theme }) => theme.color.content.tertiary};
`;

export const RingCenter = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.space.base}px;
`;

export const RingTextStack = styled.View`
  flex: 1;
`;

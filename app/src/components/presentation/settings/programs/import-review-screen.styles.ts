import styled from 'styled-components/native';
import { HomeCard } from '@/components/presentation/home/shared/home-card';

export const ReviewPage = styled.View`
  padding-horizontal: 16px;
  padding-top: 12px;
  padding-bottom: 32px;
  gap: 12px;
`;

export const ReviewCard = styled(HomeCard).attrs({ radius: 30, pad: 20 })`
  gap: 16px;
`;

export const ReviewTitle = styled.Text`
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.3px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const ReviewMeta = styled.Text`
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => (theme.isDark ? '#86868B' : '#8E8E93')};
`;

export const ImportHint = styled.Text`
  font-size: 12.5px;
  font-weight: 500;
  line-height: 19px;
  color: ${({ theme }) => (theme.isDark ? '#98989F' : '#636366')};
`;

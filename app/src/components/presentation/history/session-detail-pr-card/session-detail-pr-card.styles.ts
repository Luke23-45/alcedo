import styled from 'styled-components/native';
import { HomeGradient } from '../../home/shared/home-gradient';

export const CardInner = styled.View`
  gap: 14px;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const Title = styled.Text`
  font-size: 15.5px;
  line-height: 20px;
  font-weight: 600;
  letter-spacing: -0.3px;
  color: ${({ theme }) => theme.color.content.primary};
`;

/** Reference: 54×21, rx10.5, #FFD60A@.16 fill, text 8.5/700/+0.8 #FFD84D. */
export const NewChip = styled.View`
  min-width: 54px;
  height: 21px;
  border-radius: 10.5px;
  padding-horizontal: 8px;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 214, 10, 0.16);
`;

export const NewChipText = styled.Text`
  font-size: 8.5px;
  line-height: 11px;
  font-weight: 700;
  letter-spacing: 0.8px;
  color: #ffd84d;
`;

export const Rows = styled.View`
  gap: 12px;
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 14px;
`;

/** Reference: r=20, gradient #FFF0BE→#D9A441, gold glow shadow. */
export const Medal = styled(HomeGradient).attrs({
  colors: ['#FFF0BE', '#D9A441'] as [string, string],
  start: { x: 0.2, y: 0 },
  end: { x: 0.8, y: 1 },
})`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  shadow-color: #ffd84d;
  shadow-offset: 0px 5px;
  shadow-opacity: 0.45;
  shadow-radius: 9px;
  elevation: 8;
`;

export const RowText = styled.View`
  gap: 2px;
`;

export const RowTitle = styled.Text`
  font-size: 13px;
  line-height: 16px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const RowDetail = styled.Text`
  font-size: 10.5px;
  line-height: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.content.secondary};
`;

export const Empty = styled.Text`
  font-size: 13px;
  line-height: 17px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.content.secondary};
`;

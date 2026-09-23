import styled, { css } from 'styled-components/native';
import { StyleSheet } from 'react-native';

export const CardInner = styled.View``;

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

/** Reference: 58×21 (width flexes with content), rx10.5, white@.07, text 8.5/700/+0.8. */
export const SetsChip = styled.View`
  height: 21px;
  border-radius: 10.5px;
  padding-horizontal: 10px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(120, 120, 128, 0.12)')};
`;

export const SetsChipText = styled.Text`
  font-size: 8.5px;
  line-height: 11px;
  font-weight: 700;
  letter-spacing: 0.8px;
  color: ${({ theme }) => theme.color.content.secondary};
`;

export const ColumnHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 16px;
`;

export const ColumnLabel = styled.Text`
  font-size: 8px;
  line-height: 10px;
  font-weight: 700;
  letter-spacing: 0.8px;
  color: ${({ theme }) => theme.color.content.tertiary};
`;

export const HeaderDivider = styled.View`
  height: ${StyleSheet.hairlineWidth}px;
  margin-top: 8px;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)')};
`;

export const RowDivider = styled.View`
  height: ${StyleSheet.hairlineWidth}px;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)')};
`;

export const Row = styled.View`
  padding-vertical: 13px;
  gap: 8px;
`;

export const RowTop = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const Index = styled.Text`
  font-size: 10px;
  line-height: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.color.content.tertiary};
`;

export const Name = styled.Text`
  flex: 1;
  font-size: 13px;
  line-height: 16px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.color.content.primary};
`;

/** Reference: 28×15, rx7.5, #FFD60A@.18 fill, @.28 stroke, text 7.5/700/+0.5 #FFD84D. */
export const PrChip = styled.View`
  min-width: 28px;
  height: 15px;
  border-radius: 7.5px;
  padding-horizontal: 5px;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 214, 10, 0.18);
  border-width: 0.7px;
  border-color: rgba(255, 214, 10, 0.28);
`;

export const PrChipText = styled.Text`
  font-size: 7.5px;
  line-height: 9px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #ffd84d;
`;

export const Volume = styled.Text<{ $pr: boolean }>`
  font-size: 13px;
  line-height: 16px;
  font-weight: 700;
  letter-spacing: -0.25px;
  /* Reference: gold when the exercise holds a PR, otherwise body ink. Gold is
     a brand surface — identical in both themes. */
  color: ${({ theme, $pr }) => ($pr ? '#FFD84D' : theme.color.content.primary)};
`;

export const Chips = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 6px;
`;

/** Reference: h=18, rx=9, min-w=46, pad-x 8, white@.07, text 9/600/−0.1 #C7C7CC. */
export const SetChip = styled.View<{ $pr: boolean }>`
  min-width: 46px;
  height: 18px;
  border-radius: 9px;
  padding-horizontal: 8px;
  align-items: center;
  justify-content: center;
  ${({ theme, $pr }) =>
    $pr
      ? css`
          background-color: rgba(255, 214, 10, 0.18);
          border-width: 0.8px;
          border-color: rgba(255, 214, 10, 0.3);
        `
      : css`
          background-color: ${theme.isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(120, 120, 128, 0.12)'};
        `};
`;

export const SetChipText = styled.Text<{ $pr: boolean }>`
  font-size: 9px;
  line-height: 11px;
  font-weight: ${({ $pr }) => ($pr ? '700' : '600')};
  letter-spacing: -0.1px;
  color: ${({ theme, $pr }) => ($pr ? '#FFD84D' : theme.color.content.secondary)};
`;

export const Empty = styled.Text`
  margin-top: 12px;
  font-size: 13px;
  line-height: 17px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.content.secondary};
`;

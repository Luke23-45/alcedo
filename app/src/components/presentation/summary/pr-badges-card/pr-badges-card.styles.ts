import styled from 'styled-components/native';

export const HeaderRow = styled.View`
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

export const NewChip = styled.View`
  padding-horizontal: 10px;
  padding-vertical: 5px;
  border-radius: 10.5px;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 214, 10, 0.16)' : 'rgba(180, 130, 0, 0.14)')};
`;

export const NewChipText = styled.Text`
  font-size: 8.5px;
  line-height: 11px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: ${({ theme }) => (theme.isDark ? '#ffd84d' : '#8a6d00')};
`;

export const Rows = styled.View`
  /* Reference: first medal center 48pt below the content top. */
  margin-top: 8px;
  gap: 16px;
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

export const RowText = styled.View`
  flex: 1;
  justify-content: center;
  gap: 2px;
`;

export const RowTitle = styled.Text`
  font-size: 13px;
  line-height: 17px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const RowDetail = styled.Text`
  font-size: 10.5px;
  line-height: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.content.secondary};
`;

import styled from 'styled-components/native';

export const NotesWrap = styled.View`
  margin-top: 8px;
  gap: 4px;
`;

export const NotesText = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 13px;
  line-height: 17px;
  font-weight: 500;
  letter-spacing: -0.1px;
  color: ${({ theme }) => (theme.isDark ? '#98989F' : '#636366')};
`;

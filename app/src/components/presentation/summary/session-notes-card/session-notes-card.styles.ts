import styled from 'styled-components/native';

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const Label = styled.Text`
  font-size: 9px;
  line-height: 12px;
  font-weight: 700;
  letter-spacing: 1.3px;
  color: ${({ theme }) => theme.color.content.secondary};
`;

export const EditButton = styled.Pressable`
  min-width: 44px;
  min-height: 44px;
  margin: -12px;
  /* The reference right-aligns the label 8pt from the card edge (x=369),
     past the card's 20pt pad — the touch target extends out to cover it. */
  margin-right: -20px;
  padding: 12px;
  padding-right: 8px;
  align-items: center;
  justify-content: center;
`;

export const EditText = styled.Text`
  font-size: 11.5px;
  line-height: 15px;
  font-weight: 600;
  letter-spacing: -0.1px;
  color: ${({ theme }) => theme.home.seeAll};
`;

export const Body = styled.Text`
  margin-top: 10px;
  font-size: 12.5px;
  line-height: 19px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const Empty = styled.Text`
  margin-top: 10px;
  font-size: 12.5px;
  line-height: 19px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.content.secondary};
`;

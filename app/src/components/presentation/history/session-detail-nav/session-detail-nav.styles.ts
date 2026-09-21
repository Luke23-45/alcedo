import styled from 'styled-components/native';

export const NavRow = styled.View`
  height: 44px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 6px;
`;

export const BackButton = styled.Pressable`
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.Text`
  flex: 1;
  text-align: center;
  font-size: 15px;
  line-height: 20px;
  font-weight: 600;
  letter-spacing: -0.3px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const MenuSlot = styled.View`
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
`;

import styled from 'styled-components/native';

export const TouchArea = styled.Pressable`
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
`;

export const Circle = styled.View<{ $disabled: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.color.fill.secondary};
  opacity: ${({ $disabled }) => ($disabled ? 0.4 : 1)};
`;

import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';

export const StripInner = styled.View`
  flex-direction: row;
  height: 68px;
`;

export const Column = styled.View`
  flex: 1;
  align-items: center;
  padding-top: 21px;
`;

export const Value = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 15px;
  line-height: 20px;
  font-weight: ${({ theme }) => theme.weight.bold};
  letter-spacing: -0.4px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const Label = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 7.5px;
  line-height: 10px;
  font-weight: ${({ theme }) => theme.weight.bold};
  letter-spacing: 0.7px;
  color: ${({ theme }) => theme.color.content.secondary};
  margin-top: 7px;
`;

export const Divider = styled.View`
  position: absolute;
  right: 0;
  top: 14px;
  bottom: 14px;
  width: ${StyleSheet.hairlineWidth}px;
  background-color: ${({ theme }) =>
    theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(60,60,67,0.12)'};
`;

import styled from 'styled-components/native';
import type { StyleProp, ViewStyle } from 'react-native';

export const iconFill: StyleProp<ViewStyle> = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};

export const iconGloss: StyleProp<ViewStyle> = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  height: 30,
};

export const CardInner = styled.View`
  flex-direction: row;
  align-items: flex-start;
  padding-top: 22px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 14px;
  height: 104px;
`;

export const IconTile = styled.View`
  width: 60px;
  height: 60px;
  border-radius: 20px;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  shadow-color: #ff2d55;
  shadow-offset: 0px 6px;
  shadow-opacity: 0.45;
  shadow-radius: 10px;
  elevation: 6;
`;

export const TextBlock = styled.View`
  flex: 1;
  margin-left: 16px;
  padding-top: 2px;
`;

export const Name = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 19px;
  line-height: 24px;
  font-weight: ${({ theme }) => theme.weight.bold};
  letter-spacing: -0.45px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const Meta = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 11.5px;
  line-height: 14px;
  font-weight: ${({ theme }) => theme.weight.medium};
  color: ${({ theme }) => theme.color.content.secondary};
  margin-top: 3px;
`;

export const ChipRow = styled.View`
  flex-direction: row;
  gap: 6px;
  margin-top: 7px;
`;

export const Chip = styled.View`
  height: 18px;
  padding-horizontal: 10px;
  border-radius: 9px;
  background-color: ${({ theme }) =>
    theme.isDark ? 'rgba(255,255,255,0.07)' : 'rgba(120,120,128,0.10)'};
  align-items: center;
  justify-content: center;
`;

export const ChipText = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 8px;
  line-height: 10px;
  font-weight: ${({ theme }) => theme.weight.bold};
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.color.content.secondary};
`;

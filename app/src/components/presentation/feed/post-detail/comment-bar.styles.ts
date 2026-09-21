import type { FC, Ref } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import styled from 'styled-components/native';
import { TextInput, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';

export const BarWrap = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  border-top-width: 0.5px;
  border-top-color: ${({ theme }) => (theme.isDark ? 'rgba(255,255,255,0.11)' : 'rgba(60,60,67,0.16)')};
`;

/** Material backdrop: the spec's vertical tb gradient (RN-only absolute fill). */
export const BarMaterial = styled(LinearGradient)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  opacity: ${({ theme }) => (theme.isDark ? 0.96 : 0.95)};
`;

export const BarContent = styled.View<{ $bottomInset: number }>`
  padding-bottom: ${({ $bottomInset }) => $bottomInset}px;
`;

export const ReplyStrip = styled.View`
  flex-direction: row;
  align-items: center;
  min-height: 40px;
  padding-left: 24px;
  padding-right: 12px;
  border-bottom-width: 0.5px;
  border-bottom-color: ${({ theme }) => (theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)')};
`;

export const ReplyLabel = styled.Text`
  flex: 1;
  font-family: ${({ theme }) => theme.font.text};
  font-size: 12px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  color: ${({ theme }) => (theme.isDark ? '#8E8E93' : '#6E6E73')};
`;

export const CancelButton = styled.Pressable`
  min-height: 44px;
  min-width: 44px;
  align-items: center;
  justify-content: center;
  padding-left: 12px;
  padding-right: 12px;
`;

export const CancelText = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 12px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  color: ${({ theme }) => (theme.isDark ? '#C7C7CC' : '#3C3C43')};
`;

export const InputRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding-left: 24px;
  padding-right: 17px;
  padding-top: 12px;
`;

/** 38pt pill, radius 19; dark fill is white .08 over the bar material. */
const RawInput = styled.TextInput`
  flex: 1;
  height: 38px;
  border-radius: 19px;
  margin-left: 10px;
  margin-right: 8px;
  padding-left: 16px;
  padding-right: 16px;
  font-family: ${({ theme }) => theme.font.text};
  font-size: 13.5px;
  letter-spacing: -0.2px;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255,255,255,0.08)' : '#EFEFF2')};
  border-width: ${({ theme }) => (theme.isDark ? 0.9 : 0)}px;
  border-color: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => (theme.isDark ? '#EBEBF5' : '#1C1C1E')};
`;

/**
 * styled-components v6 types don't expose ref on styled.TextInput under
 * React 19; the cast restores it. Runtime ref-forwarding is unaffected.
 */
export const Input = RawInput as unknown as FC<TextInputProps & { ref?: Ref<TextInput> }>;

export const SendButton = styled.Pressable`
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  margin-right: -5px;
`;

/** 34pt circle; the styled 44pt SendButton carries the touch target. */
export const sendCircle: StyleProp<ViewStyle> = {
  width: 34,
  height: 34,
  borderRadius: 17,
  borderWidth: 0.9,
  borderColor: 'rgba(255,255,255,0.24)',
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: '#FF2D55',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.5,
  shadowRadius: 8,
  elevation: 6,
};

import { KeyboardAvoidingView, ScrollView } from 'react-native';
import styled from 'styled-components/native';

export const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.color.background.base};
`;

/** Safe-area pad plus a true 44pt navigation row (never compressed). */
export const Header = styled.View<{ $topInset: number }>`
  padding-top: ${({ $topInset }) => $topInset}px;
`;

export const HeaderRow = styled.View`
  height: 44px;
  flex-direction: row;
  align-items: center;
`;

export const SideSlot = styled.View`
  width: 52px;
  height: 44px;
  align-items: center;
  justify-content: center;
`;

export const HeaderButton = styled.Pressable`
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.Text`
  flex: 1;
  font-family: ${({ theme }) => theme.font.text};
  font-size: 15px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.3px;
  color: ${({ theme }) => (theme.isDark ? '#FFFFFF' : '#1C1C1E')};
  text-align: center;
`;

export const Body = styled.View`
  flex: 1;
`;

export const KeyboardAvoid = styled(KeyboardAvoidingView)`
  flex: 1;
`;

export const DetailScroll = styled(ScrollView).attrs<{ $replying: boolean }>(({ $replying }) => ({
  keyboardShouldPersistTaps: 'handled' as const,
  contentContainerStyle: {
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: $replying ? 200 : 156,
  },
}))``;

export const UnavailableWrap = styled.View`
  flex: 1;
  padding-top: 48px;
`;

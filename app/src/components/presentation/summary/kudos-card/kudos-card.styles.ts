import styled from 'styled-components/native';

export const CardButton = styled.Pressable`
  flex-direction: row;
  align-items: center;
`;

/** The reference pads this card 24pt vertically (16pt horizontally). */
export const VerticalPad = styled.View`
  padding-vertical: 8px;
`;

export const Avatars = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Avatar = styled.View<{ $color: string }>`
  width: 28px;
  height: 28px;
  border-radius: 14px;
  margin-left: -8px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $color }) => $color};
  border-width: 2.4px;
  border-color: ${({ theme }) => (theme.isDark ? '#17171a' : '#f2f2f7')};
`;

export const FirstAvatar = styled(Avatar)`
  margin-left: 0;
`;

export const Initial = styled.Text`
  font-size: 10.5px;
  line-height: 14px;
  font-weight: 600;
  color: #ffffff;
`;

export const OverflowAvatar = styled.View`
  width: 28px;
  height: 28px;
  border-radius: 14px;
  margin-left: -8px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => (theme.isDark ? '#2a2a2e' : '#e5e5ea')};
  border-width: 2.4px;
  border-color: ${({ theme }) => (theme.isDark ? '#17171a' : '#f2f2f7')};
`;

export const OverflowText = styled.Text`
  font-size: 9px;
  line-height: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.color.content.secondary};
`;

export const Copy = styled.View`
  margin-left: 14px;
  flex: 1;
  justify-content: center;
  gap: 3px;
`;

export const Headline = styled.Text`
  font-size: 12.5px;
  line-height: 16px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const Subline = styled.Text`
  font-size: 10.5px;
  line-height: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.content.secondary};
`;

export const DetailList = styled.View`
  margin-top: 12px;
  padding-top: 4px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.color.border.hairline};
`;

export const DetailRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding-vertical: 6px;
`;

export const DetailAvatar = styled.View<{ $color: string }>`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $color }) => $color};
`;

export const DetailInitial = styled.Text`
  font-size: 9px;
  line-height: 12px;
  font-weight: 600;
  color: #ffffff;
`;

export const DetailName = styled.Text`
  margin-left: 10px;
  flex: 1;
  font-size: 12.5px;
  line-height: 16px;
  font-weight: 500;
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const DetailCount = styled.Text`
  font-size: 12px;
  line-height: 16px;
  font-weight: 600;
  font-variant: tabular-nums;
  color: ${({ theme }) => theme.color.content.secondary};
`;

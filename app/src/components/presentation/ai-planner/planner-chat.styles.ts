import { LinearGradient } from 'expo-linear-gradient';
import styled from 'styled-components/native';
import { alpha, type } from '@/styles/theme';

/** iMessage send blue, lit from above. White glyph sits on it in both modes. */
export const SEND_BLUE = ['#0A84FF', '#2E9BFF'] as const;

export const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.color.background.base};
`;

export const ComposerRow = styled.View`
  flex-direction: row;
  align-items: flex-end;
  padding-horizontal: ${({ theme }) => theme.layout.screenPadding}px;
  padding-top: 8px;
  gap: 8px;
`;

/** The pill that holds the text field. Grows upward as text wraps. */
export const Pill = styled.View`
  flex: 1;
  min-height: 52px;
  max-height: 132px;
  border-radius: 26px;
  background-color: ${({ theme }) => theme.color.fill.tertiary};
  border-width: ${({ theme }) => theme.size.hairline}px;
  border-color: ${({ theme }) => theme.color.border.hairline};
  justify-content: center;
  padding-horizontal: 18px;
  padding-vertical: 8px;
`;

export const Field = styled.TextInput`
  ${({ theme }) => type(theme, 'body')}
  color: ${({ theme }) => theme.color.content.primary};
  padding: 0px;
  margin: 0px;
`;

/** 44pt touch target around the 36pt send/stop circle. */
export const SendTouch = styled.Pressable`
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  opacity: ${({ disabled }) => (disabled ? 0.35 : 1)};
`;

export const SendCircle = styled(LinearGradient)`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
`;

/** 44pt touch target for the header restart action. */
export const HeaderTouch = styled.Pressable`
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
`;

export const HeaderCircle = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => alpha(theme.color.content.primary, 0.1)};
`;

export const OutOfDateBanner = styled.View`
  margin-horizontal: ${({ theme }) => theme.layout.screenPadding}px;
  margin-top: 8px;
  border-radius: 14px;
  padding: 12px 14px;
  background-color: ${({ theme }) => theme.color.status.warning.surface};
  border-width: ${({ theme }) => theme.size.hairline}px;
  border-color: ${({ theme }) => theme.color.status.warning.border};
`;

export const OutOfDateTitle = styled.Text`
  ${({ theme }) => type(theme, 'subheadline', { weight: '600' })}
  color: ${({ theme }) => theme.color.status.warning.content};
`;

export const OutOfDateBody = styled.Text`
  ${({ theme }) => type(theme, 'footnote')}
  color: ${({ theme }) => theme.color.status.warning.content};
  margin-top: 2px;
`;

export const EmptyWrap = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-horizontal: 48px;
  gap: 8px;
`;

export const EmptyTitle = styled.Text`
  ${({ theme }) => type(theme, 'title2', { weight: '600' })}
  color: ${({ theme }) => theme.color.content.primary};
  text-align: center;
`;

export const EmptyBody = styled.Text`
  ${({ theme }) => type(theme, 'body')}
  color: ${({ theme }) => theme.color.content.secondary};
  text-align: center;
`;

export const ItemColumn = styled.View`
  width: 100%;
`;

export const ProCaption = styled.Text`
  ${({ theme }) => type(theme, 'footnote')}
  color: ${({ theme }) => theme.color.content.tertiary};
  text-align: center;
  padding-top: 4px;
`;

export const NoticeTitle = styled.Text`
  ${({ theme }) => type(theme, 'headline')}
  color: ${({ theme }) => theme.color.content.primary};
`;

export const NoticeBody = styled.Text`
  ${({ theme }) => type(theme, 'subheadline')}
  color: ${({ theme }) => theme.color.content.secondary};
`;

export const NoticeBodyWrap = styled.View`
  gap: ${({ theme }) => theme.space.sm}px;
`;

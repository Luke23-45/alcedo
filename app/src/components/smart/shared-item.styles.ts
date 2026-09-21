import type { StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';

/**
 * Shared-item public landing chrome + content styles.
 *
 * The page mirrors the post-detail screen (Screen 2 of the feed redesign):
 * the same glass header, page insets, poster slot, caption, and the primary
 * gradient CTA. Only honest content renders here — a shared session or
 * program blueprint fetched from the public link carries no author, kudos,
 * or comments, so those post-detail pieces are deliberately absent.
 */

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

export const ContentScroll = styled(ScrollView)``;

/** The poster sits 8pt wider than the page inset, like the post detail. */
export const PosterWrap = styled.View`
  margin-top: 16px;
  margin-left: -8px;
  margin-right: -8px;
`;

export const Caption = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 14px;
  font-weight: ${({ theme }) => theme.weight.medium};
  line-height: 20px;
  color: ${({ theme }) => (theme.isDark ? '#F5F5F7' : '#1C1C1E')};
  margin-top: 12px;
`;

/** The landing's action row: the same slot as the post-detail action bar. */
export const ActionRow = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-top: 16px;
`;

export const PrimaryButton = styled.Pressable`
  flex: 1;
  height: 54px;
  border-radius: 27px;
  overflow: hidden;
  align-items: center;
  justify-content: center;
`;

export const SecondaryButton = styled.Pressable`
  flex: 1;
  height: 54px;
  border-radius: 27px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${({ theme }) => theme.color.border.hairline};
  background-color: ${({ theme }) => theme.color.fill.secondary};
`;

export const PrimaryLabel = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 16px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.3px;
  color: #ffffff;
`;

export const SecondaryLabel = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 16px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.3px;
  color: ${({ theme }) => theme.color.content.primary};
`;

/** Absolute overlay fill for LinearGradient layers (RN-only prop). */
export const fill: StyleProp<ViewStyle> = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};

export const CtaGloss = styled(LinearGradient)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 50%;
  opacity: 0.35;
`;

export const CtaEdge = styled.View`
  position: absolute;
  left: 0.5px;
  right: 0.5px;
  top: 0.5px;
  bottom: 0.5px;
  border-radius: 26.5px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.22);
`;

export const BreakdownWrap = styled.View`
  margin-top: 16px;
`;

export const ProgramName = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 22px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.4px;
  color: ${({ theme }) => theme.color.content.primary};
  margin-top: 8px;
`;

export const ProgramMeta = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 14px;
  font-weight: ${({ theme }) => theme.weight.medium};
  color: ${({ theme }) => theme.color.content.secondary};
  margin-top: 4px;
`;

export const SaveWrap = styled.View`
  margin-top: 16px;
`;

export const SectionTitle = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 15px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.color.content.primary};
  margin-top: 24px;
  margin-bottom: 12px;
`;

export const SessionName = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 17px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.3px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const SessionMeta = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 13px;
  font-weight: ${({ theme }) => theme.weight.medium};
  color: ${({ theme }) => theme.color.content.secondary};
  margin-top: 2px;
  margin-bottom: 4px;
`;

export const ExerciseRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-top: 10px;
`;

export const ExerciseName = styled.Text`
  flex: 1;
  flex-shrink: 1;
  font-family: ${({ theme }) => theme.font.text};
  font-size: 14px;
  font-weight: ${({ theme }) => theme.weight.regular};
  color: ${({ theme }) => theme.color.content.primary};
`;

export const ExerciseSummary = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 14px;
  font-weight: ${({ theme }) => theme.weight.regular};
  color: ${({ theme }) => theme.color.content.secondary};
  text-align: right;
  max-width: 50%;
  flex-shrink: 0;
`;

export const FallbackWrap = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

export const FallbackText = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 14px;
  font-weight: ${({ theme }) => theme.weight.medium};
  color: ${({ theme }) => theme.color.content.secondary};
  text-align: center;
`;

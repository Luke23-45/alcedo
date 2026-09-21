import styled from 'styled-components/native';

export const AttachRow = styled.View`
  flex-direction: row;
  margin-top: 12px;
  padding-left: 16px;
  padding-right: 16px;
`;

/**
 * 48pt pill. Photo and Location are deliberately omitted: expo-image-picker
 * is not installed and no location model exists, and a fake button is worse
 * than a missing one.
 */
export const AttachPill = styled.Pressable`
  width: 112px;
  height: 48px;
  border-radius: 24px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(120, 120, 128, 0.12)')};
  border-width: 0.9px;
  border-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(120, 120, 128, 0.2)')};
`;

export const AttachLabel = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 12px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.15px;
  color: ${({ theme }) => (theme.isDark ? '#C7C7CC' : '#3C3C43')};
`;

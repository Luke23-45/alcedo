import styled from 'styled-components/native';

export const AuthorRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding-left: 26px;
  padding-right: 16px;
  margin-top: 12px;
`;

export const AvatarSlot = styled.View`
  width: 36px;
  height: 36px;
`;

export const AuthorText = styled.View`
  margin-left: 12px;
  justify-content: center;
  gap: 4px;
`;

export const AuthorName = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 14px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.25px;
  color: ${({ theme }) => (theme.isDark ? '#FFFFFF' : '#1C1C1E')};
`;

export const AudiencePill = styled.Pressable`
  flex-direction: row;
  align-items: center;
  height: 22px;
  border-radius: 11px;
  padding-left: 10px;
  padding-right: 8px;
  gap: 4px;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(120, 120, 128, 0.12)')};
  border-width: 0.8px;
  border-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.09)' : 'rgba(120, 120, 128, 0.2)')};
`;

export const AudienceLabel = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 11px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.1px;
  color: ${({ theme }) => (theme.isDark ? '#C7C7CC' : '#3C3C43')};
`;

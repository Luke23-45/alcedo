import styled from 'styled-components/native';

export const Section = styled.View`
  margin-top: 30px;
`;

export const SectionHeader = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 9px;
  font-weight: ${({ theme }) => theme.weight.bold};
  letter-spacing: 1.2px;
  color: ${({ theme }) => (theme.isDark ? '#86868B' : '#8E8E93')};
  padding-left: 24px;
`;

export const ChipRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  padding-left: 16px;
  padding-right: 16px;
  margin-top: 10px;
`;

export const TagChip = styled.Pressable`
  height: 28px;
  border-radius: 14px;
  flex-direction: row;
  align-items: center;
  padding-left: 6px;
  padding-right: 10px;
  gap: 6px;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(120, 120, 128, 0.12)')};
  border-width: 0.8px;
  border-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.09)' : 'rgba(120, 120, 128, 0.2)')};
`;

export const AvatarSlot = styled.View`
  width: 18px;
  height: 18px;
`;

export const TagName = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 11px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.1px;
  color: ${({ theme }) => (theme.isDark ? '#F5F5F7' : '#1C1C1E')};
`;

/** Dashed "+ Add" chip — visually an action, not an entity. */
export const AddChip = styled.Pressable`
  height: 28px;
  border-radius: 14px;
  flex-direction: row;
  align-items: center;
  padding-left: 10px;
  padding-right: 12px;
  gap: 6px;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.045)' : 'rgba(120, 120, 128, 0.08)')};
  border-width: 1px;
  border-style: dashed;
  border-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(120, 120, 128, 0.25)')};
`;

export const AddLabel = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 11px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.1px;
  color: #ffb84d;
`;

import styled from 'styled-components/native';

export const AuthorRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const AuthorText = styled.View`
  flex: 1;
  margin-left: 12px;
  justify-content: center;
`;

export const NameRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Name = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 15px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.3px;
  color: ${({ theme }) => (theme.isDark ? '#FFFFFF' : '#1C1C1E')};
`;

export const BadgeSlot = styled.View`
  margin-left: 6px;
`;

export const Subline = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 11.5px;
  font-weight: ${({ theme }) => theme.weight.medium};
  color: ${({ theme }) => (theme.isDark ? '#86868B' : '#8E8E93')};
  margin-top: 3px;
`;

/** Full-bleed poster slot: the spec draws it at 16pt page margins (x16..377). */
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

export const Meta = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 11px;
  font-weight: ${({ theme }) => theme.weight.medium};
  color: ${({ theme }) => (theme.isDark ? '#6C6C70' : '#8E8E93')};
  margin-top: 12px;
`;

/** Hairline between the meta and the kudos row, at 16pt page margins. */
export const Divider = styled.View`
  height: 0.67px;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255,255,255,0.08)' : theme.color.border.hairline)};
  margin-top: 10px;
  margin-left: -8px;
  margin-right: -8px;
`;

export const KudosRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 12px;
`;

export const KudosLabel = styled.Text`
  flex: 1;
  font-family: ${({ theme }) => theme.font.text};
  font-size: 12.5px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.2px;
  color: ${({ theme }) => (theme.isDark ? '#FFFFFF' : '#1C1C1E')};
  margin-left: 10px;
`;

export const KudosCount = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 11.5px;
  font-weight: ${({ theme }) => theme.weight.medium};
  color: ${({ theme }) => (theme.isDark ? '#86868B' : '#8E8E93')};
  margin-right: 12px;
`;

/** Action pills at 16pt page margins (x16..377), per the spec. */
export const ActionBarWrap = styled.View`
  margin-top: 12px;
  margin-left: -8px;
  margin-right: -8px;
`;

export const ThreadWrap = styled.View`
  margin-top: 4px;
  padding-right: 12px;
`;

export const Footer = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 10.5px;
  font-weight: ${({ theme }) => theme.weight.medium};
  color: ${({ theme }) => (theme.isDark ? '#48484A' : '#8E8E93')};
  text-align: center;
  margin-top: 8px;
  margin-bottom: 8px;
`;

import styled from 'styled-components/native';

export const SessionPage = styled.View`
  padding-horizontal: 16px;
  padding-top: 12px;
  padding-bottom: 120px;
  gap: 12px;
`;

export const SessionCard = styled.View`
  border-radius: 24px;
  border-width: 0.9px;
  padding: 16px;
  gap: 12px;
  ${({ theme }) =>
    theme.isDark
      ? `
          background-color: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.08);
        `
      : `
          background-color: rgba(255, 255, 255, 0.7);
          border-color: rgba(0, 0, 0, 0.06);
        `}
`;

export const SessionField = styled.TextInput`
  border-radius: 14px;
  border-width: 0.9px;
  padding-horizontal: 14px;
  min-height: 48px;
  font-size: 14px;
  color: ${({ theme }) => theme.color.content.primary};
  ${({ theme }) =>
    theme.isDark
      ? `
          background-color: rgba(0, 0, 0, 0.35);
          border-color: rgba(255, 255, 255, 0.06);
        `
      : `
          background-color: rgba(0, 0, 0, 0.03);
          border-color: rgba(0, 0, 0, 0.08);
        `}
`;

export const FieldLabel = styled.Text`
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.2px;
  color: ${({ theme }) => (theme.isDark ? '#86868B' : '#8E8E93')};
`;

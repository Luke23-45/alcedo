import styled from 'styled-components/native';

export const ProgramsPage = styled.View`
  padding-horizontal: 16px;
  padding-top: 12px;
  padding-bottom: 32px;
  gap: 12px;
`;

export const SortRow = styled.View`
  flex-direction: row;
  justify-content: flex-end;
`;

export const ButtonRow = styled.View`
  flex-direction: row;
  gap: 13px;
`;

export const ActionButton = styled.View<{ $kind: 'neutral' | 'amber' }>`
  flex: 1;
  height: 48px;
  border-radius: 24px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-width: 1px;
  ${({ theme, $kind }) =>
    $kind === 'amber'
      ? `
          background-color: rgba(255, 159, 10, 0.14);
          border-color: rgba(255, 159, 10, 0.3);
        `
      : theme.isDark
        ? `
            background-color: rgba(255, 255, 255, 0.07);
            border-color: rgba(255, 255, 255, 0.1);
          `
        : `
            background-color: rgba(0, 0, 0, 0.04);
            border-color: rgba(0, 0, 0, 0.08);
          `}
`;

export const ActionLabel = styled.Text<{ $kind: 'neutral' | 'amber' }>`
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: ${({ theme, $kind }) => ($kind === 'amber' ? '#FFB84D' : theme.color.content.primary)};
`;

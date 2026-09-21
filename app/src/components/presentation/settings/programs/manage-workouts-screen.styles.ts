import styled from 'styled-components/native';

export const ManagePage = styled.View`
  padding-horizontal: 16px;
  padding-top: 12px;
  padding-bottom: 120px;
  gap: 12px;
`;

export const NameField = styled.TextInput`
  border-radius: 16px;
  border-width: 0.9px;
  padding-horizontal: 16px;
  min-height: 52px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.3px;
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

export const SessionRow = styled.View``;

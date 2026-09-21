import styled from 'styled-components/native';

/* ── Card variant: tri-split thirds ─────────────────────────────── */

export const CardRow = styled.View`
  flex-direction: row;
`;

export const CardCell = styled.Pressable`
  flex: 1;
  min-height: 44px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

export const CardCount = styled.Text<{ $kudoed: boolean }>`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 11.5px;
  font-weight: ${({ theme, $kudoed }) => ($kudoed ? theme.weight.bold : theme.weight.semibold)};
  color: ${({ theme, $kudoed }) =>
    $kudoed ? (theme.isDark ? '#FF6A88' : '#D70015') : theme.isDark ? '#98989F' : '#6E6E73'};
`;

/* ── Detail variant: three pills ────────────────────────────────── */

export const DetailRow = styled.View`
  flex-direction: row;
  gap: 8px;
`;

export const Pill = styled.Pressable`
  width: 115px;
  height: 48px;
  border-radius: 24px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(120, 120, 128, 0.12)')};
`;

export const PillLabel = styled.Text<{ $kudoed: boolean }>`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 12.5px;
  font-weight: ${({ theme, $kudoed }) => ($kudoed ? theme.weight.bold : theme.weight.semibold)};
  color: ${({ theme, $kudoed }) =>
    $kudoed ? (theme.isDark ? '#FF6A88' : '#D70015') : theme.isDark ? '#C7C7CC' : '#3C3C43'};
`;

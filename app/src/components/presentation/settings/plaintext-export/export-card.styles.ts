import { LinearGradient } from 'expo-linear-gradient';
import styled, { css } from 'styled-components/native';
import { type as typeStyle } from '@/styles/theme';

/**
 * Plaintext-export card chrome: 1px gradient edge, diagonal 3-stop body,
 * dy10/blur14 black .5 shadow (backup-redesign.md S4). The danger variant
 * edges the card in red for "What's not in the file"; the warning variant
 * tints amber for the plaintext health-data note.
 */

export type ExportCardVariant = 'default' | 'danger' | 'warning';

export const CardEdge = styled(LinearGradient)<{ $radius: number }>`
  border-radius: ${({ $radius }) => $radius + 1}px;
  padding: 1px;
  margin-horizontal: 16px;
`;

export const CardBody = styled(LinearGradient)<{ $radius: number }>`
  border-radius: ${({ $radius }) => $radius}px;
  overflow: hidden;
  shadow-color: #000;
  shadow-offset: 0px 10px;
  shadow-opacity: 0.5;
  shadow-radius: 14px;
  elevation: 8;
`;

export const CardTint = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 159, 10, 0.08);
`;

export const CardInner = styled.View`
  padding: 20px;
`;

/** Uppercase micro section label above each card (S4: 9/700, tracking +1.2). */
export const SectionLabel = styled.Text<{ $tone?: 'secondary' | 'danger' }>`
  ${({ theme }) => typeStyle(theme, 'caption2', { weight: '700' })}
  ${({ theme, $tone }) =>
    css`
      color: ${$tone === 'danger'
        ? theme.color.status.danger.base
        : theme.color.content.secondary};
    `}
  text-transform: uppercase;
  letter-spacing: 1.2px;
  margin-left: 24px;
  margin-bottom: 8px;
`;

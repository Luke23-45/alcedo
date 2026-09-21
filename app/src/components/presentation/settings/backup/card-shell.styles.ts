import { LinearGradient } from 'expo-linear-gradient';
import styled from 'styled-components/native';

/**
 * Backup-screen card chrome: x16 w361, 1px gradient edge, diagonal 3-stop body,
 * dy10/blur14 black .5 shadow (settings-dark.md Screen 6). Radius is 28 for
 * the backup/storage/what's-new cards, 26 for the about card. Colors are
 * supplied by the <CardShell> wrapper in card-shell.tsx.
 */
export const BackupCardEdgeBase = styled(LinearGradient)<{ $radius: number }>`
  border-radius: ${({ $radius }) => $radius + 1}px;
  padding: 1px;
  margin-horizontal: 16px;
`;

export const BackupCardBodyBase = styled(LinearGradient)<{ $radius: number }>`
  border-radius: ${({ $radius }) => $radius}px;
  overflow: hidden;
  shadow-color: #000;
  shadow-offset: 0px 10px;
  shadow-opacity: 0.5;
  shadow-radius: 14px;
  elevation: 8;
`;

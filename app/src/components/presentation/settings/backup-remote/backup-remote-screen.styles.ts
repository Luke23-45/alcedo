import styled from 'styled-components/native';

// Remote backup screen scroll content: caption, destination, last tested,
// honest notes — the floating footer (Test / Manage backends) rides
// FullHeightScrollView's floatingChildren so it stays on screen.
export const BackupRemoteContent = styled.View`
  padding-top: 16px;
  padding-bottom: 28px;
`;

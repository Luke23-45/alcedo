import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { type as typeStyle } from '@/styles/theme';

// iCloud backup card (settings-dark.md Screen 6): x16 w361 h232 rx28.

// Header: title x36, subtitle below, toggle x313 (44×26, vertically centered
// on the title line per the SVG's y159).
export const BackupHeader = styled.View`
  flex-direction: row;
  align-items: center;
  padding-top: 18px;
  padding-bottom: 14px;
  padding-left: 20px;
  padding-right: 14px;
`;

export const BackupHeaderText = styled.View`
  flex: 1;
  gap: 5px;
`;

export const BackupTitle = styled.Text`
  ${({ theme }) => typeStyle(theme, 'footnote', { weight: '600' })}
  font-size: 13.5px;
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const BackupSubtitle = styled.Text`
  ${({ theme }) => typeStyle(theme, 'caption2', { weight: '500' })}
  font-size: 10.5px;
  color: #86868b;
`;

// Full-bleed separators for the backup cards: x36→x357 (margin 20/20).
export const BackupSeparator = styled.View`
  height: ${StyleSheet.hairlineWidth}px;
  margin-left: 20px;
  margin-right: 20px;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(60,60,67,0.12)')};
`;

// Backup mode segmented control: full-bleed with 20pt margins (x36→x357),
// matching the CTA and separators.
export const ModeSegmentWrap = styled.View`
  margin-top: 2px;
  margin-horizontal: 20px;
`;

export const ModeHintText = styled.Text`
  ${({ theme }) => typeStyle(theme, 'caption2', { weight: '500' })}
  color: #86868b;
  margin-top: 10px;
  margin-bottom: 6px;
  margin-horizontal: 20px;
`;

// Destination row: 52pt, title x36 13.5/600, value 12.5/500 #98989F, chevron.
export const DestinationRow = styled.Pressable`
  min-height: 52px;
  flex-direction: row;
  align-items: center;
  padding-left: 20px;
  padding-right: 14px;
`;

export const DestinationRowTitle = styled.Text`
  flex: 1;
  ${({ theme }) => typeStyle(theme, 'footnote', { weight: '600' })}
  font-size: 13.5px;
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const DestinationRowValue = styled.Text`
  ${({ theme }) => typeStyle(theme, 'footnote', { weight: '500' })}
  font-size: 12.5px;
  color: #98989f;
  margin-right: 6px;
  flex-shrink: 1;
`;

// Back Up Now: x36 w321 h50 rx25. Brand gradient, gloss top half, white .22
// edge, #FF2D55 .5 dy7/blur12 shadow (settings-dark.md Screen 6).
export const BackupCtaWrap = styled.View`
  margin-top: 12px;
  margin-horizontal: 20px;
`;

export const BackupCtaBase = styled(LinearGradient)<{ $disabled: boolean }>`
  height: 50px;
  border-radius: 25px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.22);
  align-items: center;
  justify-content: center;
  overflow: hidden;
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  shadow-color: #ff2d55;
  shadow-offset: 0px 7px;
  shadow-opacity: 0.5;
  shadow-radius: 12px;
  elevation: 6;
`;

export const BackupCtaGlossBase = styled(LinearGradient)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 25px;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
`;

export const BackupCtaText = styled.Text`
  ${({ theme }) => typeStyle(theme, 'subheadline', { weight: '600' })}
  font-size: 15px;
  letter-spacing: -0.3px;
  color: #ffffff;
`;

// Honest disabled hint linking to destination setup.
export const BackupHint = styled.Pressable`
  min-height: 44px;
  align-items: center;
  justify-content: center;
  padding-horizontal: 24px;
`;

export const BackupHintText = styled.Text`
  ${({ theme }) => typeStyle(theme, 'caption2', { weight: '500' })}
  color: #86868b;
  text-align: center;
`;

// Restore from Backup…: 13/600 #FF6B60 dark / #D70015 light, centered red text
// (not a button).
export const RestoreLink = styled.Pressable`
  min-height: 44px;
  align-items: center;
  justify-content: center;
  padding-bottom: 8px;
`;

export const RestoreLinkText = styled.Text`
  ${({ theme }) => typeStyle(theme, 'footnote', { weight: '600' })}
  letter-spacing: -0.2px;
  color: ${({ theme }) => (theme.isDark ? '#FF6B60' : '#D70015')};
`;

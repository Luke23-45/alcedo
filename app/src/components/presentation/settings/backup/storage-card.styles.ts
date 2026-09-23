import styled from 'styled-components/native';
import { type as typeStyle } from '@/styles/theme';

// Storage card (settings-dark.md Screen 6): x16 w361 rx28. Header, exact-
// proportion bar, legend, export rows.

// Header: "Storage used" 13.5/600 x36; "1.4 GB" 15/700 right x357.
export const StorageHeader = styled.View`
  flex-direction: row;
  align-items: baseline;
  padding-top: 20px;
  padding-bottom: 14px;
  padding-left: 20px;
  padding-right: 20px;
`;

export const StorageTitle = styled.Text`
  flex: 1;
  ${({ theme }) => typeStyle(theme, 'footnote', { weight: '600' })}
  font-size: 13.5px;
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const StorageTotal = styled.Text`
  ${({ theme }) => typeStyle(theme, 'subheadline', { weight: '700' })}
  font-size: 15px;
  letter-spacing: -0.35px;
  color: ${({ theme }) => theme.color.content.primary};
`;

// Bar: x36 w321 h10 rx5; track white .07 dark / #787880 .12 light.
export const StorageBarTrack = styled.View`
  height: 10px;
  margin-horizontal: 20px;
  border-radius: 5px;
  overflow: hidden;
  flex-direction: row;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255,255,255,0.07)' : 'rgba(120,120,128,0.12)')};
`;

// Exact spec proportions of the 321pt bar: 9.6 / 252.3 / 59.1.
// The 3% iCloud sliver is never inflated.
export const StorageSegment = styled.View<{ $flex: number; $color: string }>`
  flex: ${({ $flex }) => $flex};
  background-color: ${({ $color }) => $color};
`;

// Legend rows: 44pt; dot r5; title 13/600; sub 10.5/500 #86868B;
// value 12.5/600 right.
export const LegendRow = styled.View`
  min-height: 44px;
  flex-direction: row;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
`;

export const LegendDot = styled.View<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${({ $color }) => $color};
  margin-right: 16px;
`;

export const LegendText = styled.View`
  flex: 1;
  gap: 3px;
`;

export const LegendTitle = styled.Text`
  ${({ theme }) => typeStyle(theme, 'footnote', { weight: '600' })}
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const LegendSub = styled.Text`
  ${({ theme }) => typeStyle(theme, 'caption2', { weight: '500' })}
  font-size: 10.5px;
  color: #86868b;
`;

export const LegendValue = styled.Text`
  ${({ theme }) => typeStyle(theme, 'footnote', { weight: '600' })}
  font-size: 12.5px;
  color: ${({ theme }) => theme.color.content.primary};
`;

// Export rows: 54pt; title x36 13.5/600; value 12/500 #98989F; chevron.
export const ExportRow = styled.Pressable`
  min-height: 54px;
  flex-direction: row;
  align-items: center;
  padding-left: 20px;
  padding-right: 14px;
`;

export const ExportRowStatic = styled.View`
  min-height: 54px;
  flex-direction: row;
  align-items: center;
  padding-left: 20px;
  padding-right: 14px;
`;

export const ExportRowText = styled.View`
  flex: 1;
  gap: 3px;
`;

export const ExportRowTitle = styled.Text`
  ${({ theme }) => typeStyle(theme, 'footnote', { weight: '600' })}
  font-size: 13.5px;
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const ExportRowSubtitle = styled.Text`
  ${({ theme }) => typeStyle(theme, 'caption2', { weight: '500' })}
  font-size: 10.5px;
  color: #86868b;
`;

export const ExportRowValue = styled.Text`
  ${({ theme }) => typeStyle(theme, 'caption1', { weight: '500' })}
  color: #98989f;
  margin-right: 6px;
`;

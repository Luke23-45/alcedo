import styled from 'styled-components/native';
import { type StyleProp, type ViewStyle } from 'react-native';

/** Must match PAD_X in progress-chart.tsx: the plot's horizontal inset. */
const PAD_X = 4;

export const ChartInner = styled.View`
  padding-top: 16px;
  padding-bottom: 14px;
`;

/* Segmented control -------------------------------------------------- */

export const SegmentTrack = styled.View`
  flex-direction: row;
  height: 32px;
  margin-horizontal: 20px;
  border-radius: 16px;
  background-color: ${({ theme }) =>
    theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(120,120,128,0.12)'};
`;

export const SegmentThumb = styled.View<{ $left: number; $width: number }>`
  position: absolute;
  left: ${({ $left }) => $left}px;
  top: 2px;
  width: ${({ $width }) => $width}px;
  height: 28px;
  border-radius: 14px;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255,255,255,0.13)' : '#FFFFFF')};
  ${({ theme }) =>
    theme.isDark
      ? 'border-width: 0.8px; border-color: rgba(255,255,255,0.12);'
      : `
        shadow-color: #000000;
        shadow-offset: 0px 1px;
        shadow-opacity: 0.18;
        shadow-radius: 3px;
        elevation: 2;
      `}
`;

export const segmentHit: StyleProp<ViewStyle> = {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1,
};

export const SegmentLabel = styled.Text<{ $selected: boolean }>`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 11.5px;
  line-height: 14px;
  font-weight: ${({ theme, $selected }) => ($selected ? theme.weight.semibold : theme.weight.medium)};
  letter-spacing: -0.15px;
  color: ${({ theme, $selected }) =>
    $selected ? theme.color.content.primary : theme.color.content.secondary};
`;

/* Headings ------------------------------------------------------------ */

export const ChartTitle = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 15.5px;
  line-height: 20px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.3px;
  color: ${({ theme }) => theme.color.content.primary};
  margin-top: 12px;
  margin-horizontal: 20px;
`;

export const ChartSubtitle = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 11px;
  line-height: 14px;
  font-weight: ${({ theme }) => theme.weight.medium};
  color: ${({ theme }) => theme.color.content.secondary};
  margin-top: 3px;
  margin-horizontal: 20px;
`;

export const SvgWrap = styled.View`
  margin-top: 7px;
  margin-horizontal: 20px;
`;

export const DeltaText = styled.Text<{ $color: string }>`
  font-weight: ${({ theme }) => theme.weight.bold};
  color: ${({ $color }) => $color};
`;

/* X labels ------------------------------------------------------------- */

/* X labels: first sits under the first data point, middle is centered, last is
   end-anchored under the final point — matching the reference exactly. */
export const XLabels = styled.View`
  position: relative;
  margin-top: 8px;
  margin-horizontal: 20px;
  height: 12px;
`;

const XLabelBase = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 9px;
  line-height: 12px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: 0.2px;
  color: ${({ theme }) => (theme.isDark ? '#6C6C70' : '#8E8E93')};
`;

export const XLabelStart = styled(XLabelBase)`
  position: absolute;
  left: ${PAD_X}px;
  top: 0;
`;

export const XLabelMid = styled(XLabelBase)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  text-align: center;
`;

export const XLabelEnd = styled(XLabelBase)<{ $current?: boolean }>`
  position: absolute;
  right: 0;
  top: 0;
  color: ${({ theme }) => (theme.isDark ? '#98989F' : '#AEAEB2')};
`;

export const Divider = styled.View`
  height: 1px;
  margin-top: 8px;
  margin-horizontal: 20px;
  background-color: ${({ theme }) =>
    theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(60,60,67,0.10)'};
`;

export const Footer = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 10.5px;
  line-height: 13px;
  font-weight: ${({ theme }) => theme.weight.medium};
  color: ${({ theme }) => (theme.isDark ? '#6C6C70' : '#8E8E93')};
  margin-top: 9px;
  margin-horizontal: 20px;
`;

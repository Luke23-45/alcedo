/**
 * Pixel-spec color tokens for the Trends overview, measured off
 * docs/new_design/trends-dark.md. Dark values are the reference;
 * light values follow the spec's light-mode delta table.
 */
export interface TrendsPalette {
  primary: string;
  /** Row names on cards (#F5F5F7 in dark). */
  name: string;
  secondary: string;
  dim: string;
  tertiary: string;
  quaternary: string;
  chartGrid: string;
  nodeHalo: string;
  lineStart: string;
  lineEnd: string;
  /** Chart area fill starts at this opacity. */
  areaOpacity: number;
  heatBase: string;
  heatRest: string;
  heatOpacities: readonly [number, number, number, number, number];
  targetBand: string;
  undertrained: string;
  insightBox: string;
  insightBorder: string;
  insightText: string;
  insightSub: string;
  segmentedTrack: string;
  segmentedThumb: string;
  segmentedThumbBorder: string;
  deltaUp: string;
  deltaUpBg: string;
  deltaDown: string;
  deltaDownBg: string;
  deltaNeutral: string;
  deltaNeutralBg: string;
  gold: string;
  goldDeep: string;
  goldBg: string;
  calendarIcon: string;
}

export function trendsPalette(dark: boolean): TrendsPalette {
  return dark
    ? {
        primary: '#FFFFFF',
        name: '#F5F5F7',
        secondary: '#86868B',
        dim: '#98989F',
        tertiary: '#6C6C70',
        quaternary: '#48484A',
        chartGrid: 'rgba(255,255,255,0.05)',
        nodeHalo: '#131316',
        lineStart: '#FF9F0A',
        lineEnd: '#FF2D55',
        areaOpacity: 0.36,
        heatBase: '#30D158',
        heatRest: 'rgba(255,255,255,0.05)',
        heatOpacities: [0.05, 0.25, 0.45, 0.68, 0.95],
        targetBand: 'rgba(255,255,255,0.11)',
        undertrained: '#FF9F0A',
        insightBox: 'rgba(255,159,10,0.10)',
        insightBorder: 'rgba(255,159,10,0.22)',
        insightText: '#FFD8A8',
        insightSub: '#C9A47A',
        segmentedTrack: 'rgba(255,255,255,0.06)',
        segmentedThumb: 'rgba(255,255,255,0.13)',
        segmentedThumbBorder: 'rgba(255,255,255,0.12)',
        deltaUp: '#4ADE80',
        deltaUpBg: 'rgba(48,209,88,0.15)',
        deltaDown: '#FF6A88',
        deltaDownBg: 'rgba(255,45,85,0.15)',
        deltaNeutral: '#5EDCF0',
        deltaNeutralBg: 'rgba(94,220,240,0.14)',
        gold: '#FFD84D',
        goldDeep: '#5C4300',
        goldBg: 'rgba(255,214,10,0.16)',
        calendarIcon: '#C7C7CC',
      }
    : {
        primary: '#000000',
        name: '#1C1C1E',
        secondary: '#6C6C70',
        dim: '#8E8E93',
        tertiary: '#AEAEB2',
        quaternary: '#D1D1D6',
        chartGrid: 'rgba(60,60,67,0.10)',
        nodeHalo: '#FFFFFF',
        lineStart: '#E07800',
        lineEnd: '#D70015',
        areaOpacity: 0.2,
        heatBase: '#248A3D',
        heatRest: 'rgba(36,138,61,0.08)',
        heatOpacities: [0.08, 0.28, 0.48, 0.7, 0.95],
        targetBand: 'rgba(120,120,128,0.20)',
        undertrained: '#E07800',
        insightBox: 'rgba(255,149,0,0.12)',
        insightBorder: 'rgba(255,149,0,0.28)',
        insightText: '#8A4B00',
        insightSub: 'rgba(138,75,0,0.78)',
        segmentedTrack: 'rgba(120,120,128,0.12)',
        segmentedThumb: '#FFFFFF',
        segmentedThumbBorder: 'rgba(0,0,0,0.04)',
        deltaUp: '#248A3D',
        deltaUpBg: 'rgba(36,138,61,0.14)',
        deltaDown: '#D70015',
        deltaDownBg: 'rgba(215,0,21,0.10)',
        deltaNeutral: '#0E7C8C',
        deltaNeutralBg: 'rgba(14,124,140,0.12)',
        gold: '#FFD84D',
        goldDeep: '#5C4300',
        goldBg: 'rgba(255,214,10,0.22)',
        calendarIcon: '#6C6C70',
      };
}

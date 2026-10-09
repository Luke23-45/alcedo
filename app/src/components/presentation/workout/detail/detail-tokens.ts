/**
 * Detail page color tokens and palette extensions over sessionPalette.
 *
 * Ground truth:
 * - Extends sessionPalette(isDark), never forks it (P4.0a, README §8).
 * - Light deltas follow the spec light table (docs/new_design/workout-flow-dark.md lines 941-953).
 * - Keep-or-align decisions recorded here per the SX04 precedent:
 *   1. Brand gradient: kept identical in both modes per W10b decision.
 *   2. Done-ring green (#7BE000 → #D6FF52): kept identical in both modes (one green in the app).
 *   3. Rest-timer ring progress: dark #009DFF → #2CE9F7, light #0089CE → #17C8E8 (spec line 943).
 *   4. Sparkline line: dark #FF9F0A → #FF2D55, light #E07800 → #D70015 (spec line 947).
 *   5. Sparkline dashed guide: dark rgba(255,255,255,0.18), light rgba(60,60,67,0.18) (spec line 949).
 *   6. Set check fill: dark #30D158, light #34C759 (spec line 944).
 *   7. Failure check tint: #FF3B30 (dark) / #FF453A (light).
 *   8. Warm-up badge / tile: amber #FF9F0A at 16% fill, solid #FF9F0A label.
 */

import { sessionPalette, SessionPalette } from '@/components/presentation/workout/session/session-tokens';

export interface DetailPalette extends SessionPalette {
  detail: {
    aura: {
      idle: string;
      ready: string;
      resting: string;
      restReady: string;
      paused: string;
      complete: string;
    };
    restRing: {
      from: string;
      to: string;
      track: string;
      doneFrom: string;
      doneTo: string;
    };
    hero: {
      cardBg: string;
      cardBorder: string;
      metricValue: string;
      metricLabel: string;
      deltaText: string;
      readyChipBg: string;
      readyChipText: string;
      pausedChipBg: string;
      pausedChipText: string;
    };
    setRow: {
      minHeight: number;
      stepperBg: string;
      stepperBorder: string;
      stepperText: string;
      warmUpTileBg: string;
      warmUpTileText: string;
      warmUpBadge: string;
      failureCheck: string;
      targetRange: string;
      rpePillBg: string;
      rpePillBorder: string;
      effortBarTrack: string;
      effortBarFill: string;
      e1rmText: string;
    };
    vsLastTime: {
      rowBg: string;
      positive: string;
      negative: string;
      neutral: string;
      arrowUp: string;
      arrowDown: string;
    };
    progression: {
      chipBg: string;
      chipBorder: string;
      chipText: string;
      increaseText: string;
      holdText: string;
      easeText: string;
    };
    history: {
      chartLineFrom: string;
      chartLineTo: string;
      guideDashed: string;
      dotFill: string;
      dotBestRing: string;
    };
  };
}

export function detailPalette(isDark: boolean): DetailPalette {
  const base = sessionPalette(isDark);

  return {
    ...base,
    detail: {
      aura: {
        idle: isDark ? 'rgba(10,132,255,0.14)' : 'rgba(0,122,255,0.12)',
        ready: isDark ? 'rgba(255,45,85,0.16)' : 'rgba(255,45,85,0.12)',
        resting: isDark ? 'rgba(0,217,233,0.15)' : 'rgba(23,200,232,0.12)',
        restReady: isDark ? 'rgba(48,209,88,0.16)' : 'rgba(52,199,89,0.13)',
        paused: isDark ? 'rgba(255,159,10,0.16)' : 'rgba(255,149,0,0.12)',
        complete: isDark ? 'rgba(48,209,88,0.18)' : 'rgba(52,199,89,0.14)',
      },
      restRing: {
        // Spec line 943: dark #009DFF→#2CE9F7, light #0089CE→#17C8E8
        from: isDark ? '#009DFF' : '#0089CE',
        to: isDark ? '#2CE9F7' : '#17C8E8',
        track: isDark ? '#00D9E9' : '#17C8E8',
        // Done ring: unified single green across the app
        doneFrom: '#7BE000',
        doneTo: '#D6FF52',
      },
      hero: {
        cardBg: isDark ? '#17171A' : '#FFFFFF',
        cardBorder: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
        metricValue: isDark ? '#FFFFFF' : '#1C1C1E',
        metricLabel: isDark ? '#8E8E93' : '#636366',
        deltaText: isDark ? '#98989F' : '#6C6C70',
        readyChipBg: isDark ? 'rgba(48,209,88,0.14)' : 'rgba(52,199,89,0.14)',
        readyChipText: isDark ? '#4ADE80' : '#248A3D',
        pausedChipBg: isDark ? 'rgba(255,159,10,0.16)' : 'rgba(255,149,0,0.14)',
        pausedChipText: isDark ? '#FF9F0A' : '#D97706',
      },
      setRow: {
        minHeight: 56,
        stepperBg: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
        stepperBorder: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)',
        stepperText: isDark ? '#FFFFFF' : '#1C1C1E',
        warmUpTileBg: isDark ? 'rgba(255,159,10,0.16)' : 'rgba(255,149,0,0.14)',
        warmUpTileText: isDark ? '#FF9F0A' : '#D97706',
        warmUpBadge: isDark ? '#FF9F0A' : '#D97706',
        failureCheck: isDark ? '#FF453A' : '#FF3B30',
        targetRange: isDark ? '#6C6C70' : '#8E8E93',
        rpePillBg: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
        rpePillBorder: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)',
        effortBarTrack: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
        effortBarFill: isDark ? '#FF9F0A' : '#FF9500',
        e1rmText: isDark ? '#8E8E93' : '#636366',
      },
      vsLastTime: {
        rowBg: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
        positive: isDark ? '#30D158' : '#34C759',
        negative: isDark ? '#FF453A' : '#FF3B30',
        neutral: isDark ? '#8E8E93' : '#636366',
        arrowUp: isDark ? '#30D158' : '#34C759',
        arrowDown: isDark ? '#FF453A' : '#FF3B30',
      },
      progression: {
        chipBg: isDark ? 'rgba(255,45,85,0.12)' : 'rgba(255,45,85,0.08)',
        chipBorder: isDark ? 'rgba(255,45,85,0.24)' : 'rgba(255,45,85,0.20)',
        chipText: isDark ? '#FF6A88' : '#D70015',
        increaseText: isDark ? '#30D158' : '#34C759',
        holdText: isDark ? '#8E8E93' : '#636366',
        easeText: isDark ? '#FF9F0A' : '#D97706',
      },
      history: {
        // Spec line 947: dark #FF9F0A→#FF2D55, light #E07800→#D70015
        chartLineFrom: isDark ? '#FF9F0A' : '#E07800',
        chartLineTo: isDark ? '#FF2D55' : '#D70015',
        // Spec line 949: dark white 18%, light #3C3C43 @ 10%
        guideDashed: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(60,60,67,0.18)',
        dotFill: isDark ? '#FFFFFF' : '#1C1C1E',
        dotBestRing: '#FFD60A',
      },
    },
  };
}

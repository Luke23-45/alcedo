/**
 * Color tokens for the Active Session screens, taken from the workout-flow
 * reference (iOS system grays). All values are explicit per mode — no
 * translucency math against theme surfaces, so the match is exact.
 */
export function sessionPalette(isDark: boolean) {
  return {
    nav: {
      chevron: '#8E8E93',
      title: isDark ? '#FFFFFF' : '#1C1C1E',
      dots: '#8E8E93',
    },
    elapsed: {
      label: isDark ? '#86868B' : '#8E8E93',
      value: isDark ? '#F5F5F7' : '#1C1C1E',
      /** Spec: #FF3B30 at 16% (dark) — the live pill fill, not the dot hue. */
      livePill: isDark ? 'rgba(255,59,48,0.16)' : 'rgba(255,59,48,0.12)',
      liveDot: isDark ? '#FF453A' : '#FF3B30',
      liveText: isDark ? '#FF6B60' : '#FF3B30',
    },
    stats: {
      value: isDark ? '#FFFFFF' : '#1C1C1E',
      suffix: isDark ? '#6C6C70' : '#AEAEB2',
      label: isDark ? '#86868B' : '#8E8E93',
      divider: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
      dimValue: isDark ? '#48484A' : '#AEAEB2',
      dimLabel: isDark ? '#6C6C70' : '#AEAEB2',
    },
    header: {
      title: isDark ? '#86868B' : '#8E8E93',
      count: isDark ? '#6C6C70' : '#AEAEB2',
    },
    card: {
      indexTile: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
      indexNumber: '#8E8E93',
      name: isDark ? '#FFFFFF' : '#1C1C1E',
      /** Complete-exercise name: a half-step dimmer than the in-progress name. */
      nameDone: isDark ? '#F5F5F7' : '#1C1C1E',
      dots: '#8E8E93',
      divider: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
      chipDoneBg: isDark ? 'rgba(48,209,88,0.13)' : 'rgba(52,199,89,0.14)',
      chipDoneText: isDark ? '#4ADE80' : '#248A3D',
      chipProgressBg: isDark ? 'rgba(255,45,85,0.15)' : 'rgba(255,45,85,0.12)',
      chipProgressText: isDark ? '#FF6A88' : '#D70015',
      setTileDoneBg: isDark ? 'rgba(48,209,88,0.14)' : 'rgba(52,199,89,0.14)',
      setTileDoneText: isDark ? '#4ADE80' : '#248A3D',
      setTileCurrentBg: isDark ? 'rgba(255,45,85,0.16)' : 'rgba(255,45,85,0.14)',
      setTileCurrentText: isDark ? '#FF6A88' : '#D70015',
      setTileUpcomingBg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
      setTileUpcomingText: isDark ? '#48484A' : '#AEAEB2',
      weightDone: isDark ? '#F5F5F7' : '#1C1C1E',
      weightCurrent: isDark ? '#FFFFFF' : '#1C1C1E',
      weightUpcoming: isDark ? '#6C6C70' : '#AEAEB2',
      prev: isDark ? '#6C6C70' : '#AEAEB2',
      target: isDark ? '#98989F' : '#8E8E93',
      checkDoneFill: isDark ? '#30D158' : '#34C759',
      checkRing: isDark ? '#FF375F' : '#FF2D55',
      checkFill: isDark ? 'rgba(255,45,85,0.18)' : 'rgba(255,45,85,0.14)',
      checkDot: isDark ? '#FF375F' : '#FF2D55',
      checkUpcomingRing: isDark ? 'rgba(255,255,255,0.14)' : 'rgba(120,120,128,0.24)',
      checkMark: '#FFFFFF',
      addPlus: '#8E8E93',
      addLabel: isDark ? '#98989F' : '#8E8E93',
      addChevron: isDark ? '#48484A' : '#AEAEB2',
    },
    footer: {
      gradientFrom: isDark ? 'rgba(21,21,26,0.94)' : 'rgba(242,242,247,0.94)',
      gradientTo: isDark ? 'rgba(12,12,16,0.99)' : 'rgba(228,228,234,0.99)',
      hairline: isDark ? 'rgba(255,255,255,0.11)' : 'rgba(0,0,0,0.10)',
      ringTrack: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
      ringDash: isDark ? '#48484A' : '#AEAEB2',
      idleLabel: isDark ? '#6C6C70' : '#8E8E93',
      idleSub: isDark ? '#6C6C70' : '#8E8E93',
      skipPill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
      skipBorder: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)',
      skipText: isDark ? '#48484A' : '#AEAEB2',
      finishDisabledBg: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(120,120,128,0.12)',
      finishDisabledBorder: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
      finishDisabledText: isDark ? '#48484A' : '#AEAEB2',
      hint: isDark ? '#48484A' : '#AEAEB2',
      /** Fade-to-background wash above the tab bar (44pt, spec `fd`). */
      fadeEnd: isDark ? 'rgba(5,5,7,0.92)' : 'rgba(243,243,248,0.92)',
    },
    empty: {
      outerFill: isDark ? 'rgba(255,255,255,0.028)' : 'rgba(0,0,0,0.03)',
      outerDash: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)',
      innerFill: isDark ? 'rgba(255,255,255,0.022)' : 'rgba(0,0,0,0.022)',
      bell: isDark ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.12)',
      title: isDark ? '#F5F5F7' : '#1C1C1E',
      body: isDark ? '#86868B' : '#8E8E93',
    },
    brand: {
      from: '#FFB03A',
      mid: '#FF6A3D',
      to: '#FF2D55',
      edge: 'rgba(255,255,255,0.22)',
      label: '#FFFFFF',
    },
  };
}

export type SessionPalette = ReturnType<typeof sessionPalette>;

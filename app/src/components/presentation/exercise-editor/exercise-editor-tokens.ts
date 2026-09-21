/**
 * Color tokens for the Exercise Editor, measured off
 * docs/new_design/exercise-editor-redesign.md (dark canvases S1–S6).
 * Light mode keeps identical geometry with iOS-standard token deltas.
 * All values are explicit per mode — no translucency math against theme
 * surfaces, so the match is exact. Consumed via `theme.isDark` in styled
 * templates; callers never pass a `$dark` prop.
 */
export function editorPalette(isDark: boolean) {
  return {
    text: {
      /** Primary values, names, inputs. */
      primary: isDark ? '#FFFFFF' : '#1C1C1E',
      /** Row labels. */
      secondary: isDark ? '#F5F5F7' : '#1C1C1E',
      /** Captions, micro-labels, placeholders' neighbors. */
      caption: isDark ? '#86868B' : '#8E8E93',
      /** Tertiary hints, HMS sub-labels. */
      tertiary: isDark ? '#6C6C70' : '#AEAEB2',
      /** Input placeholders. */
      placeholder: isDark ? '#636366' : '#AEAEB2',
    },
    /** Inset wells (name field, notes, link, unit steppers). */
    well: {
      fill: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
      stroke: isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.08)',
    },
    hairline: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    /** Steppers, segmented tracks, chips, thumb controls. */
    control: {
      fill: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
      stroke: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
      thumb: isDark ? 'rgba(255,255,255,0.14)' : '#FFFFFF',
      thumbStroke: isDark ? 'rgba(255,255,255,0.20)' : 'rgba(0,0,0,0.08)',
      track: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    },
    accent: {
      ember: '#FF6A3D',
      emberOnLight: '#E8542F',
      /** Stepper glyphs, swap icon, dirty dot, See-All-style amber. */
      amber: isDark ? '#FF9F0A' : '#C93400',
      green: isDark ? '#30D158' : '#34C759',
      red: isDark ? '#FF6B60' : '#FF3B30',
      cyan: isDark ? '#64D2FF' : '#0A84FF',
    },
    /** Selected resistance row well. */
    selectedWell: isDark ? 'rgba(255,106,61,0.10)' : 'rgba(232,84,47,0.08)',
    /** Expanded/active card edge stroke. */
    activeEdge: 'rgba(255,106,61,0.30)',
    /** Search-result tile accents cycle through these. */
    tileAccents: ['#FF6B60', '#5EB1EF', '#B48CF2', '#FFB340', '#4ADE80', '#5EDCF0'] as const,
    /** Radio outline when unselected. */
    radio: isDark ? '#48484A' : '#C7C7CC',
    /** Focus glow around the Add-mode search field. */
    focusGlow: isDark ? 'rgba(255,106,61,0.55)' : 'rgba(232,84,47,0.35)',
    /** Locked tracking toggle: dimmed ON green. */
    lockedToggle: isDark ? 'rgba(48,209,88,0.5)' : 'rgba(52,199,89,0.5)',
  };
}

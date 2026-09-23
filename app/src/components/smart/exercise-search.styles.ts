import styled, { css } from 'styled-components/native';
import { alpha, type as typeStyle } from '@/styles/theme';
import { HomeGradient } from '@/components/presentation/home/shared/home-gradient';

/* ------------------------------------------------------------------ *
 * ALCEDO reference, spec screen 5 (Add Exercise / Search), 393×852.
 * Dark values below; light mode adapts per the home-page token mapping
 * (white cards, black edge strokes, #1C1C1E / #8E8E93 / #AEAEB2 text).
 * ------------------------------------------------------------------ */

export const Screen = styled.View`
  flex: 1;
`;

export const AuraWrap = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

/* Search field · 310×38 rx12. Focused: 1.8pt brand-gradient border + glow. */
export const SearchRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding-horizontal: 16px;
  margin-top: 4px;
`;

// ES01: the spec's 310 is a max, not a fixed width — the field flexes into
// the row's remainder (307 on 393 EN, shrinking for DE/long locales) so 320
// never overflows. Cancel keeps its intrinsic width (see the route below).
export const SearchOuter = styled(HomeGradient).attrs({ variant: 'brand' as const })<{ $focused: boolean }>`
  flex-grow: 1;
  flex-shrink: 1;
  min-width: 0;
  max-width: 310px;
  height: 38px;
  border-radius: 12px;
  padding: 1.8px;
  ${({ $focused }) =>
    $focused
      ? css`
          shadow-color: #ff6a3d;
          shadow-offset: 0px 0px;
          shadow-opacity: 0.4;
          shadow-radius: 5px;
          elevation: 4;
        `
      : ''}
`;

/* Spec: icon cx at 37, placeholder text x at 56 — measured from the field's
 * outer edge, so the 1.8pt gradient border insets the inner origin by 1.8. */
export const SearchInner = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  border-radius: 10px;
  background-color: ${({ theme }) => (theme.isDark ? alpha('#FFFFFF', 0.08) : alpha('#000000', 0.06))};
  padding-left: 11px;
  padding-right: 12px;
`;

export const SearchInput = styled.TextInput`
  flex: 1;
  margin-left: 11px;
  padding: 0px;
  ${({ theme }) => typeStyle(theme, 'subheadline')}
  font-size: 15px;
  letter-spacing: -0.2px;
  color: ${({ theme }) => (theme.isDark ? '#FFFFFF' : '#1C1C1E')};
`;

export const CancelText = styled.Text`
  ${({ theme }) => typeStyle(theme, 'subheadline')}
  font-size: 15.5px;
  letter-spacing: -0.3px;
  color: ${({ theme }) => theme.home.seeAll};
`;

/* Filter chips · 28h pills, horizontally scrollable. */
export const ChipsScroll = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
})``;

export const Chip = styled.Pressable<{ $active: boolean }>`
  height: 28px;
  border-radius: 14px;
  padding-horizontal: 15px;
  justify-content: center;
  align-items: center;
  ${({ theme, $active }) =>
    $active
      ? theme.isDark
        ? css`
            background-color: #ffffff;
          `
        : css`
            /* White pill on a pale background needs the hairline edge, per the
               home light mapping (white surfaces get black edge strokes). */
            background-color: #ffffff;
            border-width: 0.8px;
            border-color: ${alpha('#000000', 0.09)};
          `
      : theme.isDark
        ? css`
            background-color: ${alpha('#FFFFFF', 0.07)};
            border-width: 0.8px;
            border-color: ${alpha('#FFFFFF', 0.09)};
          `
        : css`
            background-color: ${alpha('#000000', 0.05)};
            border-width: 0.8px;
            border-color: ${alpha('#000000', 0.09)};
          `}
`;

export const ChipText = styled.Text<{ $active: boolean }>`
  ${({ theme, $active }) => typeStyle(theme, 'caption1', { weight: $active ? '600' : '500' })}
  /* Spec: selected chip label is 650, unselected is 500 — but RN renders
     non-hundred weights as Regular, so 600 is the nearest representable. */
  letter-spacing: -0.15px;
  color: ${({ theme, $active }) => ($active ? '#1C1C1E' : theme.isDark ? '#C7C7CC' : '#8E8E93')};
`;

/* Sections */
export const Section = styled.View`
  margin-top: 22px;
  padding-horizontal: 16px;
`;

export const SectionHeaderRow = styled.View`
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
  padding-horizontal: 8px;
  margin-bottom: 10px;
`;

export const SectionLabel = styled.Text`
  ${({ theme }) => typeStyle(theme, 'caption2', { weight: '700' })}
  font-size: 10px;
  letter-spacing: 1.35px;
  color: ${({ theme }) => (theme.isDark ? '#86868B' : '#8E8E93')};
`;

export const ClearText = styled.Text`
  ${({ theme }) => typeStyle(theme, 'caption2', { weight: '600' })}
  font-size: 11px;
  letter-spacing: -0.1px;
  color: #8e8e93;
`;

export const RowsList = styled.View`
  gap: 8px;
`;

/* Exercise row · 361×52 rx18 (HomeCard). The pressable is an explicit 50pt
 * so the body is exactly 52 − 2×1pt edge, never collapsing to content.
 * Spec: tile x=30 (pad-left 14), text x=74, add-button cx=349 (pad-right 13). */
export const RowPressable = styled.Pressable`
  min-height: 50px;
  flex-direction: row;
  align-items: center;
  padding-left: 14px;
  padding-right: 13px;
`;

export const IconTile = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 11px;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

export const RowTexts = styled.View`
  flex: 1;
  justify-content: center;
`;

export const RowName = styled.Text`
  ${({ theme }) => typeStyle(theme, 'footnote', { weight: '600' })}
  font-size: 14px;
  letter-spacing: -0.2px;
  line-height: 17px;
  color: ${({ theme }) => (theme.isDark ? '#FFFFFF' : '#1C1C1E')};
`;

export const RowSub = styled.Text`
  ${({ theme }) => typeStyle(theme, 'caption2', { weight: '500' })}
  font-size: 10.5px;
  line-height: 13px;
  margin-top: 3px;
  color: ${({ theme }) => (theme.isDark ? '#86868B' : '#8E8E93')};
`;

export const AddButton = styled.Pressable`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  border-width: 0.8px;
  background-color: ${alpha('#FF2D55', 0.16)};
  border-color: ${alpha('#FF2D55', 0.22)};
`;

/* Create-custom · dashed 361×52 rx18 row */
export const CreateWrap = styled.View`
  padding-horizontal: 16px;
  margin-top: 8px;
`;

/* Spec: circle cx=46 (pad-left 15), text x=74 (circle margin-right 13),
 * chevron cx=359 (pad-right 13). */
export const CreateRow = styled.Pressable`
  height: 52px;
  border-radius: 18px;
  border-width: 1px;
  border-style: dashed;
  border-color: ${({ theme }) => (theme.isDark ? alpha('#FFFFFF', 0.14) : alpha('#000000', 0.18))};
  background-color: ${({ theme }) => (theme.isDark ? alpha('#FFFFFF', 0.045) : alpha('#000000', 0.03))};
  flex-direction: row;
  align-items: center;
  padding-left: 15px;
  padding-right: 13px;
`;

export const CreateCircle = styled(HomeGradient).attrs({ variant: 'brand' as const })`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  margin-right: 13px;
`;

export const CreateTexts = styled.View`
  flex: 1;
  justify-content: center;
`;

export const CreateTitle = styled.Text`
  ${({ theme }) => typeStyle(theme, 'footnote', { weight: '600' })}
  font-size: 14px;
  letter-spacing: -0.2px;
  line-height: 17px;
  color: ${({ theme }) => (theme.isDark ? '#FFFFFF' : '#1C1C1E')};
`;

export const CreateSub = styled.Text`
  ${({ theme }) => typeStyle(theme, 'caption2', { weight: '500' })}
  font-size: 10.5px;
  line-height: 13px;
  margin-top: 3px;
  color: ${({ theme }) => (theme.isDark ? '#86868B' : '#8E8E93')};
`;

/* Neutral empty state (never shaming, never guilt-shaped). */
export const EmptyWrap = styled.View`
  padding: 40px 32px;
  align-items: center;
`;

export const EmptyTitle = styled.Text`
  ${({ theme }) => typeStyle(theme, 'subheadline', { weight: '600' })}
  font-size: 15px;
  letter-spacing: -0.2px;
  text-align: center;
  color: ${({ theme }) => (theme.isDark ? '#F5F5F7' : '#1C1C1E')};
`;

export const EmptySub = styled.Text`
  ${({ theme }) => typeStyle(theme, 'footnote')}
  text-align: center;
  margin-top: 6px;
  color: ${({ theme }) => (theme.isDark ? '#86868B' : '#8E8E93')};
`;

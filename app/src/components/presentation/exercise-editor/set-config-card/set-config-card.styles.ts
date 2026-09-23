import styled from 'styled-components/native';
import { type as typeHelper } from '@/styles/theme';
import { editorPalette } from '../exercise-editor-tokens';

/** The reference insets card content 12pt (16 card + 16 inner). */
export const ConfigPad = styled.View`
  padding: 12px;
`;

export const SectionGap = styled.View`
  height: 12px;
`;

export const ConfigRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 4px;
  padding-right: 4px;
  padding-top: 8px;
  padding-bottom: 8px;
  min-height: 44px;
`;

export const RowTextColumn = styled.View`
  flex: 1;
  padding-right: 12px;
  gap: 2px;
`;

/** Caption stacked under the row label ("Same target every set"). */
export const RowCaptionUnder = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 10.5px;
  line-height: 14px;
  font-weight: 500;
  color: ${({ theme }) => editorPalette(theme.isDark).text.caption};
`;

/** Inline caption beside the "Sets" label in per-set mode. */
export const RowInlineCaption = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 10.5px;
  line-height: 14px;
  font-weight: 500;
  color: ${({ theme }) => editorPalette(theme.isDark).text.caption};
`;

export const SetGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  padding-top: 8px;
  margin-left: -4px;
  margin-right: -4px;
`;

/** Reference cell: 104×52, rx 14, white .05 fill, white .07 @.8 stroke. */
export const SetCell = styled.View`
  width: 33.3333%;
  padding-left: 4px;
  padding-right: 4px;
  padding-bottom: 8px;
`;

export const SetCellInner = styled.View`
  height: 52px;
  border-radius: 14px;
  border-curve: continuous;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(120,120,128,0.08)')};
  border-width: 0.8px;
  border-color: ${({ theme }) => (theme.isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)')};
  padding-left: 12px;
  padding-right: 8px;
  padding-top: 6px;
`;

export const SetCellLabel = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 9px;
  line-height: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  color: ${({ theme }) => editorPalette(theme.isDark).text.caption};
`;

export const SetCellStepper = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const TailCaption = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 10.5px;
  line-height: 14px;
  font-weight: 500;
  color: ${({ theme }) => editorPalette(theme.isDark).text.tertiary};
  padding-left: 4px;
  padding-top: 4px;
`;

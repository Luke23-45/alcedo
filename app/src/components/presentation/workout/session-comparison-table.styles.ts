import styled from 'styled-components/native';

export const Title = styled.Text`
  font-size: 15.5px;
  line-height: 20px;
  font-weight: 600;
  letter-spacing: -0.3px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const Subtitle = styled.Text`
  margin-top: 2px;
  font-size: 11px;
  line-height: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.content.secondary};
`;

const cellMetric = `
  flex: 1;
  text-align: left;
`;

const cellPrev = `
  width: 76px;
  text-align: right;
`;

const cellToday = `
  width: 60px;
  text-align: right;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
  padding-bottom: 8px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.color.border.hairline};
`;

export const HeaderMetric = styled.Text`
  ${cellMetric}
  font-size: 8.5px;
  line-height: 11px;
  font-weight: 700;
  letter-spacing: 0.8px;
  color: ${({ theme }) => theme.color.content.tertiary};
`;

export const HeaderPrev = styled.Text`
  ${cellPrev}
  font-size: 8.5px;
  line-height: 11px;
  font-weight: 700;
  letter-spacing: 0.8px;
  color: ${({ theme }) => theme.color.content.tertiary};
`;

export const HeaderToday = styled.Text`
  ${cellToday}
  font-size: 8.5px;
  line-height: 11px;
  font-weight: 700;
  letter-spacing: 0.8px;
  color: ${({ theme }) => theme.color.content.tertiary};
`;

export const HeaderDelta = styled.Text`
  width: 49px;
  text-align: right;
  font-size: 8.5px;
  line-height: 11px;
  font-weight: 700;
  letter-spacing: 0.8px;
  color: ${({ theme }) => theme.color.content.tertiary};
`;

export const DataRow = styled.View<{ $last: boolean }>`
  flex-direction: row;
  align-items: center;
  height: 28px;
  border-bottom-width: ${({ $last }) => ($last ? 0 : 1)}px;
  border-bottom-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)')};
`;

export const Metric = styled.Text`
  ${cellMetric}
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.content.secondary};
`;

export const Prev = styled.Text`
  ${cellPrev}
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.content.tertiary};
`;

export const Today = styled.Text`
  ${cellToday}
  font-size: 12px;
  line-height: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const DeltaCell = styled.View`
  width: 49px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

/**
 * Trend chevron: the reference floats it in the gutter between the TODAY
 * column (ends x=308) and the Δ text — centered at x=317 for wide deltas,
 * nudged to x=333 for a narrow delta like "+2" so it still hugs the text.
 * Absolutely positioned so the delta text width never moves it.
 */
export const DeltaChevron = styled.View<{ $left: number }>`
  position: absolute;
  left: ${({ $left }) => $left}px;
  top: 9.5px;
`;

export const Delta = styled.Text<{ $positive: boolean; $negative: boolean }>`
  font-size: 11px;
  line-height: 14px;
  font-weight: 700;
  color: ${({ theme, $positive }) => ($positive ? theme.home.delta : '#8e8e93')};
`;

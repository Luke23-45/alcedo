import { AppTheme } from '@/styles/theme';
import { BarChartPropsType, CurveType, LineChartPropsType } from 'react-native-gifted-charts';

export const lineGraphProps = (theme: AppTheme, width: number, numberOfPoints: number): LineChartPropsType => {
  const calculatedSpacing = numberOfPoints > 1 ? width / (numberOfPoints - 1) - 50 / numberOfPoints : 1;
  const spacing = Math.max(calculatedSpacing, 50);
  return {
    focusEnabled: true,
    textColor: theme.color.content.primary,
    xAxisColor: 'transparent',
    yAxisColor: 'transparent',
    xAxisIndicesColor: theme.color.graph.axis,
    yAxisIndicesColor: theme.color.graph.axis,
    thickness: 3,
    curved: true,
    curveType: CurveType.CUBIC,
    curvature: 0.1,
    hideYAxisText: false,
    rulesColor: theme.color.graph.grid,
    rulesLength: width - 30,
    rulesType: 'solid',
    hideRules: false,
    scrollToEnd: true,
    extrapolateMissingValues: false,
    width: width - 30,
    spacing,
    referenceLine1Config: {
      width: width - 30,
      color: theme.color.interactive.tint,
      labelTextStyle: { color: theme.color.content.primary },
    },
    xAxisLabelTextStyle: {
      color: theme.color.content.primary,
    },
    yAxisTextStyle: {
      color: theme.color.content.primary,
    },
  };
};

export const verticalBarChartProps = (theme: AppTheme, width: number): BarChartPropsType => {
  return {
    barBorderRadius: 2,
    xAxisColor: 'transparent',
    yAxisColor: 'transparent',
    xAxisIndicesColor: theme.color.graph.axis,
    yAxisIndicesColor: theme.color.graph.axis,
    hideYAxisText: false,
    rulesColor: theme.color.graph.grid,
    rulesLength: width - 30,
    rulesType: 'solid',
    hideRules: false,
    scrollToEnd: true,
    width: width - 30,
    xAxisLabelTextStyle: {
      color: theme.color.content.primary,
    },
    referenceLine1Config: {
      width: width - 30,
      color: theme.color.interactive.tint,
      labelTextStyle: { color: theme.color.content.primary },
    },
    yAxisTextStyle: {
      color: theme.color.content.primary,
    },
  };
};

import { Path, Svg } from 'react-native-svg';
import { useTranslate } from '@tolgee/react';
import { useDispatch } from 'react-redux';
import { fontWeight } from '@/styles/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { HomeText } from '@/components/presentation/home/shared/home-text';
import { exportPlainText } from '@/store/settings';
import { trendsPalette } from '../trends-colors';
import { ExportButton } from './export-health-data.styles';

/**
 * Export Health Data: a 52pt pill button dispatching the existing
 * exportPlainText({ format: 'CSV' }) action, which the settings store's
 * effects route through the platform file export/share service.
 */
export function ExportHealthData() {
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const theme = useAppTheme();
  const dark = theme.isDark;
  const palette = trendsPalette(dark);

  return (
    <ExportButton
      $dark={dark}
      accessibilityRole="button"
      accessibilityLabel={t('trends.export.accessibility')}
      onPress={() => dispatch(exportPlainText({ format: 'CSV' }))}
    >
      <Svg width={17} height={17} viewBox="-10 -10.5 20 20">
        <Path
          d="M-6.4 -1.4 H-7.6 A1.8 1.8 0 0 0 -9.4 .4 V7 A1.8 1.8 0 0 0 -7.6 8.8 H7.6 A1.8 1.8 0 0 0 9.4 7 V.4 A1.8 1.8 0 0 0 7.6 -1.4 H6.4"
          fill="none"
          stroke={dark ? '#C7C7CC' : '#8E8E93'}
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M0 -9.6 V3.4"
          fill="none"
          stroke={dark ? '#C7C7CC' : '#8E8E93'}
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M-4.2 -5.4 L0 -9.6 L4.2 -5.4"
          fill="none"
          stroke={dark ? '#C7C7CC' : '#8E8E93'}
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
      <HomeText
        weight={fontWeight.semibold}
        tracking={-0.25}
        style={{
          fontSize: 15,
          lineHeight: 19,
          marginLeft: 11,
          color: palette.name,
        }}
      >
        {t('trends.export.title')}
      </HomeText>
    </ExportButton>
  );
}

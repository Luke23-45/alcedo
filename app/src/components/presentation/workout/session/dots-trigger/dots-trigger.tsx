import { useAppTheme } from '@/hooks/useAppTheme';
import { useTranslate } from '@tolgee/react';
import Svg, { Circle } from 'react-native-svg';
import { DotsPressable, DotsSvgColor } from './dots-trigger.styles';

/**
 * The reference's plain three-dot trigger (⋯) for native menus —
 * three #8E8E93 dots, 2pt radius, 7pt apart, on a 44pt target.
 */
export function DotsTrigger({ onPress, testID }: { onPress: () => void; testID?: string }) {
  const { isDark } = useAppTheme();
  const { t } = useTranslate();
  const color = DotsSvgColor(isDark);

  return (
    <DotsPressable
      onPress={onPress}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={t('generic.more_options.label')}
    >
      {/* +1pt optical: the reference's rightmost dot sits at x=373. */}
      <Svg width={24} height={8} viewBox="0 0 24 8" style={{ marginLeft: 1 }}>
        <Circle cx={5} cy={4} r={2} fill={color} />
        <Circle cx={12} cy={4} r={2} fill={color} />
        <Circle cx={19} cy={4} r={2} fill={color} />
      </Svg>
    </DotsPressable>
  );
}

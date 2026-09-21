import { shortFormatWeightUnit, Weight } from '@/models/weight';
import { localeFormatBigNumber } from '@/utils/locale-bignumber';
import { useTranslate } from '@tolgee/react';
import { Text, TextStyle } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { type as typeHelper, type TextStyleName } from '@/styles/theme';

type LegacyFontChoice = 'text-2xs' | 'text-xs' | 'text-sm' | 'text-base' | 'text-lg' | 'text-xl' | 'text-2xl' | 'text-3xl' | 'text-4xl';

const legacyToVariant: Record<LegacyFontChoice, TextStyleName> = {
  'text-2xs': 'caption2',
  'text-xs': 'caption1',
  'text-sm': 'footnote',
  'text-base': 'body',
  'text-lg': 'callout',
  'text-xl': 'title3',
  'text-2xl': 'title2',
  'text-3xl': 'title1',
  'text-4xl': 'metricL',
};

interface WeightFormatProps {
  weight: Weight | undefined;
  usesBodyweight?: boolean;
  fontSize?: LegacyFontChoice;
  variant?: TextStyleName;
  color?: string;
  fontWeight?: TextStyle['fontWeight'];
  decimalPlaces?: number;
}

export default function WeightFormat(props: WeightFormatProps) {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const value = props.weight?.value.decimalPlaces(props.decimalPlaces ?? 4);

  const variant = props.variant ?? (props.fontSize ? legacyToVariant[props.fontSize] : undefined);
  const baseType = variant ? typeHelper(theme, variant) : undefined;

  const resolveColor = (c: string | undefined) => {
    if (!c || c === 'onSurface') return theme.color.content.primary;
    if (c === 'onSurfaceVariant') return theme.color.content.secondary;
    if (c === 'primary') return theme.color.interactive.tint;
    return theme.color.content.primary;
  };

  const style = {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    color: resolveColor(props.color),
    fontWeight: props.fontWeight,
    ...(baseType ?? {}),
  } as const;

  if (props.usesBodyweight) {
    const label = t('exercise.short_bodyweight.label');
    if (!value || value.isZero()) {
      return <Text style={style}>{label}</Text>;
    }
    const sign = value.isGreaterThan(0) ? '+' : '';
    return (
      <Text style={style}>
        {label} {sign}
        {localeFormatBigNumber(value)} <Text style={{ fontSize: 12 }}>{shortFormatWeightUnit(props.weight?.unit)}</Text>
      </Text>
    );
  }

  const weightDisplay = localeFormatBigNumber(value) || '-';
  return (
    <Text style={style}>
      {weightDisplay} <Text style={{ fontSize: 12 }}>{shortFormatWeightUnit(props.weight?.unit)}</Text>
    </Text>
  );
}

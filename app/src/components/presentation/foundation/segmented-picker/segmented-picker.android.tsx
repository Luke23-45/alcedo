import { SegmentedPickerProps, SegmentedPickerValue } from './segmented-picker-props';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Host, Icon, Row, Text, ToggleButton } from '@expo/ui/jetpack-compose';
import { fillMaxWidth, testID as testIDModifier, weight } from '@expo/ui/jetpack-compose/modifiers';

export default function SegmentedPicker<T extends SegmentedPickerValue>({
  value,
  options,
  onChange,
  enabled = true,
  equalWidth = true,
}: SegmentedPickerProps<T>) {
  const theme = useAppTheme();

  return (
    <Host
      matchContents={{ vertical: true }}
      style={{ width: '100%' }}
      seedColor={theme.color.interactive.tint}
      colorScheme={theme.mode}
    >
      <Row horizontalArrangement={{ spacedBy: theme.space.xs }} modifiers={[fillMaxWidth()]}>
        {options.map((option) => {
          const checked = option.value === value;
          return (
            <ToggleButton
              key={String(option.value)}
              checked={checked}
              enabled={enabled}
              onCheckedChange={(isChecked) => {
                if (isChecked) {
                  onChange(option.value);
                }
              }}
              modifiers={[
                ...(equalWidth ? [weight(1)] : []),
                ...(option.testID ? [testIDModifier(option.testID)] : []),
              ]}
            >
              <Row horizontalArrangement={{ spacedBy: theme.space.sm }} verticalAlignment="center">
                {option.icon !== undefined && <Icon source={option.icon} size={18} />}
                <Text>{option.label}</Text>
              </Row>
            </ToggleButton>
          );
        })}
      </Row>
    </Host>
  );
}

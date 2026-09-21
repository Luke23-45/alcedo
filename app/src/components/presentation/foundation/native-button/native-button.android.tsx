import { NativeButtonProps, NativeButtonVariant } from './native-button-props';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Button, FilledTonalButton, Host, Icon, OutlinedButton, Row, Text, TextButton } from '@expo/ui/jetpack-compose';

const buttonForVariant = {
  filled: Button,
  tonal: FilledTonalButton,
  outlined: OutlinedButton,
  text: TextButton,
} satisfies Record<NativeButtonVariant, unknown>;

export default function NativeButton({ label, onPress, icon, variant = 'filled', disabled, style }: NativeButtonProps) {
  const theme = useAppTheme();
  const MaterialButton = buttonForVariant[variant];

  return (
    <Host matchContents seedColor={theme.color.interactive.tint} style={style} colorScheme={theme.mode}>
      <MaterialButton onClick={onPress} enabled={!disabled}>
        <Row horizontalArrangement={{ spacedBy: theme.space.sm }} verticalAlignment="center">
          {icon !== undefined && <Icon source={icon} size={18} />}
          <Text>{label}</Text>
        </Row>
      </MaterialButton>
    </Host>
  );
}

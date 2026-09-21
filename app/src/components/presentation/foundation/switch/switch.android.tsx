import { SwitchProps } from './switch-props';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Host, Switch as NativeSwitch } from '@expo/ui/jetpack-compose';

export function Switch(props: SwitchProps) {
  const theme = useAppTheme();
  return (
    <Host matchContents style={{ marginBlock: -14 }} seedColor={theme.color.interactive.tint} colorScheme={theme.mode}>
      <NativeSwitch value={props.value} onCheckedChange={props.onValueChange} enabled={!props.disabled} />
    </Host>
  );
}

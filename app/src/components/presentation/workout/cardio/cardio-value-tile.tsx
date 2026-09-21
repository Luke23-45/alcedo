import Button from '@/components/presentation/foundation/button';
import { useAppTheme } from '@/hooks/useAppTheme';
import { type as typeHelper } from '@/styles/theme';
import { T } from '@tolgee/react';
import { ReactNode, useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { Portal, Dialog, Text } from 'react-native-paper';
import TouchableRipple from '@/components/presentation/foundation/touchable-ripple';

const emptyDisplay = '-';

type CardioValueTileProps<T> = {
  value: T | undefined;
  format: (value: T) => string;
  label: string;
  dialogStyle?: ViewStyle;
  testID?: string;
} & (
  | {
      isReadonly: true;
      /** Seeds the editor when an empty tile is opened. */
      emptyValue?: T;
      onSave?: (value: T) => void;
      children?: (value: T, setValue: (value: T) => void) => ReactNode;
    }
  | {
      isReadonly?: false;
      emptyValue: T;
      onSave: (value: T) => void;
      children: (value: T, setValue: (value: T) => void) => ReactNode;
    }
);

export function CardioValueTile<T>({
  value,
  emptyValue,
  format,
  label,
  onSave,
  children,
  dialogStyle,
  testID,
  isReadonly,
}: CardioValueTileProps<T>) {
  const theme = useAppTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogValue, setDialogValue] = useState<T | undefined>(value ?? emptyValue);
  const filled = value !== undefined;

  const valueType = typeHelper(theme, 'title3', { tabular: true });
  const labelType = typeHelper(theme, 'caption1');

  const face = (
    <View style={{ alignItems: 'center' }}>
      <Text
        style={[
          styles.value,
          valueType,
          { color: filled ? theme.color.content.primary : theme.color.content.tertiary },
        ]}
      >
        {filled ? format(value) : emptyDisplay}
      </Text>
      <Text style={[styles.label, labelType, { color: theme.color.content.secondary }]}>{label}</Text>
    </View>
  );
  const tileStyle = [
    styles.tile,
    {
      backgroundColor: filled ? theme.color.fill.secondary : theme.color.fill.quaternary,
      minWidth: 80,
      paddingHorizontal: theme.space.md,
      paddingVertical: theme.space.sm,
    },
  ];

  // The seed colour is the user's and can land anywhere on the wheel, so filled and empty are
  // separated by a tonal step rather than by hue.
  return (
    <View style={{ borderRadius: theme.radius.md, overflow: 'hidden' }}>
      {isReadonly ? (
        <View testID={testID} style={tileStyle}>
          {face}
        </View>
      ) : (
        <TouchableRipple
          testID={testID}
          onPress={() => {
            setDialogValue(value ?? emptyValue);
            setDialogOpen(true);
          }}
          style={tileStyle}
        >
          {face}
        </TouchableRipple>
      )}
      {dialogOpen && dialogValue !== undefined && (
        <Portal>
          <KeyboardAvoidingView behavior={'height'} style={{ flex: 1, pointerEvents: 'box-none' }}>
            <Dialog visible={dialogOpen} onDismiss={() => setDialogOpen(false)}>
              <Dialog.Title>{label}</Dialog.Title>
              <Dialog.Content style={[{ flexDirection: 'row', alignItems: 'center' }, dialogStyle]}>
                {children?.(dialogValue, setDialogValue)}
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setDialogOpen(false)}>
                  <T keyName="generic.cancel.button" />
                </Button>
                <Button
                  testID="cardio-value-save"
                  onPress={() => {
                    setDialogOpen(false);
                    onSave?.(dialogValue);
                  }}
                >
                  <T keyName="generic.save.button" />
                </Button>
              </Dialog.Actions>
            </Dialog>
          </KeyboardAvoidingView>
        </Portal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    textAlign: 'center',
  },
  label: {
    textAlign: 'center',
  },
});

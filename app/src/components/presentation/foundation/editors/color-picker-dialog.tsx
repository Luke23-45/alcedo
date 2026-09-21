import Button from '@/components/presentation/foundation/button';
import { ColorSliders } from '@/components/presentation/foundation/editors/color-sliders';
import { SurfaceText } from '@/components/presentation/foundation/surface-text';
import { useAppTheme } from '@/hooks/useAppTheme';
import { ColorSchemeSeed } from '@/store/settings';
import { type HexColor } from '@/utils/color';
import { T } from '@tolgee/react';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Dialog, Portal } from 'react-native-paper';

interface ColorPickerDialogProps {
  open: boolean;
  onClose: () => void;
  initialSeed: ColorSchemeSeed;
  onConfirm: (seed: HexColor) => void;
}

export default function ColorPickerDialog(props: ColorPickerDialogProps) {
  const theme = useAppTheme();
  const fallback = theme.color.interactive.tint as HexColor;
  const [draft, setDraft] = useState<HexColor>(props.initialSeed === 'default' ? fallback : props.initialSeed);

  useEffect(() => {
    if (props.open) {
      setDraft(props.initialSeed === 'default' ? fallback : props.initialSeed);
    }
    // Only reset when the dialog is (re)opened, not on every theme tick.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open]);

  if (!props.open) {
    return null;
  }

  return (
    <Portal>
      <Dialog visible={props.open} onDismiss={props.onClose}>
        <Dialog.Title>
          <T keyName="settings.theme.custom.title" />
        </Dialog.Title>
        <Dialog.Content>
          <View style={{ gap: theme.space.lg }}>
            <ColorSliders value={draft} onChange={setDraft} />
            <PalettePreview seed={draft} />
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={props.onClose} testID="color-picker-close">
            <T keyName="generic.close.button" />
          </Button>
          <Button
            testID="color-picker-save"
            onPress={() => {
              props.onConfirm(draft);
              props.onClose();
            }}
          >
            <T keyName="generic.save.button" />
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

/** Shows the palette the seed generates, so its effect is visible before committing. */
function PalettePreview({ seed }: { seed: HexColor }) {
  const theme = useAppTheme();
  const swatches = [
    seed,
    theme.color.interactive.tint,
    theme.color.interactive.accent,
    theme.palette.kingfisher[600],
    theme.palette.cobalt[600],
    theme.palette.turquoise[400],
  ];

  return (
    <View
      style={{
        backgroundColor: theme.color.background.secondary,
        borderRadius: theme.space.md,
        padding: theme.space.base,
        gap: theme.space.md,
      }}
    >
      <SurfaceText variant="footnote" weight="600" color={theme.color.content.secondary}>
        <T keyName="settings.theme.custom.preview" />
      </SurfaceText>
      <View style={{ flexDirection: 'row', gap: theme.space.sm }}>
        {swatches.map((color, i) => (
          <View
            key={i}
            style={{ flex: 1, height: theme.space.xxxl, borderRadius: theme.space.sm, backgroundColor: color }}
          />
        ))}
      </View>
    </View>
  );
}

import { PotentialSet } from '@/models/session-models';
import { formatRepsTarget, Resistance, RepsTarget } from '@/models/blueprint-models';
import { ReactNode } from 'react';
import { Text, View } from 'react-native';
import WeightFormat from '@/components/presentation/foundation/weight-format';
import { useAppTheme } from '@/hooks/useAppTheme';
import { alpha, type as typeHelper } from '@/styles/theme';
import TouchableRipple from '@/components/presentation/foundation/touchable-ripple';
import Icon from '@/components/presentation/foundation/icon';

export type PotentialSetSize = 'default' | 'compact';

interface PotentialSetDisplayProps {
  set: PotentialSet;
  repsTarget: RepsTarget;
  resistance: Resistance;
  previousRepCount?: number | undefined;
  size?: PotentialSetSize;

  /** Omit to render a static tile - a tile with no handler mounts no gesture detector at all. */
  onPressReps?: () => void;
  onPressWeight?: () => void;
}

const metrics = {
  default: {
    repsHeight: 60,
    minWidth: 60,
    maxWidth: undefined,
    repsVariant: 'title3' as const,
    targetVariant: 'footnote' as const,
    weightVariant: 'footnote' as const,
    weightPadding: 8,
  },
  compact: {
    repsHeight: 36,
    minWidth: 44,
    maxWidth: 64,
    repsVariant: 'callout' as const,
    targetVariant: 'caption1' as const,
    weightVariant: 'caption1' as const,
    weightPadding: 4,
  },
} as const;

/**
 * The two-tone set tile, without any of the editor's interactivity. Handlers are optional so a read-only
 * list can render many of these without paying for a `TouchableRipple` -- and its gesture detector -- per
 * tile.
 */
export function PotentialSetDisplay(props: PotentialSetDisplayProps) {
  const theme = useAppTheme();
  const size = metrics[props.size ?? 'default'];
  const repCountValue = props.set.set?.repsCompleted;
  const isFilled = repCountValue !== undefined;
  const showsWeight = props.resistance !== 'none';

  return (
    <View
      style={{
        minWidth: size.minWidth,
        maxWidth: size.maxWidth,
        flexGrow: size.maxWidth === undefined ? undefined : 1,
        flexBasis: size.maxWidth === undefined ? undefined : size.minWidth,
      }}
    >
      <View
        style={{
          borderRadius: theme.radius.md,
          // The weight row closes the tile off when there is one.
          borderBottomLeftRadius: showsWeight ? 0 : theme.radius.md,
          borderBottomRightRadius: showsWeight ? 0 : theme.radius.md,
          overflow: 'hidden',
        }}
      >
        <Pressable
          onPress={props.onPressReps}
          testID="repcount"
          style={{
            flexShrink: 0,
            height: size.repsHeight,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isFilled ? theme.color.interactive.tint : theme.color.fill.secondary,
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <Text
              style={{
                color: isFilled ? theme.color.content.onTint : theme.color.content.primary,
                ...(typeHelper(theme, size.repsVariant) as any),
              }}
            >
              <Text style={{ fontWeight: 'bold' }}>{repCountValue ?? '-'}</Text>
              <Text style={{ ...(typeHelper(theme, size.targetVariant) as any), verticalAlign: 'top' }}>
                /{formatRepsTarget(props.repsTarget)}
              </Text>
            </Text>
            {!isFilled && props.previousRepCount !== undefined && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                <Icon source={'history'} size={12} color={alpha(theme.color.content.primary, 0.6)} />
                <Text style={{ color: alpha(theme.color.content.primary, 0.6) }}>{props.previousRepCount}</Text>
              </View>
            )}
          </View>
        </Pressable>
      </View>
      {showsWeight && (
        <View
          style={{
            borderTopWidth: 1,
            borderColor: theme.color.border.hairline,
            backgroundColor: theme.color.background.elevated,
            borderBottomLeftRadius: theme.radius.md,
            borderBottomRightRadius: theme.radius.md,
            overflow: 'hidden',
            padding: size.weightPadding,
            width: '100%',
          }}
        >
          <Pressable
            onPress={props.onPressWeight}
            testID="repcount-weight"
            style={{
              alignItems: 'center',
              margin: -size.weightPadding,
              padding: size.weightPadding,
            }}
          >
            <Text style={{ color: theme.color.content.primary, ...(typeHelper(theme, size.weightVariant) as any) }}>
              <WeightFormat weight={props.set.weight} usesBodyweight={props.resistance === 'bodyweight'} />
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function Pressable(props: { onPress: (() => void) | undefined; style: object; testID: string; children: ReactNode }) {
  if (!props.onPress) {
    return (
      <View style={props.style} testID={props.testID}>
        {props.children}
      </View>
    );
  }
  return (
    <TouchableRipple style={props.style} onPress={props.onPress} testID={props.testID}>
      {props.children}
    </TouchableRipple>
  );
}

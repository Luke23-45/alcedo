import Icon from '@/components/presentation/foundation/icon';
import { AppIconSource } from '@/components/presentation/foundation/ms-icon-source';
import { useAppTheme } from '@/hooks/useAppTheme';
import { ReactNode } from 'react';
import { View } from 'react-native';
import { RowDivider, RowLabel, RowPressable, RowSupporting, RowText, RowView, Tile } from './onboarding-row.styles';
import { OnboardingTileKind, onboardingColors, onboardingTile } from './onboarding-tokens';

/**
 * A 58pt settings row from the onboarding mocks: 34pt tinted icon tile, label
 * (+ supporting line), a right-hand control, and a hairline divider inset to
 * the icon gutter. When `onToggle` is set the whole row toggles (switch rows);
 * otherwise the right control handles its own interaction.
 */
export function OnboardingRow(props: {
  tile: OnboardingTileKind;
  icon: AppIconSource;
  label: ReactNode;
  supportingText?: ReactNode;
  right?: ReactNode;
  divider?: boolean;
  onToggle?: () => void;
  toggled?: boolean;
  testID?: string;
}) {
  const theme = useAppTheme();
  const colors = onboardingColors(theme, 0);
  const tileSpec = onboardingTile(theme, props.tile);
  const divider = props.divider ?? true;

  const body = (
    <>
      <Tile $fill={tileSpec.tile}>
        <Icon size={20} source={props.icon} color={tileSpec.glyph} />
      </Tile>
      <RowText>
        <RowLabel>{props.label}</RowLabel>
        {props.supportingText ? (
          <RowSupporting $color={colors.supporting}>{props.supportingText}</RowSupporting>
        ) : undefined}
      </RowText>
      {props.right}
    </>
  );

  return (
    <View>
      {props.onToggle ? (
        <RowPressable
          onPress={props.onToggle}
          testID={props.testID}
          accessibilityRole="switch"
          accessibilityState={{ checked: props.toggled ?? false }}
        >
          {body}
        </RowPressable>
      ) : (
        <RowView testID={props.testID}>{body}</RowView>
      )}
      {divider ? <RowDivider $color={colors.divider} /> : undefined}
    </View>
  );
}

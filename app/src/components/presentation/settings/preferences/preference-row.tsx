import { ReactNode } from 'react';
import { RowTitle, RowSubtitle } from '../shared/grouped-settings-list.styles';
import * as S from './preference-row.styles';

interface PreferenceRowProps {
  title: string;
  subtitle?: string;
  /** Trailing control: toggle, value+chevron, segmented, chip. */
  trailing?: ReactNode;
  onPress?: () => void;
  testID?: string;
  accessibilityLabel?: string;
}

/**
 * A label row in a preference card: title (13.5/600) with an optional
 * subtitle, and a trailing control. Static when there is no onPress;
 * a pressable row when the whole row is the affordance.
 */
export function PreferenceRow({ title, subtitle, trailing, onPress, testID, accessibilityLabel }: PreferenceRowProps) {
  const body = (
    <>
      <S.RowText>
        <RowTitle numberOfLines={1}>{title}</RowTitle>
        {subtitle ? <RowSubtitle numberOfLines={2}>{subtitle}</RowSubtitle> : undefined}
      </S.RowText>
      {trailing ? <S.RowTrailing>{trailing}</S.RowTrailing> : undefined}
    </>
  );
  if (onPress) {
    return (
      <S.RowPressable
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? title}
        onPress={onPress}
      >
        {body}
      </S.RowPressable>
    );
  }
  return (
    <S.Row testID={testID} accessibilityRole="text">
      {body}
    </S.Row>
  );
}

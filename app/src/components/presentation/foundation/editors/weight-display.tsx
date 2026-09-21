import WeightDialog from '@/components/presentation/foundation/editors/weight-dialog';
import WeightFormat from '@/components/presentation/foundation/weight-format';
import { useAppTheme } from '@/hooks/useAppTheme';
import { type as typeHelper } from '@/styles/theme';
import { useTranslate } from '@tolgee/react';
import BigNumber from 'bignumber.js';
import { useState } from 'react';
import Button from '@/components/presentation/foundation/button';
import { Weight } from '@/models/weight';

type WeightDisplayProps = {
  increment: BigNumber;
  label?: string;
  isReadonly?: boolean;
  allowNegative?: boolean;
} & (
  | {
      allowNull: true;
      weight: Weight | undefined;
      updateWeight: (weight: Weight | undefined) => void;
    }
  | {
      allowNull?: false;
      weight: Weight;
      updateWeight: (weight: Weight) => void;
    }
);
export default function WeightDisplay(props: WeightDisplayProps) {
  const theme = useAppTheme();
  const { t } = useTranslate();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button
        testID="weight-display"
        mode="text"
        onPress={() => setDialogOpen(true)}
        labelStyle={{ ...typeHelper(theme, 'callout') }}
      >
        <WeightFormat weight={props.weight} color={'primary'} />
      </Button>
      {props.isReadonly ? null : (
        <WeightDialog
          open={dialogOpen}
          // oxlint-disable-next-line typescript/no-unnecessary-type-assertion
          weight={props.weight!}
          increment={props.increment}
          allowNegative={props.allowNegative}
          label={props.label ?? t('weight.weight.label')}
          allowNull={props.allowNull as false}
          updateWeight={props.updateWeight}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </>
  );
}

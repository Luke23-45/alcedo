import SegmentedPicker from '@/components/presentation/foundation/segmented-picker';
import { BackendKind } from '@/models/backend';
import * as S from './kind-section.styles';

/**
 * The native segmented server-type control with its explanatory copy.
 * Options arrive translated from the caller.
 */
export function KindSection(props: {
  value: BackendKind;
  options: { value: BackendKind; label: string }[];
  supportingText: string;
  onChange: (kind: BackendKind) => void;
}) {
  return (
    <S.Wrap>
      <SegmentedPicker value={props.value} options={props.options} onChange={props.onChange} />
      <S.Supporting>{props.supportingText}</S.Supporting>
    </S.Wrap>
  );
}

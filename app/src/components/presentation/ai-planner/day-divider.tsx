import * as S from './day-divider.styles';

/** The centered "Today" / "Yesterday" / date caption between day groups. */
export function DayDivider({ label }: { label: string }) {
  return (
    <S.Wrap>
      <S.Label>{label}</S.Label>
    </S.Wrap>
  );
}

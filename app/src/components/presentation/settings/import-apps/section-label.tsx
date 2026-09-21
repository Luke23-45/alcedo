import { ReactNode } from 'react';
import * as S from './section-label.styles';

/** S5 section micro-label ("LAST IMPORTED", "FORMAT", …) in spec typography. */
export function SectionLabel({ children }: { children: ReactNode }) {
  return <S.SectionLabelText>{children}</S.SectionLabelText>;
}

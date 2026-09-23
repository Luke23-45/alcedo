import { ReactNode } from 'react';
import { useAppSelector } from '@/store';
import { toGroupLabelCase } from '../shared/grouped-settings-list';
import * as S from './section-label.styles';

/**
 * S5 section micro-label ("LAST IMPORTED", "FORMAT", …) in spec typography,
 * cased in the app language (SH02 family).
 */
export function SectionLabel({ children }: { children: ReactNode }) {
  const locale = useAppSelector((s) => s.settings.preferredLanguage) ?? undefined;
  return (
    <S.SectionLabelText>
      {typeof children === 'string' ? toGroupLabelCase(children, locale) : children}
    </S.SectionLabelText>
  );
}

import { Children, Fragment, type ReactNode } from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useTranslate } from '@tolgee/react';
import type { ChangeView } from '../plan-diff-logic';
import * as S from './diff-review-card.styles';

/** 22px custom checkbox: green filled circle with a white check when on, quiet ring when off. */
function CheckGlyph({ checked, dark }: { checked: boolean; dark: boolean }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22">
      {checked ? (
        <>
          <Circle cx={11} cy={11} r={11} fill="#30D158" />
          <Path
            d="M7 11.3l2.6 2.6L15 8.5"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <Circle
          cx={11}
          cy={11}
          r={10}
          fill="none"
          stroke={dark ? 'rgba(255,255,255,0.25)' : '#C7C7CC'}
          strokeWidth={1.6}
        />
      )}
    </Svg>
  );
}

/** 11×13 lock glyph for the always-applied session-name row. */
function LockGlyph() {
  return (
    <Svg width={11} height={13} viewBox="0 0 11 13">
      <Rect x={1} y={5.5} width={9} height={6.5} rx={1.5} fill="#8E8E93" />
      <Path d="M3 5.5V4a2.5 2.5 0 015 0v1.5" fill="none" stroke="#8E8E93" strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

/** 12px dumbbell glyph marking each exercise group in the modified card. */
function DumbbellGlyph({ dark }: { dark: boolean }) {
  const color = dark ? '#FFB340' : '#B25000';
  return (
    <Svg width={12} height={12} viewBox="0 0 12 12">
      <Rect x={1} y={3.5} width={1.6} height={5} rx={0.8} fill={color} />
      <Rect x={9.4} y={3.5} width={1.6} height={5} rx={0.8} fill={color} />
      <Rect x={2.6} y={5.4} width={6.8} height={1.2} rx={0.6} fill={color} />
    </Svg>
  );
}

interface DiffReviewCardProps {
  tone: S.ReviewCardTone;
  label: string;
  countText?: string;
  children: ReactNode;
}

/**
 * A tinted review card from the diff-save reference: 361 wide, radius 24,
 * micro-label header, hairline separators between rows.
 */
export function DiffReviewCard({ tone, label, countText, children }: DiffReviewCardProps) {
  const theme = useAppTheme();
  const dark = theme.isDark;
  const items = Children.toArray(children);

  return (
    <S.Card $tone={tone} $dark={dark} style={{ borderCurve: 'continuous' }}>
      <S.CardHeader>
        <S.MicroLabel $tone={tone} $dark={dark}>
          {label}
        </S.MicroLabel>
        {countText ? <S.HeaderCount>{countText}</S.HeaderCount> : null}
      </S.CardHeader>
      {items.map((child, index) => (
        <Fragment key={index}>
          {index > 0 ? <S.RowSeparator $dark={dark} /> : null}
          {child}
        </Fragment>
      ))}
    </S.Card>
  );
}

interface DiffChangeRowProps {
  view: ChangeView;
  checked: boolean;
  onToggle: (id: string) => void;
}

/** One checkable change row: checkbox or lock, title, description or old→new transition, chip. */
export function DiffChangeRow({ view, checked, onToggle }: DiffChangeRowProps) {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const dark = theme.isDark;

  return (
    <S.Row
      onPress={view.locked ? undefined : () => onToggle(view.id)}
      disabled={view.locked}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled: view.locked }}
      accessibilityLabel={t(view.titleKey, view.titleParams)}
    >
      {view.locked ? (
        <S.LockedBox $dark={dark}>
          <LockGlyph />
        </S.LockedBox>
      ) : (
        <CheckGlyph checked={checked} dark={dark} />
      )}
      <S.RowTexts>
        <S.RowTitle $tone={view.titleTone} $dark={dark} numberOfLines={2}>
          {t(view.titleKey, view.titleParams)}
        </S.RowTitle>
        {view.description ? <S.RowDescription>{view.description}</S.RowDescription> : null}
        {view.transition ? (
          <S.TransitionRow>
            <S.OldValue numberOfLines={1}>{view.transition.oldText}</S.OldValue>
            <S.TransitionChevron>›</S.TransitionChevron>
            <S.NewValueChip $dark={dark}>
              <S.NewValueText $dark={dark} numberOfLines={1}>
                {view.transition.newText}
              </S.NewValueText>
            </S.NewValueChip>
          </S.TransitionRow>
        ) : null}
      </S.RowTexts>
      {view.locked ? (
        <S.AlwaysTag $dark={dark}>
          <S.AlwaysText>{t('plan.diff.change.always')}</S.AlwaysText>
        </S.AlwaysTag>
      ) : view.deltaChip ? (
        <S.DeltaChip $tone={view.deltaChip.tone} $dark={dark}>
          <S.DeltaText $tone={view.deltaChip.tone} $dark={dark}>
            {view.deltaChip.text}
          </S.DeltaText>
        </S.DeltaChip>
      ) : null}
    </S.Row>
  );
}

/** Exercise group header inside the modified card. */
export function ExerciseGroupHeader({ name }: { name: string }) {
  const theme = useAppTheme();
  return (
    <S.GroupHeader>
      <DumbbellGlyph dark={theme.isDark} />
      <S.GroupName $dark={theme.isDark} numberOfLines={1}>
        {name}
      </S.GroupName>
    </S.GroupHeader>
  );
}

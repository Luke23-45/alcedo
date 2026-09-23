import Icon from '@/components/presentation/foundation/icon';
import type { AppIconSource } from '@/components/presentation/foundation/ms-icon-source';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAppSelector } from '@/store';
import { alpha } from '@/styles/theme';
import { Children, ReactNode, isValidElement, useEffect } from 'react';
import { Pressable } from 'react-native';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import { useAppReducedMotion } from '@/hooks/useMotionSettings';
import * as S from './grouped-settings-list.styles';

/**
 * Canonical iOS grouped-inset settings anatomy (settings-dark.md Screen 1):
 * labelled groups of 58pt rows with 34pt icon wells, dual-line titles, and
 * separators inset to the text column.
 */

export interface SettingsRowProps {
  icon: AppIconSource;
  /** Base hue of the icon well; alpha follows the phase-6 light deltas. */
  wellHue: string;
  /** Optional light-mode well hue (e.g. the Licenses row's #98989F). */
  wellHueLight?: string;
  /** Override the default well alphas (dark .15 / light .12). */
  wellAlpha?: { dark: number; light: number };
  iconColor: string;
  title: string;
  subtitle?: string;
  /** Right-aligned value text (e.g. "Dark", "Series 9"). */
  value?: string;
  /** Renders the value in the green active treatment ("On", "Connected"). */
  valueActive?: boolean;
  /** Gold pill such as BETA / NEW. */
  badge?: string;
  /** iOS toggle at the trailing edge (replaces the chevron). */
  toggle?: { value: boolean; onValueChange: (v: boolean) => void; label: string; disabled?: boolean };
  /** Custom trailing content (e.g. a picker); replaces badge/value/toggle/chevron. */
  trailing?: ReactNode;
  /** Override the subtitle color (e.g. the danger tone for incomplete backends). */
  subtitleColor?: string;
  onPress?: () => void;
  /** Hide the chevron for static status rows (no fake affordances). */
  hideChevron?: boolean;
  testID?: string;
}

function RowChrome({ row, pressed, trailing }: { row: SettingsRowProps; pressed: boolean; trailing: ReactNode }) {
  const theme = useAppTheme();
  const hue = !theme.isDark && row.wellHueLight ? row.wellHueLight : row.wellHue;
  const wellAlpha = row.wellAlpha ?? { dark: 0.15, light: 0.12 };
  return (
    <>
      <S.PressHighlight $pressed={pressed} />
      <S.IconWell $well={alpha(hue, theme.isDark ? wellAlpha.dark : wellAlpha.light)}>
        <Icon source={row.icon} size={20} color={row.iconColor} />
      </S.IconWell>
      <S.RowText>
        <S.RowTitle numberOfLines={1}>{row.title}</S.RowTitle>
        {row.subtitle ? (
          <S.RowSubtitle numberOfLines={2} style={row.subtitleColor ? { color: row.subtitleColor } : undefined}>
            {row.subtitle}
          </S.RowSubtitle>
        ) : undefined}
      </S.RowText>
      <S.RowTrailing>{trailing}</S.RowTrailing>
    </>
  );
}

/**
 * iOS disclosure chevron: #48484A dark / #C7C7CC light (the profile tokens
 * already use this pair). SH06 — replaces the fixed `chevronColor` import
 * wherever a loop has migrated the call site.
 */
export function useChevronColor(): string {
  const theme = useAppTheme();
  return theme.isDark ? '#48484A' : '#C7C7CC';
}

/**
 * Group-label casing in the app language (SH02): `toLocaleUpperCase` with
 * the preferred language, so Turkish dotted-İ etc. follow the app locale
 * rather than the device locale that the native `text-transform` uses.
 * Idempotent over pre-uppercased translations ("SESSIONS").
 */
export function toGroupLabelCase(label: string, locale: string | undefined): string {
  return label.toLocaleUpperCase(locale ?? undefined);
}

function RowTrailing({ row }: { row: SettingsRowProps }) {
  const chevron = useChevronColor();
  if (row.trailing) {
    return <>{row.trailing}</>;
  }
  return (
    <>
      {row.badge ? (
        <S.BadgePill accessibilityLabel={row.badge}>
          <S.BadgePillText>{row.badge}</S.BadgePillText>
        </S.BadgePill>
      ) : undefined}
      {row.value !== undefined ? (
        row.valueActive ? (
          <S.RowValueActive numberOfLines={1}>{row.value}</S.RowValueActive>
        ) : (
          <S.RowValue numberOfLines={1}>{row.value}</S.RowValue>
        )
      ) : undefined}
      {row.toggle ? (
        <SettingsToggle
          value={row.toggle.value}
          onValueChange={row.toggle.onValueChange}
          accessibilityLabel={row.toggle.label}
        />
      ) : row.onPress && !row.hideChevron ? (
        <Icon source="chevronRight" size={18} color={chevron} />
      ) : undefined}
    </>
  );
}

export function SettingsRow(row: SettingsRowProps) {
  const trailing = <RowTrailing row={row} />;
  // SH07 — voice the value/badge with the title ("Appearance, Dark");
  // toggle rows keep the inner switch's own label as the single control.
  const announced = [row.title, row.value ?? row.subtitle, row.badge].filter(
    (part): part is string => typeof part === 'string' && part.length > 0,
  );
  if (!row.onPress && !row.toggle) {
    return (
      <S.RowStatic testID={row.testID} accessibilityRole="text">
        <RowChrome row={row} pressed={false} trailing={trailing} />
      </S.RowStatic>
    );
  }
  return (
    <S.RowPressable
      testID={row.testID}
      accessibilityRole={row.toggle ? undefined : 'button'}
      accessibilityLabel={row.toggle ? undefined : announced.join(', ')}
      accessibilityState={row.toggle ? { checked: row.toggle.value } : undefined}
      onPress={row.toggle ? undefined : row.onPress}
    >
      {({ pressed }: { pressed: boolean }) => <RowChrome row={row} pressed={pressed} trailing={trailing} />}
    </S.RowPressable>
  );
}

export function SettingsGroup({ label, children }: { label: string; children: ReactNode }) {
  const locale = useAppSelector((s) => s.settings.preferredLanguage) ?? undefined;
  const rows = Children.toArray(children).filter(isValidElement);
  return (
    <S.GroupWrap>
      <S.GroupLabel>{toGroupLabelCase(label, locale)}</S.GroupLabel>
      <CardEdge>
        <CardBody>
          {rows.map((child, i) => (
            <RowSlot key={child.key ?? i} last={i === rows.length - 1}>
              {child}
            </RowSlot>
          ))}
        </CardBody>
      </CardEdge>
    </S.GroupWrap>
  );
}

/** Theme-aware card edge: the `ce` gradient stroke (settings-dark.md). */
function CardEdge({ children }: { children: ReactNode }) {
  const theme = useAppTheme();
  return (
    <S.CardEdgeBase
      colors={
        theme.isDark
          ? ['rgba(255,255,255,0.17)', 'rgba(255,255,255,0.06)', 'rgba(255,255,255,0.025)']
          : ['rgba(0,0,0,0.045)', 'rgba(0,0,0,0.06)', 'rgba(0,0,0,0.115)']
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      {children}
    </S.CardEdgeBase>
  );
}

/** Theme-aware card body: the diagonal `cd` gradient (settings-dark.md). */
function CardBody({ children }: { children: ReactNode }) {
  const theme = useAppTheme();
  return (
    <S.CardBodyBase colors={[...theme.home.card.colors]} start={{ x: 0, y: 0 }} end={{ x: 0.45, y: 1 }}>
      {children}
    </S.CardBodyBase>
  );
}

function RowSlot({ children, last }: { children: ReactNode; last: boolean }) {
  return (
    <>
      {children}
      {last ? undefined : <S.RowSeparator />}
    </>
  );
}

/**
 * iOS 44×26 toggle (settings-dark.md Screen 1). The knob glides on the
 * standard curve; reduced-motion snaps it to the final state.
 */
export function SettingsToggle({
  value,
  onValueChange,
  accessibilityLabel,
  disabled,
}: {
  value: boolean;
  onValueChange?: (v: boolean) => void;
  accessibilityLabel: string;
  /** Inert, dimmed toggle for preferences with no delivery path yet. */
  disabled?: boolean;
}) {
  const reduceMotion = useAppReducedMotion();
  const offset = useSharedValue(value ? 20 : 2);

  // Stay in sync when the value changes from outside (e.g. the store).
  useEffect(() => {
    offset.value = reduceMotion ? (value ? 20 : 2) : withTiming(value ? 20 : 2, { duration: 160 });
  }, [value, reduceMotion, offset]);

  const toggle = () => {
    if (disabled || !onValueChange) {
      return;
    }
    const next = !value;
    offset.value = reduceMotion ? (next ? 20 : 2) : withTiming(next ? 20 : 2, { duration: 160 });
    onValueChange(next);
  };

  return (
    <Pressable
      onPress={toggle}
      disabled={disabled}
      hitSlop={S.ToggleHitSlop}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={accessibilityLabel}
      style={{ padding: 4 }}
    >
      <S.ToggleTrack $on={value} $disabled={disabled}>
        <Animated.View style={{ transform: [{ translateX: offset }] }}>
          <S.ToggleKnob />
        </Animated.View>
      </S.ToggleTrack>
    </Pressable>
  );
}

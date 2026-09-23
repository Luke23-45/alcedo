import { Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useAppTheme } from '@/hooks/useAppTheme';
import type { ReactNode } from 'react';
import {
  CardBody,
  CardEdge,
  CardMargin,
  LockedRow,
  SegmentButton,
  SegmentLabel,
  SegmentThumb,
  SegmentTrack,
  SmallStepperValue,
  StepperButton,
  StepperRow,
  StepperValue,
  ToggleKnob,
  ToggleTrack,
} from './editor-primitives.styles';

// ============================================================================
// Card — the reference two-layer shell. Theme-driven (dark/light) gradients;
// callers no longer pass $dark.
// ============================================================================

export function Card({
  children,
  radius = 24,
  active = false,
}: {
  children: ReactNode;
  radius?: number;
  /** Expanded/active state: the reference draws an ember edge stroke. */
  active?: boolean;
}) {
  return (
    <CardMargin>
      <CardEdge
        $radius={radius}
        colors={
          active ? (['rgba(255,106,61,0.30)', 'rgba(255,106,61,0.30)', 'rgba(255,106,61,0.30)'] as const) : undefined
        }
      >
        <CardBody $radius={Math.max(0, radius - 1)}>{children}</CardBody>
      </CardEdge>
    </CardMargin>
  );
}

// ============================================================================
// Glyphs — spec geometry, no emojis.
// ============================================================================

function glyph(stroke: string, width: number, d: string) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d={d} stroke={stroke} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function BackChevronGlyph() {
  return glyph('#FF9F0A', 2.4, 'M15 5l-7 7 7 7');
}

export function MagnifierGlyph() {
  return glyph('#8E8E93', 1.9, 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2l-4.35-4.35');
}

export function SwapGlyph() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 9H17M14 6l3 3-3 3M19 15H7M10 12l-3 3 3 3"
        stroke="#FF9F0A"
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function LinkGlyph({ color }: { color: string }) {
  // The ink is decided by linkGlyphColor (exercise-editor-logic): ember only
  // for a real http(s) link, neutral grey otherwise — the S1 empty state.
  return glyph(
    color,
    2.0,
    'M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5',
  );
}

export function LockGlyph() {
  return (
    <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z"
        stroke="#FFFFFF"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function TrashGlyph() {
  const { isDark } = useAppTheme();
  return glyph(
    isDark ? '#FF6B60' : '#FF3B30',
    1.9,
    'M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m3 0l-.8 12.2a1 1 0 0 1-1 .8H7.8a1 1 0 0 1-1-.8L6 7',
  );
}

export function ChevronRightGlyph() {
  const { isDark } = useAppTheme();
  return glyph(isDark ? '#48484A' : '#C7C7CC', 2.0, 'M9 6l6 6-6 6');
}

export function PlusGlyph() {
  return glyph('#FFFFFF', 2.2, 'M12 5v14M5 12h14');
}

export function MinusGlyph() {
  return glyph('#C7C7CC', 2.2, 'M5 12h14');
}

export function XGlyph() {
  return glyph('#86868B', 2.2, 'M6 6l12 12M18 6L6 18');
}

// ============================================================================
// SegmentedControl — the thumb lives inside the selected segment, inset 2pt.
// ============================================================================

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  height = 40,
  accessibilityLabel,
}: {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  height?: number;
  accessibilityLabel: string;
}) {
  return (
    <SegmentTrack $height={height} accessibilityRole="tablist" accessibilityLabel={accessibilityLabel}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <SegmentButton
            key={option.value}
            onPress={() => onChange(option.value)}
            // The reference draws 36pt segments in the rules editor; the
            // vertical slop keeps the effective target at 44pt.
            hitSlop={{ top: 4, bottom: 4 }}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={option.label}
          >
            <SegmentThumb $selected={selected} $height={height} />
            <SegmentLabel $selected={selected}>{option.label}</SegmentLabel>
          </SegmentButton>
        );
      })}
    </SegmentTrack>
  );
}

// ============================================================================
// Stepper — minus, value, plus.
// ============================================================================

export function Stepper({
  value,
  onChange,
  label,
  small = false,
  disabled = false,
  min = 0,
  max,
  step = 1,
  format,
}: {
  value: number;
  onChange: (next: number) => void;
  label: string;
  small?: boolean;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  format?: (value: number) => string;
}) {
  const text = format ? format(value) : value.toString();
  const Value = small ? SmallStepperValue : StepperValue;
  const canDecrease = !disabled && value - step >= min;
  const canIncrease = !disabled && (max === undefined || value + step <= max);
  // The small steppers draw 22pt (S2-C grid density); the wider hitSlop keeps
  // the effective target at 44pt without changing the reference geometry.
  const slop = small ? 11 : 8;
  return (
    <StepperRow accessibilityRole="adjustable" accessibilityLabel={label} accessibilityValue={{ text }}>
      <StepperButton
        $small={small}
        $disabled={!canDecrease}
        onPress={() => onChange(Math.max(min, value - step))}
        disabled={!canDecrease}
        accessibilityLabel={`Decrease ${label}`}
        hitSlop={slop}
      >
        <MinusGlyph />
      </StepperButton>
      <Value>{text}</Value>
      <StepperButton
        $small={small}
        $disabled={!canIncrease}
        onPress={() => onChange(max === undefined ? value + step : Math.min(max, value + step))}
        disabled={!canIncrease}
        accessibilityLabel={`Increase ${label}`}
        hitSlop={slop}
      >
        <PlusGlyph />
      </StepperButton>
    </StepperRow>
  );
}

// ============================================================================
// Toggle — pressable unless locked; a locked toggle is display-only by design.
// ============================================================================

export function Toggle({
  on,
  locked = false,
  label,
  onChange,
}: {
  on: boolean;
  locked?: boolean;
  label: string;
  onChange?: (next: boolean) => void;
}) {
  if (locked) {
    // The reference draws the lock as its own glyph ahead of a dimmed-ON
    // track — "auto" must never read as a choice.
    return (
      <LockedRow>
        <LockGlyph />
        <ToggleTrack
          $on={on}
          $locked
          accessibilityRole="switch"
          accessibilityState={{ checked: on, disabled: true }}
          accessibilityLabel={`${label}, locked on`}
        >
          <ToggleKnob $on={on} />
        </ToggleTrack>
      </LockedRow>
    );
  }
  return (
    <Pressable
      onPress={() => onChange?.(!on)}
      accessibilityRole="switch"
      accessibilityState={{ checked: on }}
      accessibilityLabel={label}
      hitSlop={10}
    >
      <ToggleTrack $on={on} $locked={false}>
        <ToggleKnob $on={on} />
      </ToggleTrack>
    </Pressable>
  );
}

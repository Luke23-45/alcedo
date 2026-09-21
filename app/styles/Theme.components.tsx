/**
 * ALCEDO — component library, part 2
 * Input, Avatar, ListRow, SegmentedControl, ProgressRing, BottomSheet.
 *
 * Same rule as theme.usage.tsx: one variant/size prop per component, nothing
 * hand-set at the call site. Needs `react-native-svg` for ProgressRing.
 */
import React from 'react';
import {
    TextInput,
    View,
    Pressable,
    Modal,
    useWindowDimensions,
    LayoutChangeEvent,
    type TextInputProps,
    type ImageSourcePropType,
} from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import Svg, { Circle } from 'react-native-svg';
import { Text } from './theme.usage';
import type { AppTheme } from './theme';

/* -------------------------------------------------------------------------- *
 * Input
 *
 * One height (44 — the HIG minimum), one radius, states carried by border
 * colour alone. Error swaps the border to `status.danger`, never the fill —
 * a red-filled text field reads as broken, not invalid.
 * -------------------------------------------------------------------------- */

const InputSurface = styled.View<{ $focused: boolean; $error: boolean }>`
  flex-direction: row;
  align-items: center;
  height: ${({ theme }) => theme.components.input.height}px;
  padding-horizontal: ${({ theme }) => theme.components.input.paddingX}px;
  border-radius: ${({ theme }) => theme.components.input.radius}px;
  background-color: ${({ theme }) => theme.color.fill.secondary};
  border-width: ${({ theme }) => theme.borderWidth.thin}px;
  border-color: ${({ theme, $focused, $error }) =>
        $error ? theme.color.status.danger.base : $focused ? theme.color.border.focus : 'transparent'};
`;

const InputField = styled(TextInput)`
  flex: 1;
  font-family: ${({ theme }) => theme.font.text};
  font-size: ${({ theme }) => theme.text.body.fontSize}px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export interface InputProps extends TextInputProps {
    error?: string;
    helper?: string;
    label?: string;
}

export function Input({ error, helper, label, style, onFocus, onBlur, ...rest }: InputProps) {
    const theme = useTheme();
    const [focused, setFocused] = React.useState(false);
    return (
        <View style={{ gap: 6 }}>
            {label ? (
                <Text variant="subheadline" tone="secondary">
                    {label}
                </Text>
            ) : null}
            <InputSurface $focused={focused} $error={!!error} style={{ borderCurve: 'continuous' }}>
                <InputField
                    placeholderTextColor={theme.color.content.tertiary}
                    onFocus={(e) => {
                        setFocused(true);
                        onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setFocused(false);
                        onBlur?.(e);
                    }}
                    style={style}
                    {...rest}
                />
            </InputSurface>
            {error ? (
                <Text variant="footnote" style={{ color: theme.color.status.danger.content }}>
                    {error}
                </Text>
            ) : helper ? (
                <Text variant="footnote" tone="tertiary">
                    {helper}
                </Text>
            ) : null}
        </View>
    );
}

/* -------------------------------------------------------------------------- *
 * Avatar
 * -------------------------------------------------------------------------- */

type AvatarSize = keyof AppTheme['components']['avatar']['size'];

const AvatarImage = styled.Image<{ $size: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: ${({ $size }) => $size / 2}px;
  background-color: ${({ theme }) => theme.color.fill.tertiary};
`;

const AvatarFallback = styled.View<{ $size: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: ${({ $size }) => $size / 2}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.color.interactive.tint};
`;

export function Avatar({
    source,
    initials,
    size = 'md',
}: {
    source?: ImageSourcePropType;
    initials?: string;
    size?: AvatarSize;
}) {
    const theme = useTheme();
    const px = theme.components.avatar.size[size];
    return source ? (
        <AvatarImage source={source} $size={px} />
    ) : (
        <AvatarFallback $size={px}>
            <Text variant={px >= 56 ? 'title3' : 'footnote'} tone="inverse" style={{ fontWeight: '600' }}>
                {(initials ?? '?').slice(0, 2).toUpperCase()}
            </Text>
        </AvatarFallback>
    );
}

/* -------------------------------------------------------------------------- *
 * ListRow — the grouped-table row: leading slot, two-line text, trailing slot
 * -------------------------------------------------------------------------- */

const RowSurface = styled.View<{ $height: number }>`
  flex-direction: row;
  align-items: center;
  min-height: ${({ $height }) => $height}px;
  padding-horizontal: ${({ theme }) => theme.components.listRow.paddingX}px;
  gap: ${({ theme }) => theme.components.listRow.gap}px;
  background-color: ${({ theme }) => theme.color.background.groupedSecondary};
`;

const Chevron = styled.View`
  width: 8px;
  height: 8px;
  border-top-width: 2px;
  border-right-width: 2px;
  border-color: ${({ theme }) => theme.color.content.tertiary};
  transform: rotate(45deg);
`;

export function ListRow({
    title,
    subtitle,
    leading,
    trailing,
    showChevron,
    onPress,
}: {
    title: string;
    subtitle?: string;
    leading?: React.ReactNode;
    trailing?: React.ReactNode;
    showChevron?: boolean;
    onPress?: () => void;
}) {
    const theme = useTheme();
    const height = subtitle ? theme.components.listRow.heightTwoLine : theme.components.listRow.height;
    return (
        <Pressable onPress={onPress} accessibilityRole={onPress ? 'button' : undefined}>
            {({ pressed }) => (
                <RowSurface $height={height} style={pressed ? { backgroundColor: theme.color.fill.quaternary } : null}>
                    {leading}
                    <View style={{ flex: 1, gap: 2 }}>
                        <Text variant="body" numberOfLines={1}>
                            {title}
                        </Text>
                        {subtitle ? (
                            <Text variant="footnote" tone="secondary" numberOfLines={1}>
                                {subtitle}
                            </Text>
                        ) : null}
                    </View>
                    {trailing}
                    {showChevron ? <Chevron /> : null}
                </RowSurface>
            )}
        </Pressable>
    );
}

export const RowSeparator = styled.View`
  height: ${({ theme }) => theme.borderWidth.hairline}px;
  margin-left: ${({ theme }) => theme.layout.separatorInset}px;
  background-color: ${({ theme }) => theme.color.border.hairline};
`;

/* -------------------------------------------------------------------------- *
 * SegmentedControl — iOS UISegmentedControl, redrawn with a sliding thumb
 * -------------------------------------------------------------------------- */

export function SegmentedControl({
    options,
    value,
    onChange,
}: {
    options: readonly string[];
    value: string;
    onChange: (next: string) => void;
}) {
    const theme = useTheme();
    const [trackWidth, setTrackWidth] = React.useState(0);
    const segmentWidth = trackWidth / options.length;
    const index = Math.max(0, options.indexOf(value));

    const onLayout = (e: LayoutChangeEvent) => setTrackWidth(e.nativeEvent.layout.width);

    return (
        <Track onLayout={onLayout} style={{ borderCurve: 'continuous' }}>
            {trackWidth > 0 ? (
                <Thumb
                    style={{
                        borderCurve: 'continuous',
                        width: segmentWidth - 4,
                        transform: [{ translateX: index * segmentWidth + 2 }],
                    }}
                />
            ) : null}
            {options.map((option) => (
                <Pressable key={option} style={{ flex: 1 }} onPress={() => onChange(option)} accessibilityRole="button">
                    <SegmentLabelWrap>
                        <Text variant="subheadline" tone={option === value ? 'primary' : 'secondary'} style={{ fontWeight: option === value ? '600' : '400' }}>
                            {option}
                        </Text>
                    </SegmentLabelWrap>
                </Pressable>
            ))}
        </Track>
    );
}

const Track = styled.View`
  flex-direction: row;
  height: 32px;
  padding: 2px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: ${({ theme }) => theme.color.fill.primary};
`;

const Thumb = styled.View`
  position: absolute;
  top: 2px;
  bottom: 2px;
  left: 0;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => theme.color.background.elevated};
  shadow-color: #000;
  shadow-opacity: 0.16;
  shadow-radius: 3px;
  shadow-offset: 0px 1px;
  elevation: 2;
`;

const SegmentLabelWrap = styled.View`
  align-items: center;
  justify-content: center;
  height: 28px;
`;

/* -------------------------------------------------------------------------- *
 * ProgressRing — Apple Fitness-style ring, driven by the `zone` palette
 * -------------------------------------------------------------------------- */

export function ProgressRing({
    progress,
    size = 'md',
    zone = 'endurance',
    trackOnly = false,
    children,
}: {
    /** 0–1. Values above 1 wrap visually (like an Activity ring past 100%). */
    progress: number;
    size?: keyof AppTheme['components']['ring']['size'];
    zone?: keyof AppTheme['color']['zone'];
    trackOnly?: boolean;
    children?: React.ReactNode;
}) {
    const theme = useTheme();
    const dimension = theme.components.ring.size[size];
    const stroke = theme.components.ring.strokeWidth[size];
    const radius = (dimension - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const clamped = Math.max(0, Math.min(progress, 1));
    const color = theme.color.zone[zone];

    return (
        <View style={{ width: dimension, height: dimension, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={dimension} height={dimension} style={{ position: 'absolute' }}>
                <Circle
                    cx={dimension / 2}
                    cy={dimension / 2}
                    r={radius}
                    stroke={color}
                    strokeOpacity={theme.components.ring.trackOpacity}
                    strokeWidth={stroke}
                    fill="none"
                />
                {!trackOnly && (
                    <Circle
                        cx={dimension / 2}
                        cy={dimension / 2}
                        r={radius}
                        stroke={color}
                        strokeWidth={stroke}
                        strokeLinecap="round"
                        strokeDasharray={`${circumference} ${circumference}`}
                        strokeDashoffset={circumference * (1 - clamped)}
                        fill="none"
                        // Start at 12 o'clock, like Apple's rings, not 3 o'clock.
                        rotation={-90}
                        origin={`${dimension / 2}, ${dimension / 2}`}
                    />
                )}
            </Svg>
            {children}
        </View>
    );
}

/* -------------------------------------------------------------------------- *
 * BottomSheet — native Modal, theme-driven handle + radius + scrim
 *
 * This is a plain, dependency-free sheet (slide up, tap scrim to dismiss).
 * Swap the RN Modal + Animated pairing for @gorhom/bottom-sheet if the app
 * needs drag-to-dismiss or snap points — keep SheetSurface/Handle as-is so
 * the visual language doesn't drift between the two.
 * -------------------------------------------------------------------------- */

const Scrim = styled.Pressable`
  flex: 1;
  background-color: ${({ theme }) => theme.color.background.scrim};
  justify-content: flex-end;
`;

const SheetSurface = styled.View<{ $maxHeight: number }>`
  background-color: ${({ theme }) => theme.color.background.elevated};
  border-top-left-radius: ${({ theme }) => theme.components.sheet.radius}px;
  border-top-right-radius: ${({ theme }) => theme.components.sheet.radius}px;
  padding-horizontal: ${({ theme }) => theme.components.sheet.paddingX}px;
  padding-top: ${({ theme }) => theme.components.sheet.paddingTop}px;
  padding-bottom: ${({ theme }) => theme.space.xl}px;
  max-height: ${({ $maxHeight }) => $maxHeight}px;
`;

const Handle = styled.View`
  align-self: center;
  width: ${({ theme }) => theme.components.sheet.handleWidth}px;
  height: ${({ theme }) => theme.components.sheet.handleHeight}px;
  border-radius: ${({ theme }) => theme.components.sheet.handleHeight / 2}px;
  background-color: ${({ theme }) => theme.color.fill.primary};
  margin-bottom: ${({ theme }) => theme.space.md}px;
`;

export function BottomSheet({
    visible,
    onDismiss,
    children,
}: {
    visible: boolean;
    onDismiss: () => void;
    children: React.ReactNode;
}) {
    // useWindowDimensions (not Dimensions.get) so this tracks rotation and
    // iPad split-view/Stage Manager resizes instead of freezing at mount.
    const { height: windowHeight } = useWindowDimensions();
    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onDismiss}>
            <Scrim onPress={onDismiss}>
                {/* Stop propagation so a tap on the sheet itself doesn't dismiss it. */}
                <Pressable onPress={(e) => e.stopPropagation()}>
                    <SheetSurface $maxHeight={windowHeight * 0.88} style={{ borderCurve: 'continuous' }}>
                        <Handle />
                        {children}
                    </SheetSurface>
                </Pressable>
            </Scrim>
        </Modal>
    );
}

/* -------------------------------------------------------------------------- *
 * Switch — themed to match the system control without using it verbatim
 * -------------------------------------------------------------------------- */

export function ThemedSwitchTrack({ on }: { on: boolean }) {
    const theme = useTheme();
    return (
        <View
            style={{
                width: 51,
                height: 31,
                borderRadius: 16,
                padding: 2,
                backgroundColor: on ? theme.color.interactive.accent : theme.color.fill.primary,
                justifyContent: 'center',
            }}
        >
            <View
                style={{
                    width: 27,
                    height: 27,
                    borderRadius: 14,
                    backgroundColor: '#FFFFFF',
                    transform: [{ translateX: on ? 20 : 0 }],
                    shadowColor: '#000',
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                    shadowOffset: { width: 0, height: 1 },
                    elevation: 2,
                }}
            />
        </View>
    );
}
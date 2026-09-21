import React, { ReactNode, useEffect, useRef } from 'react';
import { useAppTheme } from '@/hooks/useAppTheme';
import { alpha, type AppTheme } from '@/styles/theme';
import { Animated, Platform, useWindowDimensions, View, ViewStyle } from 'react-native';
import { GlassBackground } from '@/components/presentation/foundation/glass-background';
import { SurfaceText } from '@/components/presentation/foundation/surface-text';
import { Jiggler } from '@/components/presentation/foundation/jiggler';

const barRadius = 20;
const trackHeight = 6;
const pipWidth = 2;

export interface TimerSegment {
  /** Sized in proportion to how long this part of the window lasts. */
  flex: number;
  progress: number;
  color: string;
}

interface TimerPaneProps {
  time: string;
  status: string;
  accent: string;
  segments: TimerSegment[];
  controls: ReactNode;
  jiggling?: boolean;
  testID?: string;
  style?: ViewStyle;
}

/** The chrome shared by every timer that runs against a target. */
export function TimerPane({ time, status, accent, segments, controls, jiggling, testID, style }: TimerPaneProps) {
  const theme = useAppTheme();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  return (
    // The bar clips its glass to the radius, and a clipping layer cannot cast a shadow - so the lift
    // has to come from a wrapper. Android separates itself with a hairline instead.
    <View
      style={[
        {
          alignSelf: isLandscape ? 'flex-end' : 'stretch',
          // Separates the bar from the action floating above it, which the shared gap alone leaves too tight.
          marginTop: theme.space.sm,
        },
        Platform.OS === 'ios' ? theme.elevation.sm : undefined,
        style,
      ]}
    >
      <View
        testID={testID}
        style={{
          borderRadius: barRadius,
          overflow: 'hidden',
          paddingVertical: theme.space.sm,
          paddingLeft: theme.space.base,
          paddingRight: theme.space.sm,
          gap: theme.space.xs,
          borderColor: theme.color.border.hairline,
          borderWidth: Platform.OS === 'android' ? 1 : 0,
        }}
      >
        <GlassBackground
          radius={barRadius}
          color={theme.color.background.elevated}
          tintColor={alpha(theme.color.background.elevated, 0.75)}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Jiggler jiggling={!!jiggling}>
            <SurfaceText style={{ fontVariant: ['tabular-nums'] }} variant="title1" weight="bold" color={accent}>
              {time}
            </SurfaceText>
          </Jiggler>
          <SurfaceText
            style={{
              marginLeft: theme.space.sm,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              marginRight: 'auto',
            }}
            numberOfLines={1}
            variant="caption1"
            weight="bold"
            color={accent}
          >
            {status}
          </SurfaceText>
          {controls}
        </View>
        <View style={{ paddingBottom: theme.space.sm }}>
          <ProgressBar segments={segments} theme={theme} trackColor={theme.color.border.hairline} />
        </View>
      </View>
    </View>
  );
}

export function formatTimeSpan(ms: number): string {
  const totalSeconds = Math.ceil(Math.max(ms, 0) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function resolveSegmentColor(theme: AppTheme, color: string): string {
  if (color === 'green' || color === 'success') return theme.color.status.success.base;
  if (color === 'orange' || color === 'accent' || color === 'warning') return theme.color.interactive.accent;
  if (color === 'onSurfaceVariant' || color === 'secondary') return theme.color.fill.primary;
  if (color === 'primary' || color === 'tint') return theme.color.interactive.tint;
  return color;
}

interface ProgressBarProps {
  segments: TimerSegment[];
  theme: AppTheme;
  trackColor: string;
}

/**
 * One continuous track. The segments are its colours laid end to end, each sized by its `flex`, and a
 * single curtain hides whatever the combined progress has not yet reached.
 */
function ProgressBar({ segments, theme, trackColor }: ProgressBarProps) {
  const totalFlex = segments.reduce((sum, segment) => sum + segment.flex, 0);
  // Segments fill in order, so the filled length is the flex-weighted sum of their individual progress.
  const progress =
    totalFlex > 0 ? segments.reduce((sum, segment) => sum + segment.flex * segment.progress, 0) / totalFlex : 0;
  const cover = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(cover, {
      toValue: 1 - progress,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [progress, cover]);

  return (
    <View
      style={{
        flexDirection: 'row',
        height: trackHeight,
        borderRadius: trackHeight,
        backgroundColor: trackColor,
        overflow: 'hidden',
      }}
    >
      {segments.map((segment, index) => (
        <View key={index} style={{ flex: segment.flex, backgroundColor: resolveSegmentColor(theme, segment.color) }} />
      ))}
      {/* This thing is the background which covers the real progress, it scales down over time */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: trackColor,
          transform: [{ scaleX: cover }],
          transformOrigin: 'right',
        }}
      />
      {/* Now we create a pip at each spot by making a container which is the width of the segment (segment.flex)
        The pip itself is just an absolutely positioned item with a colour and a width
      */}
      <View
        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, flexDirection: 'row' }}
        pointerEvents="none"
      >
        {segments.map((segment, index) => (
          <View key={index} style={{ flex: segment.flex }}>
            {index === segments.length - 1 ? undefined : (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  right: 0,
                  width: pipWidth,
                  backgroundColor: theme.color.background.elevated,
                }}
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

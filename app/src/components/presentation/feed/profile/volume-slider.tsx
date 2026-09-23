import { useAppTheme } from '@/hooks/useAppTheme';
import { useRef, useState } from 'react';
import { PanResponder } from 'react-native';
import { useTranslate } from '@tolgee/react';
import { feedKey } from '../shared/feed-i18n';
import * as S from './volume-slider.styles';
import { PROFILE, profilePalette } from './profile-tokens';
import { sliderValueForX, sliderXForNow, sliderXForValue } from './profile-formatters';

const { trackX, trackWidth } = PROFILE.slider;
const STEP = 500;

/**
 * Weekly volume goal slider. The white 26pt thumb is the setting (draggable
 * 20k–50k, snapped to 500); the white tick is this week's reality. Two values,
 * one control, no ambiguity. Dragging is instant; there is no animation to
 * reduce, so reduced motion needs no special case. VoiceOver users get
 * increment/decrement actions on the same 500-step grid.
 */
export function VolumeSlider({
  goalKg,
  thisWeekKg,
  onGoalChange,
  testID,
}: {
  goalKg: number;
  thisWeekKg: number;
  onGoalChange: (goalKg: number) => void;
  testID?: string;
}) {
  const theme = useAppTheme();
  const palette = profilePalette(theme.isDark);
  const { t } = useTranslate();
  const [dragX, setDragX] = useState<number | undefined>(undefined);
  const [areaW, setAreaW] = useState(0);
  const areaPageX = useRef(0);
  // The release handler must not commit inside the setState updater —
  // updaters must stay pure (React may invoke them twice). The ref carries
  // the latest drag position outside the render cycle.
  const dragXRef = useRef<number | undefined>(undefined);

  // The track spans the measured card (36 left inset, 4 right — the reference's
  // real asymmetric insets); 321-space math scales onto it. Fallback is exact.
  const trackW = areaW > 0 ? areaW - 40 : trackWidth;
  const scale = trackW / trackWidth;
  const toDisplay = (x321: number): number => trackX + (x321 - trackX) * scale;

  const thumbX = dragX ?? toDisplay(sliderXForValue(goalKg));
  const nowX = toDisplay(sliderXForNow(thisWeekKg));

  const clampToTrack = (localX: number): number => Math.min(trackX + trackW, Math.max(trackX, localX));

  const commitX = (x: number) => onGoalChange(sliderValueForX(x, trackW));

  const trackDrag = (pageX: number) => {
    const x = clampToTrack(pageX - areaPageX.current);
    dragXRef.current = x;
    setDragX(x);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_event, gesture) =>
        Math.abs(gesture.dx) > 6 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
      onPanResponderGrant: (event) => {
        trackDrag(event.nativeEvent.pageX);
      },
      onPanResponderMove: (event) => {
        trackDrag(event.nativeEvent.pageX);
      },
      onPanResponderRelease: () => {
        const released = dragXRef.current;
        dragXRef.current = undefined;
        setDragX(undefined);
        if (released !== undefined) {
          commitX(released);
        }
      },
      onPanResponderTerminate: () => {
        dragXRef.current = undefined;
        setDragX(undefined);
      },
    }),
  ).current;

  return (
    <S.SliderArea
      testID={testID}
      accessibilityRole="adjustable"
      accessibilityLabel={t(feedKey('feed.profile.goals.weekly_volume'))}
      accessibilityValue={{ min: PROFILE.slider.min, max: PROFILE.slider.max, now: goalKg }}
      accessibilityActions={[
        { name: 'increment', label: t(feedKey('feed.profile.goals.increase')) },
        { name: 'decrement', label: t(feedKey('feed.profile.goals.decrease')) },
      ]}
      onAccessibilityAction={(event) => {
        if (event.nativeEvent.actionName === 'increment') {
          onGoalChange(Math.min(PROFILE.slider.max, goalKg + STEP));
        } else if (event.nativeEvent.actionName === 'decrement') {
          onGoalChange(Math.max(PROFILE.slider.min, goalKg - STEP));
        }
      }}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setAreaW((prev) => (prev === width ? prev : width));
        event.currentTarget.measure((_x, _y, _w, _h, pageX) => {
          areaPageX.current = pageX;
        });
      }}
      {...panResponder.panHandlers}
    >
      <S.TrackBase $track={palette.sliderTrack} style={{ width: trackW }}>
        <S.TrackFill
          colors={[PROFILE.brandGradient[0], PROFILE.brandGradient[1], PROFILE.brandGradient[2]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: Math.max(0, thumbX - trackX) }}
        />
      </S.TrackBase>
      <S.NowTick style={{ left: nowX - 1 }} />
      <S.Thumb $light={!theme.isDark} style={{ left: thumbX - 13 }}>
        <S.ThumbCore
          colors={[PROFILE.brandGradient[0], PROFILE.brandGradient[1], PROFILE.brandGradient[2]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </S.Thumb>
      <S.RangeEdge $color={palette.faint}>{t(feedKey('feed.profile.goals.range_min'))}</S.RangeEdge>
      <S.RangeEdge $color={palette.faint} $right>
        {t(feedKey('feed.profile.goals.range_max'))}
      </S.RangeEdge>
    </S.SliderArea>
  );
}

import React, { useCallback, useEffect, useState } from 'react';
import { Rest } from '@/models/blueprint-models';
import { Duration, OffsetDateTime } from '@js-joda/core';
import { useWindowDimensions, View, ViewStyle } from 'react-native';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { Circle, Defs, G, LinearGradient as SvgLinearGradient, Path, Stop, Svg } from 'react-native-svg';
import { useAppTheme } from '@/hooks/useAppTheme';
import { alpha } from '@/styles/theme';
import { Jiggler } from '@/components/presentation/foundation/jiggler';
import { useTranslate } from '@tolgee/react';
import { RestTimerControls } from './rest-timer-controls';
import * as S from './rest-timer.styles';
import { getRestTimerState } from './rest-timer-state';

interface RestTimerProps {
  rest: Rest;
  startTime: OffsetDateTime;
  pausedAt: OffsetDateTime | undefined;
  failed: boolean;
  style?: ViewStyle;
  onDismiss: () => void;
  onTogglePause: () => void;
  /**
   * Complete state only: jumps to logging the next set. Optional — the
   * Complete state falls back to the Skip pill when the host doesn't wire it.
   */
  onLogSet?: () => void;
  /** Complete state: the upcoming set, e.g. "Set 3 · Triceps Pushdown". */
  nextSetTitle?: string;
  /** Complete state: the upcoming set detail, e.g. "20 kg × 15". */
  nextSetDetail?: string;
}

type RestViewState = 'running' | 'paused' | 'complete';

const RING_RADIUS = 26;
/** C(26) = 163.36 — the reference verifies 42/60 remaining as dash 114.35. */
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const ADJUST_STEP_MS = 15_000;

/** Clock readout, zero-padded minutes: "00:42". */
function formatClock(ms: number): string {
  const totalSeconds = Math.ceil(Math.max(ms, 0) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Countdown ring: r=26, stroke 7, track at 16% of the accent, progress dash
 * exactly remaining-fraction × circumference, round caps, starting at 12
 * o'clock. The complete state is a single full green ring — the reference
 * draws no glow copies.
 */
function RestRing({ fraction, complete, dimmed }: { fraction: number; complete: boolean; dimmed: boolean }) {
  const theme = useAppTheme();
  const dark = theme.isDark;
  const size = 59;
  const center = size / 2;
  const dash = Math.min(Math.max(fraction, 0), 1) * RING_CIRCUMFERENCE;
  const track = dark ? '#00D9E9' : '#17C8E8';

  return (
    <Svg width={size} height={size}>
      <Defs>
        <SvgLinearGradient id="restTimerProgress" x1="0" y1="1" x2="1" y2="0">
          <Stop offset="0" stopColor={dark ? '#009DFF' : '#0089CE'} />
          <Stop offset="1" stopColor={dark ? '#2CE9F7' : '#17C8E8'} />
        </SvgLinearGradient>
        <SvgLinearGradient id="restTimerDone" x1="0" y1="1" x2="1" y2="0">
          <Stop offset="0" stopColor="#7BE000" />
          <Stop offset="1" stopColor="#D6FF52" />
        </SvgLinearGradient>
      </Defs>
      {complete ? (
        <Circle cx={center} cy={center} r={RING_RADIUS} fill="none" stroke="url(#restTimerDone)" strokeWidth={7} />
      ) : (
        <G>
          <Circle
            cx={center}
            cy={center}
            r={RING_RADIUS}
            fill="none"
            stroke={track}
            strokeOpacity={0.16}
            strokeWidth={7}
          />
          {dash > 0.01 && (
            <Circle
              cx={center}
              cy={center}
              r={RING_RADIUS}
              fill="none"
              stroke="url(#restTimerProgress)"
              strokeWidth={7}
              strokeLinecap="round"
              strokeDasharray={`${dash} ${RING_CIRCUMFERENCE}`}
              transform={`rotate(-90 ${center} ${center})`}
              opacity={dimmed ? 0.55 : 1}
            />
          )}
        </G>
      )}
    </Svg>
  );
}

function CheckGlyph() {
  return (
    <Svg width={22} height={22} viewBox="-11 -11 22 22">
      {/* The reference draws the check at 90% scale. */}
      <G transform="scale(0.9)">
        <Path
          d="M-5 0.4 L-1.6 4 L5.6 -4"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  );
}

export function RestTimer({
  rest,
  startTime,
  pausedAt,
  failed,
  style,
  onDismiss,
  onTogglePause,
  onLogSet,
  nextSetTitle,
  nextSetDetail,
}: RestTimerProps) {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const dark = theme.isDark;
  const paused = pausedAt !== undefined;
  const [jiggled, setJiggled] = useState([] as string[]);
  // Presentation-local nudge for the −15/+15 buttons: shifts the elapsed
  // time without touching the timer model or the host's props.
  const [adjustMs, setAdjustMs] = useState(0);

  useEffect(() => {
    setJiggled([]);
    setAdjustMs(0);
  }, [startTime]);

  const getTimerState = useCallback(
    () =>
      getRestTimerState({
        rest,
        startTime,
        pausedAt,
        failed,
        adjustMs,
        now: OffsetDateTime.now(),
      }),
    [startTime, pausedAt, rest, failed, adjustMs],
  );

  const [timerState, setTimerState] = useState(getTimerState());
  const [jiggling, setJiggling] = useState(false);

  const triggerJiggle = useCallback(
    (milestone: string) => {
      if (jiggled.includes(milestone)) return;
      impactAsync(ImpactFeedbackStyle.Heavy).catch(console.log);
      setJiggling(true);
      setTimeout(() => setJiggling(false), 10);
      setJiggled((j) => [...j, milestone]);
    },
    [jiggled],
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const state = getTimerState();
      setTimerState(state);
      if (state.phase !== 'resting') triggerJiggle('ready');
      if (state.phase === 'over') triggerJiggle('over');
    }, 200);
    return () => clearInterval(timer);
  }, [getTimerState, triggerJiggle]);

  /** Shifts the countdown ±15s, never below zero remaining. */
  const nudge = (deltaMs: number) => {
    const now = pausedAt ?? OffsetDateTime.now();
    const rawElapsed = Math.max(0, Duration.between(startTime, now).toMillis());
    setAdjustMs((prev) => Math.max(-rawElapsed, prev + deltaMs));
  };

  const { phase, windowStart, windowEnd, remainingMs, restProgress } = timerState;
  // The reference draws three states: running, paused, and complete. The
  // ready and over phases both render complete — a full green ring — since
  // the reference defines no distinct overtime treatment.
  const viewState: RestViewState = paused ? 'paused' : phase === 'resting' ? 'running' : 'complete';

  const ink = dark ? '#FFFFFF' : '#1C1C1E';
  const timeColor = paused ? alpha(ink, 0.62) : ink;

  const restSeconds = Math.round(windowStart / 1000);
  const range =
    windowEnd !== undefined && windowEnd !== windowStart
      ? `${restSeconds}–${Math.round(windowEnd / 1000)}`
      : `${restSeconds}`;
  const restLabel = t('rest_timer.label.prescription', {
    rest: t('rest_timer.label.rest'),
    range,
    unit: t('rest_timer.unit.second_short'),
    prescribed: t('rest_timer.label.prescribed'),
  });

  const completeTitle = nextSetTitle ?? (phase === 'over' ? t('rest_timer.status.over') : t('rest_timer.status.ready'));

  return (
    // The bar clips its gradients to the radius, and a clipping layer cannot cast a shadow - so the
    // lift has to come from the edge layer. Android separates itself with a hairline instead.
    <View
      style={[
        {
          alignSelf: isLandscape ? 'flex-end' : 'stretch',
          // Separates the card from the action floating above it, which the shared gap alone leaves too tight.
          marginTop: theme.space.sm,
        },
        style,
      ]}
    >
      <S.TimerCard testID="rest-timer">
        <S.TimerCardBody>
          <S.CardRow>
            <S.PauseZone
              onPress={viewState === 'running' ? onTogglePause : undefined}
              accessibilityRole={viewState === 'running' ? 'button' : undefined}
              accessibilityLabel={viewState === 'running' ? t('rest_timer.pause') : undefined}
            >
              <S.RingWrap>
                <RestRing
                  fraction={viewState === 'complete' ? 1 : 1 - restProgress}
                  complete={viewState === 'complete'}
                  dimmed={paused}
                />
                <S.RingOverlay>
                  {viewState === 'complete' ? (
                    <CheckGlyph />
                  ) : (
                    <S.RingCenterLabel $color={ink} $dimmed={paused}>
                      {Math.ceil(remainingMs / 1000)}
                    </S.RingCenterLabel>
                  )}
                </S.RingOverlay>
              </S.RingWrap>
              {/* Column anchors: chip top 12pt, baselines at 33pt/62pt (card-rel)
                  per the running-state reference. */}
              <S.MiddleColumn
                $gap={viewState === 'running' ? 1 : viewState === 'paused' ? 5 : 11}
                $topPad={viewState === 'running' ? 25 : 12}
              >
                {viewState === 'running' && (
                  <>
                    <S.TimerText $size={9} $weight="700" $tracking={1.3} $color="#86868B" $lineHeight={12}>
                      {restLabel}
                    </S.TimerText>
                    <Jiggler jiggling={jiggling}>
                      <S.TimerText
                        $size={26}
                        $weight="700"
                        $tracking={-0.9}
                        $color={timeColor}
                        $lineHeight={32}
                        style={{ fontVariant: ['tabular-nums'] }}
                      >
                        {formatClock(remainingMs)}
                      </S.TimerText>
                    </Jiggler>
                  </>
                )}
                {viewState === 'paused' && (
                  <>
                    <S.Chip $width={66} $fill={alpha('#FF9F0A', 0.16)}>
                      <S.ChipLabel $color={dark ? '#FFB84D' : '#C93400'}>
                        {t('rest_timer.status.paused').toLocaleUpperCase()}
                      </S.ChipLabel>
                    </S.Chip>
                    <Jiggler jiggling={jiggling}>
                      <S.TimerText
                        $size={26}
                        $weight="700"
                        $tracking={-0.9}
                        $color={timeColor}
                        $lineHeight={32}
                        style={{ fontVariant: ['tabular-nums'] }}
                      >
                        {formatClock(remainingMs)}
                      </S.TimerText>
                    </Jiggler>
                  </>
                )}
                {viewState === 'complete' && (
                  <>
                    <S.ChipRow>
                      <S.Chip $width={52} $fill={alpha('#A6FF00', 0.16)}>
                        <S.ChipLabel $color={dark ? '#C3F53C' : '#248A3D'}>
                          {t('rest_timer.status.ready').toLocaleUpperCase()}
                        </S.ChipLabel>
                      </S.Chip>
                      {nextSetDetail !== undefined && <S.ChipDetail $color="#86868B">{nextSetDetail}</S.ChipDetail>}
                    </S.ChipRow>
                    <S.CompleteTitle $color={ink} numberOfLines={1}>
                      {completeTitle}
                    </S.CompleteTitle>
                  </>
                )}
              </S.MiddleColumn>
            </S.PauseZone>
            <RestTimerControls
              variant={viewState}
              onSubtract15={() => nudge(-ADJUST_STEP_MS)}
              onAdd15={() => nudge(ADJUST_STEP_MS)}
              onTogglePause={onTogglePause}
              onSkip={onDismiss}
              onLogSet={onLogSet}
            />
          </S.CardRow>
        </S.TimerCardBody>
      </S.TimerCard>
    </View>
  );
}

// session-component.tsx imports the default; keep it as the compatibility export.
export default RestTimer;

import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, G, LinearGradient as SvgLinearGradient, Path, Stop } from 'react-native-svg';
import { useAppTheme } from '@/hooks/useAppTheme';
import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { FocusState } from '@/components/presentation/workout/session/workout-focus-state';
import { detailPalette } from '../detail-tokens';
import * as S from './focus-card.styles';

const RING_RADIUS = 26;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function formatClock(ms: number): string {
  const totalSeconds = Math.ceil(Math.max(ms, 0) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function RestRing({
  fraction,
  complete,
}: {
  fraction: number;
  complete: boolean;
}) {
  const theme = useAppTheme();
  const pal = detailPalette(theme.isDark);
  const size = 64;
  const center = size / 2;
  const dash = Math.min(Math.max(fraction, 0), 1) * RING_CIRCUMFERENCE;

  return (
    <Svg width={size} height={size}>
      <Defs>
        <SvgLinearGradient id="heroRestProgress" x1="0" y1="1" x2="1" y2="0">
          <Stop offset="0" stopColor={pal.detail.restRing.from} />
          <Stop offset="1" stopColor={pal.detail.restRing.to} />
        </SvgLinearGradient>
        <SvgLinearGradient id="heroRestDone" x1="0" y1="1" x2="1" y2="0">
          <Stop offset="0" stopColor={pal.detail.restRing.doneFrom} />
          <Stop offset="1" stopColor={pal.detail.restRing.doneTo} />
        </SvgLinearGradient>
      </Defs>
      {complete ? (
        <Circle
          cx={center}
          cy={center}
          r={RING_RADIUS}
          fill="none"
          stroke="url(#heroRestDone)"
          strokeWidth={6.5}
        />
      ) : (
        <G>
          <Circle
            cx={center}
            cy={center}
            r={RING_RADIUS}
            fill="none"
            stroke={pal.detail.restRing.track}
            strokeOpacity={0.16}
            strokeWidth={6.5}
          />
          {dash > 0.01 && (
            <Circle
              cx={center}
              cy={center}
              r={RING_RADIUS}
              fill="none"
              stroke="url(#heroRestProgress)"
              strokeWidth={6.5}
              strokeLinecap="round"
              strokeDasharray={`${dash} ${RING_CIRCUMFERENCE}`}
              transform={`rotate(-90 ${center} ${center})`}
            />
          )}
        </G>
      )}
    </Svg>
  );
}

function CheckRing() {
  const size = 64;
  const center = size / 2;

  return (
    <Svg width={size} height={size}>
      <Defs>
        <SvgLinearGradient id="heroCheckGrad" x1="0" y1="1" x2="1" y2="0">
          <Stop offset="0" stopColor="#7BE000" />
          <Stop offset="1" stopColor="#D6FF52" />
        </SvgLinearGradient>
      </Defs>
      <Circle
        cx={center}
        cy={center}
        r={RING_RADIUS}
        fill="none"
        stroke="url(#heroCheckGrad)"
        strokeWidth={6.5}
      />
      <G transform={`translate(${center}, ${center}) scale(0.9)`}>
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

export interface FocusCardProps {
  focusState: FocusState;
  exerciseName: string;
  currentSetIndex: number;
  totalSets: number;
  targetReps: string | number;
  weightText: string;
  prevPerformance?: string;
  verdictText?: { label: string; detail?: string };
  restTimeRemainingMs?: number;
  restTotalMs?: number;
  prescribedRestSec?: number;
  completedStats?: { sets: number; volume: string; reps: number };
  nextExerciseName?: string;
}

/**
 * FocusCard — the hero element on the Workout Detail page (§4.2.1 / P4.1).
 * Renders one of five distinct faces driven by the focus state machine.
 */
export function FocusCard({
  focusState,
  exerciseName,
  currentSetIndex,
  totalSets,
  targetReps,
  weightText,
  prevPerformance,
  verdictText,
  restTimeRemainingMs = 0,
  restTotalMs = 60_000,
  prescribedRestSec = 60,
  completedStats,
  nextExerciseName,
}: FocusCardProps) {
  const restFraction = restTotalMs > 0 ? restTimeRemainingMs / restTotalMs : 0;

  return (
    <HomeCard hero radius={30} pad={20}>
      <S.CardContainer>
        {focusState.kind === 'start' && (
          <View>
            <S.MicroLabel>WORKOUT</S.MicroLabel>
            <S.HeroTitle>Ready when you are</S.HeroTitle>
            <S.BodyText>
              {exerciseName} · {totalSets} sets planned
            </S.BodyText>
            <S.DetailRow>
              <S.Chip $variant="neutral">
                <S.ChipText $variant="neutral">Set 1 of {totalSets}</S.ChipText>
              </S.Chip>
              <S.DeltaText>Target: {targetReps} reps</S.DeltaText>
            </S.DetailRow>
          </View>
        )}

        {focusState.kind === 'ready' && (
          <View>
            <S.MicroLabel>
              NEXT SET · SET {Math.min(currentSetIndex + 1, totalSets)} OF {totalSets}
            </S.MicroLabel>
            <S.MetricValue>
              {weightText} × {targetReps}
            </S.MetricValue>
            <S.DetailRow>
              {verdictText && (
                <S.Chip $variant="verdict">
                  <S.ChipText $variant="verdict">{verdictText.label}</S.ChipText>
                </S.Chip>
              )}
              {prevPerformance && <S.DeltaText>Last: {prevPerformance}</S.DeltaText>}
            </S.DetailRow>
          </View>
        )}

        {focusState.kind === 'resting' && (
          <S.RingCenter>
            <RestRing fraction={restFraction} complete={false} />
            <S.RingTextStack>
              <S.MicroLabel>REST · {prescribedRestSec}S PRESCRIBED</S.MicroLabel>
              <S.MetricValue>{formatClock(restTimeRemainingMs)}</S.MetricValue>
              <S.DeltaText numberOfLines={1}>
                Next: Set {Math.min(currentSetIndex + 1, totalSets)} · {weightText} × {targetReps}
              </S.DeltaText>
            </S.RingTextStack>
          </S.RingCenter>
        )}

        {focusState.kind === 'restReady' && (
          <S.RingCenter>
            <RestRing fraction={1} complete={true} />
            <S.RingTextStack>
              <S.DetailRow style={{ marginTop: 0 }}>
                <S.Chip $variant="ready">
                  <S.ChipText $variant="ready">READY</S.ChipText>
                </S.Chip>
              </S.DetailRow>
              <S.HeroTitle style={{ marginTop: 4, marginBottom: 2 }}>Rest Complete</S.HeroTitle>
              <S.DeltaText numberOfLines={1}>
                Set {Math.min(currentSetIndex + 1, totalSets)} · {weightText} × {targetReps}
              </S.DeltaText>
            </S.RingTextStack>
          </S.RingCenter>
        )}

        {focusState.kind === 'paused' && (
          <View>
            <S.DetailRow style={{ marginTop: 0 }}>
              <S.Chip $variant="paused">
                <S.ChipText $variant="paused">PAUSED</S.ChipText>
              </S.Chip>
            </S.DetailRow>
            <S.HeroTitle style={{ marginTop: 6 }}>Workout paused</S.HeroTitle>
            <S.BodyText>Elapsed time is held. Your sets and progress are saved.</S.BodyText>
          </View>
        )}

        {(focusState.kind === 'exerciseDone' || focusState.kind === 'allDone') && (
          <S.RingCenter>
            <CheckRing />
            <S.RingTextStack>
              <S.HeroTitle style={{ marginBottom: 4 }}>Exercise Complete</S.HeroTitle>
              {completedStats && (
                <S.BodyText style={{ marginTop: 0 }}>
                  {completedStats.sets} sets · {completedStats.volume} · {completedStats.reps} reps
                </S.BodyText>
              )}
              {nextExerciseName ? (
                <S.DeltaText style={{ marginTop: 4 }}>Next: {nextExerciseName}</S.DeltaText>
              ) : (
                <S.DeltaText style={{ marginTop: 4 }}>All planned exercises completed</S.DeltaText>
              )}
            </S.RingTextStack>
          </S.RingCenter>
        )}
      </S.CardContainer>
    </HomeCard>
  );
}

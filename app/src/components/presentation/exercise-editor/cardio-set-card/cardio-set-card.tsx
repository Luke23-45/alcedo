import { useTranslate } from '@tolgee/react';
import BigNumber from 'bignumber.js';
import type { TranslationKey } from '@tolgee/web';
import { CardioExerciseSetBlueprint, DistanceUnit } from '@/models/blueprint-models';
import { Duration } from '@js-joda/core';
import {
  Card,
  ChevronRightGlyph,
  Hairline,
  RowLabel,
  SegmentedControl,
  Stepper,
  SubHead,
  Toggle,
  TrashGlyph,
} from '../editor-primitives';
import {
  convertDistanceUnit,
  defaultCardioTarget,
  displayDistance,
  distanceStepFor,
  distanceUnitOptions,
  formatDistanceValue,
  formatRestValue,
  restPresetFor,
  setTrackFlag,
  trackStateOf,
  TrackKey,
} from '../exercise-editor-logic';
import {
  DistanceStepperWrap,
  HMSColon,
  HMSColonWrap,
  HMSSub,
  HMSUnit,
  HMSWrap,
  RestOptRow,
  RestValueRow,
  RestValueText,
  SegmentWrap,
  SetBottomPad,
  SetHeader,
  SetTitle,
  SetTopPad,
  TargetLabel,
  TargetLabelWrap,
  TargetRow,
  TrackCell,
  TrackColumnLeft,
  TrackColumnRight,
  TrackGrid,
  TrackHead,
  TrackLabel,
  TrackToggleGroup,
  TrashButton,
  UnitWrap,
} from './cardio-set-card.styles';

type EditorTFn = (
  key: TranslationKey,
  defaultValue?: string,
  options?: { [key: string]: string | number | bigint | boolean | Date | null | undefined },
) => string;

function trackLabel(t: EditorTFn, key: TrackKey): string {
  const map: Record<TrackKey, [TranslationKey, string]> = {
    time: ['exercise.track_time.label', 'Time'],
    distance: ['exercise.track_distance.label', 'Distance'],
    resistance: ['exercise.track_resistance.label', 'Resistance'],
    incline: ['exercise.track_incline.label', 'Incline'],
    weight: ['exercise.track_weight.label', 'Weight'],
    steps: ['exercise.track_steps.label', 'Steps'],
  };
  const [k, fallback] = map[key];
  return t(k, fallback);
}

function hmsParts(duration: Duration): { h: number; m: number; s: number } {
  const total = duration.seconds();
  return { h: Math.floor(total / 3600), m: Math.floor((total % 3600) / 60), s: total % 60 };
}

export function CardioSetCard({
  set,
  index,
  onChange,
  onRemove,
  removeDisabled,
  useImperialUnits,
  restTimersEnabled,
  onOpenRestSheet,
}: {
  set: CardioExerciseSetBlueprint;
  index: number;
  onChange: (set: CardioExerciseSetBlueprint) => void;
  onRemove: () => void;
  removeDisabled: boolean;
  useImperialUnits: boolean;
  restTimersEnabled: boolean;
  onOpenRestSheet: () => void;
}) {
  const { t } = useTranslate();
  const setName = t('exercise.set_number.label', 'Set {number}', { number: index + 1 });
  const target = set.target;
  const states = trackStateOf(set);
  const setRest = set.restBetweenSets;
  const hasRest = setRest !== undefined;
  const unitOptions = distanceUnitOptions(useImperialUnits);

  const shown = target.type === 'distance' ? displayDistance(target, useImperialUnits) : undefined;

  const switchTargetType = (type: 'distance' | 'time') => {
    if (type !== target.type) {
      onChange(set.with({ target: defaultCardioTarget(type, useImperialUnits) }));
    }
  };

  const switchDistanceUnit = (unit: DistanceUnit) => {
    if (target.type === 'distance' && target.value.unit !== unit) {
      onChange(set.with({ target: convertDistanceUnit(target, unit) }));
    }
  };

  const editDistance = (next: number) => {
    if (!shown) {
      return;
    }
    onChange(
      set.with({
        target: { type: 'distance', value: { unit: shown.unit, value: new BigNumber(next) } },
      }),
    );
  };

  const editDuration = (part: 'h' | 'm' | 's', value: number) => {
    if (target.type !== 'time') {
      return;
    }
    const { h, m, s } = hmsParts(target.value);
    onChange(
      set.with({
        target: {
          type: 'time',
          value: Duration.ofSeconds(
            (part === 'h' ? value : h) * 3600 + (part === 'm' ? value : m) * 60 + (part === 's' ? value : s),
          ),
        },
      }),
    );
  };

  const parts = target.type === 'time' ? hmsParts(target.value) : { h: 0, m: 0, s: 0 };
  const leftStates = states.filter(
    (state) => state.key === 'time' || state.key === 'distance' || state.key === 'resistance',
  );
  const rightStates = states.filter(
    (state) => state.key === 'incline' || state.key === 'weight' || state.key === 'steps',
  );

  const renderTrackCell = (state: (typeof states)[number], right: boolean) => (
    <TrackCell key={state.key} $right={right}>
      <TrackLabel numberOfLines={1}>{trackLabel(t, state.key)}</TrackLabel>
      <TrackToggleGroup>
        <Toggle
          on={state.on}
          locked={state.locked}
          label={trackLabel(t, state.key)}
          onChange={(next) => onChange(setTrackFlag(set, state.key, next))}
        />
      </TrackToggleGroup>
    </TrackCell>
  );

  const hmsUnit = (part: 'h' | 'm' | 's', value: number, max: number, label: string, sub: string) => (
    <HMSUnit>
      <Stepper small value={value} min={0} max={max} onChange={(next) => editDuration(part, next)} label={label} />
      <HMSSub>{sub}</HMSSub>
    </HMSUnit>
  );

  return (
    <Card radius={26}>
      <SetTopPad />
      <SetHeader>
        <SetTitle>{setName}</SetTitle>
        <TrashButton
          $disabled={removeDisabled}
          onPress={onRemove}
          disabled={removeDisabled}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={t('exercise.editor.remove_set', 'Remove {name}', { name: setName })}
          accessibilityState={{ disabled: removeDisabled }}
        >
          <TrashGlyph />
        </TrashButton>
      </SetHeader>

      <SegmentWrap>
        <SegmentedControl<'distance' | 'time'>
          height={40}
          options={[
            { value: 'distance', label: t('exercise.editor.cardio.target_distance', 'Distance') },
            { value: 'time', label: t('exercise.editor.cardio.target_time', 'Time') },
          ]}
          value={target.type}
          onChange={switchTargetType}
          accessibilityLabel={t('exercise.editor.cardio.target.label', 'Target type')}
        />
      </SegmentWrap>

      {target.type === 'distance' && shown ? (
        <TargetRow>
          <TargetLabelWrap>
            <TargetLabel numberOfLines={1}>{t('exercise.distance.label', 'Distance')}</TargetLabel>
          </TargetLabelWrap>
          <DistanceStepperWrap>
            <Stepper
              value={shown.value.toNumber()}
              min={0}
              step={distanceStepFor(shown.unit)}
              onChange={editDistance}
              label={t('exercise.distance.label', 'Distance')}
              format={(v) => formatDistanceValue(new BigNumber(v))}
            />
          </DistanceStepperWrap>
          <UnitWrap>
            <SegmentedControl<DistanceUnit>
              height={30}
              options={unitOptions.map((option) => ({ value: option.value, label: option.label }))}
              value={shown.unit}
              onChange={switchDistanceUnit}
              accessibilityLabel={t('exercise.editor.cardio.distance_unit', 'Distance unit')}
            />
          </UnitWrap>
        </TargetRow>
      ) : (
        <TargetRow>
          <TargetLabelWrap>
            <TargetLabel numberOfLines={1}>{t('exercise.editor.cardio.target_time', 'Time')}</TargetLabel>
          </TargetLabelWrap>
          <HMSWrap>
            {hmsUnit(
              'h',
              parts.h,
              99,
              t('exercise.editor.cardio.hours_a11y', 'Hours'),
              t('exercise.editor.cardio.hours', 'H'),
            )}
            <HMSColonWrap>
              <HMSColon>:</HMSColon>
            </HMSColonWrap>
            {hmsUnit(
              'm',
              parts.m,
              59,
              t('exercise.editor.cardio.minutes_a11y', 'Minutes'),
              t('exercise.editor.cardio.minutes', 'M'),
            )}
            <HMSColonWrap>
              <HMSColon>:</HMSColon>
            </HMSColonWrap>
            {hmsUnit(
              's',
              parts.s,
              59,
              t('exercise.editor.cardio.seconds_a11y', 'Seconds'),
              t('exercise.editor.cardio.seconds', 'S'),
            )}
          </HMSWrap>
        </TargetRow>
      )}

      <TrackHead>
        <SubHead>{t('exercise.editor.track.label', 'Track').toLocaleUpperCase()}</SubHead>
      </TrackHead>
      <TrackGrid>
        <TrackColumnLeft>{leftStates.map((state) => renderTrackCell(state, false))}</TrackColumnLeft>
        <TrackColumnRight>{rightStates.map((state) => renderTrackCell(state, true))}</TrackColumnRight>
      </TrackGrid>

      {restTimersEnabled ? (
        <>
          <Hairline />
          <RestOptRow>
            <RowLabel>{t('exercise.editor.rest.label', 'Rest between sets')}</RowLabel>
            <Toggle
              on={hasRest}
              label={t('exercise.editor.rest.label', 'Rest between sets')}
              onChange={(on) => onChange(set.with({ restBetweenSets: on ? restPresetFor(60) : undefined }))}
            />
          </RestOptRow>
          {setRest ? (
            <RestValueRow
              onPress={onOpenRestSheet}
              accessibilityRole="button"
              accessibilityLabel={t('exercise.editor.rest.label', 'Rest between sets')}
              accessibilityValue={{ text: formatRestValue(setRest) }}
            >
              <RestValueText>{formatRestValue(setRest)}</RestValueText>
              <ChevronRightGlyph />
            </RestValueRow>
          ) : null}
        </>
      ) : null}
      <SetBottomPad />
    </Card>
  );
}

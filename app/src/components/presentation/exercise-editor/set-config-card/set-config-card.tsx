import { useTranslate } from '@tolgee/react';
import { WeightedExerciseBlueprint } from '@/models/blueprint-models';
import { Card, Hairline, RowLabel, SegmentedControl, Stepper } from '../editor-primitives';
import {
  applyRepsMode,
  dropSetTail,
  RepsMode,
  repsModeOf,
  resizeWeightedSets,
  updateWeightedSet,
} from '../exercise-editor-logic';
import {
  ConfigPad,
  ConfigRow,
  RowCaptionUnder,
  RowInlineCaption,
  RowTextColumn,
  SectionGap,
  SetCell,
  SetCellInner,
  SetCellLabel,
  SetCellStepper,
  SetGrid,
  TailCaption,
} from './set-config-card.styles';

export function SetConfigCard({
  exercise,
  onChange,
}: {
  exercise: WeightedExerciseBlueprint;
  onChange: (exercise: WeightedExerciseBlueprint) => void;
}) {
  const { t } = useTranslate();
  const sets = exercise.plannedSets;
  const mode: RepsMode = repsModeOf(exercise);
  const first = sets[0]?.reps ?? { min: 10, max: 10 };
  const tail = dropSetTail(sets.map((s) => s.reps));
  const setNumber = (index: number) => t('exercise.set_number.label', 'Set {number}', { number: index + 1 });

  return (
    <Card>
      <ConfigPad>
        <SegmentedControl<RepsMode>
          options={[
            { value: 'fixed', label: t('exercise.editor.reps_mode.fixed', 'Fixed') },
            { value: 'range', label: t('exercise.editor.reps_mode.range', 'Range') },
            { value: 'perSet', label: t('exercise.editor.reps_mode.per_set', 'Per set') },
          ]}
          value={mode}
          onChange={(next) => onChange(applyRepsMode(exercise, next))}
          accessibilityLabel={t('exercise.editor.reps_mode.label', 'Reps mode')}
        />

        <SectionGap />

        <ConfigRow>
          <RowTextColumn>
            <RowLabel>{t('exercise.sets.label', 'Sets')}</RowLabel>
            {mode === 'perSet' ? (
              <RowInlineCaption>{t('exercise.editor.per_set.caption', 'steppers wrap 3 per row')}</RowInlineCaption>
            ) : null}
          </RowTextColumn>
          <Stepper
            value={sets.length}
            onChange={(next) => onChange(resizeWeightedSets(exercise, next))}
            label={t('exercise.sets.label', 'Sets')}
            min={1}
          />
        </ConfigRow>

        {mode === 'perSet' ? (
          <>
            <SetGrid>
              {sets.map((set, index) => (
                <SetCell key={index}>
                  <SetCellInner>
                    <SetCellLabel>
                      {t('exercise.editor.set_cell.label', 'Set {number}', { number: index + 1 }).toUpperCase()}
                    </SetCellLabel>
                    <SetCellStepper>
                      <Stepper
                        small
                        value={set.reps.max}
                        onChange={(next) => onChange(updateWeightedSet(exercise, index, { min: next, max: next }))}
                        label={setNumber(index)}
                        min={1}
                      />
                    </SetCellStepper>
                  </SetCellInner>
                </SetCell>
              ))}
            </SetGrid>
            {tail ? (
              <TailCaption>
                {t('exercise.editor.drop_set_tail', 'Drop-set tail: sets {from}–{to} step down.', {
                  from: tail.from,
                  to: tail.to,
                })}
              </TailCaption>
            ) : null}
          </>
        ) : (
          <>
            <Hairline />
            {mode === 'fixed' ? (
              <ConfigRow>
                <RowTextColumn>
                  <RowLabel>{t('exercise.reps.label', 'Reps')}</RowLabel>
                  <RowCaptionUnder>{t('exercise.editor.reps.caption_fixed', 'Same target every set')}</RowCaptionUnder>
                </RowTextColumn>
                <Stepper
                  value={first.max}
                  onChange={(next) =>
                    onChange(
                      exercise.with({
                        plannedSets: sets.map(() => ({ reps: { min: next, max: next } })),
                      }),
                    )
                  }
                  label={t('exercise.reps.label', 'Reps')}
                  min={1}
                />
              </ConfigRow>
            ) : (
              <>
                <ConfigRow>
                  <RowTextColumn>
                    <RowLabel>{t('exercise.min_reps.label', 'Min reps')}</RowLabel>
                  </RowTextColumn>
                  <Stepper
                    value={first.min}
                    onChange={(next) =>
                      onChange(
                        exercise.with({
                          plannedSets: sets.map(() => ({ reps: { min: next, max: Math.max(next, first.max) } })),
                        }),
                      )
                    }
                    label={t('exercise.min_reps.label', 'Min reps')}
                    min={1}
                  />
                </ConfigRow>
                <Hairline />
                <ConfigRow>
                  <RowTextColumn>
                    <RowLabel>{t('exercise.max_reps.label', 'Max reps')}</RowLabel>
                  </RowTextColumn>
                  <Stepper
                    value={first.max}
                    onChange={(next) =>
                      onChange(
                        exercise.with({
                          plannedSets: sets.map(() => ({ reps: { min: Math.min(first.min, next), max: next } })),
                        }),
                      )
                    }
                    label={t('exercise.max_reps.label', 'Max reps')}
                    min={1}
                  />
                </ConfigRow>
              </>
            )}
          </>
        )}
      </ConfigPad>
    </Card>
  );
}

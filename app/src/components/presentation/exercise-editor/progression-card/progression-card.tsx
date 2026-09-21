import { useState } from 'react';
import { useTranslate } from '@tolgee/react';
import BigNumber from 'bignumber.js';
import {
  ProgressionAxis,
  ProgressionRule,
  WeightedExerciseBlueprint,
  defaultCeilingFor,
} from '@/models/blueprint-models';
import { Card, ChevronRightGlyph, Hairline, RowLabel, SegmentedControl, Stepper, Toggle } from '../editor-primitives';
import {
  defaultProgressionRule,
  progressionSummary,
  scopeFromSegment,
  scopeSegmentOf,
  ScopeSegment,
} from '../exercise-editor-logic';
import {
  AddRuleButton,
  AddRuleText,
  DeleteRule,
  DeleteRuleText,
  ExpandedPad,
  NoLoadWarning,
  ProgressionLabel,
  ProgressionRow,
  ProgressionSummary,
  ProgressionTextColumn,
  RuleBlock,
  RuleHeader,
  RuleRow,
  RuleTitle,
} from './progression-card.styles';

function ruleWithAxis(rule: ProgressionRule, axis: ProgressionAxis, defaultCeiling: BigNumber): ProgressionRule {
  if (axis === 'load') {
    return rule.with({ axis, step: BigNumber(2.5), ceiling: undefined, onCeiling: undefined });
  }
  return rule.with({ axis, step: BigNumber(1), ceiling: defaultCeiling });
}

export function ProgressionCard({
  exercise,
  onChange,
  weightSuffix,
}: {
  exercise: WeightedExerciseBlueprint;
  onChange: (exercise: WeightedExerciseBlueprint) => void;
  weightSuffix: string;
}) {
  const { t } = useTranslate();
  const [expanded, setExpanded] = useState(false);
  const rules = exercise.progression;
  const summary = progressionSummary(rules, weightSuffix);
  const defaultCeiling = defaultCeilingFor(exercise);
  const canMoveLoad = exercise.resistance !== 'none';

  const replaceRule = (index: number, rule: ProgressionRule) =>
    onChange(exercise.with({ progression: rules.map((existing, i) => (i === index ? rule : existing)) }));

  return (
    <Card radius={20} active={expanded}>
      <ProgressionRow
        onPress={() => setExpanded((open) => !open)}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={t('exercise.progressive_overload.label', 'Progressive Overload')}
      >
        <ProgressionTextColumn>
          <ProgressionLabel>{t('exercise.progressive_overload.label', 'Progressive Overload')}</ProgressionLabel>
          {!expanded && summary ? <ProgressionSummary numberOfLines={1}>{summary}</ProgressionSummary> : null}
        </ProgressionTextColumn>
        {expanded ? null : <ChevronRightGlyph />}
      </ProgressionRow>
      {expanded ? (
        <ExpandedPad>
          {rules.map((rule, index) => (
            <RuleBlock key={index}>
              {index > 0 ? <Hairline /> : null}
              {rules.length > 1 ? (
                <RuleHeader>
                  <RuleTitle>{t('exercise.editor.progression.rule_title', 'Rule {n}', { n: index + 1 })}</RuleTitle>
                  <DeleteRule
                    onPress={() => onChange(exercise.with({ progression: rules.filter((_, i) => i !== index) }))}
                    accessibilityRole="button"
                    accessibilityLabel={t('exercise.editor.progression.remove', 'Remove rule')}
                  >
                    <DeleteRuleText>{t('exercise.editor.progression.remove', 'Remove rule')}</DeleteRuleText>
                  </DeleteRule>
                </RuleHeader>
              ) : null}
              <SegmentedControl<ProgressionAxis>
                height={36}
                options={[
                  { value: 'load', label: t('exercise.editor.progression.axis_load', 'Load') },
                  { value: 'reps', label: t('exercise.editor.progression.axis_reps', 'Reps') },
                ]}
                value={rule.axis}
                onChange={(axis) => replaceRule(index, ruleWithAxis(rule, axis, defaultCeiling))}
                accessibilityLabel={t('exercise.editor.progression.axis.label', 'Progress on')}
              />
              {rule.axis === 'load' && !canMoveLoad ? (
                <NoLoadWarning>
                  {t(
                    'exercise.editor.progression.no_load',
                    'This exercise logs no weight, so a load rule cannot move it.',
                  )}
                </NoLoadWarning>
              ) : null}
              <RuleRow>
                <RowLabel>{t('exercise.editor.progression.increment', 'Increment')}</RowLabel>
                <Stepper
                  value={rule.step.toNumber()}
                  onChange={(next) => replaceRule(index, rule.with({ step: BigNumber(next) }))}
                  label={t('exercise.editor.progression.increment', 'Increment')}
                  min={rule.axis === 'load' ? 0.25 : 1}
                  step={rule.axis === 'load' ? 0.25 : 1}
                  format={(value) => (rule.axis === 'load' ? `${value} ${weightSuffix}` : `+${value}`)}
                />
              </RuleRow>
              <SegmentedControl<ScopeSegment>
                height={36}
                options={[
                  { value: 'top', label: t('exercise.editor.progression.scope_top', 'Top set') },
                  { value: 'all', label: t('exercise.editor.progression.scope_all', 'All sets') },
                ]}
                value={scopeSegmentOf(rule.scope)}
                onChange={(segment) => replaceRule(index, rule.with({ scope: scopeFromSegment(segment, rule.scope) }))}
                accessibilityLabel={t('exercise.editor.progression.scope.label', 'Apply to')}
              />
              {rule.axis === 'reps' ? (
                <>
                  <RuleRow>
                    <RowLabel>{t('exercise.editor.progression.ceiling', 'Rep ceiling')}</RowLabel>
                    <Toggle
                      on={rule.ceiling !== undefined}
                      label={t('exercise.editor.progression.ceiling', 'Rep ceiling')}
                      onChange={(on) => replaceRule(index, rule.with({ ceiling: on ? defaultCeiling : undefined }))}
                    />
                  </RuleRow>
                  {rule.ceiling !== undefined ? (
                    <RuleRow>
                      <RowLabel>{t('exercise.editor.progression.ceiling_value', 'Ceiling reps')}</RowLabel>
                      <Stepper
                        value={rule.ceiling.toNumber()}
                        onChange={(next) => replaceRule(index, rule.with({ ceiling: BigNumber(next) }))}
                        label={t('exercise.editor.progression.ceiling_value', 'Ceiling reps')}
                        min={1}
                      />
                    </RuleRow>
                  ) : null}
                  {rule.ceiling !== undefined && index < rules.length - 1 ? (
                    <RuleRow>
                      <RowLabel>{t('exercise.editor.progression.reset', 'Reset on ceiling')}</RowLabel>
                      <Toggle
                        on={rule.onCeiling === 'reset'}
                        label={t('exercise.editor.progression.reset', 'Reset on ceiling')}
                        onChange={(on) => replaceRule(index, rule.with({ onCeiling: on ? 'reset' : undefined }))}
                      />
                    </RuleRow>
                  ) : null}
                </>
              ) : null}
            </RuleBlock>
          ))}
          <AddRuleButton
            onPress={() => onChange(exercise.with({ progression: [...rules, defaultProgressionRule()] }))}
            accessibilityRole="button"
            accessibilityLabel={t('exercise.editor.progression.add', 'Add progression')}
          >
            <AddRuleText>{t('exercise.editor.progression.add', 'Add progression')}</AddRuleText>
          </AddRuleButton>
        </ExpandedPad>
      ) : null}
    </Card>
  );
}

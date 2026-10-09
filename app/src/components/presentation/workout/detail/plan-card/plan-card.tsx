import React, { useState } from 'react';
import { View } from 'react-native';
import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { RecordedWeightedExercise } from '@/models/session-models';
import { Rest } from '@/models/blueprint-models';
import { RestSheet } from '@/components/presentation/exercise-editor/rest-sheet/rest-sheet';
import { calculateProgressionVerdict, formatVerdictText } from '../progression-verdict';
import * as S from './plan-card.styles';

export interface PlanCardProps {
  exercise: RecordedWeightedExercise;
  supersetPartnerName?: string;
  onUpdateRest: (rest: Rest) => void;
  onUpdateNotes: (notes: string) => void;
}

/**
 * PLAN & PROGRESSION card (§4.2.4 / P4.4).
 * Displays the progression verdict chip, editable rest prescription,
 * superset partner badge, read-only progression rules, and inline notes editor.
 */
export function PlanCard({
  exercise,
  supersetPartnerName,
  onUpdateRest,
  onUpdateNotes,
}: PlanCardProps) {
  const [restSheetOpen, setRestSheetOpen] = useState(false);
  const [notes, setNotes] = useState(exercise.notes ?? '');

  const verdict = calculateProgressionVerdict(exercise);
  const verdictFormatted = formatVerdictText(verdict, exercise.potentialSets[0]?.weight.unit ?? 'kg');

  const rest = exercise.blueprint.restBetweenSets;
  const restText = `${rest.minRest.seconds()}–${rest.maxRest.seconds()} s`;

  const progressionRules = exercise.blueprint.progression;

  const handleNotesBlur = () => {
    if (notes !== (exercise.notes ?? '')) {
      onUpdateNotes(notes);
    }
  };

  return (
    <>
      <HomeCard radius={24} pad={16}>
        <S.Container>
          <S.HeaderRow>
            <S.CardTitle>PLAN & PROGRESSION</S.CardTitle>
            {supersetPartnerName && (
              <S.SupersetBadge>
                <S.SupersetText>SUPERSET → {supersetPartnerName}</S.SupersetText>
              </S.SupersetBadge>
            )}
          </S.HeaderRow>

          {/* Verdict Chip */}
          <S.ChipRow>
            <S.VerdictPill>
              <S.VerdictLabel>{verdictFormatted.label}</S.VerdictLabel>
              {verdictFormatted.detail && (
                <S.VerdictDetail>· {verdictFormatted.detail}</S.VerdictDetail>
              )}
            </S.VerdictPill>
          </S.ChipRow>

          {/* Editable Rest Line */}
          <S.SettingLine onPress={() => setRestSheetOpen(true)} hitSlop={6}>
            <S.SettingLabel>Rest Between Sets</S.SettingLabel>
            <S.SettingValue>{restText} ›</S.SettingValue>
          </S.SettingLine>

          {/* Read-only rules if configured */}
          {progressionRules && progressionRules.length > 0 && (
            <S.RulesBlock>
              <S.CardTitle style={{ marginBottom: 4 }}>Progression Rules</S.CardTitle>
              {progressionRules.map((rule, idx) => (
                <S.RuleLine key={idx}>
                  • {rule.axis === 'load' ? `Load +${rule.step.toString()} kg` : `Reps +${rule.step.toString()}`}
                  {rule.ceiling ? ` up to ${rule.ceiling.toString()}` : ''}
                  {rule.onCeiling === 'reset' ? ' (resets ladder)' : ''}
                </S.RuleLine>
              ))}
            </S.RulesBlock>
          )}

          {/* Inline Notes Editor */}
          <View style={{ gap: 4 }}>
            <S.CardTitle>Notes</S.CardTitle>
            <S.NotesInput
              value={notes}
              onChangeText={setNotes}
              onBlur={handleNotesBlur}
              placeholder="Add notes for this exercise..."
              placeholderTextColor="#8E8E93"
              multiline
            />
          </View>
        </S.Container>
      </HomeCard>

      <RestSheet
        rest={rest}
        onChange={(r) => {
          onUpdateRest(r);
          setRestSheetOpen(false);
        }}
        onClose={() => setRestSheetOpen(false)}
      />
    </>
  );
}

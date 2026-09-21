import { Fragment } from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useTranslate } from '@tolgee/react';
import type { SessionBlueprintDiff } from '@/models/blueprint-diff';
import { describeChange, type ChangeView } from '../plan-diff-logic';
import { ModeSegmentedControl, type PlanDiffMode } from '../mode-segmented-control/mode-segmented-control';
import { DiffReviewCard, DiffChangeRow, ExerciseGroupHeader } from '../diff-review-card/diff-review-card';
import * as S from './update-plan-screen.styles';

/** Quiet check glyph for the no-changes empty state. */
function EmptyGlyph({ dark }: { dark: boolean }) {
  const color = dark ? '#8E8E93' : '#AEAEB2';
  return (
    <Svg width={28} height={28} viewBox="0 0 28 28">
      <Circle cx={14} cy={14} r={13} fill="none" stroke={color} strokeWidth={1.6} />
      <Path
        d="M9 14.2l3.4 3.4L19 11"
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export interface UpdatePlanScreenProps {
  canChooseMode: boolean;
  mode: PlanDiffMode;
  /** Original session name (segment label + update-mode consequence). */
  sessionName: string;
  /** Destination-aware subtitle name: the existing or the new workout name. */
  targetName: string;
  saveAsNew: boolean;
  diff: SessionBlueprintDiff;
  selectedIds: Set<string>;
  selectedCount: number;
  onToggleChange: (id: string) => void;
  onModeChange: (mode: PlanDiffMode) => void;
}

/**
 * The diff-save review screen from the reference: intro, update/save-as-new
 * segmented control with its consequence line, then the review cards —
 * neutral session, green added, red removed, amber modified.
 */
export function UpdatePlanScreen({
  canChooseMode,
  mode,
  sessionName,
  targetName,
  saveAsNew,
  diff,
  selectedIds,
  selectedCount,
  onToggleChange,
  onModeChange,
}: UpdatePlanScreenProps) {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const dark = theme.isDark;

  const renderRow = (view: ChangeView) => (
    <DiffChangeRow key={view.id} view={view} checked={selectedIds.has(view.id)} onToggle={onToggleChange} />
  );

  const sessionRows = diff.sessionChanges.map((change) => renderRow(describeChange(t, change)));
  const addedRows = diff.addedExercises.map((change) => renderRow(describeChange(t, change)));
  const removedRows = diff.removedExercises.map((change) => renderRow(describeChange(t, change)));

  const modifiedGroups = diff.modifiedExercises.map((modification) => (
    <Fragment key={`modified-${modification.exerciseIndex}`}>
      <ExerciseGroupHeader name={modification.exerciseName} />
      {modification.changes.map((change) => renderRow(describeChange(t, change)))}
    </Fragment>
  ));
  const reorderedGroups = diff.reorderedExercises.map((change) => (
    <Fragment key={change.id}>
      <ExerciseGroupHeader name={change.exerciseName} />
      {renderRow(describeChange(t, change))}
    </Fragment>
  ));
  const hasModified = modifiedGroups.length > 0 || reorderedGroups.length > 0;

  return (
    <S.ScreenContent>
      <S.IntroTitle $dark={dark}>{t('plan.diff.intro.title')}</S.IntroTitle>
      <S.IntroSubtitle $dark={dark}>
        {t(saveAsNew ? 'plan.diff.intro.subtitle_new' : 'plan.diff.intro.subtitle_update', {
          workoutName: targetName,
        })}
      </S.IntroSubtitle>

      {canChooseMode && (
        <S.ModeBlock>
          <ModeSegmentedControl mode={mode} sessionName={sessionName} onModeChange={onModeChange} />
          <S.ConsequenceLine $dark={dark}>
            {saveAsNew ? t('plan.diff.mode.new_consequence') : t('plan.diff.mode.update_consequence', { sessionName })}
          </S.ConsequenceLine>
        </S.ModeBlock>
      )}

      {diff.hasChanges ? (
        <Fragment>
          <S.ReviewHeader>
            <S.ReviewTitle $dark={dark}>{t('plan.diff.review.title')}</S.ReviewTitle>
            <S.SelectedChip $dark={dark}>
              <S.SelectedChipText $dark={dark}>
                {t('plan.diff.review.selected', { count: selectedCount })}
              </S.SelectedChipText>
            </S.SelectedChip>
          </S.ReviewHeader>
          <S.CardsWrap>
            {sessionRows.length > 0 && (
              <DiffReviewCard
                tone="neutral"
                label={t('plan.diff.review.session')}
                countText={t('plan.diff.review.card_count', { count: sessionRows.length })}
              >
                {sessionRows}
              </DiffReviewCard>
            )}
            {addedRows.length > 0 && (
              <DiffReviewCard
                tone="added"
                label={t('plan.diff.review.added')}
                countText={t('plan.diff.review.card_count', { count: addedRows.length })}
              >
                {addedRows}
              </DiffReviewCard>
            )}
            {removedRows.length > 0 && (
              <DiffReviewCard
                tone="removed"
                label={t('plan.diff.review.removed')}
                countText={t('plan.diff.review.card_count', { count: removedRows.length })}
              >
                {removedRows}
              </DiffReviewCard>
            )}
            {hasModified && (
              <DiffReviewCard tone="modified" label={t('plan.diff.review.modified')}>
                {modifiedGroups}
                {reorderedGroups}
              </DiffReviewCard>
            )}
          </S.CardsWrap>
        </Fragment>
      ) : (
        <S.EmptyState>
          <EmptyGlyph dark={dark} />
          <S.EmptyText $dark={dark}>{t('plan.diff.no_changes.body')}</S.EmptyText>
        </S.EmptyState>
      )}
    </S.ScreenContent>
  );
}

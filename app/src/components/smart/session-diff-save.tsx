import styled from 'styled-components/native';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslate } from '@tolgee/react';
import FullHeightScrollView from '@/components/layout/full-height-scroll-view';
import { PlanDiffBackground } from '@/components/presentation/plan-diff/plan-diff-background';
import { PlanCommitBar } from '@/components/presentation/plan-diff/plan-commit-bar/plan-commit-bar';
import {
  UpdatePlanScreen,
  type UpdatePlanScreenProps,
} from '@/components/presentation/plan-diff/update-plan-screen/update-plan-screen';
import type { PlanDiffMode } from '@/components/presentation/plan-diff/mode-segmented-control/mode-segmented-control';
import {
  createAddNewWorkoutDiff,
  createUpdateExistingWorkoutDiff,
  defaultSelection,
  selectedCount,
  selectedDiff,
  toggleSelected,
} from '@/components/presentation/plan-diff/plan-diff-logic';
import { EmptySessionBlueprintDiff } from '@/models/blueprint-diff';
import { useAppSelector, useAppSelectorWithArg } from '@/store';
import {
  applyDiffToPlan,
  fetchUpcomingSessions,
  selectNewWorkoutName,
  selectPendingPlanDiff,
  setPendingPlanDiff,
} from '@/store/program';
import { useOnDismiss } from '@/hooks/useOnDismiss';
import { useAppTheme } from '@/hooks/useAppTheme';

/** 44pt Reset target in the nav bar, 15/400 per the reference. */
const ResetAction = styled(Pressable)`
  min-width: 44px;
  min-height: 44px;
  justify-content: center;
  align-items: flex-end;
  padding-right: 8px;
`;

const ResetLabel = styled.Text<{ $dark: boolean }>`
  font-size: 15px;
  line-height: 20px;
  font-weight: 400;
  letter-spacing: -0.2px;
  color: ${({ $dark }) => ($dark ? '#FF9F0A' : '#B25000')};
`;

export function SessionDiffSaveEditor() {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const dark = theme.isDark;
  const dispatch = useDispatch();
  const { dismiss } = useRouter();

  const currentPlanDiff = useAppSelector(selectPendingPlanDiff);
  const [isCreatingNewWorkout, setIsCreatingNewWorkout] = useState(false);
  const newWorkoutName = useAppSelectorWithArg(selectNewWorkoutName, currentPlanDiff?.programId ?? '');

  const canEditExistingWorkout = currentPlanDiff?.type === 'diff';
  const saveAsNewWorkout = isCreatingNewWorkout || !canEditExistingWorkout;

  // The store's pending diff is the single source of truth: its change IDs are
  // stable, so checkbox state survives re-renders. A mode switch recomputes the
  // diff and writes it back into the store (same as the legacy screen).
  const diff = currentPlanDiff?.diff ?? EmptySessionBlueprintDiff;
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => defaultSelection(diff));

  // A new pending diff (fresh review or mode switch) means everything checked.
  useEffect(() => {
    setSelectedIds(defaultSelection(diff));
  }, [diff]);

  useOnDismiss(() => {
    dispatch(setPendingPlanDiff(undefined));
  });

  const handleSaveModeChange = (mode: PlanDiffMode) => {
    if (!currentPlanDiff) {
      return;
    }
    const createNew = mode === 'new';
    setIsCreatingNewWorkout(createNew);
    const newDiff = createNew
      ? createAddNewWorkoutDiff(currentPlanDiff, newWorkoutName)
      : createUpdateExistingWorkoutDiff(currentPlanDiff);
    dispatch(setPendingPlanDiff({ ...currentPlanDiff, diff: newDiff }));
  };

  const handleReset = () => {
    setSelectedIds(defaultSelection(diff));
  };

  const handleToggleChange = (id: string) => {
    setSelectedIds((previous) => toggleSelected(diff, previous, id));
  };

  const save = () => {
    if (currentPlanDiff) {
      const committed = selectedDiff(diff, selectedIds);
      const payload = saveAsNewWorkout
        ? { type: 'add' as const, programId: currentPlanDiff.programId, diff: committed }
        : { ...currentPlanDiff, diff: committed };
      dispatch(applyDiffToPlan(payload));
    }
    dispatch(fetchUpcomingSessions());
    dismiss();
  };

  const count = selectedCount(diff, selectedIds);
  const saveDisabled = count === 0;

  const originalSessionName = currentPlanDiff?.diff.originalSession.name ?? '';
  const targetName = saveAsNewWorkout ? newWorkoutName : originalSessionName;

  const screenProps: UpdatePlanScreenProps = {
    canChooseMode: canEditExistingWorkout,
    mode: saveAsNewWorkout ? 'new' : 'update',
    sessionName: originalSessionName,
    targetName,
    saveAsNew: saveAsNewWorkout,
    diff,
    selectedIds,
    selectedCount: count,
    onToggleChange: handleToggleChange,
    onModeChange: handleSaveModeChange,
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: t('plan.diff.dialog.title'),
          headerRight: () => (
            <ResetAction
              onPress={handleReset}
              accessibilityRole="button"
              accessibilityLabel={t('plan.diff.reset.button')}
            >
              <ResetLabel $dark={dark}>{t('plan.diff.reset.button')}</ResetLabel>
            </ResetAction>
          ),
        }}
      />
      <FullHeightScrollView
        screenBackground={<PlanDiffBackground />}
        floatingChildren={
          <PlanCommitBar selectedCount={count} saveDisabled={saveDisabled} onSave={save} onDiscard={dismiss} />
        }
      >
        <UpdatePlanScreen {...screenProps} />
      </FullHeightScrollView>
    </>
  );
}

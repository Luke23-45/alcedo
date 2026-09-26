import { useAppSelector, useAppSelectorWithArg } from '@/store';
import { getPlanDiff } from '@/store/program/helpers';
import { selectActiveProgram, setPendingPlanDiff } from '@/store/program';
import { awaitSessionFinished, selectSession, sessionFinished } from '@/store/stored-sessions';
import { useDispatch } from 'react-redux';

/**
 * Finishes the given session and returns whether the saved session
 * differs from the active plan, so the caller can open the diff-save modal.
 *
 * The returned function is async: it resolves only after the final content and the
 * cleared active flag are durable. Callers must await it before navigating away -
 * otherwise an app kill in between resurrects the finished workout on restart.
 */
export function useFinishWorkout(sessionId: string | undefined) {
  const dispatch = useDispatch();
  const session = useAppSelectorWithArg(selectSession, sessionId ?? '');
  const program = useAppSelector(selectActiveProgram);
  const programId = useAppSelector((x) => x.program.activePlanId);
  return async (): Promise<boolean> => {
    if (!sessionId || !session) {
      return false;
    }
    const diff = getPlanDiff(program, session, programId);
    if (diff) {
      dispatch(setPendingPlanDiff(diff));
    }
    dispatch(sessionFinished(sessionId));
    await awaitSessionFinished(sessionId);
    return !!diff;
  };
}

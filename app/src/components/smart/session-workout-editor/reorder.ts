import { Session } from '@/models/session-models';

/**
 * Reorder that keeps blueprint.exercises and recordedExercises aligned 1-for-1.
 * Reorder bypasses the name/notes draft entirely: index changes commit to the
 * store on drop, immediately, and are never lost by a Cancel.
 */
export function reorderExercises(session: Session, from: number, to: number): Session {
  if (from === to) {
    return session;
  }
  const move = <T>(items: T[]): T[] => {
    const next = [...items];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item!);
    return next;
  };
  return session.with({
    blueprint: session.blueprint.with({ exercises: move(session.blueprint.exercises) }),
    recordedExercises: move(session.recordedExercises),
  });
}

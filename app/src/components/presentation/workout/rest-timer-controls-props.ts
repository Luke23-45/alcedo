export type RestTimerControlsVariant = 'running' | 'paused' | 'complete';

export interface RestTimerControlsProps {
  variant: RestTimerControlsVariant;
  onSubtract15: () => void;
  onAdd15: () => void;
  onTogglePause: () => void;
  /** Skips the rest: dismisses the timer, keeping the existing undo snackbar. */
  onSkip: () => void;
  /**
   * Complete state only: jumps to logging the next set. Optional — when the
   * host doesn't wire it, the Complete state falls back to the Skip pill so
   * the timer never strands the user without an action.
   */
  onLogSet?: () => void;
}

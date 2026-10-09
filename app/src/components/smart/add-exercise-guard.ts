/**
 * Double-tap guard for the add-exercise flow. Both entry points (the session
 * screen's add action and the workout editor's add row) compute the new
 * exercise index from a render snapshot, then dispatch the placeholder insert
 * and push the editor. Two taps inside the same tick see the same snapshot:
 * two placeholders are inserted but both editors address the same index, so
 * the first draft clobbers the second on dismiss. The second claim inside the
 * window is refused; the already-open editor owns the slot.
 */
let lastClaimAt = 0;
const CLAIM_WINDOW_MS = 800;

export function claimAddExerciseSlot(): boolean {
  const now = Date.now();
  if (now - lastClaimAt < CLAIM_WINDOW_MS) {
    return false;
  }
  lastClaimAt = now;
  return true;
}

/**
 * RECENTLY VIEWED tracking for the exercise picker.
 *
 * Deliberately in-memory and module-level, not persisted: the recently-viewed
 * list is an ephemeral navigation aid for the current app run (the picker is a
 * transient sheet, not a history surface). It resets on app restart by design.
 * Capped at 5, most-recent-first, de-duplicated by exact exercise name.
 * Updated when a detail screen is opened from the picker ("Show Trends").
 */

const MAX_RECENT_VIEWS = 5;

let recentViews: string[] = [];

/** Most-recent-first snapshot of recently viewed exercise names. */
export function getRecentViews(): string[] {
  return [...recentViews];
}

/** Record an exercise detail opened from the picker. */
export function recordRecentView(exerciseName: string): void {
  const name = exerciseName.trim();
  if (!name) {
    return;
  }
  recentViews = [name, ...recentViews.filter((x) => x !== name)].slice(0, MAX_RECENT_VIEWS);
}

/** Test-only reset. */
export function clearRecentViews(): void {
  recentViews = [];
}

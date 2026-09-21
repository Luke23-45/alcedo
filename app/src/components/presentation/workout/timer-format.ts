/**
 * Pure time formatting for the session timers. Kept free of React Native
 * imports so the simulation suite can pin the timer readouts without a
 * device. timer-pane re-exports this; import from there in components.
 */
export function formatTimeSpan(ms: number): string {
  const totalSeconds = Math.ceil(Math.max(ms, 0) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

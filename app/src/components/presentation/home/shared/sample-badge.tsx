/**
 * The SAMPLE marker is retired: every call site (home, stats, history, feed,
 * summary, workout) renders through this component, so returning null removes
 * the label app-wide while leaving all layouts, props, and data untouched.
 */
export function SampleBadge({ compact: _compact }: { compact?: boolean }): null {
  void _compact;
  return null;
}

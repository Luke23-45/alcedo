import { Href } from 'expo-router';

/**
 * Route helper for the profile editor. The editor itself moved to
 * `ProfileEditorScreen` (`components/smart/profile-editor-screen.tsx`); this
 * module keeps the href so existing callers (feed menu, feed) don't break.
 */
export function getFeedProfileEditorHref(opts?: { focusPublish?: boolean }): Href {
  return `/feed/profile-editor${opts?.focusPublish ? '?focusPublish=1' : ''}` as Href;
}

/**
 * Google OAuth client configuration for Sign in with Google.
 *
 * Setup (one time, in Google Cloud Console):
 * 1. Create OAuth 2.0 client IDs: one "Web application" (used as
 *    `webClientId`) and one "iOS" (used as `iosClientId`) for the bundle id
 *    `com.limajuice.liftlog`. Android uses the app's SHA-1 fingerprint —
 *    no client id is pasted here.
 * 2. Copy the iOS client's *reversed* client id
 *    (`com.googleusercontent.apps.<id>`) into the expo config plugin
 *    options for `@react-native-google-signin/google-signin` in app.json
 *    (`iosUrlScheme`).
 * 3. Paste the client ids below.
 *
 * Until real values are pasted, `isGoogleAuthConfigured()` is false and the
 * Account screen shows setup guidance instead of attempting sign-in — the
 * app never crashes on missing config.
 */
export const googleAuthConfig = {
  webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
} as const;

const PLACEHOLDER_PREFIX = 'YOUR_';

export function isGoogleAuthConfigured(): boolean {
  return (
    !googleAuthConfig.webClientId.startsWith(PLACEHOLDER_PREFIX) &&
    !googleAuthConfig.iosClientId.startsWith(PLACEHOLDER_PREFIX)
  );
}

/**
 * Makes `props.theme` fully typed inside every styled component, with no
 * generics at the call site. Keep this file in the project's `include` path
 * in tsconfig.json — it is never imported.
 *
 * React Native: augment 'styled-components/native' (below).
 * Web:          change both strings to 'styled-components'.
 */
import 'styled-components/native';
import type { AppTheme } from './theme';

declare module 'styled-components/native' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends AppTheme {}
}

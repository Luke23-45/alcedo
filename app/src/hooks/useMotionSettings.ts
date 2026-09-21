import { useAppSelector } from '@/store';
import { useReducedMotion as useOsReducedMotion } from 'react-native-reanimated';

/**
 * App-level reduced motion: true when the OS requests it OR the user flipped
 * the Reduce Motion switch in Preferences. Every animation that honors the OS
 * setting must read this hook instead, so the in-app toggle genuinely calms
 * motion across the app.
 */
export function useAppReducedMotion(): boolean {
  const userPref = useAppSelector((state) => state.settings.reduceMotion);
  const osReduced = useOsReducedMotion();
  return userPref || osReduced;
}

/**
 * Whether earned-celebration animations (kudos bursts, PR fanfare) may play.
 * Celebrations are decorative: they need the explicit opt-in AND calm motion
 * to stay off.
 */
export function useCelebrationsEnabled(): boolean {
  const celebrations = useAppSelector((state) => state.settings.celebrationAnimations);
  const reduceMotion = useAppReducedMotion();
  return celebrations && !reduceMotion;
}

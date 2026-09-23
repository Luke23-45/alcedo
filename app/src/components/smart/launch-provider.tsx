import { useAssets } from 'expo-asset';
import * as SplashScreen from 'expo-splash-screen';
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { AnimatedLaunchScreen } from './animated-launch-screen';

const SPLASH = require('../../../assets/splash.png') as number;

/**
 * The launch choreography runs 2000ms: 0.4s of stillness, the wake, then the
 * splash dissolves. The app starts waking underneath the moment the dissolve
 * begins; the overlay is removed once the dissolve completes.
 */
const REVEAL_START_MS = 1300;
const CHOREOGRAPHY_MS = 2000;
/** Absolute ceiling: never leave the user staring at the splash. */
const HIDE_TIMEOUT_MS = 6000;

/** True once the splash has started dissolving and the app is waking up beneath it. */
const LaunchHiddenContext = createContext(false);

export function useSplashHidden() {
  return useContext(LaunchHiddenContext);
}

/**
 * Owns the launch handoff. The native splash (a still of the bird artwork)
 * stays up until the first frame is laid out and the artwork is decoded; then
 * the native splash hides and this provider mounts the animated launch
 * screen — its first frame is pixel-identical to the still, so the handoff is
 * invisible — which plays the choreography (stillness, wake, dissolve). At
 * 1.3s the splash starts dissolving and the welcome hero wakes up underneath;
 * at 2.0s the overlay is gone.
 */
export function LaunchProvider({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const [assets] = useAssets([SPLASH]);
  const [splashHidden, setSplashHidden] = useState(false);
  const [branded, setBranded] = useState(false);
  const [overlayRemoved, setOverlayRemoved] = useState(false);
  const state = useRef({ hideStarted: false, laidOut: false, brandShownAt: 0 });

  const showBranded = useCallback(
    (force: boolean) => {
      const s = state.current;
      if (s.hideStarted || (!force && !assets) || !s.laidOut) {
        return;
      }
      s.hideStarted = true;
      // Two frames: let the first painted frame land before hiding, so there
      // is never a flash of an intermediate state.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          void (async () => {
            try {
              await SplashScreen.hideAsync();
            } catch {
              // Already hidden or never shown; continue with the reveal.
            }
            s.brandShownAt = Date.now();
            setBranded(true);
          })();
        });
      });
    },
    [assets],
  );

  const onLayout = useCallback(() => {
    state.current.laidOut = true;
    showBranded(false);
  }, [showBranded]);

  useEffect(() => {
    showBranded(false);
  }, [showBranded]);

  // Once the branded screen is up, run the choreography clock: wake the app
  // under the dissolving splash, then remove the overlay.
  useEffect(() => {
    if (!branded) {
      return;
    }
    const elapsed = Date.now() - state.current.brandShownAt;
    if (reduceMotion) {
      const timer = setTimeout(
        () => {
          setSplashHidden(true);
          setOverlayRemoved(true);
        },
        Math.max(0, 400 - elapsed),
      );
      return () => clearTimeout(timer);
    }
    const wakeTimer = setTimeout(() => setSplashHidden(true), Math.max(0, REVEAL_START_MS - elapsed));
    const removeTimer = setTimeout(() => setOverlayRemoved(true), Math.max(0, CHOREOGRAPHY_MS - elapsed));
    return () => {
      clearTimeout(wakeTimer);
      clearTimeout(removeTimer);
    };
  }, [branded, reduceMotion]);

  // Absolute ceiling: force the handoff even if readiness never signals.
  useEffect(() => {
    const timer = setTimeout(() => {
      showBranded(true);
      setSplashHidden(true);
      setOverlayRemoved(true);
    }, HIDE_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [showBranded]);

  return (
    <LaunchHiddenContext.Provider value={splashHidden}>
      <View style={styles.fill} onLayout={onLayout}>
        {children}
      </View>
      {branded && !overlayRemoved && (
        <View style={styles.overlay} pointerEvents="none">
          <AnimatedLaunchScreen reduceMotion={reduceMotion} />
        </View>
      )}
    </LaunchHiddenContext.Provider>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
  },
});

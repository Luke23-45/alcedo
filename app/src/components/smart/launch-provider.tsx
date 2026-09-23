import { useAssets } from 'expo-asset';
import * as SplashScreen from 'expo-splash-screen';
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { AnimatedLaunchScreen } from './animated-launch-screen';

const SPLASH = require('../../../assets/splash.png') as number;

const EASE_OUT_EXPO = Easing.bezier(0.16, 0.84, 0.24, 1);

/**
 * Minimum time the branded launch screen stays up: the brand beat. The bird
 * pushes in and breathes while the app finishes preparing.
 */
const MIN_BRAND_MS = 1700;
/** Dismiss crossfade from the branded splash into the app. */
const DISMISS_MS = 450;
/** Absolute ceiling: never leave the user staring at the splash. */
const HIDE_TIMEOUT_MS = 6000;

/** True once the branded splash has started dismissing and the app is waking up. */
const LaunchHiddenContext = createContext(false);

export function useSplashHidden() {
  return useContext(LaunchHiddenContext);
}

/**
 * Owns the launch handoff. The native splash (a still of the branded lockup)
 * stays up until the first frame is laid out and the artwork is decoded; then
 * the native splash hides and this provider mounts the animated launch screen
 * — its first frame is pixel-identical to the still, so the handoff is
 * invisible — which plays the brand beat (slow push-in, breathing bird).
 * Once the app is ready and the beat has played, the screen crossfades into the app and the welcome hero wakes up underneath.
 */
export function LaunchProvider({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const [assets] = useAssets([SPLASH]);
  const [splashHidden, setSplashHidden] = useState(false);
  const [branded, setBranded] = useState(false);
  const [overlayRemoved, setOverlayRemoved] = useState(false);
  const opacity = useRef(new Animated.Value(1)).current;
  const state = useRef({ hideStarted: false, laidOut: false, brandShownAt: 0, dismissed: false });

  const dismiss = useCallback(() => {
    const s = state.current;
    if (s.dismissed) {
      return;
    }
    s.dismissed = true;
    setSplashHidden(true);
    if (reduceMotion) {
      opacity.setValue(0);
      setOverlayRemoved(true);
      return;
    }
    Animated.timing(opacity, {
      toValue: 0,
      duration: DISMISS_MS,
      easing: EASE_OUT_EXPO,
      useNativeDriver: true,
    }).start(() => setOverlayRemoved(true));
  }, [opacity, reduceMotion]);

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

  // Once the branded screen is up, hold the brand beat, then dismiss.
  useEffect(() => {
    if (!branded) {
      return;
    }
    const elapsed = Date.now() - state.current.brandShownAt;
    const wait = reduceMotion ? 400 : Math.max(0, MIN_BRAND_MS - elapsed);
    const timer = setTimeout(dismiss, wait);
    return () => clearTimeout(timer);
  }, [branded, dismiss, reduceMotion]);

  // Absolute ceiling: force the handoff even if readiness never signals.
  useEffect(() => {
    const timer = setTimeout(() => {
      showBranded(true);
      setTimeout(dismiss, 400);
    }, HIDE_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [showBranded, dismiss]);

  return (
    <LaunchHiddenContext.Provider value={splashHidden}>
      <View style={styles.fill} onLayout={onLayout}>
        {children}
      </View>
      {branded && !overlayRemoved && (
        <Animated.View style={[styles.overlay, { opacity }]} pointerEvents="none">
          <AnimatedLaunchScreen reduceMotion={reduceMotion} />
        </Animated.View>
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

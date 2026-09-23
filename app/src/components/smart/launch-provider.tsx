import { useAssets } from 'expo-asset';
import * as SplashScreen from 'expo-splash-screen';
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, useColorScheme, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

const SPLASH_DARK = require('../../../assets/splash-dark.png') as number;
const SPLASH_LIGHT = require('../../../assets/splash-light.png') as number;

/** Matches the `backgroundColor` values in app.json so letterbox bands agree. */
const OVERLAY_BG = { dark: '#07080B', light: '#F4F4F8' } as const;

const OVERLAY_FADE_MS = 450;
/** Absolute ceiling: never leave the user staring at the splash. */
const HIDE_TIMEOUT_MS = 6000;

const EASE_OUT_EXPO = Easing.bezier(0.16, 0.84, 0.24, 1);

/** True once the native splash has hidden and the app is waking up. */
const LaunchHiddenContext = createContext(false);

export function useSplashHidden() {
  return useContext(LaunchHiddenContext);
}

/**
 * Owns the launch handoff. The native splash (a still of the welcome hero)
 * stays up until the first frame is laid out and the overlay artwork is
 * decoded; then the native splash hides, this provider renders the identical
 * image as a JS overlay, and the overlay dissolves — over the welcome hero on
 * first launch (invisible), over the tabs on later launches (a soft brand beat).
 */
export function LaunchProvider({ children }: { children: ReactNode }) {
  const colorScheme = useColorScheme();
  const reduceMotion = useReducedMotion();
  const [assets] = useAssets([SPLASH_DARK, SPLASH_LIGHT]);
  const [splashHidden, setSplashHidden] = useState(false);
  const [overlayRemoved, setOverlayRemoved] = useState(false);
  const opacity = useRef(new Animated.Value(1)).current;
  const hideStarted = useRef(false);
  const laidOut = useRef(false);

  const dark = colorScheme !== 'light';

  const hide = useCallback(
    (force: boolean) => {
      if (hideStarted.current || (!force && !assets) || !laidOut.current) {
        return;
      }
      hideStarted.current = true;
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
            setSplashHidden(true);
            if (reduceMotion || force) {
              opacity.setValue(0);
              setOverlayRemoved(true);
              return;
            }
            Animated.timing(opacity, {
              toValue: 0,
              duration: OVERLAY_FADE_MS,
              easing: EASE_OUT_EXPO,
              useNativeDriver: true,
            }).start(() => setOverlayRemoved(true));
          })();
        });
      });
    },
    [assets, opacity, reduceMotion],
  );

  const onLayout = useCallback(() => {
    laidOut.current = true;
    hide(false);
  }, [hide]);

  useEffect(() => {
    hide(false);
  }, [hide]);

  useEffect(() => {
    const timer = setTimeout(() => hide(true), HIDE_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [hide]);

  return (
    <LaunchHiddenContext.Provider value={splashHidden}>
      <View style={styles.fill} onLayout={onLayout}>
        {children}
      </View>
      {!overlayRemoved && (
        <Animated.View
          style={[styles.overlay, { opacity, backgroundColor: dark ? OVERLAY_BG.dark : OVERLAY_BG.light }]}
          pointerEvents="none"
        >
          {assets && <Image source={dark ? SPLASH_DARK : SPLASH_LIGHT} style={styles.image} resizeMode="contain" />}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

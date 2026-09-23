import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, View } from 'react-native';

/**
 * Stand-in brand art. Swap the final approved artwork in at
 * `app/assets/splash.png` (1179x2556, dark) — the native splash and this
 * screen both follow that file.
 */
const SPLASH = require('../../../assets/splash.png') as number;

const BG = '#05070D';

const EASE_OUT_EXPO = Easing.bezier(0.16, 0.84, 0.24, 1);
const EASE_IN_OUT = Easing.inOut(Easing.ease);

/**
 * The branded launch moment, shown the instant the native still hides.
 * The first frame is pixel-identical to the native splash (same file), so the
 * handoff is invisible; then the bird slowly pushes in and breathes until the
 * app dismisses it.
 */
export function AnimatedLaunchScreen({ reduceMotion }: { reduceMotion: boolean }) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (reduceMotion) {
      return;
    }
    // Slow push-in from the identical first frame, then a gentle breathe loop.
    const motion = Animated.sequence([
      Animated.timing(scale, { toValue: 1.035, duration: 2600, easing: EASE_OUT_EXPO, useNativeDriver: true }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.05, duration: 1800, easing: EASE_IN_OUT, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1.035, duration: 1800, easing: EASE_IN_OUT, useNativeDriver: true }),
        ]),
      ),
    ]);
    motion.start();
    return () => {
      motion.stop();
    };
  }, [reduceMotion, scale]);

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: BG }]}>
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ scale }] }]}>
        <Image source={SPLASH} style={styles.image} resizeMode="cover" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
});

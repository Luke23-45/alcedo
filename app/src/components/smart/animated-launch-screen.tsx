import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, View } from 'react-native';

/**
 * Stand-in brand art. Swap the final approved artwork in at
 * `app/assets/splash.png` (1179x2556, dark) — the native splash, this screen,
 * and the loading dots' anchor below the wordmark all follow that file.
 */
const SPLASH = require('../../../assets/splash.png') as number;

const BG = '#05070D';
const EMBER = '#F0670F';

const EASE_OUT_EXPO = Easing.bezier(0.16, 0.84, 0.24, 1);
const EASE_IN_OUT = Easing.inOut(Easing.ease);

/** Dots sit just below the "SLEEP TRACKER" tagline baked into the artwork. */
const DOTS_TOP_PCT = '66%';
const DOT_PERIOD_MS = 1200;

/**
 * The branded launch moment, shown the instant the native still hides.
 * The first frame is pixel-identical to the native splash (same file), so the
 * handoff is invisible; then the lockup slowly pushes in and breathes while a
 * three-dot loading wave runs beneath the wordmark until the app dismisses it.
 */
export function AnimatedLaunchScreen({ reduceMotion }: { reduceMotion: boolean }) {
  const scale = useRef(new Animated.Value(1)).current;
  const dotsOpacity = useRef(new Animated.Value(0)).current;
  const dotValues = useRef([0, 1, 2].map(() => new Animated.Value(0.25))).current;

  useEffect(() => {
    if (reduceMotion) {
      return;
    }
    let alive = true;
    const loops: Animated.CompositeAnimation[] = [];
    const timers: ReturnType<typeof setTimeout>[] = [];

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
    loops.push(motion);

    const dotsIn = Animated.timing(dotsOpacity, {
      toValue: 1,
      duration: 500,
      delay: 500,
      easing: EASE_IN_OUT,
      useNativeDriver: true,
    });
    dotsIn.start();
    loops.push(dotsIn);

    // Loading wave: equal periods keep the dots in phase; the stagger only
    // offsets each dot's start so the wave travels left to right.
    dotValues.forEach((v, i) => {
      timers.push(
        setTimeout(
          () => {
            if (!alive) {
              return;
            }
            const wave = Animated.loop(
              Animated.sequence([
                Animated.timing(v, { toValue: 1, duration: 400, easing: EASE_IN_OUT, useNativeDriver: true }),
                Animated.timing(v, { toValue: 0.25, duration: 400, easing: EASE_IN_OUT, useNativeDriver: true }),
                Animated.delay(DOT_PERIOD_MS - 800),
              ]),
            );
            wave.start();
            loops.push(wave);
          },
          700 + i * 200,
        ),
      );
    });

    return () => {
      alive = false;
      timers.forEach(clearTimeout);
      loops.forEach((l) => l.stop());
    };
  }, [reduceMotion, scale, dotsOpacity, dotValues]);

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: BG }]}>
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ scale }] }]}>
        <Image source={SPLASH} style={styles.image} resizeMode="cover" />
      </Animated.View>
      {!reduceMotion && (
        <Animated.View style={[styles.dots, { opacity: dotsOpacity }]} pointerEvents="none">
          {dotValues.map((v, i) => (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                {
                  opacity: v,
                  transform: [{ scale: v.interpolate({ inputRange: [0.25, 1], outputRange: [0.75, 1] }) }],
                },
              ]}
            />
          ))}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
  dots: {
    position: 'absolute',
    top: DOTS_TOP_PCT,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: EMBER,
  },
});

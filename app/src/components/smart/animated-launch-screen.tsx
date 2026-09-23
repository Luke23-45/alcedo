import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Circle, Defs, RadialGradient, Stop, Svg } from 'react-native-svg';

/**
 * Stand-in brand art. Swap the final approved artwork in at
 * `app/assets/splash.png` (1179x2556, dark) — the native splash and this
 * screen both follow that file. The medallion/eye geometry below is measured
 * from the current art; re-measure if the final art moves the bird.
 */
const SPLASH = require('../../../assets/splash.png') as number;

const BG = '#05070D';

/** Native PNG geometry, in image pixels (1179x2556). */
const IMG_W = 1179;
const IMG_H = 2556;
const MEDALLION = { x: 607, y: 1276, r: 340 };
const EYE = { x: 709.5, y: 1163.7 };

const EASE_OUT_EXPO = Easing.bezier(0.16, 0.84, 0.24, 1);
const EASE_IN_OUT = Easing.inOut(Easing.ease);

/**
 * The launch choreography, in ms — three beats:
 *   0.0–0.4s  Stillness. Pixel-identical to the native PNG; the eye registers
 *             continuity before anything moves.
 *   0.4–1.3s  The wake. The bird rises ~10pt and breathes to 1.045 scale, a
 *             blue bloom warms up around it, a faint sheen sweeps across once,
 *             and a single catchlight glints in the eye around 0.9s.
 *   1.3–2.0s  The reveal. The whole splash dissolves while the app appears
 *             beneath (the launch provider wakes the hero under it at 1.3s).
 */
const STILL_MS = 400;
const WAKE_MS = 900;
const REVEAL_MS = 700;

/** Map an image-pixel point to screen points for a cover-fit full-screen image. */
function useSplashGeometry() {
  const { width: w, height: h } = useWindowDimensions();
  const s = Math.max(w / IMG_W, h / IMG_H);
  const ox = (IMG_W * s - w) / 2;
  const oy = (IMG_H * s - h) / 2;
  return {
    medallion: { x: MEDALLION.x * s - ox, y: MEDALLION.y * s - oy, r: MEDALLION.r * s },
    eye: { x: EYE.x * s - ox, y: EYE.y * s - oy },
  };
}

export function AnimatedLaunchScreen({ reduceMotion }: { reduceMotion: boolean }) {
  const rise = useRef(new Animated.Value(0)).current;
  const breathe = useRef(new Animated.Value(1)).current;
  const bloom = useRef(new Animated.Value(0)).current;
  const sheenX = useRef(new Animated.Value(0)).current;
  const sheenOpacity = useRef(new Animated.Value(0)).current;
  const glint = useRef(new Animated.Value(0)).current;
  const dissolve = useRef(new Animated.Value(1)).current;

  const { medallion: m, eye } = useSplashGeometry();
  const r = m.r;

  useEffect(() => {
    if (reduceMotion) {
      return;
    }
    const wake = Animated.parallel([
      Animated.timing(rise, { toValue: -10, duration: WAKE_MS, easing: EASE_OUT_EXPO, useNativeDriver: true }),
      Animated.timing(breathe, { toValue: 1.045, duration: WAKE_MS, easing: EASE_IN_OUT, useNativeDriver: true }),
      Animated.timing(bloom, { toValue: 1, duration: WAKE_MS, easing: EASE_OUT_EXPO, useNativeDriver: true }),
      Animated.timing(sheenX, { toValue: 1, duration: WAKE_MS, easing: Easing.linear, useNativeDriver: true }),
      Animated.sequence([
        Animated.timing(sheenOpacity, { toValue: 1, duration: 250, easing: EASE_OUT_EXPO, useNativeDriver: true }),
        Animated.timing(sheenOpacity, { toValue: 0, duration: 400, easing: EASE_IN_OUT, useNativeDriver: true }),
      ]),
      // The catchlight lands around 0.9s: 400ms stillness + 250ms delay.
      Animated.sequence([
        Animated.delay(250),
        Animated.timing(glint, { toValue: 0.85, duration: 150, easing: EASE_OUT_EXPO, useNativeDriver: true }),
        Animated.timing(glint, { toValue: 0, duration: 300, easing: EASE_IN_OUT, useNativeDriver: true }),
      ]),
    ]);
    const choreography = Animated.sequence([
      Animated.delay(STILL_MS),
      wake,
      Animated.timing(dissolve, { toValue: 0, duration: REVEAL_MS, easing: EASE_IN_OUT, useNativeDriver: true }),
    ]);
    choreography.start();
    return () => {
      choreography.stop();
    };
  }, [reduceMotion, rise, breathe, bloom, sheenX, sheenOpacity, glint, dissolve]);

  const sheenTravel = sheenX.interpolate({ inputRange: [0, 1], outputRange: [-2.4 * r, 2.4 * r] });

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: BG }]}>
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: dissolve }]}>
        <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateY: rise }, { scale: breathe }] }]}>
          <Image source={SPLASH} style={styles.image} resizeMode="cover" />
          {/* Blue bloom warming up around the medallion — transparent over the bird itself. */}
          <Animated.View style={[StyleSheet.absoluteFill, { opacity: bloom }]} pointerEvents="none">
            <Svg style={StyleSheet.absoluteFill}>
              <Defs>
                <RadialGradient id="launchBloom" cx="50%" cy="50%" r="50%">
                  <Stop offset="0%" stopColor="#2470FF" stopOpacity={0} />
                  <Stop offset="62%" stopColor="#2470FF" stopOpacity={0} />
                  <Stop offset="80%" stopColor="#2470FF" stopOpacity={0.28} />
                  <Stop offset="100%" stopColor="#2470FF" stopOpacity={0} />
                </RadialGradient>
              </Defs>
              <Circle cx={m.x} cy={m.y} r={r * 1.7} fill="url(#launchBloom)" />
            </Svg>
          </Animated.View>
          {/* Sheen: one diagonal sweep, clipped to the medallion. */}
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: m.x - r,
              top: m.y - r,
              width: r * 2,
              height: r * 2,
              borderRadius: r,
              overflow: 'hidden',
            }}
          >
            <Animated.View
              style={{
                position: 'absolute',
                width: 56,
                height: r * 3.2,
                left: r - 28,
                top: -r * 0.6,
                opacity: sheenOpacity,
                transform: [{ translateX: sheenTravel }, { rotate: '-16deg' }],
              }}
            >
              <LinearGradient
                style={StyleSheet.absoluteFill}
                colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.25)', 'rgba(255,255,255,0)']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
              />
            </Animated.View>
          </View>
          {/* Catchlight glint in the eye. */}
          <Animated.View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: eye.x - 4.1,
              top: eye.y - 4.6,
              width: 5.2,
              height: 5.2,
              borderRadius: 2.6,
              backgroundColor: '#FFFFFF',
              opacity: glint,
            }}
          />
        </Animated.View>
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

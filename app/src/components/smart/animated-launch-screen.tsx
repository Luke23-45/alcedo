import { useEffect } from 'react';
import { Image, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Defs, Ellipse, G, LinearGradient, Mask, RadialGradient, Rect, Stop, Svg } from 'react-native-svg';

/**
 * Stand-in brand art. Swap the final approved artwork in at
 * `app/assets/splash.png` (1179x2556, dark) — the native splash and this
 * screen both follow that file. The bird/eye geometry below is measured from
 * the current art; re-measure if the final art moves the bird.
 */
const SPLASH = require('../../../assets/splash.png') as number;

const BG = '#05070D';

/** Native PNG geometry, in image pixels (1179x2556). */
const IMG_W = 1179;
const IMG_H = 2556;
/** Bird visual center + extent, for the bloom and sheen. */
const BIRD = { x: 622, y: 1154, rx: 360, ry: 320 };
const EYE = { x: 726.5, y: 1165 };

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

const AnimatedRect = Animated.createAnimatedComponent(Rect);

/** Map an image-pixel point to screen points for a cover-fit full-screen image. */
function useSplashGeometry() {
  const { width: w, height: h } = useWindowDimensions();
  const s = Math.max(w / IMG_W, h / IMG_H);
  const ox = (IMG_W * s - w) / 2;
  const oy = (IMG_H * s - h) / 2;
  return {
    bird: { x: BIRD.x * s - ox, y: BIRD.y * s - oy, rx: BIRD.rx * s, ry: BIRD.ry * s },
    eye: { x: EYE.x * s - ox, y: EYE.y * s - oy },
  };
}

export function AnimatedLaunchScreen({ reduceMotion }: { reduceMotion: boolean }) {
  const rise = useSharedValue(0);
  const breathe = useSharedValue(1);
  const bloom = useSharedValue(0);
  const sheenP = useSharedValue(0);
  const sheenOpacity = useSharedValue(0);
  const glint = useSharedValue(0);
  const dissolve = useSharedValue(1);

  const { bird: b, eye } = useSplashGeometry();

  useEffect(() => {
    if (reduceMotion) {
      return;
    }
    rise.value = withDelay(STILL_MS, withTiming(-10, { duration: WAKE_MS, easing: Easing.out(Easing.exp) }));
    breathe.value = withDelay(STILL_MS, withTiming(1.045, { duration: WAKE_MS, easing: Easing.inOut(Easing.ease) }));
    bloom.value = withDelay(STILL_MS, withTiming(0.8, { duration: WAKE_MS, easing: Easing.out(Easing.exp) }));
    sheenP.value = withDelay(STILL_MS, withTiming(1, { duration: WAKE_MS, easing: Easing.linear }));
    sheenOpacity.value = withDelay(
      STILL_MS,
      withSequence(withTiming(1, { duration: 250 }), withTiming(0, { duration: 400 })),
    );
    // The catchlight lands around 0.9s: 400ms stillness + 250ms into the wake.
    glint.value = withDelay(
      STILL_MS + 250,
      withSequence(
        withTiming(0.85, { duration: 150, easing: Easing.out(Easing.exp) }),
        withTiming(0, { duration: 300 }),
      ),
    );
    dissolve.value = withDelay(
      STILL_MS + WAKE_MS,
      withTiming(0, { duration: REVEAL_MS, easing: Easing.inOut(Easing.ease) }),
    );
  }, [reduceMotion, rise, breathe, bloom, sheenP, sheenOpacity, glint, dissolve]);

  const wakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: rise.value }, { scale: breathe.value }],
  }));
  const dissolveStyle = useAnimatedStyle(() => ({ opacity: dissolve.value }));
  const bloomStyle = useAnimatedStyle(() => ({ opacity: bloom.value }));
  const sheenOpacityStyle = useAnimatedStyle(() => ({ opacity: sheenOpacity.value }));
  const glintStyle = useAnimatedStyle(() => ({ opacity: glint.value }));
  const sheenRectProps = useAnimatedProps(() => ({
    // Sweep the band across the bird, centered on it at the midpoint.
    x: b.x - 2.8 * b.rx + sheenP.value * 5.6 * b.rx - 32,
  }));

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: BG }]}>
      <Animated.View style={[StyleSheet.absoluteFill, dissolveStyle]}>
        <Animated.View style={[StyleSheet.absoluteFill, wakeStyle]}>
          <Image source={SPLASH} style={styles.image} resizeMode="cover" />
          {/* Diffuse blue bloom warming up around the bird — fast falloff, no edge. */}
          <Animated.View style={[StyleSheet.absoluteFill, bloomStyle]} pointerEvents="none">
            <Svg style={StyleSheet.absoluteFill}>
              <Defs>
                <RadialGradient id="launchBloom" cx="50%" cy="50%" r="50%">
                  <Stop offset="0%" stopColor="#4D8DFF" stopOpacity={0.24} />
                  <Stop offset="45%" stopColor="#4D8DFF" stopOpacity={0.08} />
                  <Stop offset="75%" stopColor="#4D8DFF" stopOpacity={0.012} />
                  <Stop offset="100%" stopColor="#4D8DFF" stopOpacity={0} />
                </RadialGradient>
              </Defs>
              <Ellipse cx={b.x} cy={b.y} rx={b.rx * 1.3} ry={b.ry * 1.3} fill="url(#launchBloom)" />
            </Svg>
          </Animated.View>
          {/* Sheen: one diagonal sweep, softly masked to the bird — no hard clip. */}
          <Animated.View style={[StyleSheet.absoluteFill, sheenOpacityStyle]} pointerEvents="none">
            <Svg style={StyleSheet.absoluteFill}>
              <Defs>
                <RadialGradient id="sheenMaskFade" cx="50%" cy="50%" r="50%">
                  <Stop offset="40%" stopColor="#FFFFFF" stopOpacity={1} />
                  <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
                </RadialGradient>
                <Mask
                  id="sheenMask"
                  maskUnits="userSpaceOnUse"
                  x={b.x - b.rx * 1.4}
                  y={b.y - b.ry * 1.4}
                  width={b.rx * 2.8}
                  height={b.ry * 2.8}
                >
                  <Ellipse cx={b.x} cy={b.y} rx={b.rx * 1.15} ry={b.ry * 1.15} fill="url(#sheenMaskFade)" />
                </Mask>
                <LinearGradient id="sheenBand" x1="0" y1="0" x2="1" y2="0">
                  <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0} />
                  <Stop offset="50%" stopColor="#FFFFFF" stopOpacity={0.22} />
                  <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
                </LinearGradient>
              </Defs>
              <G mask="url(#sheenMask)">
                <AnimatedRect
                  y={b.y - b.ry * 2}
                  width={64}
                  height={b.ry * 4}
                  fill="url(#sheenBand)"
                  transform={`rotate(-16 ${b.x} ${b.y})`}
                  animatedProps={sheenRectProps}
                />
              </G>
            </Svg>
          </Animated.View>
          {/* Catchlight glint in the eye. */}
          <Animated.View
            pointerEvents="none"
            style={[
              {
                position: 'absolute',
                left: eye.x - 4.1,
                top: eye.y - 4.6,
                width: 5.2,
                height: 5.2,
                borderRadius: 2.6,
                backgroundColor: '#FFFFFF',
              },
              glintStyle,
            ]}
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

import { useEffect } from 'react';
import { Image, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { Defs, Ellipse, RadialGradient, Stop, Svg } from 'react-native-svg';

/**
 * Stand-in brand art. Swap the final approved artwork in at
 * `app/assets/splash.png` (1179x2556, dark) — the native splash and this
 * screen both follow that file.
 */
const SPLASH = require('../../../assets/splash.png') as number;

const BG = '#05070D';

/** Native PNG geometry, in image pixels (1179x2556). */
const IMG_W = 1179;
const IMG_H = 2556;
/** Bird visual center, in image pixels. */
const BIRD = { x: 622, y: 1154 };
/**
 * The soft azure glow pools just below the bird (measured from the approved
 * reference: centroid ~60px right / ~130px down from the bird's center).
 */
const GLOW = { x: 681, y: 1284, r: 340 };

/**
 * The launch choreography, in ms — three beats:
 *   0.0–0.4s  Stillness. Pixel-identical to the native PNG.
 *   0.4–1.3s  The wake. The bird rises ~10pt and a faint azure glow fades in
 *             beneath it. Nothing else moves.
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
  const px = (x: number) => x * s - ox;
  const py = (y: number) => y * s - oy;
  return {
    glow: { x: px(GLOW.x), y: py(GLOW.y), r: GLOW.r * s },
  };
}

export function AnimatedLaunchScreen({ reduceMotion }: { reduceMotion: boolean }) {
  const rise = useSharedValue(0);
  const glow = useSharedValue(0);
  const dissolve = useSharedValue(1);

  const { glow: gl } = useSplashGeometry();

  useEffect(() => {
    if (reduceMotion) {
      return;
    }
    rise.value = withDelay(STILL_MS, withTiming(-10, { duration: WAKE_MS, easing: Easing.out(Easing.exp) }));
    glow.value = withDelay(STILL_MS, withTiming(1, { duration: WAKE_MS, easing: Easing.out(Easing.exp) }));
    dissolve.value = withDelay(
      STILL_MS + WAKE_MS,
      withTiming(0, { duration: REVEAL_MS, easing: Easing.inOut(Easing.ease) }),
    );
  }, [reduceMotion, rise, glow, dissolve]);

  const wakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: rise.value }],
  }));
  const dissolveStyle = useAnimatedStyle(() => ({ opacity: dissolve.value }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: glow.value }));

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: BG }]}>
      <Animated.View style={[StyleSheet.absoluteFill, dissolveStyle]}>
        <Animated.View style={[StyleSheet.absoluteFill, wakeStyle]}>
          <Image source={SPLASH} style={styles.image} resizeMode="cover" />
          {/* Faint azure glow fading in beneath the bird — fixed size, no edge. */}
          <Animated.View style={[StyleSheet.absoluteFill, glowStyle]} pointerEvents="none">
            <Svg style={StyleSheet.absoluteFill}>
              <Defs>
                <RadialGradient id="launchGlow" cx="50%" cy="50%" r="50%">
                  <Stop offset="0%" stopColor="#2470FF" stopOpacity={0.05} />
                  <Stop offset="40%" stopColor="#2470FF" stopOpacity={0.025} />
                  <Stop offset="70%" stopColor="#2470FF" stopOpacity={0.006} />
                  <Stop offset="100%" stopColor="#2470FF" stopOpacity={0} />
                </RadialGradient>
              </Defs>
              <Ellipse cx={gl.x} cy={gl.y} rx={gl.r} ry={gl.r} fill="url(#launchGlow)" />
            </Svg>
          </Animated.View>
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

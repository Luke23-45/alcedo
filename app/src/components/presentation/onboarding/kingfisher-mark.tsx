import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleProp, ViewStyle } from 'react-native';
import Svg, {
  Circle,
  ClipPath,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import { BackLayer, BirdLayer, MarkRoot } from './kingfisher-mark.styles';

/**
 * The free-floating kingfisher mark from `docs/new_design/onboading`: ember
 * breast, cobalt back, deep wing, soft blue/ember bloom, counter-phase shadow,
 * drifting wing sheen and a periodic eye glint. Geometry and timing are taken
 * from the mock; the drop-shadow filter is approximated with a soft ellipse so
 * it renders identically on both platforms.
 */

const BREAST_D =
  'M 344.00,8.00 C 344.00,8.00 190.00,-44.00 190.00,-44.00 C 190.00,-44.00 169.67,-86.00 150.00,-104.00 ' +
  'C 130.33,-122.00 102.67,-143.67 72.00,-152.00 C 41.33,-160.33 0.33,-157.67 -34.00,-154.00 ' +
  'C -68.33,-150.33 -104.00,-139.33 -134.00,-130.00 C -164.00,-120.67 -188.33,-108.00 -214.00,-98.00 ' +
  'C -239.67,-88.00 -285.75,-73.50 -288.00,-70.00 C -290.25,-66.50 -271.73,-19.02 -268.00,-14.00 ' +
  'C -264.27,-8.98 -240.00,3.67 -224.00,16.00 C -208.00,28.33 -196.33,43.00 -172.00,60.00 ' +
  'C -147.67,77.00 -110.33,106.33 -78.00,118.00 C -45.67,129.67 -10.00,133.33 22.00,130.00 ' +
  'C 54.00,126.67 87.67,111.00 114.00,98.00 C 140.33,85.00 166.40,61.87 180.00,52.00 ' +
  'C 193.60,42.13 203.70,27.30 216.00,24.00 C 228.30,20.70 344.00,8.00 344.00,8.00 Z';

const BACK_D =
  'M 190.00,-44.00 C 190.00,-44.00 169.67,-86.00 150.00,-104.00 C 130.33,-122.00 102.67,-143.67 72.00,-152.00 ' +
  'C 41.33,-160.33 0.33,-157.67 -34.00,-154.00 C -68.33,-150.33 -104.00,-139.33 -134.00,-130.00 ' +
  'C -164.00,-120.67 -188.33,-108.00 -214.00,-98.00 C -239.67,-88.00 -285.75,-73.50 -288.00,-70.00 ' +
  'C -290.25,-66.50 -271.73,-19.02 -268.00,-14.00 C -264.27,-8.98 -240.00,3.67 -224.00,16.00 ' +
  'C -224.00,16.00 -195.00,10.00 -172.00,8.00 C -149.00,6.00 -118.33,5.33 -86.00,4.00 ' +
  'C -53.67,2.67 -13.33,4.00 22.00,0.00 C 57.33,-4.00 98.00,-12.67 126.00,-20.00 ' +
  'C 154.00,-27.33 190.00,-44.00 190.00,-44.00 Z';

const WING_D =
  'M -134.00,-130.00 C -164.00,-120.67 -188.33,-108.00 -214.00,-98.00 C -239.67,-88.00 -285.75,-73.50 -288.00,-70.00 ' +
  'C -290.25,-66.50 -271.73,-19.02 -268.00,-14.00 C -268.00,-14.00 -227.33,-34.00 -212.00,-44.00 ' +
  'C -196.67,-54.00 -188.00,-61.67 -176.00,-74.00 C -164.00,-86.33 -147.00,-108.67 -140.00,-118.00 ' +
  'C -133.00,-127.33 -134.00,-130.00 -134.00,-130.00 Z';

const BIRD_TRANSFORM_OUTER = 'translate(196.5,245) scale(0.31) translate(-517.5,-528.5)';
const BIRD_TRANSFORM_INNER = 'translate(517.5,528.5) rotate(-26) scale(1.26)';

const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const EASE_IN_OUT = Easing.inOut(Easing.ease);
const EASE_OUT_EXPO = Easing.bezier(0.16, 0.84, 0.24, 1);

function useLoop(value: Animated.Value, build: () => Animated.CompositeAnimation) {
  const buildRef = useRef(build);
  buildRef.current = build;
  useEffect(() => {
    const loop = Animated.loop(buildRef.current());
    loop.start();
    return () => loop.stop();
  }, [value]);
}

export function KingfisherMark({ style }: { style?: StyleProp<ViewStyle> }) {
  const entrance = useRef(new Animated.Value(0)).current;
  const floatY = useRef(new Animated.Value(0)).current;
  const bloomOpacity = useRef(new Animated.Value(0.85)).current;
  const sheenX = useRef(new Animated.Value(-160)).current;
  const sheenOpacity = useRef(new Animated.Value(0)).current;
  const glintOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(entrance, {
      toValue: 1,
      duration: 1200,
      easing: EASE_OUT_EXPO,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [entrance]);

  useLoop(floatY, () =>
    Animated.sequence([
      Animated.timing(floatY, { toValue: -7, duration: 2500, easing: EASE_IN_OUT, useNativeDriver: true }),
      Animated.timing(floatY, { toValue: 0, duration: 2500, easing: EASE_IN_OUT, useNativeDriver: true }),
    ]),
  );
  useLoop(bloomOpacity, () =>
    Animated.sequence([
      Animated.timing(bloomOpacity, { toValue: 1, duration: 1200, easing: EASE_IN_OUT, useNativeDriver: false }),
      Animated.timing(bloomOpacity, { toValue: 0.85, duration: 1200, easing: EASE_IN_OUT, useNativeDriver: false }),
    ]),
  );
  useLoop(sheenX, () =>
    Animated.sequence([
      Animated.parallel([
        Animated.timing(sheenX, { toValue: 560, duration: 4000, easing: Easing.linear, useNativeDriver: false }),
        Animated.sequence([
          Animated.timing(sheenOpacity, { toValue: 1, duration: 480, easing: Easing.linear, useNativeDriver: false }),
          Animated.delay(3040),
          Animated.timing(sheenOpacity, { toValue: 0, duration: 480, easing: Easing.linear, useNativeDriver: false }),
        ]),
      ]),
      Animated.timing(sheenX, { toValue: -160, duration: 0, useNativeDriver: false }),
    ]),
  );
  useLoop(glintOpacity, () =>
    Animated.sequence([
      Animated.timing(glintOpacity, { toValue: 0.85, duration: 384, easing: Easing.linear, useNativeDriver: false }),
      Animated.timing(glintOpacity, { toValue: 0, duration: 480, easing: Easing.linear, useNativeDriver: false }),
      Animated.delay(3936),
    ]),
  );

  const entranceRise = entrance.interpolate({ inputRange: [0, 1], outputRange: [18, 0] });
  const shadowOpacity = floatY.interpolate({ inputRange: [-7, 0], outputRange: [0.22, 0.34] });

  return (
    <MarkRoot style={[style, { opacity: entrance, transform: [{ translateY: entranceRise }] }]}>
      {/* Back layer: bloom + grounding shadow. */}
      <BackLayer>
        <Svg width="100%" height="100%" viewBox="0 40 393 340" preserveAspectRatio="xMidYMid meet">
          <Defs>
            <RadialGradient id="onb-bloom-blue" gradientUnits="userSpaceOnUse" cx="196.5" cy="225" r="170">
              <Stop offset="0" stopColor="#2470FF" stopOpacity={0.22} />
              <Stop offset="1" stopColor="#2470FF" stopOpacity={0} />
            </RadialGradient>
            <RadialGradient id="onb-bloom-ember" gradientUnits="userSpaceOnUse" cx="196.5" cy="330" r="190">
              <Stop offset="0" stopColor="#FF6A3D" stopOpacity={0.14} />
              <Stop offset="1" stopColor="#FF6A3D" stopOpacity={0} />
            </RadialGradient>
            <RadialGradient id="onb-mark-shadow" gradientUnits="userSpaceOnUse" cx="196.5" cy="312" r="120">
              <Stop offset="0" stopColor="#000000" stopOpacity={1} />
              <Stop offset="1" stopColor="#000000" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <AnimatedEllipse cx="196.5" cy="225" rx="170" ry="170" fill="url(#onb-bloom-blue)" opacity={bloomOpacity} />
          <Ellipse cx="196.5" cy="330" rx="190" ry="150" fill="url(#onb-bloom-ember)" />
          <AnimatedEllipse cx="196.5" cy="312" rx="120" ry="16" fill="url(#onb-mark-shadow)" opacity={shadowOpacity} />
        </Svg>
      </BackLayer>
      {/* Bird layer: floats; sheen and glint ride with it. */}
      <BirdLayer style={{ transform: [{ translateY: floatY }] }}>
        <Svg width="100%" height="100%" viewBox="0 40 393 340" preserveAspectRatio="xMidYMid meet">
          <Defs>
            <LinearGradient id="onb-breast" x1="0.04" y1="0.94" x2="0.96" y2="0.06">
              <Stop offset="0" stopColor="#B92403" />
              <Stop offset="0.5" stopColor="#F0670F" />
              <Stop offset="1" stopColor="#FFAE3C" />
            </LinearGradient>
            <LinearGradient id="onb-back" x1="0.02" y1="0.88" x2="0.98" y2="0.02">
              <Stop offset="0" stopColor="#0B2CC8" />
              <Stop offset="0.44" stopColor="#1194E4" />
              <Stop offset="1" stopColor="#35E0D6" />
            </LinearGradient>
            <LinearGradient id="onb-wing" x1="0" y1="0.92" x2="1" y2="0">
              <Stop offset="0" stopColor="#051A80" />
              <Stop offset="1" stopColor="#0C4CC4" />
            </LinearGradient>
            <LinearGradient id="onb-sheen" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0} />
              <Stop offset="0.5" stopColor="#FFFFFF" stopOpacity={0.2} />
              <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
            </LinearGradient>
            <ClipPath id="onb-bird-clip">
              <G transform={BIRD_TRANSFORM_OUTER}>
                <G transform={BIRD_TRANSFORM_INNER}>
                  <Path d={BREAST_D} />
                  <Path d={BACK_D} />
                  <Path d={WING_D} />
                </G>
              </G>
            </ClipPath>
          </Defs>
          <G transform={BIRD_TRANSFORM_OUTER}>
            <G transform={BIRD_TRANSFORM_INNER}>
              <Path d={BREAST_D} fill="url(#onb-breast)" />
              <Path d={BACK_D} fill="url(#onb-back)" />
              <Path d={WING_D} fill="url(#onb-wing)" />
              <Circle cx="140" cy="-54" r="17" fill="#05101F" />
            </G>
          </G>
          <G clipPath="url(#onb-bird-clip)">
            <G transform="skewX(-16)">
              <AnimatedRect x={sheenX} y={60} width={64} height={360} fill="url(#onb-sheen)" opacity={sheenOpacity} />
            </G>
          </G>
          <AnimatedCircle cx="236" cy="200" r="2.6" fill="#FFFFFF" opacity={glintOpacity} />
        </Svg>
      </BirdLayer>
    </MarkRoot>
  );
}

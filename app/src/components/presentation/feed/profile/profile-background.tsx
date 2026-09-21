import Svg, { Defs, RadialGradient, Stop, Ellipse } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { useAppTheme } from "@/hooks/useAppTheme";
import * as S from "./profile-background.styles";
import { profilePalette } from "./profile-tokens";

/**
 * Screen 4 background: the 3-stop near-vertical base (#0B0B0E → #050507 →
 * #08080B, x1=0 y1=0 → x2=.25 y2=1) with the reference's two radial auras —
 * purple .20 at (196, 170) r=260 and red .09 at (375, 900) r=320. Light mode
 * keeps the pale screen gradient with the same hues at calm opacities.
 * Top-anchored at the reference's 1854 canvas height; pointer-transparent.
 */
export function ProfileBackground() {
  const theme = useAppTheme();
  const palette = profilePalette(theme.isDark);
  const dark = theme.isDark;
  const auras = dark
    ? [
        { id: "profileAuraPurple", color: "#5E5CE6", opacity: 0.2, cx: 196, cy: 170, r: 260 },
        { id: "profileAuraRed", color: "#FF2D55", opacity: 0.09, cx: 375, cy: 900, r: 320 },
      ]
    : [
        { id: "profileAuraPurple", color: "#AF52DE", opacity: 0.05, cx: 196, cy: 170, r: 260 },
        { id: "profileAuraRed", color: "#FF2D55", opacity: 0.04, cx: 375, cy: 900, r: 320 },
      ];
  return (
    <S.BackgroundLayer pointerEvents="none">
      <LinearGradient
        colors={palette.screenGradient}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.25, y: 1 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <Svg width="100%" height="100%" viewBox="0 0 393 1854" preserveAspectRatio="xMidYMin slice">
        <Defs>
          {auras.map((a) => (
            <RadialGradient key={a.id} id={a.id} cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={a.color} stopOpacity={a.opacity} />
              <Stop offset="100%" stopColor={a.color} stopOpacity={0} />
            </RadialGradient>
          ))}
        </Defs>
        {auras.map((a) => (
          <Ellipse key={a.id} cx={a.cx} cy={a.cy} rx={a.r} ry={a.r} fill={`url(#${a.id})`} />
        ))}
      </Svg>
    </S.BackgroundLayer>
  );
}

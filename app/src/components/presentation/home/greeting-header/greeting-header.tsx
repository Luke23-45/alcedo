import type { ReactNode } from 'react';
import { Circle, Defs, LinearGradient as SvgGradient, Stop, Svg } from 'react-native-svg';
import { fontWeight } from '@/styles/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { HomeText } from '../shared/home-text';
import { Avatar, HeaderRow, TextColumn, TrailingGroup } from './greeting-header.styles';

/**
 * Reference avatar: r22 circle on gAvatar (#5E5CE6→#BF5AF2) with top gloss,
 * white@0.18 ring, and the red notification dot from the reference
 * (offset +15/−15 from center, r7, stroked with the screen background).
 */
function AvatarBadge() {
  const theme = useAppTheme();
  const dark = theme.isDark;
  return (
    <Svg width={44} height={44} viewBox="0 0 52 52">
      <Defs>
        <SvgGradient id="greetAvatar" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={dark ? '#5E5CE6' : '#5856D6'} />
          <Stop offset="1" stopColor={dark ? '#BF5AF2' : '#AF52DE'} />
        </SvgGradient>
      </Defs>
      <Circle cx={26} cy={26} r={22} fill="url(#greetAvatar)" />
      <Circle cx={21} cy={18} r={12} fill="#FFFFFF" opacity={0.18} />
      <Circle cx={26} cy={26} r={22} fill="none" stroke="#FFFFFF" strokeOpacity={0.18} />
      <Circle cx={41} cy={11} r={7} fill="#FF3B30" stroke={theme.color.background.base} strokeWidth={2.2} />
    </Svg>
  );
}

export function GreetingHeader({
  dateLabel,
  greeting,
  trailing,
}: {
  /** Already-localized date micro-label, e.g. "MONDAY, JUNE 9". */
  dateLabel: string;
  /** Already-localized greeting; no user name exists in the app. */
  greeting: string;
  /** Optional node rendered beside the avatar (e.g. a notification bell). */
  trailing?: ReactNode;
}) {
  const theme = useAppTheme();
  const dark = theme.isDark;
  const dateColor = dark ? '#86868B' : '#8E8E93';
  const greetingColor = dark ? '#FFFFFF' : '#1C1C1E';

  return (
    <HeaderRow>
      <TextColumn>
        <HomeText
          weight={fontWeight.bold}
          micro
          tracking={1.45}
          numberOfLines={1}
          style={{ fontSize: 10.5, lineHeight: 13, color: dateColor }}
        >
          {dateLabel}
        </HomeText>
        <HomeText
          weight={fontWeight.bold}
          tracking={-0.55}
          numberOfLines={2}
          style={{ fontSize: 25, lineHeight: 30, color: greetingColor, marginTop: 2 }}
        >
          {greeting}
        </HomeText>
      </TextColumn>
      <TrailingGroup>
        {trailing}
        <Avatar>
          <AvatarBadge />
          <HomeText
            weight={fontWeight.semibold}
            tracking={-0.3}
            style={{
              fontSize: 17,
              lineHeight: 20,
              color: '#FFFFFF',
              position: 'absolute',
              opacity: 0.95,
            }}
          >
            A
          </HomeText>
        </Avatar>
      </TrailingGroup>
    </HeaderRow>
  );
}

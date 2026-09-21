import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import * as S from './feed-card.styles';
import {
  CARD_BODY_DARK,
  CARD_BODY_LIGHT,
  CARD_BODY_LOCATIONS,
  CARD_EDGE_DARK,
  CARD_EDGE_LIGHT,
  CARD_EDGE_LOCATIONS,
  TIMELINE_CARD_RADIUS,
} from './timeline-tokens';

/**
 * The shared Feed card shell (Screen 1 spec): 3-stop diagonal body over a
 * 1pt vertical gradient edge, with the spec's drop shadow. Body and edge
 * values come from timeline-tokens; posters' inner text never themes.
 */
export function FeedCard({
  radius = TIMELINE_CARD_RADIUS,
  children,
  style,
}: {
  radius?: number;
  children: ReactNode;
  style?: ViewStyle;
}) {
  const theme = useAppTheme();
  const dark = theme.isDark;
  return (
    <S.CardShadow $radius={radius} $dark={dark} style={style}>
      <LinearGradient
        colors={[...(dark ? CARD_EDGE_DARK : CARD_EDGE_LIGHT)]}
        locations={[...CARD_EDGE_LOCATIONS]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ borderRadius: radius, padding: 1 }}
      >
        <LinearGradient
          colors={[...(dark ? CARD_BODY_DARK : CARD_BODY_LIGHT)]}
          locations={[...CARD_BODY_LOCATIONS]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.45, y: 1 }}
          style={{ borderRadius: radius - 1 }}
        >
          {children}
        </LinearGradient>
      </LinearGradient>
    </S.CardShadow>
  );
}

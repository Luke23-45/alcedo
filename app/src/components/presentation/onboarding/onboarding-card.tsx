import { useAppTheme } from '@/hooks/useAppTheme';
import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { CardBody, CardEdge, CardShadow } from './onboarding-card.styles';
import { onboardingColors } from './onboarding-tokens';

/**
 * The 28pt material card from the onboarding mocks: diagonal 3-stop fill, a
 * 1pt vertical edge highlight, and a soft platform shadow.
 */
export function OnboardingCard({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const theme = useAppTheme();
  const colors = onboardingColors(theme, 0);
  return (
    <CardShadow
      $shadowColor={colors.cardShadowColor}
      $shadowOpacity={colors.cardShadowOpacity}
      $shadowOffsetY={colors.cardShadowOffsetY}
      $shadowRadius={colors.cardShadowRadius}
      style={style}
    >
      <CardEdge colors={colors.cardEdgeStops} locations={[0, 0.4, 1]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
        <CardBody colors={colors.cardStops} locations={[0, 0.55, 1]} start={{ x: 0, y: 0 }} end={{ x: 0.9, y: 1 }}>
          {children}
        </CardBody>
      </CardEdge>
    </CardShadow>
  );
}

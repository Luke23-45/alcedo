import { useAppTheme } from '@/hooks/useAppTheme';
import Svg, { Path } from 'react-native-svg';
import { HomeGradient } from '../../../home/shared/home-gradient';
import { sessionPalette } from '../session-tokens';
import { BrandContent, BrandLabel, BrandPressable } from './brand-button.styles';

function PlusIcon() {
  return (
    <Svg width={16} height={16} viewBox="-8 -8 16 16" style={{ marginRight: 12 }}>
      <Path d="M-8 0 H8 M0 -8 V8" stroke="#FFFFFF" strokeWidth={2.2} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

/**
 * The single brand-gradient CTA per screen (amber → coral → crimson) with
 * gloss, a white 22% edge, and the reference's drop shadow.
 */
export function BrandButton({
  label,
  onPress,
  width,
  height,
  radius,
  fontSize = 16,
  fontWeight,
  letterSpacing,
  withPlus = false,
  testID,
  accessibilityLabel,
}: {
  label: string;
  onPress: () => void;
  /** Fixed width; omit to stretch to the parent. */
  width?: number;
  height: number;
  radius: number;
  fontSize?: number;
  fontWeight?: number;
  letterSpacing?: number;
  withPlus?: boolean;
  testID?: string;
  accessibilityLabel?: string;
}) {
  const { isDark } = useAppTheme();
  const c = sessionPalette(isDark).brand;

  return (
    <BrandPressable
      $width={width}
      $height={height}
      $radius={radius}
      onPress={onPress}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
    >
      <HomeGradient
        variant="brand"
        style={{
          flex: 1,
          borderRadius: radius,
          borderWidth: 1,
          borderColor: c.edge,
          shadowColor: '#FF2D55',
          shadowOpacity: 0.5,
          shadowOffset: { width: 0, height: 7 },
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <HomeGradient
          variant="gloss"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: height / 2,
            borderTopLeftRadius: radius,
            borderTopRightRadius: radius,
            opacity: 0.35,
          }}
        />
        <BrandContent>
          {withPlus && <PlusIcon />}
          <BrandLabel $fontSize={fontSize} $fontWeight={fontWeight} $letterSpacing={letterSpacing}>
            {label}
          </BrandLabel>
        </BrandContent>
      </HomeGradient>
    </BrandPressable>
  );
}

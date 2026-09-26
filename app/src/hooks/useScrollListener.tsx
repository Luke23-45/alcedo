import { useAppTheme } from '@/hooks/useAppTheme';
import { createContext, useCallback, useContext, useMemo, useState, ReactNode, useEffect, useRef } from 'react';
import { Animated, ColorValue, NativeScrollEvent, NativeSyntheticEvent, useAnimatedValue } from 'react-native';

type ScrollContextValues = {
  isScrolled: boolean;
  setScrolled: (_: boolean) => void;
  isScrollingDown: boolean;
  setScrollingDown: (_: boolean) => void;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
};

// Create a context with default value
const ScrollContext = createContext<ScrollContextValues>({
  isScrolled: false,
  setScrolled: (_: boolean) => {},
  isScrollingDown: false,
  setScrollingDown: (_: boolean) => {},
  handleScroll: (_event: NativeSyntheticEvent<NativeScrollEvent>) => {},
});

type ScrollProviderCallbackProps =
  | {
      setScrolled: (scroll: boolean) => void;
      isScrolled: boolean;
    }
  | {
      setScrolled?: undefined;
      isScrolled?: undefined;
    };

type ScrollProviderProps = {
  children: ReactNode;
} & ScrollProviderCallbackProps;

// Create a provider component
export const ScrollProvider = ({
  children,
  isScrolled: isScrolledOverride,
  setScrolled: setScrolledOverride,
}: ScrollProviderProps) => {
  const [isScrolledGlobal, setScrolledGlobal] = useState(false);
  const [isScrollingDown, setScrollingDown] = useState(false);

  // Stable provider value: a fresh literal per render re-renders every consumer.
  const value = useMemo<ScrollContextValues>(
    () => ({
      isScrolled: isScrolledOverride ?? isScrolledGlobal,
      setScrolled: setScrolledOverride ?? setScrolledGlobal,
      isScrollingDown,
      setScrollingDown,
      handleScroll: () => {},
    }),
    [isScrolledOverride, isScrolledGlobal, setScrolledOverride, isScrollingDown],
  );

  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
};

// Create a hook to use the ScrollContext
export const useScroll = (invertedScroll?: boolean): ScrollContextValues => {
  const ctx = useContext(ScrollContext);
  // Ref, not state: this is write-per-scroll-frame bookkeeping that must never
  // trigger a re-render by itself.
  const scrollHandlerLastFired = useRef<boolean | undefined>(undefined);
  const lastOffset = useRef(0);
  const lastScrollingDown = useRef(false);
  // Stable identity: FlatList/ScrollView take this as onScroll — a fresh
  // closure per render defeats their internal memoization.
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const contentHeight = event.nativeEvent.contentSize.height;
      const layoutHeight = event.nativeEvent.layoutMeasurement.height;
      const scrollHeight = contentHeight - layoutHeight;

      // Clamp so that an overscroll bounce past the top doesn't read as scrolling down on the way back.
      // Only propagate when the direction actually changes — this fires per
      // scroll frame, and an unconditional context setState per frame is wasted work.
      const scrollingDown = offsetY > Math.max(lastOffset.current, 0);
      if (scrollingDown !== lastScrollingDown.current) {
        lastScrollingDown.current = scrollingDown;
        ctx.setScrollingDown(scrollingDown);
      }
      lastOffset.current = offsetY;

      const isScrolled = invertedScroll ? offsetY < scrollHeight : offsetY > 0;
      if (scrollHandlerLastFired.current === isScrolled) {
        return;
      }
      scrollHandlerLastFired.current = isScrolled;
      ctx.setScrolled(isScrolled);
    },
    [ctx, invertedScroll],
  );
  return useMemo(() => ({ ...ctx, handleScroll }), [ctx, handleScroll]);
};

export const useScrollHeaderColor = (): ColorValue => {
  const { isScrolled } = useScroll();
  const { colors } = useAppTheme();
  const scrollColor = useAnimatedValue(0);

  useEffect(() => {
    Animated.timing(scrollColor, {
      toValue: isScrolled ? 1 : 0,
      duration: 200,
      useNativeDriver: false, // color interpolation can't use native driver
    }).start();
  }, [isScrolled, scrollColor]);

  // Interpolate background color
  const backgroundColor = scrollColor.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.surface, colors.surfaceContainer],
  }) as unknown as ColorValue;

  return backgroundColor;
};

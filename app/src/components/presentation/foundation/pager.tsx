import { useAppTheme } from '@/hooks/useAppTheme';
import { Children, ReactNode, useEffect, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Reanimated, { useAnimatedScrollHandler, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { PageIndicator } from './page-indicator';

export interface PagerProps {
  children: ReactNode;
  /** Controlled active page. When it changes the pager scrolls to it. */
  page?: number;
  onPageChange?: (page: number) => void;
  scrollEnabled?: boolean;
  showIndicator?: boolean;
  indicatorColor?: string;
  /** Fill the parent's height instead of sizing to content. */
  fill?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Pager({
  children,
  page,
  onPageChange,
  scrollEnabled = true,
  showIndicator = true,
  indicatorColor,
  fill = false,
  style,
}: PagerProps) {
  const theme = useAppTheme();
  const [pageWidth, setPageWidth] = useState(0);
  // UI-thread scroll offset: the indicator dots track the finger with no JS round-trip.
  const scrollX = useSharedValue(0);
  const scrollRef = useRef<ScrollView>(null);
  const pages = Children.toArray(children);

  useEffect(() => {
    if (page != null && pageWidth > 0) {
      scrollRef.current?.scrollTo({ x: page * pageWidth, animated: true });
    }
  }, [page, pageWidth]);

  const progressWidth = useSharedValue(1);
  if (pageWidth > 0) progressWidth.value = pageWidth;
  const progress = useDerivedValue(() => scrollX.value / progressWidth.value);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  const onLayout = (e: LayoutChangeEvent) => setPageWidth(e.nativeEvent.layout.width);
  const settleTo = (offsetX: number) => {
    if (pageWidth > 0) {
      onPageChange?.(Math.round(offsetX / pageWidth));
    }
  };
  // targetContentOffset (iOS) reports the snap destination even for slow drags that never gain
  // momentum, which onMomentumScrollEnd alone would miss.
  const onScrollEndDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    settleTo(e.nativeEvent.targetContentOffset?.x ?? e.nativeEvent.contentOffset.x);
  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => settleTo(e.nativeEvent.contentOffset.x);

  return (
    <View style={[fill && styles.fill, style]}>
      <Reanimated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={scrollEnabled && pages.length > 1}
        onScroll={scrollHandler}
        onScrollEndDrag={onScrollEndDrag}
        onMomentumScrollEnd={onMomentumScrollEnd}
        scrollEventThrottle={16}
        onLayout={onLayout}
        style={fill ? styles.fill : undefined}
      >
        {pageWidth > 0 &&
          pages.map((child, index) => (
            <View key={index} style={{ width: pageWidth }}>
              {child}
            </View>
          ))}
      </Reanimated.ScrollView>

      {showIndicator && (
        <PageIndicator
          count={pages.length}
          progress={progress}
          color={indicatorColor ?? theme.color.content.secondary}
          style={styles.indicator}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  indicator: {
    marginTop: 8,
  },
});

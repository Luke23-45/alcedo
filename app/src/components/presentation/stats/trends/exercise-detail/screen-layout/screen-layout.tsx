import { type ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FullHeightScrollView from '@/components/layout/full-height-scroll-view';
import { ExerciseDetailBackground } from '../screen-background/screen-background';
import { Body, EmptyWrap, EmptyText } from './screen-layout.styles';

/**
 * Screen-owned layout: the scroll container with the exercise-detail
 * background and the reference's 16pt side margins. Vertical rhythm between
 * sections lives in Body (12pt gaps), matching the SVG's card spacing.
 */
export function ExerciseDetailLayout({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <FullHeightScrollView
      screenBackground={<ExerciseDetailBackground />}
      contentContainerStyle={{
        paddingTop: insets.top,
        paddingHorizontal: 16,
        paddingBottom: Math.max(insets.bottom, 24),
      }}
    >
      {children}
    </FullHeightScrollView>
  );
}

export { Body, EmptyWrap, EmptyText };

import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { useAppReducedMotion } from '@/hooks/useMotionSettings';
import { SharePoster } from '../../shared/share-poster';
import { useComposerT } from '../composer-i18n';
import type { PosterProps } from '../poster-props';
import * as S from './live-preview.styles';

interface LivePreviewProps {
  poster: PosterProps;
}

/**
 * The live preview: the shared SharePoster, so the composer shows
 * byte-identical output to what the feed renders. The LIVE dot pulses on a
 * 2s loop unless reduced motion is on, in which case it freezes on.
 */
export function LivePreview({ poster }: LivePreviewProps) {
  const t = useComposerT();
  const reduceMotion = useAppReducedMotion();
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (reduceMotion) {
      pulse.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.3, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, reduceMotion]);

  return (
    <S.Section>
      <S.HeaderRow>
        <S.SectionHeader>{t('feed.composer.preview.title', 'PREVIEW')}</S.SectionHeader>
        <S.LiveRow>
          <Animated.View style={{ opacity: pulse }}>
            <S.LiveDot />
          </Animated.View>
          <S.LiveLabel>{t('feed.composer.preview.live', 'LIVE')}</S.LiveLabel>
        </S.LiveRow>
      </S.HeaderRow>
      <S.PosterSlot>
        <SharePoster
          theme={poster.theme}
          kicker={poster.kicker}
          heroValue={poster.heroValue}
          heroUnit={poster.heroUnit}
          workoutName={poster.workoutName}
          duration={poster.duration}
          sets={poster.sets}
          prPills={poster.prPills}
        />
      </S.PosterSlot>
    </S.Section>
  );
}

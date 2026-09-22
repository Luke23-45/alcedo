import { useState } from 'react';
import { Pressable } from 'react-native';
import { useVideoPlayer } from 'expo-video';
import Svg, { Path } from 'react-native-svg';
import * as S from './media-hero.styles';

function PlayGlyph({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M8.5 5.8v12.4c0 .8.9 1.3 1.6.9l9.7-6.2c.6-.4.6-1.4 0-1.8L10.1 4.9c-.7-.4-1.6.1-1.6.9z" fill="#FFFFFF" />
    </Svg>
  );
}

/**
 * Video hero: the still poster fills the slot until the user taps, then the
 * bundled clip plays inline. No autoplay, no sound on by default — playback
 * is always user-initiated, which also keeps reduced-motion honest. Tapping
 * while playing pauses. A duration chip rides the bottom-trailing corner.
 */
export function VideoHero({
  video,
  poster,
  a11yLabel,
  durationLabel,
}: {
  video: number;
  poster: number;
  a11yLabel: string;
  durationLabel: string;
}) {
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const player = useVideoPlayer(video, (p) => {
    p.loop = true;
  });

  const toggle = () => {
    if (!started) {
      setStarted(true);
      player.play();
      setPlaying(true);
    } else if (playing) {
      player.pause();
      setPlaying(false);
    } else {
      player.play();
      setPlaying(true);
    }
  };

  return (
    <S.ShadowWrap>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={playing ? `${a11yLabel} — pause` : `${a11yLabel} — play`}
        onPress={toggle}
      >
        <S.MediaFrame>
          {started ? (
            <S.VideoFill player={player} contentFit="cover" nativeControls={false} />
          ) : (
            <S.Photo source={poster} resizeMode="cover" />
          )}
          {!playing && (
            <S.PlayButton accessibilityElementsHidden={true}>
              <PlayGlyph />
            </S.PlayButton>
          )}
          {!started && (
            <>
              <S.Scrim />
              <S.DurationChip>
                <S.DurationText style={{ fontVariant: ['tabular-nums'] }}>{durationLabel}</S.DurationText>
              </S.DurationChip>
            </>
          )}
          <S.Edge />
        </S.MediaFrame>
      </Pressable>
    </S.ShadowWrap>
  );
}

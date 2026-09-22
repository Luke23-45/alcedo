import { requireOptionalNativeModule } from 'expo';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { POSTER_HEIGHT, POSTER_RADIUS, ShadowWrap } from './share-poster.styles';

// expo-video may be missing from the dev APK if it was built before the dependency
// was added. Don't crash the entire feed on import — fall back to a plain View.
// `require('expo-video')` itself throws when the native module is missing, so
// don't touch the JS entry at all — only use the optional native view if present.
let VideoView: any = View;
const mod = requireOptionalNativeModule('ExpoVideo');
if (mod?.VideoView) VideoView = mod.VideoView;

/**
 * Shared media-hero chrome: the photo/video heroes reuse the share poster's
 * exact slot geometry (190pt tall, 22pt continuous radius, poster shadow) so
 * the feed rhythm is identical across workout, photo, and video cards.
 * Media heroes are photographs — they do not theme in light mode.
 */

export { ShadowWrap };

/** 190pt media frame, clipped to the poster radius. */
export const MediaFrame = styled.View`
  width: 100%;
  height: ${POSTER_HEIGHT}px;
  border-radius: ${POSTER_RADIUS}px;
  overflow: hidden;
  background-color: #1c1c1e;
`;

export const Photo = styled.Image`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
`;

export const VideoFill = styled(VideoView)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

/** 1pt white .22 edge, inset 0.5pt so it hugs the corner radius. */
export const Edge = styled.View`
  position: absolute;
  left: 0.5px;
  right: 0.5px;
  top: 0.5px;
  bottom: 0.5px;
  border-radius: ${POSTER_RADIUS - 0.5}px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.22);
`;

/** Bottom scrim so the duration chip stays legible over bright footage. */
export const Scrim = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 56px;
  background-color: rgba(0, 0, 0, 0.28);
`;

/** Frosted 56pt play button, centered. */
export const PlayButton = styled.View`
  position: absolute;
  left: 50%;
  top: 50%;
  width: 56px;
  height: 56px;
  margin-left: -28px;
  margin-top: -28px;
  border-radius: 28px;
  background-color: rgba(20, 20, 22, 0.55);
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.35);
  align-items: center;
  justify-content: center;
`;

/** Monospace-feel duration chip, bottom-trailing. */
export const DurationChip = styled.View`
  position: absolute;
  right: 10px;
  bottom: 10px;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 3px;
  padding-bottom: 3px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.6);
`;

export const DurationText = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 11px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  color: #ffffff;
`; /** Tabular numerals ride as a style prop at the usage site. */

import { LinearGradient } from 'expo-linear-gradient';
import type { FeedPerson } from './people';
import * as S from './feed-avatar.styles';

interface FeedAvatarProps {
  person: FeedPerson;
  /** Diameter in pt. Spec reference: 36 (post header), 22 (kudos stack), 44 (detail author). */
  size?: number;
  /**
   * Knockout stroke colour. Must match the surface directly behind the avatar —
   * dark #17171A / light #FFFFFF on cards — and is passed by the caller because
   * only the caller knows what the avatar sits on.
   */
  ringColor: string;
}

/**
 * Initial avatar for a locked social-graph person: gradient or solid fill,
 * white .18 inner ring, knockout stroke. Identical in dark and light mode —
 * the avatar is an identity, not a surface.
 */
export function FeedAvatar({ person, size = 36, ringColor }: FeedAvatarProps) {
  return (
    <S.Avatar size={size} ringColor={ringColor}>
      {person.gradient ? (
        <LinearGradient
          colors={[person.gradient[0], person.gradient[1]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={S.fill}
        />
      ) : (
        <S.SolidFill color={person.color} />
      )}
      <S.InnerRing size={size} />
      <S.Initial size={size}>{person.initial}</S.Initial>
    </S.Avatar>
  );
}

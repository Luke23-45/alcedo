import { PROFILE } from "./profile-tokens";
import * as S from "./profile-avatar.styles";

/**
 * 88pt identity avatar: violet gradient, white .20 ring, violet glow.
 * Display-only. The reference's camera badge and "Change Photo" are omitted
 * deliberately: expo-image-picker is not installed, so they would be dead
 * controls, and dead controls don't ship.
 */
export function ProfileAvatar({ initial }: { initial: string }) {
  return (
    <S.AvatarGlow>
      <S.AvatarWrap accessibilityRole="image" accessibilityLabel="Profile photo">
        <S.AvatarFill
          colors={[PROFILE.avatarGradient[0], PROFILE.avatarGradient[1]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <S.Initial>{initial}</S.Initial>
      </S.AvatarWrap>
    </S.AvatarGlow>
  );
}

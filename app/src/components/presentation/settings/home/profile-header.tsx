import Icon from '@/components/presentation/foundation/icon';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAppSelector } from '@/store';
import { useRouter } from 'expo-router';
import { ReactNode, useState } from 'react';
import { chevronColor } from '../shared/grouped-settings-list.styles';
import { PressHighlight } from '../shared/grouped-settings-list.styles';
import * as S from './profile-header.styles';

function HeaderEdge({ children }: { children: ReactNode }) {
  const theme = useAppTheme();
  return (
    <S.HeaderEdgeBase
      colors={
        theme.isDark
          ? ['rgba(255,255,255,0.17)', 'rgba(255,255,255,0.06)', 'rgba(255,255,255,0.025)']
          : ['rgba(0,0,0,0.045)', 'rgba(0,0,0,0.06)', 'rgba(0,0,0,0.115)']
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      {children}
    </S.HeaderEdgeBase>
  );
}

function HeaderBody({ children }: { children: ReactNode }) {
  const theme = useAppTheme();
  return (
    <S.HeaderBodyBase colors={[...theme.home.card.colors]} start={{ x: 0, y: 0 }} end={{ x: 0.45, y: 1 }}>
      {children}
    </S.HeaderBodyBase>
  );
}

function Avatar({ children }: { children: ReactNode }) {
  return (
    <S.AvatarBase colors={['#5856D6', '#BF5AF2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      {children}
    </S.AvatarBase>
  );
}

/**
 * Settings home profile header (settings-dark.md Screen 1): avatar, name,
 * handle line, chevron — opens the feed profile editor.
 *
 * The name is the real feed-identity display name and the handle is the real
 * persisted profile username. No email is stored anywhere, so the contract's
 * sample email is not shown.
 */
export function ProfileHeader() {
  const { push } = useRouter();
  const [pressed, setPressed] = useState(false);
  const identityName = useAppSelector((s) => s.feed.identity.map((identity) => identity.name ?? '').unwrapOr(''));
  const username = useAppSelector((s) => s.settings.profileUsername) ?? 'alexr';

  const title = identityName.trim() || `@${username}`;
  const handle = `@${username}`;

  return (
    <HeaderEdge>
      <HeaderBody>
        <S.HeaderPressable
          accessibilityRole="button"
          accessibilityLabel={title}
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          onPress={() => push('/feed/profile-editor')}
        >
          <PressHighlight $pressed={pressed} />
          <Avatar>
            <S.AvatarInitial>{title.charAt(0).toUpperCase()}</S.AvatarInitial>
          </Avatar>
          <S.HeaderText>
            <S.HeaderName numberOfLines={1}>{title}</S.HeaderName>
            <S.HeaderSubtitle numberOfLines={1}>{handle}</S.HeaderSubtitle>
          </S.HeaderText>
          <Icon source="chevronRight" size={18} color={chevronColor} />
        </S.HeaderPressable>
      </HeaderBody>
    </HeaderEdge>
  );
}

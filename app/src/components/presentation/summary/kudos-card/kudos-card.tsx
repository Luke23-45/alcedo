import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { useTranslate } from '@tolgee/react';
import { useState } from 'react';
import Svg, { Path } from 'react-native-svg';
import * as S from './kudos-card.styles';

export interface KudosAvatar {
  initial: string;
  color: string;
}

export interface KudosDetail {
  initial: string;
  color: string;
  name: string;
  count: number;
}

function Chevron({ expanded }: { expanded: boolean }) {
  return (
    <Svg
      width={9}
      height={13}
      viewBox="-4.5 -6.5 9 13"
      style={{ transform: [{ rotate: expanded ? '90deg' : '0deg' }] }}
    >
      <Path
        d="M-2 -4 L2 0 L-2 4"
        fill="none"
        stroke="#48484A"
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * Reference card: 361×76, rx26. Overlapping follower avatars (initials on
 * bold colors, "+N" overflow), "{names}" + "gave you kudos for this session",
 * chevron. Tapping expands the per-person breakdown inline — initials,
 * names, and reaction counts, no emoji. Returns null when nobody reacted.
 */
export function KudosCard({
  avatars,
  overflowCount,
  headline,
  details,
}: {
  avatars: KudosAvatar[];
  overflowCount: number;
  headline: string;
  details: KudosDetail[];
}) {
  const { t } = useTranslate();
  const [expanded, setExpanded] = useState(false);

  if (avatars.length === 0) {
    return null;
  }

  return (
    <HomeCard radius={26} pad={16}>
      <S.VerticalPad>
      <S.CardButton
        onPress={() => setExpanded((x) => !x)}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={headline}
      >
        <S.Avatars>
          {avatars.map((avatar, index) =>
            index === 0 ? (
              <S.FirstAvatar key={index} $color={avatar.color}>
                <S.Initial>{avatar.initial}</S.Initial>
              </S.FirstAvatar>
            ) : (
              <S.Avatar key={index} $color={avatar.color}>
                <S.Initial>{avatar.initial}</S.Initial>
              </S.Avatar>
            ),
          )}
          {overflowCount > 0 && (
            <S.OverflowAvatar>
              <S.OverflowText>+{overflowCount}</S.OverflowText>
            </S.OverflowAvatar>
          )}
        </S.Avatars>
        <S.Copy>
          <S.Headline numberOfLines={1}>{headline}</S.Headline>
          <S.Subline numberOfLines={1}>{t('workout.post_workout.kudos.label')}</S.Subline>
        </S.Copy>
        <Chevron expanded={expanded} />
      </S.CardButton>
      </S.VerticalPad>
      {expanded && (
        <S.DetailList>
          {details.map((detail) => (
            <S.DetailRow key={detail.name}>
              <S.DetailAvatar $color={detail.color}>
                <S.DetailInitial>{detail.initial}</S.DetailInitial>
              </S.DetailAvatar>
              <S.DetailName numberOfLines={1}>{detail.name}</S.DetailName>
              <S.DetailCount>×{detail.count}</S.DetailCount>
            </S.DetailRow>
          ))}
        </S.DetailList>
      )}
    </HomeCard>
  );
}

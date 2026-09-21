import { KudosAvatar, KudosCard, KudosDetail } from '@/components/presentation/summary/kudos-card/kudos-card';
import { ReceivedReaction } from '@/models/feed-models';
import { useAppSelector } from '@/store';
import { selectFeedFollowers, selectReceivedReactionsByEvent } from '@/store/feed';
import { useTranslate } from '@tolgee/react';

/** The mock's bold avatar palette, cycled by reactor order. */
const AVATAR_COLORS = ['#FF4FB8', '#0A84FF', '#30D158', '#FF9F0A', '#BF5AF2'];

/**
 * The post-workout kudos card, wired to the store. Avatars are the first
 * three reactors' initials; the headline names them from real follower names
 * ("Mia, Jon and 4 others"). Null when nobody reacted.
 */
export function SmartKudosCard({ sessionId }: { sessionId: string }) {
  const { t } = useTranslate();
  const receivedByEvent = useAppSelector(selectReceivedReactionsByEvent);
  const followers = useAppSelector(selectFeedFollowers);

  const received = receivedByEvent.get(sessionId) ?? [];
  if (received.length === 0) {
    return null;
  }

  const nameOf = (reaction: ReceivedReaction) =>
    followers.find((x) => x.id === reaction.fromUserId)?.name ?? t('feed.anonymous_user.label');
  const names = [...new Set(received.map(nameOf))];

  const avatars: KudosAvatar[] = names.slice(0, 3).map((name, index) => ({
    initial: name.trim().charAt(0).toUpperCase() || '•',
    color: AVATAR_COLORS[index % AVATAR_COLORS.length]!,
  }));
  const overflowCount = Math.max(0, names.length - 3);

  const details: KudosDetail[] = names.map((name, index) => ({
    initial: name.trim().charAt(0).toUpperCase() || '•',
    color: AVATAR_COLORS[index % AVATAR_COLORS.length]!,
    name,
    count: received.filter((r) => nameOf(r) === name).reduce((sum, r) => sum + r.count, 0),
  }));

  const headline =
    names.length === 1
      ? t('workout.post_workout.kudos.names_one', { name: names[0] })
      : names.length === 2
        ? t('workout.post_workout.kudos.names_two', { a: names[0], b: names[1] })
        : names.length === 3
          ? t('workout.post_workout.kudos.names_three', { a: names[0], b: names[1], c: names[2] })
          : t('workout.post_workout.kudos.and_others', {
              a: names[0],
              b: names[1],
              count: (names.length - 2).toString(),
            });

  return <KudosCard avatars={avatars} overflowCount={overflowCount} headline={headline} details={details} />;
}

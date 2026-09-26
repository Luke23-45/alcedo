import { Instant } from '@js-joda/core';
import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { ReceivedReaction } from '@/models/feed-models';
import { useAppSelector, useAppSelectorWithArg } from '@/store';
import { selectReceivedReactionsByEvent } from '@/store/feed';
import { selectPostKudos, togglePostKudos } from '@/store/feed/comments';
import { personById, type FeedPerson } from './people';

/**
 * Reference kudos for Alex's own post, seeded as received cheers in the
 * existing reaction store ("cheers others sent you — only ever populated for
 * your own workouts", keyed by session id). The reference's six kudos are
 * Mia, Jon, Sofia, Dev, Lena and Tom.
 */
export const ALEX_KUDOS_SENDERS = ['mia', 'jon', 'sofia', 'dev', 'lena', 'tom'] as const;

export function buildAlexKudosSeed(sessionId: string): ReceivedReaction[] {
  const now = Instant.now();
  return ALEX_KUDOS_SENDERS.map(
    (fromUserId, index) =>
      new ReceivedReaction(
        `seed-alex-kudos-${fromUserId}`,
        sessionId,
        fromUserId,
        '💪',
        1,
        now.minusSeconds(index * 3600),
      ),
  );
}

/**
 * Live kudos for Alex's own post. The count is the received cheers for the
 * session — the store's designed source for cheers on your own workouts,
 * seeded with the reference's six kudos so the count is real and grows when
 * real cheers arrive — while the heart toggle is the same persisted local
 * kudo record every other post uses (keyed 'alex'), so the heart stays filled
 * and never hits the cheer pipeline's drop-for-unfollowed-author rollback.
 *
 * Shared by Screen 1 (timeline) and Screen 2 (post detail) so both screens
 * show the same count and the same toggle state for the same post.
 */
export interface OwnPostKudos {
  total: number;
  faces: FeedPerson[];
  kudoed: boolean;
}

export function useOwnPostKudos(sessionId: string | undefined): {
  /** Defined only when a real session id is given (undefined for the contract fixture). */
  kudos: OwnPostKudos | undefined;
  toggleKudos: () => void;
  needsKudosSeed: boolean;
} {
  const dispatch = useDispatch();
  const receivedByEvent = useAppSelector(selectReceivedReactionsByEvent);
  const storedKudos = useAppSelectorWithArg(selectPostKudos, 'alex');

  // Stable identities: the timeline passes kudos/toggleKudos into memoized
  // rows — fresh objects per render would defeat that memoization.
  const kudos = useMemo(() => {
    if (sessionId === undefined) return undefined;
    const received = receivedByEvent.get(sessionId) ?? [];
    return {
      total: received.reduce((sum, r) => sum + r.count, 0) + (storedKudos?.kudoed ? 1 : 0),
      faces: received
        .map((r) => personById(r.fromUserId))
        .filter((p): p is FeedPerson => p !== undefined)
        .slice(0, 3),
      kudoed: storedKudos?.kudoed ?? false,
    };
  }, [sessionId, receivedByEvent, storedKudos]);

  const toggleKudos = useCallback(() => dispatch(togglePostKudos('alex')), [dispatch]);

  const needsKudosSeed = sessionId !== undefined && (receivedByEvent.get(sessionId) ?? []).length === 0;

  return useMemo(
    () => ({ kudos, toggleKudos, needsKudosSeed }),
    [kudos, toggleKudos, needsKudosSeed],
  );
}

import { useAppSelector } from '@/store';
import { selectFeedIdentityRemote } from '@/store/feed';
import { buildOwnPerson } from './own-person';
import type { FeedPerson } from './people';

/** Own-user FeedPerson for the current store state (timeline, composer, detail). */
export function useOwnPerson(): FeedPerson {
  const identityName = useAppSelector((state) =>
    selectFeedIdentityRemote(state)
      .map((identity) => identity.name ?? '')
      .unwrapOr(''),
  );
  const username = useAppSelector((state) => state.settings.profileUsername);
  return buildOwnPerson({ name: identityName, username });
}

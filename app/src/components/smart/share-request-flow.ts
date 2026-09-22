import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { PendingFeedUser } from '@/models/feed-models';
import { useAppSelector } from '@/store';
import { fetchAndSetSharedFeedUser, requestFollowUser, selectSharedFeedUser } from '@/store/feed';

/**
 * Display name for the share-request card. The name travels on the deep link
 * (`?name=`) — the API deliberately returns no display name, because names
 * are end-to-end encrypted blobs the server cannot read — so an empty sender
 * name is labelled honestly with the translated "Anonymous User" string
 * (passed in by the caller) instead of being left blank or hard-coded in
 * English.
 */
export function shareRequestDisplayName(name: string | undefined, anonymousLabel: string): string {
  return name !== undefined && name.trim().length > 0 ? name : anonymousLabel;
}

/**
 * View-model for the `?id=` share-request branch of /feed/share. Mounting
 * fetches the sender's public profile by id; Accept sends a follow request
 * and pops the screen, Cancel just pops. The accept is one-shot: a rapid
 * double-tap must not fire two follow requests.
 *
 * Kept in its own module so the fetch-on-mount contract, retry, and the
 * one-shot guard are unit-testable without a device.
 */
export function useShareRequestFlow(id: string, name: string) {
  const dispatch = useDispatch();
  const { back } = useRouter();
  const acceptedRef = useRef(false);

  const fetchUser = useCallback(() => {
    dispatch(
      fetchAndSetSharedFeedUser({
        idOrLookup: id,
        name,
        fromUserAction: true,
      }),
    );
  }, [dispatch, id, name]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const sharedProfileRemote = useAppSelector(selectSharedFeedUser);

  const handleAccept = (user: PendingFeedUser) => {
    if (acceptedRef.current) {
      return;
    }
    acceptedRef.current = true;
    dispatch(requestFollowUser({ user, fromUserAction: true }));
    back();
  };

  const handleCancel = () => {
    back();
  };

  return { sharedProfileRemote, fetchUser, handleAccept, handleCancel };
}

import type { KeyValueStore } from '@/services/key-value-store';
import { useCallback, useEffect, useMemo, useState } from 'react';

const HIDDEN_POSTS_KEY = 'feed.timeline.hidden.v1';
const BOOKMARKS_KEY = 'feed.timeline.bookmarks.v1';

async function readStringSet(store: KeyValueStore, key: string): Promise<Set<string>> {
  try {
    const raw = await store.getItem(key);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((x): x is string => typeof x === 'string'));
  } catch {
    return new Set();
  }
}

function useStringSet(
  store: KeyValueStore,
  key: string,
): {
  set: Set<string>;
  add: (id: string) => void;
  toggle: (id: string) => void;
  has: (id: string) => boolean;
} {
  const [set, setSet] = useState<Set<string>>(new Set());
  useEffect(() => {
    let live = true;
    void readStringSet(store, key).then((next) => {
      if (live) setSet(next);
    });
    return () => {
      live = false;
    };
  }, [store, key]);

  const persist = useCallback(
    (next: Set<string>) => {
      setSet(next);
      void store.setItem(key, JSON.stringify([...next])).catch(() => {});
    },
    [store, key],
  );

  const add = useCallback(
    (id: string) => {
      const next = new Set(set);
      next.add(id);
      persist(next);
    },
    [set, persist],
  );

  const toggle = useCallback(
    (id: string) => {
      const next = new Set(set);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      persist(next);
    },
    [set, persist],
  );

  const has = useCallback((id: string) => set.has(id), [set]);

  // Stable identity: consumers memoize against this object (e.g. the timeline's
  // posts array). A fresh literal per render would defeat every downstream useMemo.
  return useMemo(() => ({ set, add, toggle, has }), [set, add, toggle, has]);
}

/**
 * Posts the user hid via Delete (own) or Report (others). Persisted so the
 * post stays gone across restarts.
 */
export function useHiddenPosts(store: KeyValueStore) {
  return useStringSet(store, HIDDEN_POSTS_KEY);
}

/** Bookmarked posts. Persisted across restarts. */
export function useBookmarks(store: KeyValueStore) {
  return useStringSet(store, BOOKMARKS_KEY);
}

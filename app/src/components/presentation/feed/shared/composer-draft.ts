import type { KeyValueStore } from '@/services/key-value-store';
import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from 'expo-router';

/**
 * Composer draft contract shared between the share/composer screen and the
 * Feed timeline.
 *
 * The composer writes the user's in-progress caption here (KeyValueStore is
 * the app's accepted local-persistence mechanism — file-backed key/value).
 * The timeline's Alex card reads it back so the feed post carries the caption
 * the user actually drafted. Absence of a draft is a normal state (the card
 * renders without a caption), never an error.
 *
 * NOTE: the composer worker (Screen 3) owns writing. If the composer later
 * persists through a different key, update COMPOSER_DRAFT_STORAGE_KEY here
 * and in the composer — this module is the single source of truth for the key.
 */
export const COMPOSER_DRAFT_STORAGE_KEY = 'feed.composer.draft.v1';

export interface ComposerDraft {
  caption: string;
  updatedAt: number;
}

export async function readComposerDraft(store: KeyValueStore): Promise<ComposerDraft | null> {
  try {
    const raw = await store.getItem(COMPOSER_DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ComposerDraft>;
    if (typeof parsed.caption !== 'string' || parsed.caption.trim().length === 0) return null;
    return { caption: parsed.caption, updatedAt: typeof parsed.updatedAt === 'number' ? parsed.updatedAt : 0 };
  } catch {
    return null;
  }
}

export async function writeComposerDraft(store: KeyValueStore, draft: ComposerDraft): Promise<void> {
  await store.setItem(COMPOSER_DRAFT_STORAGE_KEY, JSON.stringify(draft));
}

export async function clearComposerDraft(store: KeyValueStore): Promise<void> {
  await store.removeItem(COMPOSER_DRAFT_STORAGE_KEY);
}

/**
 * Reads the composer caption, re-reading every time the host screen regains
 * focus (the timeline stays mounted under the composer, so a mount-only read
 * would miss a caption drafted after first paint). Returns undefined while
 * loading or when there is no draft — the caller renders the no-caption
 * state.
 */
export function useComposerDraftCaption(store: KeyValueStore): string | undefined {
  const [caption, setCaption] = useState<string | undefined>(undefined);
  const refresh = useCallback(() => {
    let live = true;
    void readComposerDraft(store).then((draft) => {
      if (live) setCaption(draft?.caption ?? undefined);
    });
    return () => {
      live = false;
    };
  }, [store]);
  useEffect(refresh, [refresh]);
  useFocusEffect(refresh);
  return caption;
}

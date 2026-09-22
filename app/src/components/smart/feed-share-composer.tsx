import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { ShareComposer } from '@/components/presentation/feed/composer/share-composer/share-composer';
import { deriveComposerSessionData, latestSession } from '@/components/presentation/feed/composer/composer-data';
import {
  DEFAULT_VISIBLE_STATS,
  type ComposerAudience,
  type ComposerStatKey,
  type ComposerTheme,
} from '@/components/presentation/feed/composer/composer-types';
import {
  clearComposerDraft,
  readComposerDraft,
  writeComposerDraft,
} from '@/components/presentation/feed/shared/composer-draft';
import type { KeyValueStore } from '@/services/key-value-store';
import { useAppSelector } from '@/store';
import { useFormatDate } from '@/hooks/useFormatDate';
import { useFormatNumber } from '@/hooks/useFormatNumber';
import { publishComposerPost } from '@/store/feed/composer-posts';
import { selectMutualFriendCount, selectMutualFriends } from '@/store/feed';
import { selectSessions, selectHistoryPersonalRecords } from '@/store/stored-sessions';

/** Draft persistence settles this long after the last keystroke. */
const DRAFT_DEBOUNCE_MS = 500;

function defaultVisible(): Record<ComposerStatKey, boolean> {
  return {
    volume: DEFAULT_VISIBLE_STATS.includes('volume'),
    duration: DEFAULT_VISIBLE_STATS.includes('duration'),
    sets: DEFAULT_VISIBLE_STATS.includes('sets'),
    prs: DEFAULT_VISIBLE_STATS.includes('prs'),
    reps: DEFAULT_VISIBLE_STATS.includes('reps'),
    heartrate: DEFAULT_VISIBLE_STATS.includes('heartrate'),
    notes: DEFAULT_VISIBLE_STATS.includes('notes'),
    rpe: DEFAULT_VISIBLE_STATS.includes('rpe'),
  };
}

export function getFeedShareComposerHref() {
  return '/feed/share' as const;
}

/**
 * Smart container for the Share Composer. Owns the composer state; the
 * session defaults to the user's latest recorded session. Publishing writes a
 * real post to the composer-posts store and lands on the feed tab, where the
 * timeline renders it at the top.
 *
 * The composer opens empty: no pre-filled caption, no pre-tagged friends.
 * The reference mockup's filled state illustrates the focused/typed state,
 * not content to attribute to the user — publishing must never ship example
 * copy or example tags as the user's own. A caption the user actually types
 * is drafted to the KeyValueStore (scoped to the attached session, debounced)
 * so the timeline's own-post card can show it; sharing clears the draft.
 */
export function FeedShareComposer({ keyValueStore }: { keyValueStore: KeyValueStore }) {
  const dispatch = useDispatch();
  const { back, replace } = useRouter();
  const sessions = useAppSelector(selectSessions);
  const recordsBySession = useAppSelector(selectHistoryPersonalRecords);
  const friendCount = useAppSelector(selectMutualFriendCount);
  const taggablePeople = useAppSelector(selectMutualFriends);

  const latest = latestSession(sessions);
  const latestId = latest?.id;
  const [detached, setDetached] = useState(false);
  const [posterTheme, setPosterTheme] = useState<ComposerTheme>('ember');
  const [visible, setVisible] = useState<Record<ComposerStatKey, boolean>>(defaultVisible);
  const [caption, setCaption] = useState('');
  const [taggedIds, setTaggedIds] = useState<string[]>([]);
  const [audience, setAudience] = useState<ComposerAudience>('friends');
  const [audienceSheetVisible, setAudienceSheetVisible] = useState(false);
  const [tagSheetVisible, setTagSheetVisible] = useState(false);

  // Restore the in-progress draft for the attached session, unless the user
  // already started typing before the read resolved.
  const captionTouched = useRef(false);
  const [draftRestored, setDraftRestored] = useState(false);
  useEffect(() => {
    setDraftRestored(false);
    if (latestId === undefined) {
      setDraftRestored(true);
      return;
    }
    let live = true;
    void readComposerDraft(keyValueStore, latestId).then((draft) => {
      if (!live) {
        return;
      }
      if (draft && !captionTouched.current) {
        setCaption(draft.caption);
      }
      setDraftRestored(true);
    });
    return () => {
      live = false;
    };
  }, [keyValueStore, latestId]);

  // Persist the draft, debounced, scoped to the attached session. An emptied
  // caption clears the draft so a stale draft can never surface on the card.
  // Writes wait for the restore so mounting with an empty field can never
  // wipe a draft the read has not seen yet.
  useEffect(() => {
    if (!draftRestored || latestId === undefined) {
      return;
    }
    const trimmed = caption.trim();
    const timer = setTimeout(() => {
      if (trimmed.length === 0) {
        void clearComposerDraft(keyValueStore);
      } else {
        void writeComposerDraft(keyValueStore, { caption: trimmed, updatedAt: Date.now(), sessionId: latestId });
      }
    }, DRAFT_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [caption, keyValueStore, latestId, draftRestored]);

  const attached = !detached && latest !== undefined;
  const formatDate = useFormatDate();
  const formatNumber = useFormatNumber();
  const data =
    attached && latest ? deriveComposerSessionData(latest, sessions, recordsBySession, formatDate, formatNumber) : null;

  const toggleStat = (key: ComposerStatKey) => setVisible((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleCaptionChange = (value: string) => {
    captionTouched.current = true;
    setCaption(value);
  };

  // One-shot publish: a rapid double tap must not create two posts before
  // the navigation to /feed unmounts the composer.
  const shareAttempted = useRef(false);
  const share = () => {
    if (!attached || !latest || shareAttempted.current) {
      return;
    }
    shareAttempted.current = true;
    const visibleStats = (Object.keys(visible) as ComposerStatKey[]).filter((key) => visible[key]);
    // The draft is now a published post — it must not linger on the card.
    void clearComposerDraft(keyValueStore);
    dispatch(
      publishComposerPost({
        sessionId: latest.id,
        theme: posterTheme,
        visibleStats,
        caption: caption.trim(),
        taggedIds,
        audience,
        postedAt: Date.now(),
      }),
    );
    replace('/feed');
  };

  return (
    <ShareComposer
      data={data}
      attached={attached}
      canAttach={latest !== undefined}
      onAttachSession={() => setDetached(false)}
      onDetachSession={() => setDetached(true)}
      posterTheme={posterTheme}
      onPosterThemeChange={setPosterTheme}
      visible={visible}
      onToggleStat={toggleStat}
      caption={caption}
      onCaptionChange={handleCaptionChange}
      taggedIds={taggedIds}
      onUntag={(id) => setTaggedIds((prev) => prev.filter((x) => x !== id))}
      taggablePeople={taggablePeople}
      audience={audience}
      friendCount={friendCount}
      audienceSheetVisible={audienceSheetVisible}
      onOpenAudienceSheet={() => setAudienceSheetVisible(true)}
      onCloseAudienceSheet={() => setAudienceSheetVisible(false)}
      onSelectAudience={setAudience}
      tagSheetVisible={tagSheetVisible}
      onOpenTagSheet={() => setTagSheetVisible(true)}
      onCloseTagSheet={() => setTagSheetVisible(false)}
      onApplyTags={setTaggedIds}
      canShare={attached}
      onShare={share}
      onCancel={() => back()}
    />
  );
}

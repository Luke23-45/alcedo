import { useState } from 'react';
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
import { useAppSelector } from '@/store';
import { useFormatDate } from '@/hooks/useFormatDate';
import { publishComposerPost } from '@/store/feed/composer-posts';
import { selectSessions, selectHistoryPersonalRecords } from '@/store/stored-sessions';

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
 */
export function FeedShareComposer() {
  const dispatch = useDispatch();
  const { back, replace } = useRouter();
  const sessions = useAppSelector(selectSessions);
  const recordsBySession = useAppSelector(selectHistoryPersonalRecords);

  const latest = latestSession(sessions);
  const [detached, setDetached] = useState(false);
  const [posterTheme, setPosterTheme] = useState<ComposerTheme>('ember');
  const [visible, setVisible] = useState<Record<ComposerStatKey, boolean>>(defaultVisible);
  // The reference mockup opens with a drafted caption and two tagged friends.
  const [caption, setCaption] = useState('Volume up 18% on last push day — shoulder press finally moved.');
  const [taggedIds, setTaggedIds] = useState<string[]>(['mia', 'jon']);
  const [audience, setAudience] = useState<ComposerAudience>('friends');
  const [audienceSheetVisible, setAudienceSheetVisible] = useState(false);
  const [tagSheetVisible, setTagSheetVisible] = useState(false);

  const attached = !detached && latest !== undefined;
  const formatDate = useFormatDate();
  const data = attached && latest ? deriveComposerSessionData(latest, sessions, recordsBySession, formatDate) : null;

  const toggleStat = (key: ComposerStatKey) => setVisible((prev) => ({ ...prev, [key]: !prev[key] }));

  const share = () => {
    if (!attached || !latest) {
      return;
    }
    const visibleStats = (Object.keys(visible) as ComposerStatKey[]).filter((key) => visible[key]);
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
      onCaptionChange={setCaption}
      taggedIds={taggedIds}
      onUntag={(id) => setTaggedIds((prev) => prev.filter((x) => x !== id))}
      audience={audience}
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

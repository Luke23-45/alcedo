import FullHeightScrollView from '@/components/layout/full-height-scroll-view';
import { latestWhatsNewId } from '@/models/whats-new';
import { useAppSelector } from '@/store';
import { useDispatch } from 'react-redux';
import { selectApplicableWhatsNew, selectHasUnseenWhatsNew, setLastSeenWhatsNewId } from '@/store/settings';
import { useTranslate } from '@tolgee/react';
import { Stack } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useReducedMotion } from 'react-native-reanimated';
import { SettingsBackground } from '../shared/settings-background';
import { GroupLabel, ScreenFooter } from '../shared/grouped-settings-list.styles';
import { settingsKey } from '../shared/settings-i18n';
import { ReleaseCard } from '../backup/release-card';
import { WhatsNewEntryCard } from './whats-new-entry-card';
import * as S from './whats-new-screen.styles';

/**
 * What's new (settings-dark.md Screen 6 family): the shared release card on
 * top, then the real applicable entries from whats-new.ts (conditions
 * respected, newest first). "View all release notes" scrolls to the entries.
 * Opening the screen marks the entries seen — the existing behavior — but the
 * NEW pills snapshot the unread state at open so they stay visible for the
 * visit instead of vanishing mid-read.
 */
export function WhatsNewScreen() {
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const hasUnseen = useAppSelector(selectHasUnseenWhatsNew);
  const entries = useAppSelector(selectApplicableWhatsNew);
  const lastSeenId = useAppSelector((s) => s.settings.lastSeenWhatsNewId);

  // Snapshot the unread state at open; the mark-seen effect below must not
  // clear the pills while the user is still reading.
  const [initialUnseen] = useState(hasUnseen);
  const lastSeenAtOpen = useRef<number | null>(null);
  if (lastSeenAtOpen.current === null) {
    lastSeenAtOpen.current = lastSeenId;
  }

  const scrollRef = useRef<ScrollView>(null);
  const [entriesY, setEntriesY] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (hasUnseen) {
      dispatch(setLastSeenWhatsNewId(latestWhatsNewId));
    }
  }, [hasUnseen, dispatch]);

  const scrollToEntries = () => {
    scrollRef.current?.scrollTo({ y: Math.max(0, entriesY - 8), animated: !reduceMotion });
  };

  return (
    <FullHeightScrollView scrollRef={scrollRef} screenBackground={<SettingsBackground variant="backup" />}>
      <Stack.Screen options={{ title: t(settingsKey('settings.whatsnew.title')) }} />
      <S.WhatsNewScreenContent>
        <View>
          <GroupLabel>{t(settingsKey('settings.whatsnew.section.release'))}</GroupLabel>
          <ReleaseCard isNew={initialUnseen} onViewAll={scrollToEntries} />
        </View>
        {entries.length > 0 ? (
          <View onLayout={(e) => setEntriesY(e.nativeEvent.layout.y)}>
            <GroupLabel>{t(settingsKey('settings.whatsnew.section.entries'))}</GroupLabel>
            <S.WhatsNewEntries>
              {[...entries].reverse().map((entry) => (
                <WhatsNewEntryCard
                  key={entry.id}
                  entry={entry}
                  isNew={entry.id > (lastSeenAtOpen.current ?? lastSeenId)}
                />
              ))}
            </S.WhatsNewEntries>
          </View>
        ) : undefined}
        <ScreenFooter>{t(settingsKey('settings.whatsnew.footer'))}</ScreenFooter>
      </S.WhatsNewScreenContent>
    </FullHeightScrollView>
  );
}

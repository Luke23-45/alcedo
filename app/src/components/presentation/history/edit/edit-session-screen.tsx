import { Session } from '@/models/session-models';
import { useTranslate } from '@tolgee/react';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { useState } from 'react';
import { LiveTotalsStrip } from './live-totals-strip';
import { WhenCard } from './when-card';
import { ExercisesSection } from './exercises-section';
import { NotesEditor } from './notes-editor';
import * as S from './edit-session-screen.styles';

/** Amber aura at (width-63, 180), r=280, #FF9F0A @ .12 → 0 — spec background. */
function Aura() {
  const { width } = useWindowDimensions();
  const cx = width - 63;
  return (
    <Svg style={{ position: 'absolute', left: 0, top: 0 }} width={width} height={460} viewBox={`0 0 ${width} 460`}>
      <Defs>
        <RadialGradient id="editSessionAura" gradientUnits="userSpaceOnUse" cx={cx} cy={180} r={280}>
          <Stop offset="0" stopColor="#FF9F0A" stopOpacity={0.12} />
          <Stop offset="1" stopColor="#FF9F0A" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={460} fill="url(#editSessionAura)" />
    </Svg>
  );
}

/**
 * Edit Session screen (History Screen 3): atmospheric background, modal
 * nav, live totals, WHEN card, exercise rows with inline set editor,
 * notes, delete, and the sticky save bar. Purely presentational — the
 * route owns store dispatches and navigation.
 */
export function EditSessionScreen({
  session,
  updateSession,
  onSave,
  onCancel,
  onDelete,
  onAddExercise,
  menu,
}: {
  session: Session;
  updateSession: (update: (s: Session) => Session) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onAddExercise: () => void;
  menu: ReactNode;
}) {
  const { t } = useTranslate();
  const insets = useSafeAreaInsets();
  const [scrollEnabled, setScrollEnabled] = useState(true);

  return (
    <S.Screen>
      <S.BgGradient />
      <Aura />

      <S.NavBar $top={insets.top}>
        <S.NavTitle numberOfLines={1}>{t('history.edit.title', 'Edit Session')}</S.NavTitle>
        <S.NavCancel
          onPress={onCancel}
          accessibilityRole="button"
          accessibilityLabel={t('history.edit.cancel.button', 'Cancel')}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <S.NavCancelText>{t('history.edit.cancel.button', 'Cancel')}</S.NavCancelText>
        </S.NavCancel>
        <S.NavMenuSlot>{menu}</S.NavMenuSlot>
      </S.NavBar>

      <ScrollView
        scrollEnabled={scrollEnabled}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 170,
        }}
        showsVerticalScrollIndicator={false}
      >
        <S.Section $gap={0}>
          <LiveTotalsStrip session={session} />
        </S.Section>
        <S.Section $gap={12}>
          <WhenCard session={session} updateSession={updateSession} />
        </S.Section>
        <S.Section $gap={24}>
          <ExercisesSection
            session={session}
            updateSession={updateSession}
            onAddExercise={onAddExercise}
            onDragStateChange={(dragging) => setScrollEnabled(!dragging)}
          />
        </S.Section>
        <S.Section $gap={24}>
          <NotesEditor session={session} updateSession={updateSession} />
        </S.Section>
        <S.Section $gap={16}>
          <S.DeleteButton
            onPress={onDelete}
            accessibilityRole="button"
            accessibilityLabel={t('history.edit.delete_session.button', 'Delete Session')}
            style={{ borderCurve: 'continuous' }}
          >
            <S.DeleteLabel>{t('history.edit.delete_session.button', 'Delete Session')}</S.DeleteLabel>
          </S.DeleteButton>
        </S.Section>
      </ScrollView>

      <S.SaveBar $bottom={insets.bottom}>
        <Pressable
          onPress={onSave}
          accessibilityRole="button"
          accessibilityLabel={t('history.edit.save.button', 'Save Changes')}
        >
          <S.SaveOuter>
            <S.SaveBody style={{ borderCurve: 'continuous' }}>
              <S.SaveGloss />
              <S.SaveLabel>{t('history.edit.save.button', 'Save Changes')}</S.SaveLabel>
            </S.SaveBody>
          </S.SaveOuter>
        </Pressable>
        <S.SaveCaption>{t('history.edit.save.caption', 'Totals and PRs recalculate automatically')}</S.SaveCaption>
      </S.SaveBar>
    </S.Screen>
  );
}

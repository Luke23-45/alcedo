import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';
import FullHeightScrollView from '@/components/layout/full-height-scroll-view';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/hooks/useAppTheme';
import { AttachedSessionCard } from '../attached-session-card/attached-session-card';
import { AttachRow } from '../attach-row/attach-row';
import { AudienceSheet } from '../audience-sheet/audience-sheet';
import { AuthorRow } from '../author-row/author-row';
import { CaptionInput } from '../caption-input/caption-input';
import type { ComposerSessionData } from '../composer-data';
import { ComposerCta } from '../composer-cta/composer-cta';
import { ComposerNav } from '../composer-nav/composer-nav';
import { LivePreview } from '../live-preview/live-preview';
import { StatChips } from '../stat-chips/stat-chips';
import { TaggedChips } from '../tagged-chips/tagged-chips';
import { TagSheet } from '../tag-sheet/tag-sheet';
import { ThemeSwatches } from '../theme-swatches/theme-swatches';
import type { ComposerAudience, ComposerStatKey, ComposerTheme } from '../composer-types';
import type { TagPerson } from '../../shared/tag-person';
import { buildPosterProps } from '../poster-props';
import * as S from './share-composer.styles';

export interface ShareComposerProps {
  data: ComposerSessionData | null;
  /** A session is currently attached — drives the Share CTA state. */
  attached: boolean;
  /** A latest session exists and can be (re-)attached. */
  canAttach: boolean;
  onAttachSession: () => void;
  onDetachSession: () => void;
  posterTheme: ComposerTheme;
  onPosterThemeChange: (theme: ComposerTheme) => void;
  visible: Record<ComposerStatKey, boolean>;
  onToggleStat: (key: ComposerStatKey) => void;
  caption: string;
  onCaptionChange: (value: string) => void;
  taggedIds: string[];
  onUntag: (id: string) => void;
  /** Real mutual friends eligible for tagging; empty renders the empty state. */
  taggablePeople: TagPerson[];
  audience: ComposerAudience;
  /** Mutual friends from the social graph; 0/unknown omits the number. */
  friendCount: number;
  audienceSheetVisible: boolean;
  onOpenAudienceSheet: () => void;
  onCloseAudienceSheet: () => void;
  onSelectAudience: (audience: ComposerAudience) => void;
  tagSheetVisible: boolean;
  onOpenTagSheet: () => void;
  onCloseTagSheet: () => void;
  onApplyTags: (ids: string[]) => void;
  canShare: boolean;
  onShare: () => void;
  onCancel: () => void;
}

function ScreenBackground() {
  const theme = useAppTheme();
  if (!theme.isDark) {
    return null;
  }
  return (
    <S.BackgroundFill>
      <LinearGradient
        colors={['#0B0B0E', '#050507', '#08080B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.25, y: 1 }}
        style={S.fill}
      />
      <S.Aura>
        <Svg width="100%" height={700} viewBox="0 0 393 700" preserveAspectRatio="xMidYMid slice">
          <Defs>
            <RadialGradient id="composer-aura" gradientUnits="userSpaceOnUse" cx="196" cy="350" r="300">
              <Stop offset="0" stopColor="#FF6A3D" stopOpacity="0.14" />
              <Stop offset="1" stopColor="#FF6A3D" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Ellipse cx="196" cy="350" rx="300" ry="300" fill="url(#composer-aura)" />
        </Svg>
      </S.Aura>
    </S.BackgroundFill>
  );
}

/**
 * SCREEN 3 · Share Composer. Assembles every section; the smart container
 * owns the state. The preview renders the shared SharePoster through the
 * toggle rule in poster-props.ts — byte-identical to the feed.
 */
export function ShareComposer(props: ShareComposerProps) {
  const {
    data,
    attached,
    canAttach,
    onAttachSession,
    onDetachSession,
    posterTheme,
    onPosterThemeChange,
    visible,
    onToggleStat,
    caption,
    onCaptionChange,
    taggedIds,
    onUntag,
    taggablePeople,
    audience,
    friendCount,
    audienceSheetVisible,
    onOpenAudienceSheet,
    onCloseAudienceSheet,
    onSelectAudience,
    tagSheetVisible,
    onOpenTagSheet,
    onCloseTagSheet,
    onApplyTags,
    canShare,
    onShare,
    onCancel,
  } = props;
  const insets = useSafeAreaInsets();
  const poster = data ? buildPosterProps(data, posterTheme, visible) : null;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <FullHeightScrollView
        avoidKeyboard
        screenBackground={<ScreenBackground />}
        floatingChildren={
          <ComposerCta
            canShare={canShare}
            audience={audience}
            friendCount={friendCount}
            visible={visible}
            onShare={onShare}
          />
        }
      >
        <S.TopInset $top={insets.top}>
          <ComposerNav onCancel={onCancel} onShare={onShare} canShare={canShare} />
          <AuthorRow audience={audience} onAudiencePress={onOpenAudienceSheet} />
          <AttachedSessionCard
            data={attached ? data : null}
            canAttach={canAttach}
            onRemove={onDetachSession}
            onAttach={onAttachSession}
          />
          <ThemeSwatches theme={posterTheme} onThemeChange={onPosterThemeChange} heroLabel={data?.volumeLabel ?? '—'} />
          <StatChips visible={visible} onToggle={onToggleStat} />
          {poster ? <LivePreview poster={poster} /> : null}
          <CaptionInput value={caption} onChange={onCaptionChange} />
          <AttachRow onTagPress={onOpenTagSheet} />
          <TaggedChips taggedIds={taggedIds} people={taggablePeople} onRemove={onUntag} onAdd={onOpenTagSheet} />
          <S.BottomPad />
        </S.TopInset>
      </FullHeightScrollView>
      <AudienceSheet
        visible={audienceSheetVisible}
        audience={audience}
        friendCount={friendCount}
        onSelect={onSelectAudience}
        onClose={onCloseAudienceSheet}
      />
      <TagSheet
        visible={tagSheetVisible}
        taggedIds={taggedIds}
        people={taggablePeople}
        onApply={onApplyTags}
        onClose={onCloseTagSheet}
      />
    </>
  );
}

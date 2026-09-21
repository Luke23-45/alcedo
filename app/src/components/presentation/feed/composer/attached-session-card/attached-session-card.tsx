import { LinearGradient } from 'expo-linear-gradient';
import { DumbbellGlyph } from '../../shared/feed-glyphs';
import { CloseGlyph } from '../composer-glyphs';
import type { ComposerSessionData } from '../composer-data';
import { useComposerT } from '../composer-i18n';
import { useAppTheme } from '@/hooks/useAppTheme';
import * as S from './attached-session-card.styles';

export const BRAND_GRADIENT = ['#FFB03A', '#FF6A3D', '#FF2D55'] as const;

interface AttachedSessionCardProps {
  /** The attached session's derived data, or null when nothing is attached. */
  data: ComposerSessionData | null;
  /** The latest session exists and can be (re-)attached. */
  canAttach: boolean;
  onRemove: () => void;
  onAttach: () => void;
}

/**
 * The attached-session card, the re-attach affordance, and the no-sessions
 * empty state. Removing the attachment disables the Share CTA (the parent
 * owns that); the re-attach card restores the latest session — the only
 * session source the composer knows.
 */
export function AttachedSessionCard({ data, canAttach, onRemove, onAttach }: AttachedSessionCardProps) {
  const theme = useAppTheme();
  const t = useComposerT();

  if (!data) {
    return (
      <S.CardWrap>
        <S.ReattachCard
          onPress={canAttach ? onAttach : undefined}
          disabled={!canAttach}
          accessibilityRole="button"
          accessibilityLabel={t('feed.composer.attach.title', 'Attach your latest session')}
        >
          <S.SessionTile>
            <LinearGradient colors={[...BRAND_GRADIENT]} start={{ x: 0, y: 0 }} end={{ x: 0.6, y: 1 }} style={S.fill} />
            <S.TileGloss
              colors={['rgba(255,255,255,0.32)', 'rgba(255,255,255,0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
            <DumbbellGlyph size={23} color="#FFFFFF" />
          </S.SessionTile>
          <S.CardText>
            <S.EmptyTitle>
              {canAttach
                ? t('feed.composer.attach.title', 'Attach your latest session')
                : t('feed.composer.attach.empty', 'No recorded sessions yet')}
            </S.EmptyTitle>
            {canAttach ? (
              <S.EmptySubtitle>{t('feed.composer.attach.subtitle', 'Your most recent workout')}</S.EmptySubtitle>
            ) : null}
          </S.CardText>
        </S.ReattachCard>
      </S.CardWrap>
    );
  }

  return (
    <S.CardWrap>
      <S.CardShadow>
        <S.Card>
          <LinearGradient
            colors={theme.isDark ? ['#1F1F23', '#17171A', '#131316'] : ['#FFFFFF', '#FAFAFC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.45, y: 1 }}
            style={S.fill}
          />
          <S.SessionTile>
            <LinearGradient colors={[...BRAND_GRADIENT]} start={{ x: 0, y: 0 }} end={{ x: 0.6, y: 1 }} style={S.fill} />
            <S.TileGloss
              colors={['rgba(255,255,255,0.32)', 'rgba(255,255,255,0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
            <DumbbellGlyph size={23} color="#FFFFFF" />
          </S.SessionTile>
          <S.CardText>
            <S.CardKicker>{t('feed.composer.attached.label', 'ATTACHED SESSION')}</S.CardKicker>
            <S.CardTitle numberOfLines={1} ellipsizeMode="tail">
              {`${data.name} · ${data.kindLabel} — ${data.volumeLabel} ${data.volumeUnit}`}
            </S.CardTitle>
          </S.CardText>
          <S.RemoveButton
            onPress={onRemove}
            accessibilityRole="button"
            accessibilityLabel={t('feed.composer.attached.remove', 'Remove attached session')}
            hitSlop={{ top: 9, bottom: 9, left: 9, right: 9 }}
          >
            <CloseGlyph size={12} color={theme.isDark ? '#98989F' : '#6E6E73'} strokeWidth={1.8} />
          </S.RemoveButton>
          <S.CardEdge />
        </S.Card>
      </S.CardShadow>
    </S.CardWrap>
  );
}

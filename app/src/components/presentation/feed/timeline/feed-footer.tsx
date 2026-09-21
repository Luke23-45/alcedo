import { useAppTheme } from '@/hooks/useAppTheme';
import { SampleBadge } from '@/components/presentation/home/shared/sample-badge';
import { useTimelineT } from './timeline-i18n';
import * as S from './feed-footer.styles';

/**
 * Feed footer (Screen 1 spec): "Showing N of 128 posts from your circle" with
 * the feed's single SampleBadge (the fictional Mia/Jon/Sofia posts are sample
 * content), then the "Load earlier" pill. The pill dispatches a real refresh
 * of feed + inbox — it is never a visual no-op.
 */
export function FeedFooter({
  shown,
  total,
  onLoadEarlier,
}: {
  shown: number;
  total: number;
  onLoadEarlier: () => void;
}) {
  const theme = useAppTheme();
  const dark = theme.isDark;
  const t = useTimelineT();
  return (
    <S.Footer>
      <S.ShowingRow>
        <S.ShowingText $dark={dark}>
          {t('feed.timeline.footer.showing', `Showing ${shown} of ${total} posts from your circle`, {
            shown,
            total,
          })}
        </S.ShowingText>
        <S.BadgeWrap>
          <SampleBadge compact />
        </S.BadgeWrap>
      </S.ShowingRow>
      <S.LoadButton
        $dark={dark}
        onPress={onLoadEarlier}
        accessibilityRole="button"
        accessibilityLabel={t('feed.timeline.footer.load_earlier', 'Load earlier')}
      >
        <S.LoadLabel $dark={dark}>{t('feed.timeline.footer.load_earlier', 'Load earlier')}</S.LoadLabel>
      </S.LoadButton>
    </S.Footer>
  );
}

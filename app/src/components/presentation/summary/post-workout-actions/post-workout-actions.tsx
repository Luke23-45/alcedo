import { useAppTheme } from '@/hooks/useAppTheme';
import { useTranslate } from '@tolgee/react';
import Svg, { Path } from 'react-native-svg';
import * as S from './post-workout-actions.styles';

/** The mock's share glyph, drawn 1:1 in its own coordinate space. */
function ShareGlyph({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="70 1173 20 20">
      <Path
        d="M70 1188 l5 -5 l10 -10 a3.5 3.5 0 0 1 5 5 l-10 10 z M79 1179 l5 5"
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * The sticky action bar: Share (white 8% glass, custom share glyph) and Done
 * (brand gradient + top-half gloss + #fb-grade shadow), each 174×54 rx27,
 * pinned to the viewport bottom over a fade backing. Callbacks come from the
 * route so finish/share behavior stays exactly as before.
 */
export function PostWorkoutActions({
  onShare,
  onDone,
  doneLabel,
}: {
  onShare: () => void;
  onDone: () => void;
  doneLabel: string;
}) {
  const { t } = useTranslate();
  const theme = useAppTheme();

  return (
    <S.BarWrap>
      <S.Fade />
      <S.Row>
        <S.ShareButton
          onPress={onShare}
          accessibilityRole="button"
          accessibilityLabel={t('workout.post_workout.share.button')}
        >
          <ShareGlyph color={theme.color.content.primary} />
          <S.ShareLabel>{t('workout.post_workout.share.button')}</S.ShareLabel>
        </S.ShareButton>
        <S.DoneButton onPress={onDone} accessibilityRole="button" accessibilityLabel={doneLabel}>
          <S.DoneFill />
          <S.DoneGloss />
          <S.DoneLabel>{doneLabel}</S.DoneLabel>
        </S.DoneButton>
      </S.Row>
    </S.BarWrap>
  );
}

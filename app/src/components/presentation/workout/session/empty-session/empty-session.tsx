import { useAppTheme } from '@/hooks/useAppTheme';
import { useTranslate } from '@tolgee/react';
import Svg, { Circle, G, Rect } from 'react-native-svg';
import { BrandButton } from '../brand-button/brand-button';
import { sessionPalette } from '../session-tokens';
import { Body, ButtonWrap, EmptyWrap, Title } from './empty-session.styles';

function DumbbellIllustration() {
  const { isDark } = useAppTheme();
  const c = sessionPalette(isDark).empty;

  return (
    <Svg width={144} height={144} viewBox="0 0 144 144">
      <Circle cx={72} cy={72} r={72} fill={c.outerFill} />
      <Circle cx={72} cy={72} r={72} fill="none" stroke={c.outerDash} strokeWidth={1.4} strokeDasharray="4 7" strokeLinecap="round" />
      <Circle cx={72} cy={72} r={52} fill={c.innerFill} />
      <G transform="translate(72,72) scale(1.9)" fill={c.bell}>
        <Rect x={-13} y={-5.6} width={4.4} height={11.2} rx={1.8} />
        <Rect x={-7.6} y={-8} width={3.8} height={16} rx={1.7} />
        <Rect x={-7.6} y={-1.9} width={15.2} height={3.8} rx={0.6} />
        <Rect x={3.8} y={-8} width={3.8} height={16} rx={1.7} />
        <Rect x={8.6} y={-5.6} width={4.4} height={11.2} rx={1.8} />
      </G>
    </Svg>
  );
}

/** Empty active session: illustration, neutral copy, and the Add Exercise CTA. */
export function EmptySession({ onAddExercise }: { onAddExercise: () => void }) {
  const { t } = useTranslate();

  return (
    <EmptyWrap>
      <DumbbellIllustration />
      <Title>{t('workout.session.no_exercises.title')}</Title>
      <Body>{t('workout.session.no_exercises.body')}</Body>
      <ButtonWrap>
        <BrandButton
          label={t('exercise.add.title')}
          onPress={onAddExercise}
          width={241}
          height={48}
          radius={24}
          fontSize={15}
          fontWeight={600}
          letterSpacing={-0.25}
          withPlus
          testID="empty-session-add-exercise"
        />
      </ButtonWrap>
    </EmptyWrap>
  );
}

import { Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslate } from '@tolgee/react';
import { HomeGradient } from '@/components/presentation/home/shared/home-gradient';
import * as S from './exercise-detail-actions.styles';

/**
 * The two bottom actions: the primary "Log {short} Session" CTA on the
 * reference's 3-stop brand gradient (HomeGradient's `brand` variant is that
 * exact gradient) with its top gloss and white edge, and the secondary
 * "Edit Exercise Details" button. Both are 44pt+ targets. Behavior is owned
 * by the route so the nav overflow menu can share the same handlers.
 */
export function ExerciseDetailActions({
  shortName,
  onLogSession,
  onEditDetails,
}: {
  shortName: string;
  onLogSession: () => void;
  onEditDetails: () => void;
}) {
  const { t } = useTranslate();
  return (
    <S.Actions>
      <Pressable
        onPress={onLogSession}
        accessibilityRole="button"
        accessibilityLabel={t('stats.exercise_detail.actions.log_session', { name: shortName })}
      >
        <HomeGradient variant="brand" style={S.ctaButton}>
          <LinearGradient
            colors={['rgba(255,255,255,0.30)', 'rgba(255,255,255,0)']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={S.ctaGloss}
          />
          <S.CtaLabel numberOfLines={2}>{t('stats.exercise_detail.actions.log_session', { name: shortName })}</S.CtaLabel>
        </HomeGradient>
      </Pressable>
      <Pressable
        onPress={onEditDetails}
        accessibilityRole="button"
        accessibilityLabel={t('stats.exercise_detail.actions.edit_details')}
        style={S.secondaryHit}
      >
        <S.SecondaryButton>
          <S.SecondaryLabel>{t('stats.exercise_detail.actions.edit_details')}</S.SecondaryLabel>
        </S.SecondaryButton>
      </Pressable>
    </S.Actions>
  );
}

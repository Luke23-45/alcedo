import { SurfaceText } from '@/components/presentation/foundation/surface-text';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useTranslate } from '@tolgee/react';
import { View } from 'react-native';

export function UpdatePrompt() {
  const theme = useAppTheme();
  const { t } = useTranslate();
  return (
    <View style={{ gap: theme.space.sm }}>
      <SurfaceText weight="bold">{t('ai.update_required.title')}</SurfaceText>
      <SurfaceText>{t('ai.update_required.explanation')}</SurfaceText>
    </View>
  );
}

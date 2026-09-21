import { useAppTheme } from '@/hooks/useAppTheme';
import {
  CardioTimerControlsProps,
  cardioControlIconSize,
} from '@/components/presentation/workout/cardio/cardio-timer-controls-props';
import { Host, Icon, IconButton, Row } from '@expo/ui/jetpack-compose';
import { useTranslate } from '@tolgee/react';
import StopIcon from '@expo/material-symbols/stop.xml';

export function CardioTimerControls({ onStop }: CardioTimerControlsProps) {
  const theme = useAppTheme();
  const { t } = useTranslate();

  return (
    <Host matchContents seedColor={theme.color.interactive.tint} colorScheme={theme.mode}>
      <Row horizontalArrangement={{ spacedBy: theme.space.xs }} verticalAlignment="center">
        <IconButton onClick={onStop}>
          <Icon source={StopIcon} size={cardioControlIconSize + 3} contentDescription={t('cardio_timer.stop')} />
        </IconButton>
      </Row>
    </Host>
  );
}

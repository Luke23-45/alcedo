import { SurfaceText } from '@/components/presentation/foundation/surface-text';
import { useAppTheme } from '@/hooks/useAppTheme';
import { ACTIVITY_LEVELS } from '@/store/activity';
import { useTranslate } from '@tolgee/react';
import { View } from 'react-native';
import { levelColor } from '@/components/presentation/calendar/activity-colors';

const SWATCH_SIZE = 12;
const DOT_SIZE = 6;

/** A graded fill is unreadable without a key to grade it against. */
export function ActivityLegend({ showFriends }: { showFriends: boolean }) {
  const { t } = useTranslate();
  const theme = useAppTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: theme.space.base,
        marginTop: theme.space.md,
        paddingTop: theme.space.md,
        borderTopWidth: 1,
        borderTopColor: theme.color.border.hairline,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space.xs }}>
        {ACTIVITY_LEVELS.map((level) => (
          <View
            key={level}
            style={{
              width: SWATCH_SIZE,
              height: SWATCH_SIZE,
              borderRadius: 3,
              backgroundColor: levelColor(level, theme).background,
            }}
          />
        ))}
        <SurfaceText font="text-xs" color="onSurfaceVariant" style={{ marginLeft: theme.space.xs }}>
          {t('history.calendar.legend.volume')}
        </SurfaceText>
      </View>

      {showFriends && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.space.xs }}>
          <View
            style={{
              width: DOT_SIZE,
              height: DOT_SIZE,
              borderRadius: 1000,
              backgroundColor: theme.palette.turquoise[400],
            }}
          />
          <View
            style={{ width: DOT_SIZE, height: DOT_SIZE, borderRadius: 1000, backgroundColor: theme.palette.ember[300] }}
          />
          <SurfaceText font="text-xs" color="onSurfaceVariant">
            {t('history.calendar.legend.friends')}
          </SurfaceText>
        </View>
      )}
    </View>
  );
}

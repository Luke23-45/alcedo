import WeightFormat from '@/components/presentation/foundation/weight-format';
import { useAppTheme } from '@/hooks/useAppTheme';
import { RecordedWeightedExercise, Session } from '@/models/session-models';
import { MovementKey } from '@/models/blueprint-models';
import { Weight } from '@/models/weight';
import { formatDuration } from '@/utils/format-date';
import { localeFormatBigNumber } from '@/utils/locale-bignumber';
import { T, useTranslate } from '@tolgee/react';
import BigNumber from 'bignumber.js';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

interface SessionComparisonTableProps {
  mode: 'compact' | 'full';
  previousSession?: Session | undefined;
  session: Session;
}

export function SessionComparisonTable(props: SessionComparisonTableProps) {
  const theme = useAppTheme();
  const { t } = useTranslate();
  const weightedExerciseComparisons = getWeightedExerciseComparisons(props.session, props.previousSession);
  const showCurrentTotalTime =
    !!props.session.duration && (props.mode === 'compact' || props.session.duration.toMinutes() >= 5);
  const showPreviousTotalTime =
    !!props.previousSession?.duration && (props.mode === 'compact' || props.previousSession.duration.toMinutes() >= 5);
  const totalLiftedBadge = (
    <ComparisonBadge current={props.session.totalWeightLifted} previous={props.previousSession?.totalWeightLifted} />
  );
  const content = (
    <View>
      {props.mode === 'compact' ? (
        <Text
          variant="titleMedium"
          style={{
            paddingHorizontal: theme.space.sm,
            paddingTop: theme.space.sm,
            paddingBottom: theme.space.xs,
          }}
        >
          {t('workout.summary.title')}
        </Text>
      ) : null}
      {props.mode === 'full' ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: showCurrentTotalTime || showPreviousTotalTime ? 1 : 0,
            borderBottomColor: theme.color.border.hairline,
          }}
        >
          <View
            style={{
              flex: 1.46,
              paddingHorizontal: theme.space.sm,
              paddingVertical: theme.space.sm,
            }}
          />
          <Text
            variant="bodyMedium"
            style={{
              flex: 0.56,
              paddingHorizontal: theme.space.sm,
              paddingVertical: theme.space.sm,
              textAlign: 'right',
              color: theme.color.content.secondary,
            }}
          >
            {t('generic.previous.button')}
          </Text>
          <Text
            variant="bodyMedium"
            style={{
              flex: 0.56,
              paddingHorizontal: theme.space.sm,
              paddingVertical: theme.space.sm,
              textAlign: 'right',
              color: theme.color.content.secondary,
            }}
          >
            {t('workout.current_short.label')}
          </Text>
          <View
            style={{
              flex: 0.34,
              paddingHorizontal: theme.space.sm,
              paddingVertical: theme.space.sm,
            }}
          />
        </View>
      ) : null}
      {showCurrentTotalTime || showPreviousTotalTime ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: theme.color.border.hairline,
          }}
        >
          <Text
            variant="bodyMedium"
            style={{
              flex: 1.46,
              paddingHorizontal: theme.space.sm,
              paddingVertical: theme.space.sm,
            }}
          >
            <T keyName="workout.total_time.label" />
          </Text>
          {props.mode === 'full' ? (
            <Text
              variant="bodyMedium"
              style={{
                flex: 0.56,
                paddingHorizontal: theme.space.sm,
                paddingVertical: theme.space.sm,
                textAlign: 'right',
                color: theme.color.interactive.tint,
                fontWeight: 'normal',
              }}
            >
              {(showPreviousTotalTime &&
                props.previousSession?.duration &&
                formatDuration(props.previousSession.duration, 'hours-mins')) ||
                '-'}
            </Text>
          ) : null}
          {props.mode === 'full' ? (
            <Text
              variant="bodyMedium"
              style={{
                flex: 0.56,
                paddingHorizontal: theme.space.sm,
                paddingVertical: theme.space.sm,
                textAlign: 'right',
                color: theme.color.interactive.tint,
                fontWeight: 'bold',
              }}
            >
              {(showCurrentTotalTime &&
                props.session.duration &&
                formatDuration(props.session.duration, 'hours-mins')) ||
                '-'}
            </Text>
          ) : (
            <View
              style={{
                flex: 0.9,
                alignItems: 'flex-end',
                paddingHorizontal: theme.space.sm,
                paddingVertical: theme.space.sm,
              }}
            >
              <Text
                variant="bodyMedium"
                style={{
                  textAlign: 'right',
                  color: theme.color.interactive.tint,
                  fontWeight: 'bold',
                }}
              >
                {(showCurrentTotalTime &&
                  props.session.duration &&
                  formatDuration(props.session.duration, 'hours-mins')) ||
                  '-'}
              </Text>
            </View>
          )}
          {props.mode === 'full' ? (
            <View
              style={{
                flex: 0.34,
                paddingHorizontal: theme.space.sm,
                paddingVertical: theme.space.sm,
              }}
            />
          ) : null}
        </View>
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Text
          variant="bodyMedium"
          style={{
            flex: 1.46,
            paddingHorizontal: theme.space.sm,
            paddingVertical: theme.space.sm,
          }}
        >
          {t('stats.exercise.total_lifted.label')}
        </Text>
        {props.mode === 'full' ? (
          <View
            style={{
              flex: 0.56,
              alignItems: 'flex-end',
              paddingHorizontal: theme.space.sm,
              paddingVertical: theme.space.sm,
            }}
          >
            {props.previousSession ? (
              <WeightFormat
                decimalPlaces={0}
                fontWeight="normal"
                color="primary"
                weight={props.previousSession.totalWeightLifted}
              />
            ) : (
              <Text variant="bodyMedium">-</Text>
            )}
          </View>
        ) : null}
        {props.mode === 'full' ? (
          <>
            <View
              style={{
                flex: 0.56,
                alignItems: 'flex-end',
                paddingHorizontal: theme.space.sm,
                paddingVertical: theme.space.sm,
              }}
            >
              <WeightFormat
                decimalPlaces={0}
                fontWeight="bold"
                color="primary"
                weight={props.session.totalWeightLifted}
              />
            </View>
            <View
              style={{
                flex: 0.34,
                alignItems: 'flex-end',
                paddingHorizontal: theme.space.sm,
                paddingVertical: theme.space.sm,
              }}
            >
              {totalLiftedBadge}
            </View>
          </>
        ) : (
          <View
            style={{
              flex: 0.9,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: theme.space.sm,
              paddingHorizontal: theme.space.sm,
              paddingVertical: theme.space.sm,
            }}
          >
            <WeightFormat
              decimalPlaces={0}
              fontWeight="bold"
              color="primary"
              weight={props.session.totalWeightLifted}
            />
            {totalLiftedBadge}
          </View>
        )}
      </View>
      {props.mode === 'full' && weightedExerciseComparisons.length ? (
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: theme.color.border.hairline,
          }}
        >
          {weightedExerciseComparisons.map((comparison, index) => (
            <View
              key={comparison.key}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomWidth: index === weightedExerciseComparisons.length - 1 ? 0 : 1,
                borderBottomColor: theme.color.border.hairline,
              }}
            >
              <Text
                variant="bodyMedium"
                style={{
                  flex: 1.46,
                  paddingHorizontal: theme.space.sm,
                  paddingVertical: theme.space.sm,
                }}
              >
                {comparison.name}
              </Text>
              <View
                style={{
                  flex: 0.56,
                  alignItems: 'flex-end',
                  paddingHorizontal: theme.space.sm,
                  paddingVertical: theme.space.sm,
                }}
              >
                {comparison.previous ? (
                  <WeightFormat decimalPlaces={0} fontWeight="normal" color="primary" weight={comparison.previous} />
                ) : (
                  <Text variant="bodyMedium">-</Text>
                )}
              </View>
              <View
                style={{
                  flex: 0.56,
                  alignItems: 'flex-end',
                  paddingHorizontal: theme.space.sm,
                  paddingVertical: theme.space.sm,
                }}
              >
                <WeightFormat decimalPlaces={0} fontWeight="bold" color="primary" weight={comparison.current} />
              </View>
              <View
                style={{
                  flex: 0.34,
                  alignItems: 'flex-end',
                  paddingHorizontal: theme.space.sm,
                  paddingVertical: theme.space.sm,
                }}
              >
                <ComparisonBadge current={comparison.current} previous={comparison.previous} />
              </View>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );

  return content;
}

function getWeightedExerciseComparisons(session: Session, previousSession: Session | undefined) {
  const currentExerciseTotals = getWeightedExerciseTotals(session);
  const previousExerciseTotals = previousSession
    ? getWeightedExerciseTotals(previousSession)
    : new Map<MovementKey, { name: string; weight: Weight }>();

  return Array.from(currentExerciseTotals.entries()).map(([key, value]) => ({
    key,
    name: value.name,
    current: value.weight,
    previous: previousExerciseTotals.get(key)?.weight,
  }));
}

function getWeightedExerciseTotals(session: Session) {
  const totals = new Map<MovementKey, { name: string; weight: Weight }>();

  for (const exercise of session.recordedExercises) {
    if (!(exercise instanceof RecordedWeightedExercise)) {
      continue;
    }

    const key = exercise.movementKey();
    const existing = totals.get(key);
    totals.set(key, {
      name: existing?.name ?? exercise.blueprint.name,
      weight: (existing?.weight ?? Weight.NIL).plus(exercise.totalWeightLifted),
    });
  }

  return totals;
}

function getIncreasePercentage(current: Weight, previous: Weight | undefined): BigNumber | undefined {
  if (!previous || previous.value.lte(0) || !current.isGreaterThan(previous)) {
    return undefined;
  }

  return current.minus(previous).value.multipliedBy(100).dividedBy(previous.value);
}

function ComparisonBadge(props: { current: Weight; previous: Weight | undefined }) {
  const theme = useAppTheme();
  const increasePercentage = getIncreasePercentage(props.current, props.previous);

  return increasePercentage ? (
    <View
      style={{
        borderRadius: theme.radius.full,
        backgroundColor: theme.color.status.success.surface,
        paddingHorizontal: theme.space.sm,
        paddingVertical: theme.space.xxs,
      }}
    >
      <Text
        variant="labelSmall"
        style={{
          color: theme.color.status.success.content,
          fontWeight: '600',
          fontVariant: ['tabular-nums'],
        }}
      >
        +{localeFormatBigNumber(increasePercentage, 0)}%
      </Text>
    </View>
  ) : null;
}

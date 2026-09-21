import { AccordionItem } from '@/components/presentation/foundation/accordion-item';
import { useAppTheme } from '@/hooks/useAppTheme';
import { RecordedExercise } from '@/models/session-models';
import { useAppSelector } from '@/store';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { Card, Divider, Text } from 'react-native-paper';
import IconButton from '@/components/presentation/foundation/icon-button';

interface ExerciseNotesDisplayProps {
  exercise: RecordedExercise;
  previousExercise: RecordedExercise | undefined;
}
export default function ExerciseNotesDisplay(props: ExerciseNotesDisplayProps) {
  const theme = useAppTheme();
  const expandByDefault = useAppSelector((x) => x.settings.notesExpandedByDefault);
  const notes = props.exercise.notes ?? '';
  const blueprintNotes = props.exercise.blueprint.notes ?? '';
  const previousNotes = props.previousExercise?.notes ? 'Last time: ' + props.previousExercise.notes : '';
  const [expanded, setExpanded] = useState(expandByDefault);
  const [maxNumberOfLines, setMaxNumberOfLines] = useState(expandByDefault ? undefined : 1);
  const iconButtonHeight = 40;
  const hasNotes = !(!notes && !blueprintNotes && !previousNotes);
  const handleAccordionToggle = (accordionExpanded: boolean) => {
    if (!accordionExpanded) {
      setMaxNumberOfLines(1);
    }
  };
  const handleToggleExpanded = useCallback(() => {
    const nowExpanded = !expanded;
    if (nowExpanded) {
      setMaxNumberOfLines(undefined);
    }
    setExpanded(nowExpanded);
  }, [expanded]);

  const renderText = (maxNumberOfLines: number | undefined) => {
    const renderNotes = notes;
    const renderBlueprintNotes = (maxNumberOfLines === undefined && blueprintNotes) || (!renderNotes && blueprintNotes);
    const renderPreviousNotes =
      (maxNumberOfLines === undefined && previousNotes) || (!renderBlueprintNotes && !renderNotes && previousNotes);
    return (
      <>
        {renderNotes && (
          <Text testID="exercise-notes" numberOfLines={maxNumberOfLines}>
            {notes}
          </Text>
        )}
        {renderNotes && (renderPreviousNotes || renderBlueprintNotes) && <Divider />}
        {renderBlueprintNotes && (
          <Text testID="exercise-blueprint-notes" numberOfLines={maxNumberOfLines}>
            {blueprintNotes}
          </Text>
        )}
        {renderPreviousNotes && renderBlueprintNotes && <Divider />}
        {renderPreviousNotes && (
          <Text testID="exercise-previous-notes" numberOfLines={maxNumberOfLines}>
            {previousNotes}
          </Text>
        )}
      </>
    );
  };
  if (!hasNotes) {
    return undefined;
  }
  return (
    <Card mode="contained" style={[{ marginTop: theme.space.base }]}>
      <Card.Content style={{ flexDirection: 'row' }}>
        <IconButton
          icon={expanded ? 'unfoldLess' : 'unfoldMore'}
          style={{
            margin: 0,
            marginLeft: -theme.space.md,
            alignSelf: 'flex-start',
          }}
          animated
          onPress={handleToggleExpanded}
        />

        <View style={{ flex: 1 }}>
          <AccordionItem
            isExpanded={expanded}
            startsExpanded={expandByDefault}
            onToggled={handleAccordionToggle}
            unexpandedHeight={iconButtonHeight}
          >
            <View
              style={{
                flexDirection: 'row',
                gap: theme.space.sm,
                marginTop: theme.space.md,
              }}
            >
              <View style={{ flex: 1, paddingRight: theme.space.sm }}>
                <View style={{ position: 'absolute', gap: theme.space.sm }}>{renderText(maxNumberOfLines)}</View>
                {/* Render this so it doesn't jump around when expanding - need to always reserve the full text space */}
                <View style={{ visibility: 'hidden', opacity: 0, gap: theme.space.sm }}>{renderText(undefined)}</View>
              </View>
            </View>
          </AccordionItem>
        </View>
      </Card.Content>
    </Card>
  );
}

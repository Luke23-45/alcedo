import { useState } from 'react';
import { Pressable, TextInput } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { getStringAsync } from 'expo-clipboard';
import { useTranslate } from '@tolgee/react';
import { useAppSelector } from '@/store';
import { selectExercises } from '@/store/stored-sessions';
import { setPendingImport } from '@/store/program';
import { useAppTheme } from '@/hooks/useAppTheme';
import FullHeightScrollView from '@/components/layout/full-height-scroll-view';
import { HomeGradient } from '@/components/presentation/home/shared/home-gradient';
import { SectionHeader } from '@/components/presentation/home/shared/section-header';
import { SettingsBackground } from '@/components/presentation/settings/shared/settings-background';
import { settingsKey } from '@/components/presentation/settings/shared/settings-i18n';
import { parsePlanText, parsedPlanToBlueprint, type ParsedExercise } from './plan-parser';
import {
  ImportPage,
  ParserCard,
  ParserHeaderRow,
  PasteBox,
  PasteButton,
  PasteButtonLabel,
  PastedLabel,
  RecognizedList,
  RecognizedName,
  RecognizedNote,
  RecognizedRow,
  RecognizedSets,
  SourceCaption,
  StatusCheck,
  StatusRow,
  StatusText,
  SubmitButton,
  SubmitLabel,
} from './import-plan-screen.styles';

function formatSets(exercise: ParsedExercise): string {
  const reps = exercise.reps === 'amrap' ? 'AMRAP' : exercise.reps;
  const rest = exercise.restSeconds ? ` · ${exercise.restSeconds}s` : '';
  return `${exercise.sets} × ${reps}${rest}`;
}

function RecognizedRowView({ exercise }: { exercise: ParsedExercise }) {
  const { t } = useTranslate();
  const note = exercise.matched
    ? exercise.renamed
      ? t(settingsKey('settings.programs.import.matched_renamed'), { name: exercise.rawName })
      : t(settingsKey('settings.programs.import.matched'))
    : t(settingsKey('settings.programs.import.unmatched'));
  return (
    <RecognizedRow>
      <RecognizedName>
        {exercise.name}
        <RecognizedNote $ok={exercise.matched}>{`\n${note}`}</RecognizedNote>
      </RecognizedName>
      <RecognizedSets>{formatSets(exercise)}</RecognizedSets>
    </RecognizedRow>
  );
}

/**
 * Screen 5 (bottom) — the import-plan parser. Paste plan text (or pull it
 * from the clipboard), watch Kinetic recognize each exercise against the
 * exercise library, then import the parsed days as a real program blueprint
 * for review.
 */
export function ImportPlanScreen() {
  const { t } = useTranslate();
  const { push } = useRouter();
  const dispatch = useDispatch();
  const theme = useAppTheme();
  const descriptors = useAppSelector(selectExercises);
  const [text, setText] = useState('');

  const plan = parsePlanText(text, descriptors);
  // An untouched paste box is zero lines, not one.
  const lineCount = text.length === 0 ? 0 : text.split(/\r?\n/).length;
  const hasExercises = plan.total > 0;
  const allRecognized = hasExercises && plan.recognized === plan.total;

  const paste = async () => {
    const clipped = await getStringAsync();
    if (clipped) {
      setText(clipped);
    }
  };

  const importPlan = () => {
    if (!hasExercises) {
      return;
    }
    dispatch(setPendingImport({ programBlueprint: parsedPlanToBlueprint(plan) }));
    push('/settings/import-plan-info');
  };

  return (
    <FullHeightScrollView screenBackground={<SettingsBackground variant="programs" />}>
      <ImportPage>
        <SectionHeader label={t(settingsKey('settings.programs.import.header'))} />
        <ParserCard>
          <ParserHeaderRow>
            <PastedLabel>{t(settingsKey('settings.programs.import.pasted'))}</PastedLabel>
            <SourceCaption>
              {t(settingsKey('settings.programs.import.source_lines'), { count: lineCount })}
            </SourceCaption>
          </ParserHeaderRow>
          <PasteBox>
            <TextInput
              value={text}
              onChangeText={setText}
              multiline
              placeholder={t(settingsKey('settings.programs.import.placeholder'))}
              placeholderTextColor={theme.isDark ? '#6C6C70' : '#AEAEB2'}
              style={{
                fontFamily: 'Menlo',
                fontSize: 12,
                lineHeight: 18,
                color: theme.isDark ? '#98989F' : '#636366',
                minHeight: 128,
                textAlignVertical: 'top',
              }}
              accessibilityLabel={t(settingsKey('settings.programs.import.pasted'))}
              testID="import-plan-text-input"
            />
          </PasteBox>
          <Pressable
            onPress={() => {
              void paste();
            }}
            accessibilityRole="button"
            accessibilityLabel={t(settingsKey('settings.programs.import.paste_button'))}
          >
            <PasteButton>
              <Svg width={12} height={12} viewBox="-6 -6 12 12">
                <Path
                  d="M-3 -5 H3 V5 H-3 Z M-1.5 -5 V-3.5 H1.5 V-5"
                  fill="none"
                  stroke={theme.color.content.primary}
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <PasteButtonLabel>{t(settingsKey('settings.programs.import.paste_button'))}</PasteButtonLabel>
            </PasteButton>
          </Pressable>
          {hasExercises ? (
            <>
              <StatusRow>
                <StatusCheck>
                  <Svg width={10} height={10} viewBox="-6 -6 12 12">
                    <Path
                      d="M-4 .3 L-1.2 3.2 L4.4 -3"
                      fill="none"
                      stroke="#FFF"
                      strokeWidth={2.4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </StatusCheck>
                <StatusText $ok={allRecognized}>
                  {t(settingsKey('settings.programs.import.recognized'), {
                    recognized: plan.recognized,
                    total: plan.total,
                  })}
                </StatusText>
              </StatusRow>
              <RecognizedList>
                {plan.days.flatMap((day) =>
                  day.exercises.map((exercise, i) => (
                    <RecognizedRowView key={`${day.name}-${exercise.rawName}-${i}`} exercise={exercise} />
                  )),
                )}
              </RecognizedList>
            </>
          ) : undefined}
          <Pressable
            onPress={importPlan}
            disabled={!hasExercises}
            accessibilityRole="button"
            accessibilityLabel={t(settingsKey('settings.programs.import.submit'))}
            style={{ opacity: hasExercises ? 1 : 0.5 }}
          >
            <SubmitButton>
              <HomeGradient
                variant="gloss"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 25,
                  opacity: 0.35,
                }}
              />
              <SubmitLabel>{t(settingsKey('settings.programs.import.submit'))}</SubmitLabel>
            </SubmitButton>
          </Pressable>
        </ParserCard>
      </ImportPage>
    </FullHeightScrollView>
  );
}

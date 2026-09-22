import { DayOfWeek } from '@js-joda/core';
import { Pressable } from 'react-native';
import { useDispatch } from 'react-redux';
import { HomeGradient } from '@/components/presentation/home/shared/home-gradient';
import { useAppSelector } from '@/store';
import { selectActiveProgram } from '@/store/program';
import { setPlannerTrainingDays } from '@/store/settings';
import { useTranslate } from '@tolgee/react';
import { settingsKey } from '@/components/presentation/settings/shared/settings-i18n';
import { weekdayShort } from './planner-data';
import {
  DayCircle,
  DayLetter,
  DayRow,
  DaysCard,
  DaysHeaderRow,
  DaysRestCaption,
  DaysTitle,
  SplitStrip,
} from './training-days.styles';

const WEEK: { day: DayOfWeek; letter: string }[] = [
  { day: DayOfWeek.MONDAY, letter: 'M' },
  { day: DayOfWeek.TUESDAY, letter: 'T' },
  { day: DayOfWeek.WEDNESDAY, letter: 'W' },
  { day: DayOfWeek.THURSDAY, letter: 'T' },
  { day: DayOfWeek.FRIDAY, letter: 'F' },
  { day: DayOfWeek.SATURDAY, letter: 'S' },
  { day: DayOfWeek.SUNDAY, letter: 'S' },
];

/**
 * The 7-day training/rest picker. Selected days fill with the brand gradient;
 * rest days stay hollow. The strip below maps each training day onto the
 * active program's session rotation, so "matches your split" is literal.
 */
export function TrainingDays() {
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const trainingDays = useAppSelector((s) => s.settings.plannerTrainingDays);
  const program = useAppSelector(selectActiveProgram);
  const locale = useAppSelector((s) => s.settings.preferredLanguage);

  const selected = new Set(trainingDays.map((d) => d.value()));
  const training = WEEK.filter(({ day }) => selected.has(day.value()));
  const rest = WEEK.filter(({ day }) => !selected.has(day.value()));

  const toggle = (day: DayOfWeek) => {
    const next = selected.has(day.value())
      ? trainingDays.filter((d) => d.value() !== day.value())
      : [...trainingDays, day].sort((a, b) => a.value() - b.value());
    dispatch(setPlannerTrainingDays(next));
  };

  // Map each training day onto the program's session rotation in order.
  const strip =
    program && training.length
      ? training
          .map((d, i) => program.sessions[i % program.sessions.length]?.name)
          .filter(Boolean)
          .join(' · ')
      : undefined;

  return (
    <DaysCard>
      <DaysHeaderRow>
        <DaysTitle>{t(settingsKey('settings.planner.training_days.summary'), { count: training.length })}</DaysTitle>
        {rest.length > 0 && (
          <DaysRestCaption>
            {t(settingsKey('settings.planner.training_days.rest'), {
              days: rest.map(({ day }) => weekdayShort(day, locale)).join(' & '),
            })}
          </DaysRestCaption>
        )}
      </DaysHeaderRow>
      <DayRow>
        {WEEK.map(({ day, letter }) => {
          const isSelected = selected.has(day.value());
          return (
            <Pressable
              key={day.value()}
              onPress={() => toggle(day)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={t(settingsKey('settings.planner.training_days.day_label'), {
                day: weekdayShort(day, locale),
              })}
              hitSlop={2}
              style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
            >
              {isSelected ? (
                <HomeGradient variant="brand" style={{ width: 40, height: 40, borderRadius: 20 }}>
                  <DayCircle $selected>
                    <DayLetter $selected>{letter}</DayLetter>
                  </DayCircle>
                </HomeGradient>
              ) : (
                <DayCircle $selected={false}>
                  <DayLetter $selected={false}>{letter}</DayLetter>
                </DayCircle>
              )}
            </Pressable>
          );
        })}
      </DayRow>
      {strip ? <SplitStrip numberOfLines={1}>{strip}</SplitStrip> : undefined}
    </DaysCard>
  );
}

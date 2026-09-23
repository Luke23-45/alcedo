import { DayOfWeek } from '@js-joda/core';
import { Pressable } from 'react-native';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { dayLetter } from '../notifications/notification-day-chips';
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

const WEEK: { day: DayOfWeek }[] = [
  { day: DayOfWeek.MONDAY },
  { day: DayOfWeek.TUESDAY },
  { day: DayOfWeek.WEDNESDAY },
  { day: DayOfWeek.THURSDAY },
  { day: DayOfWeek.FRIDAY },
  { day: DayOfWeek.SATURDAY },
  { day: DayOfWeek.SUNDAY },
];

/** Spec circle: 40. Below that the row measures itself and scales the
 * circles down (28 floor keeps the 12pt initial legible) so 320 never
 * overlaps — pressable flex alone can't fix 7 × 40 > 246. */
const SPEC_CIRCLE = 40;
const MIN_CIRCLE = 28;
const MIN_GAP_TOTAL = 24;

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
  const [rowWidth, setRowWidth] = useState(0);
  const circle =
    rowWidth > 0
      ? Math.min(SPEC_CIRCLE, Math.max(MIN_CIRCLE, Math.floor((rowWidth - MIN_GAP_TOTAL) / WEEK.length)))
      : SPEC_CIRCLE;

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
        <DaysTitle numberOfLines={1}>
          {t(settingsKey('settings.planner.training_days.summary'), { count: training.length })}
        </DaysTitle>
        {rest.length > 0 && (
          <DaysRestCaption numberOfLines={1}>
            {t(settingsKey('settings.planner.training_days.rest'), {
              days: rest.map(({ day }) => weekdayShort(day, locale)).join(' & '),
            })}
          </DaysRestCaption>
        )}
      </DaysHeaderRow>
      <DayRow
        onLayout={(e) => {
          const width = e.nativeEvent.layout.width;
          setRowWidth((prev) => (prev === width ? prev : width));
        }}
      >
        {WEEK.map(({ day }) => {
          const isSelected = selected.has(day.value());
          // AP02: visual initials in the app language (Intl narrow), same
          // pattern the notifications day chips already use.
          const initial = dayLetter(day, locale ?? undefined);
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
              style={{ flex: 1, maxWidth: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
            >
              {isSelected ? (
                <HomeGradient
                  variant="brand"
                  style={{ width: circle, height: circle, borderRadius: circle / 2 }}
                >
                  <DayCircle $selected style={{ width: circle, height: circle, borderRadius: circle / 2 }}>
                    <DayLetter $selected>{initial}</DayLetter>
                  </DayCircle>
                </HomeGradient>
              ) : (
                <DayCircle
                  $selected={false}
                  style={{ width: circle, height: circle, borderRadius: circle / 2 }}
                >
                  <DayLetter $selected={false}>{initial}</DayLetter>
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

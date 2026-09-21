import { Session } from '@/models/session-models';
import { useAppSelector } from '@/store';
import { LocalDate, OffsetDateTime } from '@js-joda/core';
import { useTranslate } from '@tolgee/react';
import { useState } from 'react';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import Svg, { Path } from 'react-native-svg';
import { applySessionDateTime, formatCompactDuration, offsetDateTimeAt } from '../session-time-utils';
import * as S from './when-card.styles';

function ChevronGlyph() {
  return (
    <Svg width={8} height={14} viewBox="-4 -7 8 14">
      <Path
        d="M-2 -4 L2 0 L-2 4"
        fill="none"
        stroke="#48484A"
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Memoized ICU formatters, following useFormatDate. */
const formatters = new Map<string, Intl.DateTimeFormat>();
function formatterFor(locale: string | undefined, opts: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = `${locale}|${JSON.stringify(opts)}`;
  const existing = formatters.get(key);
  if (existing) {
    return existing;
  }
  const formatter = new Intl.DateTimeFormat(locale, opts);
  formatters.set(key, formatter);
  return formatter;
}

/** "Mon, Jun 9 · 9:41 AM" — from the timestamp's own wall time, not the device zone. */
function formatDateTime(locale: string | undefined, value: OffsetDateTime, use24HourTime: boolean): string {
  const jsDate = new Date(value.year(), value.monthValue() - 1, value.dayOfMonth(), value.hour(), value.minute());
  const date = formatterFor(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(jsDate);
  const time = formatterFor(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: !use24HourTime,
  }).format(jsDate);
  return `${date} · ${time}`;
}

type Anchor = 'start' | 'end';

/**
 * WHEN card (spec 361×132 rx28): Start / End rows with chevrons open a
 * date-then-time editor that shifts every recorded set timestamp by the
 * chosen delta (see session-time-utils); Duration recomputes with an AUTO chip.
 */
export function WhenCard({
  session,
  updateSession,
}: {
  session: Session;
  updateSession: (update: (s: Session) => Session) => void;
}) {
  const { t } = useTranslate();
  const locale = useAppSelector((x) => x.settings.preferredLanguage);
  const use24HourTime = useAppSelector((x) => x.settings.use24HourTime);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const [pickedDate, setPickedDate] = useState<Date | null>(null);

  const start = session.firstExercise?.earliestTime;
  const end = session.lastExercise?.latestTime;
  const anchorTime = anchor === 'start' ? start : anchor === 'end' ? end : undefined;

  const closeEditor = () => {
    setAnchor(null);
    setPickedDate(null);
  };

  const openEditor = (next: Anchor) => {
    setPickedDate(null);
    setAnchor(next);
  };

  const handleDateConfirm = ({ date }: { date: Date | undefined }) => {
    if (!date || !anchor) {
      closeEditor();
      return;
    }
    if (!anchorTime) {
      // No recorded timestamps: only the session date can change.
      const picked = LocalDate.of(date.getFullYear(), date.getMonth() + 1, date.getDate());
      updateSession((s) => s.withUpdatedDate(picked));
      closeEditor();
      return;
    }
    setPickedDate(date);
  };

  const handleTimeConfirm = ({ hours, minutes }: { hours: number; minutes: number }) => {
    if (anchor && pickedDate && anchorTime) {
      const newDateTime = offsetDateTimeAt(pickedDate, hours, minutes, anchorTime.offset());
      updateSession((s) => applySessionDateTime(s, anchor, newDateTime));
    }
    closeEditor();
  };

  const initialDate = anchorTime
    ? new Date(
        anchorTime.year(),
        anchorTime.monthValue() - 1,
        anchorTime.dayOfMonth(),
        anchorTime.hour(),
        anchorTime.minute(),
      )
    : new Date(session.date.year(), session.date.month().ordinal(), session.date.dayOfMonth());

  const rows: Array<{
    key: string;
    label: string;
    value: string;
    editable: boolean;
    a11y: string;
    testID: string;
  }> = [
    {
      key: 'start',
      label: t('history.edit.when.start.label', 'Start'),
      value: start ? formatDateTime(locale, start, use24HourTime) : '—',
      editable: true,
      a11y: t('history.edit.when.edit_start.a11y', 'Edit session start'),
      testID: 'when-start',
    },
    {
      key: 'end',
      label: t('history.edit.when.end.label', 'End'),
      value: end ? formatDateTime(locale, end, use24HourTime) : '—',
      editable: true,
      a11y: t('history.edit.when.edit_end.a11y', 'Edit session end'),
      testID: 'when-end',
    },
    {
      key: 'duration',
      label: t('history.edit.when.duration.label', 'Duration'),
      value: formatCompactDuration(session.duration),
      editable: false,
      a11y: t('history.edit.when.duration.label', 'Duration'),
      testID: 'when-duration',
    },
  ];

  return (
    <>
      <S.WhenOuter $radius={28} style={{ borderCurve: 'continuous' }}>
        <S.WhenBody style={{ borderCurve: 'continuous' }}>
          {rows.map((row) => (
            <S.WhenRow
              key={row.key}
              testID={row.testID}
              accessibilityRole={row.editable ? 'button' : undefined}
              accessibilityLabel={row.a11y}
              disabled={!row.editable}
              onPress={() => openEditor(row.key as Anchor)}
            >
              <S.WhenLabel>{row.label}</S.WhenLabel>
              <S.WhenValueWrap>
                <S.WhenValue style={{ fontVariant: ['tabular-nums'] }}>{row.value}</S.WhenValue>
                {row.key === 'duration' && (
                  <S.AutoChip>
                    <S.AutoChipText>{t('history.edit.when.auto.label', 'Auto')}</S.AutoChipText>
                  </S.AutoChip>
                )}
                {row.editable && (
                  <S.ChevronSlot>
                    <ChevronGlyph />
                  </S.ChevronSlot>
                )}
              </S.WhenValueWrap>
            </S.WhenRow>
          ))}
          <S.WhenDivider $top={48} />
          <S.WhenDivider $top={92} />
        </S.WhenBody>
      </S.WhenOuter>

      <DatePickerModal
        locale="default"
        mode="single"
        visible={anchor !== null && pickedDate === null}
        onDismiss={closeEditor}
        onConfirm={handleDateConfirm}
        date={initialDate}
      />
      {pickedDate && (
        <TimePickerModal
          locale="default"
          visible
          onDismiss={closeEditor}
          onConfirm={handleTimeConfirm}
          hours={anchorTime?.hour() ?? 9}
          minutes={anchorTime?.minute() ?? 0}
        />
      )}
    </>
  );
}

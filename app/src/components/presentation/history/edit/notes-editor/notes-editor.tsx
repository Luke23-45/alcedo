import { Session } from '@/models/session-models';
import { useTranslate } from '@tolgee/react';
import { useEffect, useRef, useState } from 'react';
import * as S from './notes-editor.styles';

const MAX_NOTES_LENGTH = 500;

/**
 * Session notes editor. Drafts locally and commits to `session.blueprint.notes`
 * on blur (or unmount), so typing never round-trips through the store.
 */
export function NotesEditor({
  session,
  updateSession,
}: {
  session: Session;
  updateSession: (update: (s: Session) => Session) => void;
}) {
  const { t } = useTranslate();
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState(session.blueprint.notes);
  const commitRef = useRef<() => void>(() => {});

  const commit = () => {
    const text = draft;
    updateSession((s) => (s.blueprint.notes === text ? s : s.with({ blueprint: s.blueprint.with({ notes: text }) })));
  };
  commitRef.current = commit;

  // Resync when the stored notes change underneath the editor (not while typing).
  useEffect(() => {
    if (!focused) {
      setDraft(session.blueprint.notes);
    }
  }, [session.blueprint.notes, focused]);

  // Commit any un-blurred draft when the editor goes away.
  useEffect(() => () => commitRef.current(), []);

  return (
    <>
      <S.NotesLabel>{t('history.edit.notes.label', 'Notes')}</S.NotesLabel>
      <S.NotesOuter $focused={focused} style={{ borderCurve: 'continuous' }}>
        <S.NotesBody style={{ borderCurve: 'continuous' }}>
          <S.NotesInput
            value={draft}
            onChangeText={setDraft}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false);
              commit();
            }}
            placeholder={t('history.edit.notes.placeholder', 'Notes about this session...')}
            multiline
            maxLength={MAX_NOTES_LENGTH}
            cursorColor="#FF6A3D"
            accessibilityLabel={t('history.edit.notes.label', 'Notes')}
          />
          <S.NotesCounter style={{ fontVariant: ['tabular-nums'] }}>
            {t('history.edit.notes.counter', '{count} / 500', {
              count: draft.length,
            })}
          </S.NotesCounter>
        </S.NotesBody>
      </S.NotesOuter>
    </>
  );
}

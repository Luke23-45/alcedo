import Icon from '@/components/presentation/foundation/icon';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Backend, isBackendComplete } from '@/models/backend';
import { useAppSelector } from '@/store';
import { putBackend, selectAssignedBackendId, selectUserBackends, setBackendAssignment } from '@/store/backends';
import { uuid } from '@/utils/uuid';
import { useTranslate } from '@tolgee/react';
import { useRouter } from 'expo-router';
import { Fragment, ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import * as GS from '../../shared/grouped-settings-list.styles';
import * as S from './server-list.styles';

/** Theme-aware card edge: the `ce` gradient stroke (settings-dark.md). */
function CardEdge({ children }: { children: ReactNode }) {
  const theme = useAppTheme();
  return (
    <S.CardEdge
      colors={
        theme.isDark
          ? ['rgba(255,255,255,0.17)', 'rgba(255,255,255,0.06)', 'rgba(255,255,255,0.025)']
          : ['rgba(0,0,0,0.045)', 'rgba(0,0,0,0.06)', 'rgba(0,0,0,0.115)']
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      {children}
    </S.CardEdge>
  );
}

/** Theme-aware card body: the diagonal `cd` gradient (settings-dark.md). */
function CardBody({ children }: { children: ReactNode }) {
  const theme = useAppTheme();
  return (
    <S.CardBody colors={theme.home.card.colors} start={{ x: 0, y: 0 }} end={{ x: 0.45, y: 1 }}>
      {children}
    </S.CardBody>
  );
}

/** A complete backend: tappable radio row, assigns instantly. */
function CompleteRow({
  backend,
  selected,
  onAssign,
}: {
  backend: Backend;
  selected: boolean;
  onAssign: () => void;
}) {
  const { t } = useTranslate();
  const kind = backend.kind === 'liftlog' ? t('backends.kind.liftlog.label') : t('backends.kind.backup_endpoint.label');
  return (
    <S.ServerRowPressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={backend.name || t('backends.unnamed.label')}
      onPress={onAssign}
    >
      {({ pressed }: { pressed: boolean }) => (
        <>
          <GS.PressHighlight $pressed={pressed} />
          <S.ServerRowText>
            <S.ServerName numberOfLines={1}>{backend.name || t('backends.unnamed.label')}</S.ServerName>
            <S.ServerSubtitle numberOfLines={1}>
              {backend.url} · {kind}
            </S.ServerSubtitle>
          </S.ServerRowText>
          {selected ? <Icon source="check" size={20} color="#FF9F0A" /> : undefined}
        </>
      )}
    </S.ServerRowPressable>
  );
}

/** An incomplete backend: greyed, red INCOMPLETE tag, tapping does nothing. */
function IncompleteRow({ backend }: { backend: Backend }) {
  const { t } = useTranslate();
  return (
    <S.ServerRowStatic accessibilityRole="text">
      <S.ServerRowText>
        <S.ServerNameIncomplete numberOfLines={1}>
          {backend.name || t('backends.unnamed.label')}
        </S.ServerNameIncomplete>
        {backend.url ? (
          <S.ServerSubtitle numberOfLines={1}>{backend.url}</S.ServerSubtitle>
        ) : (
          <S.ServerSubtitle numberOfLines={2}>
            {t('backup.remote.choose_server.incomplete_hint')}
          </S.ServerSubtitle>
        )}
      </S.ServerRowText>
      <S.IncompleteTag accessibilityLabel={t('backup.remote.choose_server.incomplete')}>
        <S.IncompleteTagText>{t('backup.remote.choose_server.incomplete').toUpperCase()}</S.IncompleteTagText>
      </S.IncompleteTag>
    </S.ServerRowStatic>
  );
}

/**
 * The backend cards (backup-redesign.md S2): complete backends as tappable
 * radio rows that assign instantly, incomplete backends greyed with the
 * INCOMPLETE tag, and the dashed add-new row with the real add flow.
 */
export function ServerList() {
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const { push } = useRouter();
  const backends = useAppSelector(selectUserBackends);
  const assignedBackendId = useAppSelector((s) => selectAssignedBackendId(s, 'backup'));

  const complete = backends.filter(isBackendComplete);
  const incomplete = backends.filter((backend) => !isBackendComplete(backend));

  // The backends editor flow: create an empty backend and open the editor.
  // An editor left empty removes it — unchanged behavior.
  const addBackend = () => {
    const id = uuid();
    dispatch(putBackend({ id, name: '', url: '', kind: 'liftlog', headers: [] }));
    push(`/settings/backends/${id}`);
  };

  return (
    <>
      {complete.length > 0 ? (
        <>
          <S.SectionLabelText>
            {t('backup.remote.choose_server.complete_label')}
          </S.SectionLabelText>
          <CardEdge>
            <CardBody>
              {complete.map((backend, index) => (
                <Fragment key={backend.id}>
                  <CompleteRow
                    backend={backend}
                    selected={backend.id === assignedBackendId}
                    onAssign={() => dispatch(setBackendAssignment({ feature: 'backup', backendId: backend.id }))}
                  />
                  {index < complete.length - 1 ? <S.RowSeparator /> : undefined}
                </Fragment>
              ))}
            </CardBody>
          </CardEdge>
          <S.AssignHint>
            {t('backup.remote.choose_server.assign_hint')}
          </S.AssignHint>
        </>
      ) : undefined}
      {incomplete.length > 0 ? (
        <>
          <S.SectionLabelText>
            {t('backup.remote.choose_server.incomplete_label')}
          </S.SectionLabelText>
          <CardEdge>
            <CardBody>
              {incomplete.map((backend, index) => (
                <Fragment key={backend.id}>
                  <IncompleteRow backend={backend} />
                  {index < incomplete.length - 1 ? <S.RowSeparator /> : undefined}
                </Fragment>
              ))}
            </CardBody>
          </CardEdge>
        </>
      ) : undefined}
      <S.SectionLabelText>
        {t('backup.remote.choose_server.add_label')}
      </S.SectionLabelText>
      <S.AddNewCard
        accessibilityRole="button"
        accessibilityLabel={t('backup.remote.choose_server.add_new')}
        onPress={addBackend}
      >
        <Icon source="add" size={20} color="#FF9F0A" />
        <S.AddNewLabel>{t('backup.remote.choose_server.add_new')}</S.AddNewLabel>
      </S.AddNewCard>
      <S.FootnoteBlock>
        <S.FootnoteText>{t('backup.remote.choose_server.footnote_types')}</S.FootnoteText>
        <S.FootnoteText>{t('backup.remote.choose_server.footnote_auth')}</S.FootnoteText>
        <S.FootnoteText>{t('backup.remote.choose_server.footnote_oauth')}</S.FootnoteText>
      </S.FootnoteBlock>
    </>
  );
}

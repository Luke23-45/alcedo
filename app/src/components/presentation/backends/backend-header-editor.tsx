import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { DeleteCircleGlyph, KeyGlyph, PlusGlyph } from '@/components/presentation/foundation/glyphs';
import { useAppTheme } from '@/hooks/useAppTheme';
import { BackendHeader } from '@/models/backend';
import { useTranslate } from '@tolgee/react';
import { Fragment, useState } from 'react';
import { HeaderSheet } from './header-sheet';
import * as S from './backend-header-editor.styles';

const secretHeaderNames = ['authorization', 'proxy-authorization', 'x-api-key'];

const isSecretHeader = (name: string) => secretHeaderNames.includes(name.trim().toLowerCase());

// A fixed length, so the list does not report how long a secret is.
const maskedValue = '•'.repeat(12);

interface EditingHeader {
  index: number;
  header: BackendHeader;
}

export function BackendHeaderEditor(props: { headers: BackendHeader[]; onChange: (headers: BackendHeader[]) => void }) {
  const { headers, onChange } = props;
  const { t } = useTranslate();
  const theme = useAppTheme();
  const [editing, setEditing] = useState<EditingHeader | undefined>(undefined);

  const deleteColor = theme.color.status.danger.base;

  return (
    <>
      <S.SectionCaption>{t('backends.headers.label')}</S.SectionCaption>
      <HomeCard radius={20} pad={0}>
        {headers.map((header, index) => (
          <Fragment key={`header-${index}`}>
            <S.Row
              onPress={() => setEditing({ index, header })}
              accessibilityRole="button"
              accessibilityLabel={`${header.name}`}
            >
              <S.IconSlot>
                <KeyGlyph color={theme.color.content.secondary} size={22} />
              </S.IconSlot>
              <S.TextSlot>
                <S.RowTitle numberOfLines={1}>{header.name}</S.RowTitle>
                <S.RowSubtitle numberOfLines={1}>
                  {isSecretHeader(header.name) ? maskedValue : header.value}
                </S.RowSubtitle>
              </S.TextSlot>
              <S.DeleteButton
                onPress={() => onChange(headers.filter((_, i) => i !== index))}
                accessibilityRole="button"
                accessibilityLabel={t('generic.delete.button')}
                hitSlop={8}
              >
                <DeleteCircleGlyph color={deleteColor} size={22} />
              </S.DeleteButton>
            </S.Row>
            <S.Hairline />
          </Fragment>
        ))}
        <S.Row
          onPress={() => setEditing({ index: headers.length, header: { name: '', value: '' } })}
          accessibilityRole="button"
          accessibilityLabel={t('backends.headers.add.button')}
        >
          <S.IconSlot>
            <PlusGlyph color={theme.color.interactive.tint} size={22} />
          </S.IconSlot>
          <S.AddRowTitle>{t('backends.headers.add.button')}</S.AddRowTitle>
        </S.Row>
      </HomeCard>
      <S.Explanation>{t('backends.headers.explanation')}</S.Explanation>

      {editing && (
        <HeaderSheet
          key={editing.index}
          visible
          title={t(editing.index === headers.length ? 'backends.headers.add.title' : 'backends.headers.edit.title')}
          initial={editing.header}
          isNew={editing.index === headers.length}
          labels={{
            name: t('backends.header_name.label'),
            value: t('backends.header_value.label'),
            username: t('backends.basic_auth.username.label'),
            password: t('backends.basic_auth.password.label'),
            schemeLabel: t('backends.header_scheme.label'),
            schemeBasic: t('backends.header_scheme.basic'),
            schemeRaw: t('backends.header_scheme.raw'),
            cancel: t('generic.cancel.button'),
            save: t('generic.save.button'),
            show: t('generic.show.button'),
            hide: t('generic.hide.button'),
          }}
          onCancel={() => setEditing(undefined)}
          onConfirm={(header) => {
            const next = [...headers];
            next[editing.index] = header;
            onChange(next);
            setEditing(undefined);
          }}
        />
      )}
    </>
  );
}

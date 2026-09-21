import FullHeightScrollView from '@/components/layout/full-height-scroll-view';
import { refreshExportPreview } from '@/store/settings';
import type { PlaintextExportFormat } from '@/store/settings';
import { useAppSelector } from '@/store';
import { useTranslate } from '@tolgee/react';
import { Stack, useFocusEffect } from 'expo-router';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { SettingsBackground } from '../shared/settings-background';
import { ExportAction } from './export-action';
import { ExportCaption } from './export-caption';
import { FilenameCard } from './filename-card';
import { FormatSegmented } from './format-segmented';
import { JsonShapeCard } from './json-shape-card';
import { NotInFileCard } from './not-in-file-card';
import { PrivacyNoteCard } from './privacy-note-card';
import { WhatsInFileCard } from './whats-in-file-card';
import { WillExportCard } from './will-export-card';
import * as S from './plaintext-export-screen.styles';

/**
 * Plain-text export (backup-redesign.md S4): verbatim caption, CSV/JSON
 * format switch, live export-preview counts, the eight CSV columns, honest
 * weight caveats, the red cardio-omission card, the JSON shape, a filename
 * preview, the amber plaintext-health-data note, and a sticky brand Export
 * button. The dead documentation row is gone.
 */
export function PlaintextExportScreen() {
  const { t } = useTranslate();
  const dispatch = useDispatch();
  // Local state only — CSV default, never persisted.
  const [format, setFormat] = useState<PlaintextExportFormat>('CSV');
  const preview = useAppSelector((s) => s.settings.exportPreview);

  useFocusEffect(() => {
    dispatch(refreshExportPreview());
  });

  return (
    <FullHeightScrollView
      screenBackground={<SettingsBackground variant="backup" />}
      floatingChildren={<ExportAction format={format} />}
    >
      <Stack.Screen options={{ title: t('backup.plaintext_export.title') }} />
      <S.PlaintextExportContent>
        <ExportCaption />
        <FormatSegmented format={format} onChange={setFormat} />
        <WillExportCard preview={preview} />
        <WhatsInFileCard />
        <NotInFileCard />
        <JsonShapeCard />
        <FilenameCard format={format} />
        <PrivacyNoteCard />
      </S.PlaintextExportContent>
    </FullHeightScrollView>
  );
}

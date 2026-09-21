import FullHeightScrollView from '@/components/layout/full-height-scroll-view';
import { ExternalImportFormat, importFromExternal } from '@/store/settings';
import { useTranslate } from '@tolgee/react';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { SettingsBackground } from '../shared/settings-background';
import { FormatRadioList } from './format-radio-list';
import { HowMergeCard } from './how-merge-card';
import { ImportAppsHeader } from './import-apps-header';
import { ImportButton } from './import-button';
import { LastImportedCard } from './last-imported-card';
import { NotSupportedCard } from './not-supported-card';
import * as S from './import-apps-screen.styles';

/**
 * Import from other apps (backup-redesign.md §5): the persisted last-imported
 * card, the two-format radio list, the honest merge contract, the unsupported
 * list, and the sticky brand Import button. Tapping Import opens the OS file
 * picker immediately — no confirmation or preview; the import effect keeps
 * the parse/dedupe logic and all snackbar feedback unchanged.
 */
export function ImportAppsScreen() {
  const { t } = useTranslate();
  const dispatch = useDispatch();
  // Local only: which CSV shape to expect. Never persisted.
  const [format, setFormat] = useState<ExternalImportFormat>('FitNotes');

  return (
    <FullHeightScrollView
      screenBackground={<SettingsBackground variant="backup" />}
      floatingChildren={<ImportButton onImport={() => dispatch(importFromExternal({ format }))} />}
    >
      <Stack.Screen options={{ title: t('backup.import_from_other_apps.title') }} />
      <S.ImportAppsScreenContent>
        <ImportAppsHeader />
        <S.ScreenSection>
          <LastImportedCard />
        </S.ScreenSection>
        <S.ScreenSection>
          <FormatRadioList value={format} onChange={setFormat} />
        </S.ScreenSection>
        <S.ScreenSection>
          <HowMergeCard />
        </S.ScreenSection>
        <NotSupportedCard />
      </S.ImportAppsScreenContent>
    </FullHeightScrollView>
  );
}

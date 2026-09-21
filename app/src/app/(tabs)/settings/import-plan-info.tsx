import { Stack } from 'expo-router';
import { useDispatch } from 'react-redux';
import { useTranslate } from '@tolgee/react';
import { importPlanFromPicker } from '@/store/program';
import { settingsKey } from '@/components/presentation/settings/shared/settings-i18n';
import { ImportReviewScreen } from '@/components/presentation/settings/programs/import-review-screen';

/**
 * Reviews a pending plan import before saving it to the library. Thin
 * wrapper; the UI lives in components/presentation/settings/programs/.
 */
export default function ImportPlanInfoPage() {
  const { t } = useTranslate();
  const dispatch = useDispatch();
  return (
    <>
      <Stack.Screen options={{ title: t(settingsKey('settings.programs.review.nav_title')) }} />
      <ImportReviewScreen importPlanFromPicker={() => dispatch(importPlanFromPicker())} />
    </>
  );
}

import { Pressable } from 'react-native';
import { Fragment } from 'react';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { useTranslate } from '@tolgee/react';
import { uuid } from '@/utils/uuid';
import { useAppSelector } from '@/store';
import { clearPendingImport, savePlan } from '@/store/program';
import { useOnDismiss } from '@/hooks/useOnDismiss';
import FullHeightScrollView from '@/components/layout/full-height-scroll-view';
import { SectionHeader } from '@/components/presentation/home/shared/section-header';
import { SettingsBackground } from '@/components/presentation/settings/shared/settings-background';
import { usePreferredWeightUnit } from '@/hooks/usePreferredWeightUnit';
import { Session } from '@/models/session-models';
import { settingsKey } from '@/components/presentation/settings/shared/settings-i18n';
import SessionSummary from '@/components/presentation/summary/session-summary';
import SessionSummaryTitle from '@/components/presentation/summary/session-summary-title';
import { SubmitButton, SubmitLabel } from './import-plan-screen.styles';
import { ImportHint, ReviewCard, ReviewMeta, ReviewPage, ReviewTitle } from './import-review-screen.styles';
import { DocumentationRow } from '@/components/presentation/foundation/documentation-row';

/**
 * Reviews the parsed plan (from the clipboard parser or the plan-file
 * picker) before it is saved to the library. Backing out without saving
 * discards the pending import; the file-picker fallback is kept for
 * serialized plan files.
 */
export function ImportReviewScreen({ importPlanFromPicker }: { importPlanFromPicker: () => void }) {
  const { t } = useTranslate();
  const { replace } = useRouter();
  const dispatch = useDispatch();
  const pendingImport = useAppSelector((state) => state.program.pendingImport);
  const preferredWeightUnit = usePreferredWeightUnit();

  useOnDismiss(() => dispatch(clearPendingImport()));

  const save = () => {
    if (!pendingImport) {
      return;
    }
    const programId = uuid();
    dispatch(savePlan({ programId, programBlueprint: pendingImport }));
    dispatch(clearPendingImport());
    replace({
      pathname: '/settings/program-list',
      params: { focusprogramId: programId },
    });
  };

  const sessionCount = pendingImport?.sessions.length ?? 0;

  return (
    <FullHeightScrollView screenBackground={<SettingsBackground variant="programs" />}>
      <ReviewPage>
        <SectionHeader label={t(settingsKey('settings.programs.review.header'))} />
        {pendingImport ? (
          <ReviewCard>
            <ReviewTitle numberOfLines={1}>{pendingImport.name}</ReviewTitle>
            <ReviewMeta numberOfLines={1}>
              {t(settingsKey('settings.programs.row.sessions'), { count: sessionCount })}
            </ReviewMeta>
            {pendingImport.sessions.map((session, index) => (
              <Fragment key={index}>
                <SessionSummaryTitle
                  session={Session.getEmptySession(session, preferredWeightUnit)}
                  showVolume={true}
                />
                <SessionSummary session={Session.getEmptySession(session, preferredWeightUnit)} />
              </Fragment>
            ))}
            <Pressable
              onPress={save}
              accessibilityRole="button"
              accessibilityLabel={t(settingsKey('settings.programs.review.save'))}
            >
              <SubmitButton>
                <SubmitLabel>{t(settingsKey('settings.programs.review.save'))}</SubmitLabel>
              </SubmitButton>
            </Pressable>
          </ReviewCard>
        ) : (
          <ReviewCard>
            <ImportHint>{t('plan.import.info.instructions')}</ImportHint>
            <Pressable
              onPress={importPlanFromPicker}
              accessibilityRole="button"
              accessibilityLabel={t('plan.import.info.choose_file.button')}
            >
              <SubmitButton>
                <SubmitLabel>{t('plan.import.info.choose_file.button')}</SubmitLabel>
              </SubmitButton>
            </Pressable>
            <DocumentationRow doc="PlanFileFormat.md" />
          </ReviewCard>
        )}
      </ReviewPage>
    </FullHeightScrollView>
  );
}

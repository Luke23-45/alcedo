import { Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { useDispatch } from 'react-redux';
import { LocalDate } from '@js-joda/core';
import { useTranslate } from '@tolgee/react';
import { uuid } from '@/utils/uuid';
import { useAppSelector } from '@/store';
import { savePlan, selectAllPrograms, setActivePlan } from '@/store/program';
import { setPlansSortOrder } from '@/store/settings';
import { showSnackbar } from '@/store/app';
import { ProgramBlueprint } from '@/models/blueprint-models';
import FullHeightScrollView from '@/components/layout/full-height-scroll-view';
import { SectionHeader } from '@/components/presentation/home/shared/section-header';
import { SettingsBackground } from '@/components/presentation/settings/shared/settings-background';
import { settingsKey } from '@/components/presentation/settings/shared/settings-i18n';
import SelectPicker from '@/components/presentation/foundation/select-picker';
import { ProgramHeroCard } from './program-hero-card';
import { ProgramRow } from './program-row';
import { ActionButton, ActionLabel, ButtonRow, ProgramsPage, SortRow } from './program-list-screen.styles';

function PlusGlyph() {
  return (
    <Svg width={12} height={12} viewBox="-6 -6 12 12">
      <Path d="M-5 0 H5 M0 -5 V5" stroke="#C7C7CC" strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function ImportGlyph() {
  return (
    <Svg width={17} height={17} viewBox="-9 -9 18 18">
      <Path
        d="M0 -8 V3 M-4.5 -1.5 L0 3 L4.5 -1.5 M-7 3 V6 A2 2 0 0 0 -5 8 H5 A2 2 0 0 0 7 6 V3"
        fill="none"
        stroke="#FFB84D"
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * Screen 5 (top) — the program library. The active program gets the hero
 * card; tapping another program activates it with undo; the overflow menus
 * keep every existing program action. Thin-route contract: all UI lives here.
 */
export function ProgramListScreen() {
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const { push } = useRouter();
  const { focusprogramId } = useLocalSearchParams<{ focusprogramId?: string }>();
  const plans = useAppSelector(selectAllPrograms);
  const activePlanId = useAppSelector((state) => state.program.activePlanId);
  const sortOrder = useAppSelector((state) => state.settings.plansSortOrder);

  const selectPlan = (planId: string, name: string) => {
    const previousPlanId = activePlanId;
    dispatch(setActivePlan({ activePlanId: planId }));
    dispatch(
      showSnackbar(
        previousPlanId
          ? {
              text: t('plan.now_using.message', { name }),
              action: t('generic.undo.button'),
              dispatchAction: setActivePlan({ activePlanId: previousPlanId }),
            }
          : { text: t('plan.now_using.message', { name }) },
      ),
    );
  };

  const addProgram = () => {
    const programId = uuid();
    dispatch(
      savePlan({
        programId,
        programBlueprint: new ProgramBlueprint(t('plan.new_default_name.label'), [], LocalDate.now()),
      }),
    );
    push(`/settings/manage-workouts/${programId}/`);
  };

  const otherPlans = plans.filter(({ id }) => id !== activePlanId);
  if (sortOrder === 'recent') {
    otherPlans.sort((a, b) => b.program.lastEdited.compareTo(a.program.lastEdited));
  }

  return (
    <FullHeightScrollView screenBackground={<SettingsBackground variant="programs" />}>
      <ProgramsPage>
        <SectionHeader label={t(settingsKey('settings.programs.header'))} />
        {activePlanId ? <ProgramHeroCard id={activePlanId} /> : undefined}
        {otherPlans.length > 1 ? (
          <SortRow>
            <SelectPicker
              value={sortOrder}
              options={[
                { value: 'name', label: t('plan.sort.name') },
                { value: 'recent', label: t('plan.sort.recent') },
              ]}
              onChange={(value) => dispatch(setPlansSortOrder(value))}
            />
          </SortRow>
        ) : undefined}
        {otherPlans.map(({ id, program }, index) => (
          <ProgramRow
            key={id}
            id={id}
            index={index}
            highlight={focusprogramId === id}
            onSelect={() => selectPlan(id, program.name)}
          />
        ))}
        <ButtonRow>
          <Pressable
            onPress={addProgram}
            accessibilityRole="button"
            accessibilityLabel={t('plan.add.button')}
            style={{ flex: 1 }}
          >
            <ActionButton $kind="neutral">
              <PlusGlyph />
              <ActionLabel $kind="neutral" numberOfLines={1}>
                {t('plan.add.button')}
              </ActionLabel>
            </ActionButton>
          </Pressable>
          <Pressable
            onPress={() => push('/settings/import-plan')}
            accessibilityRole="button"
            accessibilityLabel={t('plan.import.button')}
            style={{ flex: 1 }}
          >
            <ActionButton $kind="amber">
              <ImportGlyph />
              <ActionLabel $kind="amber" numberOfLines={1}>
                {t('plan.import.button')}
              </ActionLabel>
            </ActionButton>
          </Pressable>
        </ButtonRow>
      </ProgramsPage>
    </FullHeightScrollView>
  );
}

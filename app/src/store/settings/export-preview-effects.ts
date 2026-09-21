import { refreshExportPreview, setExportPreview } from '@/store/settings';
import { computeExportPreviewCounts } from '@/services/plaintext-export-preview';
import { AddEffectFn } from '@/store/store';

/**
 * Recomputes the plaintext export "will export" preview from the real sessions
 * in the database. The route dispatches refreshExportPreview on focus so the
 * counts always describe the data as it is right now.
 */
export function addExportPreviewEffects(addEffect: AddEffectFn) {
  addEffect(refreshExportPreview, async (_, { dispatch, extra: { progressRepository } }) => {
    const sessions = progressRepository.getOrderedSessions();
    dispatch(setExportPreview(computeExportPreviewCounts(sessions)));
  });
}

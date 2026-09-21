import ConfirmationDialog from '@/components/presentation/foundation/confirmation-dialog';
import LimitedHtml from '@/components/presentation/foundation/limited-html';
import { useActionEffect } from '@/hooks/useActionEffect';
import { useAppTheme } from '@/hooks/useAppTheme';
import { FeedBackupData } from '@/models/backup';
import { RemoteData } from '@/models/remote';
import { useDispatch } from 'react-redux';
import {
  addFollower,
  clearFeedState,
  putFollowedUser,
  resetFeedAccount,
  setFollowRequests,
  setIdentity,
  upsertFeedItems,
} from '@/store/feed';
import { beginFeedImport, exportData } from '@/store/settings';
import { useTranslate } from '@tolgee/react';
import { useState } from 'react';

interface DialogProps {
  open: boolean;
  setOpen: (o: boolean) => void;
}

/**
 * Feed-account choice for file backups: exports the real compressed
 * `.sqlite.gz` backup through the file export service, with or without the
 * feed account.
 */
export function ExportFeedDialog({ open, setOpen }: DialogProps) {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const dispatch = useDispatch();
  return (
    <ConfirmationDialog
      headline={t('feed.backup_account.title')}
      textContent={
        <LimitedHtml
          value={t('feed.backup_account.confirm.body')}
          emStyles={{ color: theme.color.status.danger.content, fontWeight: 'bold' }}
        />
      }
      okText={t('feed.include_feed.label')}
      onOk={() => {
        dispatch(exportData({ includeFeed: true }));
        setOpen(false);
      }}
      additionalActionText={t('backup.just_my_data.button')}
      onAdditionalAction={() => {
        dispatch(exportData({ includeFeed: false }));
        setOpen(false);
      }}
      cancelText={t('generic.cancel.button')}
      onCancel={() => setOpen(false)}
      open={open}
    />
  );
}

/**
 * Confirm dialog for importing a feed account from a backup file, driven by
 * the real `beginFeedImport` action.
 */
export function ImportFeedDialog({ open, setOpen }: DialogProps) {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const dispatch = useDispatch();
  const [importedFeedState, setImportedFeedState] = useState<FeedBackupData>();

  const importFeedData = () => {
    if (!importedFeedState) {
      setOpen(false);
      return;
    }
    dispatch(
      resetFeedAccount({
        fromUserAction: true,
        createNewIdentity: false,
      }),
    );
    dispatch(clearFeedState());
    dispatch(setIdentity(RemoteData.success(importedFeedState.identity)));
    dispatch(upsertFeedItems(importedFeedState.feedItems));
    dispatch(setFollowRequests(importedFeedState.followRequests));
    importedFeedState.followed.forEach((x) => dispatch(putFollowedUser(x)));
    importedFeedState.followers.forEach((x) => dispatch(addFollower(x)));
    setOpen(false);
  };

  useActionEffect(beginFeedImport, (action) => {
    setImportedFeedState(action.payload);
    setOpen(true);
  });

  return (
    <ConfirmationDialog
      headline={t('feed.import_data.confirm.title')}
      textContent={
        <LimitedHtml
          value={t('feed.import_data.confirm.body')}
          emStyles={{ color: theme.color.status.danger.content, fontWeight: 'bold' }}
        />
      }
      onOk={importFeedData}
      okText={t('generic.import.button')}
      onCancel={() => setOpen(false)}
      cancelText={t('feed.dont_import.button')}
      open={open}
    />
  );
}

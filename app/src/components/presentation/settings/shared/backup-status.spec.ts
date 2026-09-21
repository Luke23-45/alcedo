import { Instant } from '@js-joda/core';
import { describe, expect, it } from 'vitest';
import { RemoteData } from '@/models/remote';
import { LastBackup } from '@/store/settings/registry';
import { didLastBackupSucceed, lastBackupLabel } from './backup-status';

const labels = { today: 'Today', yesterday: 'Yesterday' };

function backupAt(instant: Instant): RemoteData<LastBackup, string> {
  return RemoteData.success({
    lastBackupTime: instant,
    lastSuccessfulRemoteBackupHash: 'abc',
    backendId: 'built-in',
  });
}

describe('lastBackupLabel', () => {
  it('labels a backup from earlier today as "Today, <time>"', () => {
    const label = lastBackupLabel(backupAt(Instant.now().minusSeconds(3600)), labels, 'en-US', false);
    expect(label).toMatch(/^Today, /);
  });

  it('labels a backup from yesterday as "Yesterday, <time>"', () => {
    // Noon yesterday local avoids any midnight-boundary flakiness.
    const now = new Date();
    const yesterdayNoon = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 12);
    const label = lastBackupLabel(backupAt(Instant.ofEpochMilli(yesterdayNoon.getTime())), labels, 'en-US', false);
    expect(label).toMatch(/^Yesterday, /);
  });

  it('labels older backups with a short date', () => {
    const old = new Date(2025, 5, 8, 6, 12);
    const label = lastBackupLabel(backupAt(Instant.ofEpochMilli(old.getTime())), labels, 'en-US', false);
    expect(label).toMatch(/^Jun 8, /);
  });

  it('returns null when no backup has ever succeeded', () => {
    expect(lastBackupLabel(RemoteData.notAsked(), labels, 'en-US', false)).toBeNull();
    expect(lastBackupLabel(RemoteData.loading(), labels, 'en-US', false)).toBeNull();
    expect(lastBackupLabel(RemoteData.error('boom'), labels, 'en-US', false)).toBeNull();
  });

  it('honors the 24-hour clock preference', () => {
    const label12 = lastBackupLabel(backupAt(Instant.now().minusSeconds(60)), labels, 'en-US', false);
    const label24 = lastBackupLabel(backupAt(Instant.now().minusSeconds(60)), labels, 'en-US', true);
    expect(label12).toMatch(/AM|PM/);
    expect(label24).not.toMatch(/AM|PM/);
  });
});

describe('didLastBackupSucceed', () => {
  it('is true only for a successful backup', () => {
    expect(didLastBackupSucceed(backupAt(Instant.now()))).toBe(true);
    expect(didLastBackupSucceed(RemoteData.notAsked())).toBe(false);
    expect(didLastBackupSucceed(RemoteData.loading())).toBe(false);
    expect(didLastBackupSucceed(RemoteData.error('boom'))).toBe(false);
  });
});

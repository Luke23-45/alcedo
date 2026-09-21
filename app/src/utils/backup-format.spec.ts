import { describe, expect, it } from 'vitest';
import { formatBackupBytes, formatBackupDuration } from '@/utils/backup-format';

describe('formatBackupBytes', () => {
  it('formats bytes below 1 KB as B', () => {
    expect(formatBackupBytes(512)).toBe('512 B');
  });

  it('formats kilobytes with one decimal', () => {
    expect(formatBackupBytes(412_000)).toBe('412.0 KB');
  });

  it('formats megabytes with one decimal', () => {
    expect(formatBackupBytes(412_000_000)).toBe('412.0 MB');
  });

  it('formats gigabytes with one decimal', () => {
    expect(formatBackupBytes(1_400_000_000)).toBe('1.4 GB');
  });
});

describe('formatBackupDuration', () => {
  it('formats milliseconds as seconds with one decimal', () => {
    expect(formatBackupDuration(2100)).toBe('2.1s');
    expect(formatBackupDuration(900)).toBe('0.9s');
  });
});

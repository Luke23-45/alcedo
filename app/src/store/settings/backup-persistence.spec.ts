import { describe, expect, it } from 'vitest';
import { Instant } from '@js-joda/core';
import { preferenceRegistry } from '@/store/settings/registry';
import type { LastExternalImport, LastRemoteBackupTest } from '@/store/settings/registry';

const lastTestedCodec = preferenceRegistry.lastRemoteBackupTest.codec!;
const lastImportedCodec = preferenceRegistry.lastExternalImport.codec!;

function roundTrip<T>(
  codec: { serialize: (v: T) => string | undefined; deserialize: (r: string | undefined) => T },
  value: T,
): T {
  return codec.deserialize(codec.serialize(value));
}

describe('backup persistence codecs', () => {
  it('round-trips a successful last-tested record', () => {
    const record: LastRemoteBackupTest = {
      status: 'success',
      time: Instant.parse('2026-09-21T10:15:30Z'),
      uploadedBytes: 1_482_240,
      gzipBytes: 312_445,
      durationMs: 2100,
    };
    const restored = roundTrip(lastTestedCodec, record);
    expect(restored).toEqual(record);
    expect(restored!.time).toBeInstanceOf(Instant);
    expect(restored!.time.toString()).toBe('2026-09-21T10:15:30Z');
  });

  it('round-trips an error last-tested record with variant and code', () => {
    const record: LastRemoteBackupTest = {
      status: 'error',
      time: Instant.parse('2026-09-21T10:15:30Z'),
      errorVariant: 'httpOther',
      errorCode: 418,
    };
    expect(roundTrip(lastTestedCodec, record)).toEqual(record);
  });

  it('round-trips a last-imported record', () => {
    const record: LastExternalImport = {
      time: Instant.parse('2026-09-20T08:00:00Z'),
      workoutCount: 23,
      format: 'FitNotes',
      setCount: 2140,
    };
    const restored = roundTrip(lastImportedCodec, record);
    expect(restored).toEqual(record);
    expect(restored!.time).toBeInstanceOf(Instant);
  });

  it('falls back to undefined for invalid persisted JSON', () => {
    expect(lastTestedCodec.deserialize('not json{{')).toBeUndefined();
    expect(lastTestedCodec.deserialize('{"status":"bogus","time":"2026-09-21T10:15:30Z"}')).toBeUndefined();
    expect(lastTestedCodec.deserialize('{"status":"success","time":"yesterday-ish"}')).toBeUndefined();
    expect(lastTestedCodec.deserialize('{"status":"success"}')).toBeUndefined();
    expect(lastTestedCodec.deserialize(undefined)).toBeUndefined();
    expect(lastImportedCodec.deserialize('not json{{')).toBeUndefined();
    expect(
      lastImportedCodec.deserialize(
        '{"time":"2026-09-20T08:00:00Z","workoutCount":"many","format":"FitNotes","setCount":1}',
      ),
    ).toBeUndefined();
    expect(
      lastImportedCodec.deserialize('{"time":"2026-09-20T08:00:00Z","workoutCount":1,"format":"Hevy","setCount":1}'),
    ).toBeUndefined();
  });

  it('serializes undefined as undefined (no storage write)', () => {
    expect(lastTestedCodec.serialize(undefined)).toBeUndefined();
    expect(lastImportedCodec.serialize(undefined)).toBeUndefined();
  });
});

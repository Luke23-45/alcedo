import type { RepositoryBundle } from './harness';

const SUB = 'parity-workout-sub';
const CID = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;

const data = (name: string, exercises: unknown[] = []) => ({
  name,
  date: '2026-09-26',
  exercises: exercises as never[],
});

export function workoutContracts(get: () => RepositoryBundle): void {
  describe('WorkoutRepository parity', () => {
    it('creates and finds by client id', async () => {
      const { workouts } = get();
      const created = await workouts.create(SUB, CID(1), data('Push day'), 0);
      expect(created.clientId).toBe(CID(1));
      expect(created.userId).toBe(SUB);
      expect(created.version).toBe(0);
      expect(created.name).toBe('Push day');

      const found = await workouts.findByClientId(SUB, CID(1));
      expect(found!.id).toBe(created.id);
      expect(await workouts.findByClientId(SUB, CID(9))).toBeNull();
      // Another user's client id is invisible.
      expect(await workouts.findByClientId('other-sub', CID(1))).toBeNull();
    });

    it('applies a version-guarded mutation atomically', async () => {
      const { workouts } = get();
      await workouts.create(SUB, CID(1), data('v0'), 0);

      const applied = await workouts.applyIfVersionMatches(SUB, CID(1), 0, data('v1'));
      expect(applied.status).toBe('applied');
      expect(applied.record!.version).toBe(1);
      expect(applied.record!.name).toBe('v1');

      // Stale base version conflicts; the caller re-reads for the truth.
      const stale = await workouts.applyIfVersionMatches(SUB, CID(1), 0, data('v2'));
      expect(stale.status).toBe('conflict');
      expect(stale.record).toBeNull();
      expect((await workouts.findByClientId(SUB, CID(1)))!.version).toBe(1);

      // Missing row conflicts with a null record.
      const missing = await workouts.applyIfVersionMatches(SUB, CID(9), 0, data('x'));
      expect(missing.status).toBe('conflict');
      expect(missing.record).toBeNull();
    });

    it('pages changed-since in (serverUpdatedAt, id) order', async () => {
      const { workouts } = get();
      const a = await workouts.create(SUB, CID(1), data('a'), 0);
      await new Promise((r) => setTimeout(r, 15));
      const b = await workouts.create(SUB, CID(2), data('b'), 0);

      const all = await workouts.findChangedSince(SUB, null, 10);
      expect(all.map((w) => w.clientId)).toEqual([CID(1), CID(2)]);

      const cursor = { t: a.serverUpdatedAt, id: a.id };
      const rest = await workouts.findChangedSince(SUB, cursor, 10);
      expect(rest.map((w) => w.clientId)).toEqual([CID(2)]);
      expect(b.id).toBeDefined();
    });

    it('lists newest first and pages backwards', async () => {
      const { workouts } = get();
      const w1 = await workouts.create(SUB, CID(1), data('one'), 0);
      await new Promise((r) => setTimeout(r, 15));
      const w2 = await workouts.create(SUB, CID(2), data('two'), 0);

      const page = await workouts.list(SUB, { before: null, limit: 1, includeDeleted: false });
      expect(page.map((w) => w.clientId)).toEqual([CID(2)]);

      const older = await workouts.list(SUB, {
        before: { t: w2.serverUpdatedAt, id: w2.id },
        limit: 10,
        includeDeleted: false,
      });
      expect(older.map((w) => w.clientId)).toEqual([CID(1)]);
      expect(w1.id).toBeDefined();
    });

    it('soft-deletes and purges old tombstones', async () => {
      const { workouts } = get();
      await workouts.create(SUB, CID(1), data('gone'), 0);
      const deleted = await workouts.softDelete(SUB, CID(1));
      expect(deleted!.deletedAt).toBeInstanceOf(Date);

      const hidden = await workouts.list(SUB, { before: null, limit: 10, includeDeleted: false });
      expect(hidden).toHaveLength(0);
      const shown = await workouts.list(SUB, { before: null, limit: 10, includeDeleted: true });
      expect(shown).toHaveLength(1);

      // Second delete is a no-op null.
      expect(await workouts.softDelete(SUB, CID(1))).toBeNull();

      // A cutoff before the tombstone purges nothing; a later one purges it.
      expect(await workouts.purgeTombstones(new Date(Date.now() - 60000))).toBe(0);
      expect(await workouts.purgeTombstones(new Date())).toBe(1);
      expect(await workouts.findByClientId(SUB, CID(1))).toBeNull();
    });

    it('updates partially and bumps the version', async () => {
      const { workouts } = get();
      await workouts.create(SUB, CID(1), data('old'), 0);
      const updated = await workouts.update(SUB, CID(1), { name: 'new' });
      expect(updated!.name).toBe('new');
      expect(updated!.version).toBe(1);
      expect(await workouts.update(SUB, CID(9), { name: 'x' })).toBeNull();
    });
  });

  describe('SyncIdempotencyStore parity', () => {
    it('claims once, then reports duplicates', async () => {
      const { idempotency } = get();
      expect(await idempotency.claim('k1', SUB)).toBe(true);
      expect(await idempotency.claim('k1', SUB)).toBe(false);
      expect(await idempotency.find('k1')).toBeNull();

      await idempotency.save('k1', SUB, { status: 'applied', entityId: 'e1', serverVersion: 1 });
      expect(await idempotency.find('k1')).toEqual({
        status: 'applied',
        entityId: 'e1',
        serverVersion: 1,
      });
    });

    it('purges only claims older than the cutoff', async () => {
      const { idempotency } = get();
      await idempotency.claim('old', SUB);
      // Backdate is impossible through the public API; a future cutoff
      // relative to creation still exercises the boundary honestly: only
      // claims created before `cutoff` are removed.
      expect(await idempotency.purgeExpired(new Date(Date.now() - 1000))).toBe(0);
      expect(await idempotency.purgeExpired(new Date(Date.now() + 1000))).toBe(1);
      expect(await idempotency.find('old')).toBeNull();
    });
  });
}

import type { RepositoryBundle } from './harness';

const ALICE = 'parity-alice';
const BOB = 'parity-bob';
const CAROL = 'parity-carol';

export function socialContracts(get: () => RepositoryBundle): void {
  describe('PostRepository parity', () => {
    it('creates and finds posts', async () => {
      const { posts } = get();
      const post = await posts.create(ALICE, { text: 'hello', mediaUrls: ['u1'] });
      expect(post.authorId).toBe(ALICE);
      expect(post.text).toBe('hello');
      expect(post.mediaUrls).toEqual(['u1']);

      const found = await posts.findById(post.id);
      expect(found!.id).toBe(post.id);
      expect(await posts.findById('does-not-exist')).toBeNull();
    });

    it('soft-deletes only for the author', async () => {
      const { posts } = get();
      const post = await posts.create(ALICE, { text: 'mine' });
      expect(await posts.softDelete(BOB, post.id)).toBe(false);
      expect(await posts.softDelete(ALICE, post.id)).toBe(true);
      expect(await posts.softDelete(ALICE, post.id)).toBe(false);
    });

    it('feeds newest first, skips deleted, pages with cursor', async () => {
      const { posts } = get();
      const p1 = await posts.create(ALICE, { text: 'first' });
      await new Promise((r) => setTimeout(r, 15));
      const p2 = await posts.create(BOB, { text: 'second' });
      await new Promise((r) => setTimeout(r, 15));
      const p3 = await posts.create(ALICE, { text: 'third' });
      await posts.softDelete(BOB, p2.id);

      expect(await posts.findFeed([], null, 10)).toEqual([]);

      const page1 = await posts.findFeed([ALICE, BOB], null, 2);
      expect(page1.map((p) => p.id)).toEqual([p3.id, p1.id]);

      const page2 = await posts.findFeed(
        [ALICE, BOB],
        { t: p1.createdAt, id: p1.id },
        10,
      );
      expect(page2).toEqual([]);
      expect(p2.id).toBeDefined();
    });
  });

  describe('FollowRepository parity', () => {
    it('follows idempotently and unfollows idempotently', async () => {
      const { follows } = get();
      await follows.follow(ALICE, BOB);
      await follows.follow(ALICE, BOB); // no-op, not an error
      expect(await follows.isFollowing(ALICE, BOB)).toBe(true);
      expect(await follows.isFollowing(BOB, ALICE)).toBe(false);
      expect(await follows.followingIds(ALICE)).toEqual([BOB]);

      await follows.unfollow(ALICE, BOB);
      await follows.unfollow(ALICE, BOB); // no-op
      expect(await follows.isFollowing(ALICE, BOB)).toBe(false);
    });

    it('lists followers and following newest first with cursors', async () => {
      const { follows } = get();
      await follows.follow(ALICE, CAROL);
      await new Promise((r) => setTimeout(r, 15));
      await follows.follow(BOB, CAROL);

      const followers = await follows.listFollowers(CAROL, null, 10);
      expect(followers.map((f) => f.followerId)).toEqual([BOB, ALICE]);

      const first = followers[0];
      const rest = await follows.listFollowers(
        CAROL,
        { t: first.createdAt, id: first.id },
        10,
      );
      expect(rest.map((f) => f.followerId)).toEqual([ALICE]);

      const following = await follows.listFollowing(ALICE, null, 10);
      expect(following.map((f) => f.followeeId)).toEqual([CAROL]);
    });
  });
}

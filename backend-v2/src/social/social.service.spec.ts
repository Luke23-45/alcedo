import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SocialService } from './social.service';
import {
  FollowCursor,
  FollowRecord,
  FollowRepository,
} from './repositories/follow-repository.interface';
import {
  CreatePostData,
  PostCursor,
  PostRecord,
  PostRepository,
} from './repositories/post-repository.interface';

const A = 'google-sub-a';
const B = 'google-sub-b';
const C = 'google-sub-c';

let tick = 0;
let hexSeq = 0;
/** 24-hex ids: valid ObjectIds, lexicographic order == creation order. */
function nextHexId(): string {
  hexSeq += 1;
  return String(hexSeq).padStart(24, '0');
}

class FakeFollowRepo extends FollowRepository {
  readonly records = new Map<string, FollowRecord>();

  private key(followerId: string, followeeId: string): string {
    return `${followerId}:${followeeId}`;
  }

  async follow(followerId: string, followeeId: string): Promise<void> {
    const key = this.key(followerId, followeeId);
    if (!this.records.has(key)) {
      this.records.set(key, {
        createdAt: new Date(Date.now() + tick++),
        followeeId,
        followerId,
        id: nextHexId(),
      });
    }
  }

  async unfollow(followerId: string, followeeId: string): Promise<void> {
    this.records.delete(this.key(followerId, followeeId));
  }

  async isFollowing(followerId: string, followeeId: string): Promise<boolean> {
    return this.records.has(this.key(followerId, followeeId));
  }

  async followingIds(followerId: string): Promise<string[]> {
    return [...this.records.values()]
      .filter((r) => r.followerId === followerId)
      .map((r) => r.followeeId);
  }

  private listed(filter: (r: FollowRecord) => boolean, after: FollowCursor | null): FollowRecord[] {
    let rows = [...this.records.values()].filter(filter);
    if (after) {
      rows = rows.filter(
        (r) => r.createdAt < after.t || (+r.createdAt === +after.t && r.id < after.id),
      );
    }
    rows.sort((a, b) => +b.createdAt - +a.createdAt || b.id.localeCompare(a.id));
    return rows;
  }

  async listFollowers(
    followeeId: string,
    after: FollowCursor | null,
    limit: number,
  ): Promise<FollowRecord[]> {
    return this.listed((r) => r.followeeId === followeeId, after).slice(0, limit);
  }

  async listFollowing(
    followerId: string,
    after: FollowCursor | null,
    limit: number,
  ): Promise<FollowRecord[]> {
    return this.listed((r) => r.followerId === followerId, after).slice(0, limit);
  }
}

class FakePostRepo extends PostRepository {
  readonly posts = new Map<string, PostRecord>();

  async create(authorId: string, data: CreatePostData): Promise<PostRecord> {
    const record: PostRecord = {
      authorId,
      createdAt: new Date(Date.now() + tick++),
      id: nextHexId(),
      mediaUrls: data.mediaUrls ?? [],
      text: data.text,
    };
    this.posts.set(record.id, record);
    return record;
  }

  async findById(id: string): Promise<PostRecord | null> {
    return this.posts.get(id) ?? null;
  }

  async softDelete(authorId: string, id: string): Promise<boolean> {
    const post = this.posts.get(id);
    if (!post || post.authorId !== authorId || post.deletedAt) return false;
    this.posts.set(id, { ...post, deletedAt: new Date() });
    return true;
  }

  async findFeed(
    authorIds: string[],
    before: PostCursor | null,
    limit: number,
  ): Promise<PostRecord[]> {
    let rows = [...this.posts.values()].filter(
      (p) => authorIds.includes(p.authorId) && !p.deletedAt,
    );
    if (before) {
      rows = rows.filter(
        (p) => p.createdAt < before.t || (+p.createdAt === +before.t && p.id < before.id),
      );
    }
    rows.sort((a, b) => +b.createdAt - +a.createdAt || b.id.localeCompare(a.id));
    return rows.slice(0, limit);
  }
}

/** Minimal UsersService stand-in: only the methods SocialService touches. */
function fakeUsers(known: Set<string>, withExists = false): UsersService {
  const svc = {
    findByGoogleSub: async (sub: string) => (known.has(sub) ? { googleSub: sub } : null),
  } as unknown as Record<string, unknown>;
  if (withExists) {
    svc.exists = async (sub: string) => known.has(sub);
  }
  return svc as unknown as UsersService;
}

describe('SocialService', () => {
  let service: SocialService;
  let follows: FakeFollowRepo;
  let posts: FakePostRepo;
  let known: Set<string>;

  beforeEach(() => {
    tick = 0;
    hexSeq = 0;
    follows = new FakeFollowRepo();
    posts = new FakePostRepo();
    known = new Set([A, B, C]);
    service = new SocialService(follows, posts, fakeUsers(known));
  });

  it('rejects self-follow with SOCIAL_SELF_FOLLOW', async () => {
    const error = await service.follow(A, A).catch((e) => e);
    expect(error).toBeInstanceOf(BadRequestException);
    expect(error.getResponse()).toMatchObject({ code: 'SOCIAL_SELF_FOLLOW' });
  });

  it('rejects follow of an unknown user with SOCIAL_USER_NOT_FOUND', async () => {
    const error = await service.follow(A, 'ghost-sub').catch((e) => e);
    expect(error).toBeInstanceOf(NotFoundException);
    expect(error.getResponse()).toMatchObject({ code: 'SOCIAL_USER_NOT_FOUND' });
    expect(await follows.isFollowing(A, 'ghost-sub')).toBe(false);
  });

  it('uses usersService.exists when the users worker adds it', async () => {
    const withExists = new SocialService(follows, posts, fakeUsers(known, true));
    expect(await withExists.follow(A, B)).toEqual({ following: true });
    const error = await withExists.follow(A, 'ghost-sub').catch((e) => e);
    expect(error).toBeInstanceOf(NotFoundException);
    expect(error.getResponse()).toMatchObject({ code: 'SOCIAL_USER_NOT_FOUND' });
  });

  it('follow is idempotent', async () => {
    expect(await service.follow(A, B)).toEqual({ following: true });
    expect(await service.follow(A, B)).toEqual({ following: true });
    expect(await follows.isFollowing(A, B)).toBe(true);
    const following = await service.following(A, undefined, 50);
    expect(following.items).toHaveLength(1);
    expect(following.items[0].userId).toBe(B);
  });

  it('unfollow is idempotent', async () => {
    expect(await service.unfollow(A, B)).toEqual({ following: false });
    await service.follow(A, B);
    expect(await service.unfollow(A, B)).toEqual({ following: false });
    expect(await follows.isFollowing(A, B)).toBe(false);
    expect(await service.unfollow(A, B)).toEqual({ following: false });
  });

  it('lists followers and following', async () => {
    await service.follow(A, B);
    await service.follow(C, B);
    const followers = await service.followers(B, undefined, 50);
    expect(followers.items.map((i) => i.userId).sort()).toEqual([A, C].sort());
    const following = await service.following(A, undefined, 50);
    expect(following.items.map((i) => i.userId)).toEqual([B]);
  });

  it('paginates followers with a cursor', async () => {
    await service.follow(A, C);
    await service.follow(B, C);
    const page1 = await service.followers(C, undefined, 1);
    expect(page1.items).toHaveLength(1);
    expect(page1.hasMore).toBe(true);
    const page2 = await service.followers(C, page1.cursor ?? undefined, 1);
    expect(page2.items).toHaveLength(1);
    expect(page2.hasMore).toBe(false);
    expect(page2.items[0].userId).not.toBe(page1.items[0].userId);
  });

  it('feed includes only followees’ posts, newest first', async () => {
    await service.follow(A, B);
    const p1 = await service.createPost(B, { text: 'First' });
    const p2 = await service.createPost(B, { text: 'Second' });
    await service.createPost(C, { text: 'Stranger post' });

    const feed = await service.feed(A, undefined, 20);
    expect(feed.items.map((i) => i.id)).toEqual([p2.id, p1.id]);
    expect(feed.hasMore).toBe(false);
    expect(feed.serverTime).toBeTruthy();
  });

  it('feed is empty when following nobody', async () => {
    await service.createPost(B, { text: 'Hello' });
    const feed = await service.feed(A, undefined, 20);
    expect(feed.items).toHaveLength(0);
  });

  it('feed excludes deleted posts', async () => {
    await service.follow(A, B);
    const post = await service.createPost(B, { text: 'Gone soon' });
    await service.deletePost(B, post.id);

    const feed = await service.feed(A, undefined, 20);
    expect(feed.items).toHaveLength(0);
  });

  it('feed paginates with a cursor', async () => {
    await service.follow(A, B);
    await service.createPost(B, { text: 'One' });
    await service.createPost(B, { text: 'Two' });
    await service.createPost(B, { text: 'Three' });

    const page1 = await service.feed(A, undefined, 2);
    expect(page1.items).toHaveLength(2);
    expect(page1.hasMore).toBe(true);
    expect(page1.cursor).toBeTruthy();

    const page2 = await service.feed(A, page1.cursor ?? undefined, 2);
    expect(page2.items).toHaveLength(1);
    expect(page2.items[0].text).toBe('One');
    expect(page2.hasMore).toBe(false);
  });

  it('rejects an invalid feed cursor with SOCIAL_BAD_CURSOR', async () => {
    const error = await service.feed(A, 'garbage', 10).catch((e) => e);
    expect(error).toBeInstanceOf(BadRequestException);
    expect(error.getResponse()).toMatchObject({ code: 'SOCIAL_BAD_CURSOR' });
  });

  it('delete is author-only: others get 404 and the post survives', async () => {
    const post = await service.createPost(B, { text: 'Mine' });

    const error = await service.deletePost(A, post.id).catch((e) => e);
    expect(error).toBeInstanceOf(NotFoundException);
    expect(error.getResponse()).toMatchObject({ code: 'SOCIAL_POST_NOT_FOUND' });
    expect(await posts.findById(post.id)).toMatchObject({ authorId: B });
    expect((await posts.findById(post.id))?.deletedAt).toBeFalsy();

    expect(await service.deletePost(B, post.id)).toEqual({ deleted: true });
    expect(await posts.findById(post.id)).toMatchObject({ deletedAt: expect.any(Date) });

    // Deleting twice is a 404, not a second delete.
    const again = await service.deletePost(B, post.id).catch((e) => e);
    expect(again).toBeInstanceOf(NotFoundException);
  });

  it('rejects a malformed post id with SOCIAL_BAD_POST_ID', async () => {
    const error = await service.deletePost(A, 'not-an-id').catch((e) => e);
    expect(error).toBeInstanceOf(BadRequestException);
    expect(error.getResponse()).toMatchObject({ code: 'SOCIAL_BAD_POST_ID' });
  });

  it('createPost stores text and media urls', async () => {
    const post = await service.createPost(A, {
      mediaUrls: ['https://example.com/a.jpg'],
      text: 'Hello feed',
    });
    expect(post).toMatchObject({
      authorId: A,
      mediaUrls: ['https://example.com/a.jpg'],
      text: 'Hello feed',
    });
    expect(post.id).toBeTruthy();
    expect(post.createdAt).toBeTruthy();
  });
});

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { decodeCursor, encodeCursor } from '../common/pagination/cursor-pagination';
import { UsersService } from '../users/users.service';
import { CreatePostDto } from './dto/create-post.dto';
import {
  FollowRecord,
  FollowRepository,
} from './repositories/follow-repository.interface';
import {
  PostRecord,
  PostRepository,
} from './repositories/post-repository.interface';

export interface PostView {
  id: string;
  authorId: string;
  text: string;
  mediaUrls: string[];
  createdAt: string;
}

export interface FollowEdgeView {
  userId: string;
  followedAt: string;
}

export interface Page<T> {
  items: T[];
  cursor: string | null;
  hasMore: boolean;
}

const FEED_DEFAULT_LIMIT = 20;
const FEED_MAX_LIMIT = 50;
const FOLLOW_DEFAULT_LIMIT = 50;
const FOLLOW_MAX_LIMIT = 200;

function toPostView(r: PostRecord): PostView {
  return {
    authorId: r.authorId,
    createdAt: r.createdAt.toISOString(),
    id: r.id,
    mediaUrls: r.mediaUrls,
    text: r.text,
  };
}

function toEdgeView(r: FollowRecord, userId: string): FollowEdgeView {
  return { followedAt: r.createdAt.toISOString(), userId };
}

/** Wraps the shared cursor codec with ObjectId-tiebreaker validation. */
function decodePageCursor(
  cursor: string | undefined,
): { t: Date; id: string } | null {
  if (!cursor) return null;
  try {
    const { timestamp, tiebreakerId } = decodeCursor(cursor);
    if (Number.isNaN(timestamp.getTime()) || !Types.ObjectId.isValid(tiebreakerId)) {
      throw new Error('bad cursor');
    }
    return { id: tiebreakerId, t: timestamp };
  } catch {
    throw new BadRequestException({ code: 'SOCIAL_BAD_CURSOR', message: 'Invalid cursor.' });
  }
}

function clampLimit(limit: number | undefined, def: number, max: number): number {
  return Math.min(Math.max(limit ?? def, 1), max);
}

function pageOf<T, R>(
  records: R[],
  limit: number,
  inputCursor: string | undefined,
  map: (r: R) => T,
  cursorOf: (r: R) => { t: Date; id: string },
): Page<T> {
  // Callers fetch `limit + 1` rows so hasMore is exact even when the last
  // page is exactly full; the extra row is never exposed.
  const hasMore = records.length > limit;
  const page = hasMore ? records.slice(0, limit) : records;
  const last = page[page.length - 1];
  const next = last ? cursorOf(last) : null;
  return {
    cursor: next ? encodeCursor(next.t.toISOString(), next.id) : (inputCursor ?? null),
    hasMore,
    items: page.map(map),
  };
}

@Injectable()
export class SocialService {
  constructor(
    private readonly follows: FollowRepository,
    private readonly posts: PostRepository,
    private readonly users: UsersService,
  ) {}

  /** Idempotent follow: already-following is a 200, not an error. */
  async follow(followerId: string, targetId: string): Promise<{ following: boolean }> {
    if (followerId === targetId) {
      throw new BadRequestException({
        code: 'SOCIAL_SELF_FOLLOW',
        message: 'You cannot follow yourself.',
      });
    }
    if (!(await this.userExists(targetId))) {
      throw new NotFoundException({ code: 'SOCIAL_USER_NOT_FOUND', message: 'User not found.' });
    }
    await this.follows.follow(followerId, targetId);
    return { following: true };
  }

  /** Idempotent unfollow: not-following is a no-op. */
  async unfollow(followerId: string, targetId: string): Promise<{ following: boolean }> {
    assertUserId(targetId);
    await this.follows.unfollow(followerId, targetId);
    return { following: false };
  }

  async followers(
    userId: string,
    cursor: string | undefined,
    limit: number | undefined,
  ): Promise<Page<FollowEdgeView>> {
    const after = decodePageCursor(cursor);
    const safeLimit = clampLimit(limit, FOLLOW_DEFAULT_LIMIT, FOLLOW_MAX_LIMIT);
    const records = await this.follows.listFollowers(userId, after, safeLimit + 1);
    return pageOf(records, safeLimit, cursor, (r) => toEdgeView(r, r.followerId), (r) => ({
      id: r.id,
      t: r.createdAt,
    }));
  }

  async following(
    userId: string,
    cursor: string | undefined,
    limit: number | undefined,
  ): Promise<Page<FollowEdgeView>> {
    const after = decodePageCursor(cursor);
    const safeLimit = clampLimit(limit, FOLLOW_DEFAULT_LIMIT, FOLLOW_MAX_LIMIT);
    const records = await this.follows.listFollowing(userId, after, safeLimit + 1);
    return pageOf(records, safeLimit, cursor, (r) => toEdgeView(r, r.followeeId), (r) => ({
      id: r.id,
      t: r.createdAt,
    }));
  }

  async createPost(authorId: string, dto: CreatePostDto): Promise<PostView> {
    const record = await this.posts.create(authorId, {
      mediaUrls: dto.mediaUrls ?? [],
      text: dto.text.trim(),
    });
    return toPostView(record);
  }

  /**
   * Posts from followed users, newest first. Only live posts — deleted ones
   * never appear, and unfollowing someone drops their posts immediately.
   */
  async feed(
    userId: string,
    cursor: string | undefined,
    limit: number | undefined,
  ): Promise<Page<PostView> & { serverTime: string }> {
    const before = decodePageCursor(cursor);
    const safeLimit = clampLimit(limit, FEED_DEFAULT_LIMIT, FEED_MAX_LIMIT);
    const followeeIds = await this.follows.followingIds(userId);
    const records =
      followeeIds.length === 0 ? [] : await this.posts.findFeed(followeeIds, before, safeLimit + 1);
    return {
      ...pageOf(records, safeLimit, cursor, toPostView, (r) => ({ id: r.id, t: r.createdAt })),
      serverTime: new Date().toISOString(),
    };
  }

  /** Author-only soft delete; anyone else gets a 404 (never a leak). */
  async deletePost(userId: string, postId: string): Promise<{ deleted: boolean }> {
    if (!Types.ObjectId.isValid(postId)) {
      throw new BadRequestException({ code: 'SOCIAL_BAD_POST_ID', message: 'Invalid post id.' });
    }
    const deleted = await this.posts.softDelete(userId, postId);
    if (!deleted) {
      throw new NotFoundException({ code: 'SOCIAL_POST_NOT_FOUND', message: 'Post not found.' });
    }
    return { deleted: true };
  }

  /**
   * The users worker may add an `exists()` helper to UsersService; use it
   * when present, otherwise fall back to the always-available findByGoogleSub.
   */
  private async userExists(googleSub: string): Promise<boolean> {
    assertUserId(googleSub);
    const svc = this.users as unknown as { exists?: (sub: string) => Promise<boolean> };
    if (typeof svc.exists === 'function') return svc.exists.call(this.users, googleSub);
    return (await this.users.findByGoogleSub(googleSub)) !== null;
  }
}

function assertUserId(userId: string): void {
  if (typeof userId !== 'string' || userId.trim().length === 0 || userId.length > 256) {
    throw new BadRequestException({ code: 'SOCIAL_BAD_USER_ID', message: 'Invalid user id.' });
  }
}

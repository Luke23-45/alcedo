/** Opaque page position: last row's sort keys (timestamp + provider row id). */
export interface FollowCursor {
  t: Date;
  id: string;
}

export interface FollowRecord {
  id: string;
  followerId: string;
  followeeId: string;
  createdAt: Date;
}

export abstract class FollowRepository {
  /** Idempotent: following twice is a no-op, not an error. */
  abstract follow(followerId: string, followeeId: string): Promise<void>;
  /** Idempotent: unfollowing a non-edge is a no-op. */
  abstract unfollow(followerId: string, followeeId: string): Promise<void>;
  abstract isFollowing(followerId: string, followeeId: string): Promise<boolean>;
  abstract followingIds(followerId: string): Promise<string[]>;
  /** Edges where `followeeId` is followed, newest first. */
  abstract listFollowers(
    followeeId: string,
    after: FollowCursor | null,
    limit: number,
  ): Promise<FollowRecord[]>;
  /** Edges where `followerId` follows, newest first. */
  abstract listFollowing(
    followerId: string,
    after: FollowCursor | null,
    limit: number,
  ): Promise<FollowRecord[]>;
}

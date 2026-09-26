/** Opaque page position: last row's sort keys (timestamp + provider row id). */
export interface PostCursor {
  t: Date;
  id: string;
}

export interface PostRecord {
  id: string;
  authorId: string;
  text: string;
  mediaUrls: string[];
  createdAt: Date;
  deletedAt?: Date;
}

export interface CreatePostData {
  text: string;
  mediaUrls?: string[];
}

export abstract class PostRepository {
  abstract create(authorId: string, data: CreatePostData): Promise<PostRecord>;
  abstract findById(id: string): Promise<PostRecord | null>;
  /**
   * Soft-deletes the post, but only if `authorId` is the author.
   * Returns false when the post is missing, deleted, or owned by someone else.
   */
  abstract softDelete(authorId: string, id: string): Promise<boolean>;
  /** Live posts from the given authors, newest first. */
  abstract findFeed(
    authorIds: string[],
    before: PostCursor | null,
    limit: number,
  ): Promise<PostRecord[]>;
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Post, PostDocument } from '../schemas/post.schema';
import {
  CreatePostData,
  PostCursor,
  PostRecord,
  PostRepository,
} from './post-repository.interface';

function toRecord(doc: PostDocument): PostRecord {
  return {
    authorId: doc.authorId,
    createdAt: doc.createdAt,
    deletedAt: doc.deletedAt ?? undefined,
    id: doc._id.toHexString(),
    mediaUrls: doc.mediaUrls ?? [],
    text: doc.text,
  };
}

function feedFilter(
  authorIds: string[],
  before: PostCursor | null,
): FilterQuery<PostDocument> {
  const filter: FilterQuery<PostDocument> = {
    authorId: { $in: authorIds },
    deletedAt: null,
  };
  if (before) {
    filter.$or = [
      { createdAt: { $lt: before.t } },
      { createdAt: before.t, _id: { $lt: new Types.ObjectId(before.id) } },
    ];
  }
  return filter;
}

@Injectable()
export class MongoPostRepository extends PostRepository {
  constructor(@InjectModel(Post.name) private readonly model: Model<PostDocument>) {
    super();
  }

  async create(authorId: string, data: CreatePostData): Promise<PostRecord> {
    const doc = await this.model.create({
      authorId,
      mediaUrls: data.mediaUrls ?? [],
      text: data.text,
    });
    return toRecord(doc);
  }

  async findById(id: string): Promise<PostRecord | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await this.model.findById(id).exec();
    return doc ? toRecord(doc) : null;
  }

  async softDelete(authorId: string, id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;
    // Author-scoped: another user's post is invisible to this query, so the
    // caller can 404 without leaking whether the post exists.
    const updated = await this.model
      .findOneAndUpdate(
        { _id: id, authorId, deletedAt: null },
        { $set: { deletedAt: new Date() } },
        { new: true },
      )
      .exec();
    return updated !== null;
  }

  async findFeed(
    authorIds: string[],
    before: PostCursor | null,
    limit: number,
  ): Promise<PostRecord[]> {
    if (authorIds.length === 0) return [];
    const docs = await this.model
      .find(feedFilter(authorIds, before))
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit)
      .exec();
    return docs.map(toRecord);
  }
}

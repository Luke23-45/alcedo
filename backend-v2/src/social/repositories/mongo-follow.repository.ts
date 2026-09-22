import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Follow, FollowDocument } from '../schemas/follow.schema';
import {
  FollowCursor,
  FollowRecord,
  FollowRepository,
} from './follow-repository.interface';

function toRecord(doc: FollowDocument): FollowRecord {
  return {
    createdAt: doc.createdAt,
    followeeId: doc.followeeId,
    followerId: doc.followerId,
    id: doc._id.toHexString(),
  };
}

function pageFilter(
  party: { followerId?: string; followeeId?: string },
  after: FollowCursor | null,
): FilterQuery<FollowDocument> {
  const filter: FilterQuery<FollowDocument> = { ...party };
  if (after) {
    filter.$or = [
      { createdAt: { $lt: after.t } },
      { createdAt: after.t, _id: { $lt: new Types.ObjectId(after.id) } },
    ];
  }
  return filter;
}

@Injectable()
export class MongoFollowRepository extends FollowRepository {
  constructor(@InjectModel(Follow.name) private readonly model: Model<FollowDocument>) {
    super();
  }

  async follow(followerId: string, followeeId: string): Promise<void> {
    // The unique compound index makes this atomic and idempotent.
    await this.model
      .updateOne(
        { followerId, followeeId },
        { $setOnInsert: { followerId, followeeId } },
        { upsert: true },
      )
      .exec();
  }

  async unfollow(followerId: string, followeeId: string): Promise<void> {
    await this.model.deleteOne({ followerId, followeeId }).exec();
  }

  async isFollowing(followerId: string, followeeId: string): Promise<boolean> {
    return (await this.model.exists({ followerId, followeeId })) !== null;
  }

  async followingIds(followerId: string): Promise<string[]> {
    const docs = await this.model.find({ followerId }).select('followeeId').lean().exec();
    return docs.map((d) => d.followeeId);
  }

  async listFollowers(
    followeeId: string,
    after: FollowCursor | null,
    limit: number,
  ): Promise<FollowRecord[]> {
    const docs = await this.model
      .find(pageFilter({ followeeId }, after))
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit)
      .exec();
    return docs.map(toRecord);
  }

  async listFollowing(
    followerId: string,
    after: FollowCursor | null,
    limit: number,
  ): Promise<FollowRecord[]> {
    const docs = await this.model
      .find(pageFilter({ followerId }, after))
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit)
      .exec();
    return docs.map(toRecord);
  }
}

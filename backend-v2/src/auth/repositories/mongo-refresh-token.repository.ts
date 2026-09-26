import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RefreshToken, RefreshTokenDocument } from '../schemas/refresh-token.schema';
import {
  CreateRefreshTokenInput,
  RefreshTokenRecord,
  RefreshTokenRepository,
} from './refresh-token-repository.interface';

function toRecord(doc: RefreshTokenDocument): RefreshTokenRecord {
  return {
    createdAt: doc.createdAt,
    expiresAt: doc.expiresAt,
    familyId: doc.tokenFamilyId,
    googleSub: doc.googleSub,
    replacedByHash: doc.replacedByHash,
    revokedAt: doc.revokedAt,
    tokenHash: doc.tokenHash,
  };
}

@Injectable()
export class MongoRefreshTokenRepository extends RefreshTokenRepository {
  constructor(
    @InjectModel(RefreshToken.name) private readonly model: Model<RefreshTokenDocument>,
  ) {
    super();
  }

  async findByHash(tokenHash: string): Promise<RefreshTokenRecord | null> {
    const doc = await this.model.findOne({ tokenHash }).exec();
    return doc ? toRecord(doc) : null;
  }

  async create(input: CreateRefreshTokenInput): Promise<void> {
    await this.model.create({
      expiresAt: input.expiresAt,
      googleSub: input.googleSub,
      tokenFamilyId: input.familyId,
      tokenHash: input.tokenHash,
    });
  }

  async claimRotation(
    tokenHash: string,
    now: Date,
    replacementHash: string,
  ): Promise<boolean> {
    const claimed = await this.model
      .findOneAndUpdate(
        { expiresAt: { $gt: now }, revokedAt: { $exists: false }, tokenHash },
        { $set: { replacedByHash: replacementHash, revokedAt: now } },
        { new: true },
      )
      .exec();
    return claimed !== null;
  }

  async revokeByHash(tokenHash: string, now: Date): Promise<void> {
    await this.model
      .updateOne(
        { revokedAt: { $exists: false }, tokenHash },
        { $set: { revokedAt: now } },
      )
      .exec();
  }

  async revokeFamily(familyId: string, now: Date): Promise<void> {
    await this.model
      .updateMany(
        { revokedAt: { $exists: false }, tokenFamilyId: familyId },
        { $set: { revokedAt: now } },
      )
      .exec();
  }

  async revokeAllForUser(googleSub: string, now: Date): Promise<void> {
    await this.model
      .updateMany(
        { googleSub, revokedAt: { $exists: false } },
        { $set: { revokedAt: now } },
      )
      .exec();
  }

  async purgeExpired(now: Date): Promise<number> {
    const res = await this.model.deleteMany({ expiresAt: { $lt: now } }).exec();
    return res.deletedCount ?? 0;
  }
}

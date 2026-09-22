import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateUserInput,
  UpdateEntitlementInput,
  UpdateProfileInput,
  UserRecord,
  UserRepository,
} from './user-repository.interface';
import { User, UserDocument } from '../schemas/user.schema';

function toRecord(doc: UserDocument): UserRecord {
  return {
    createdAt: doc.createdAt,
    email: doc.email,
    googleSub: doc.googleSub,
    id: doc._id.toString(),
    isAdmin: doc.isAdmin ?? false,
    name: doc.name,
    picture: doc.picture,
    premium: {
      expiresAt: doc.premium?.expiresAt ?? null,
      source: doc.premium?.source,
      status: doc.premium?.status ?? 'none',
      updatedAt: doc.premium?.updatedAt ?? new Date(),
    },
    units: doc.units,
    updatedAt: doc.updatedAt,
  };
}

@Injectable()
export class MongoUserRepository extends UserRepository {
  constructor(@InjectModel(User.name) private readonly model: Model<UserDocument>) {
    super();
  }

  async findByGoogleSub(googleSub: string): Promise<UserRecord | null> {
    const doc = await this.model.findOne({ googleSub }).exec();
    return doc ? toRecord(doc) : null;
  }

  async create(input: CreateUserInput): Promise<UserRecord> {
    const doc = await this.model.create({
      email: input.email,
      googleSub: input.googleSub,
      name: input.name,
      picture: input.picture,
    });
    return toRecord(doc);
  }

  async updateProfile(googleSub: string, patch: UpdateProfileInput): Promise<UserRecord | null> {
    const doc = await this.model
      .findOneAndUpdate({ googleSub }, { $set: patch }, { new: true })
      .exec();
    return doc ? toRecord(doc) : null;
  }

  async updateEntitlement(
    googleSub: string,
    entitlement: UpdateEntitlementInput,
  ): Promise<UserRecord | null> {
    const doc = await this.model
      .findOneAndUpdate(
        { googleSub },
        {
          $set: {
            premium: {
              expiresAt: entitlement.expiresAt ?? null,
              source: entitlement.source,
              status: entitlement.status,
              updatedAt: new Date(),
            },
          },
        },
        { new: true, upsert: false },
      )
      .exec();
    return doc ? toRecord(doc) : null;
  }

  async setAdmin(googleSub: string, isAdmin: boolean): Promise<UserRecord | null> {
    const doc = await this.model
      .findOneAndUpdate({ googleSub }, { $set: { isAdmin } }, { new: true, upsert: false })
      .exec();
    return doc ? toRecord(doc) : null;
  }
}

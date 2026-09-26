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
import { PremiumSource, User, UserDocument } from '../schemas/user.schema';

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
    stripeCustomerId: doc.stripeCustomerId,
    stripeSubscriptionId: doc.stripeSubscriptionId,
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

  async findByStripeCustomerId(customerId: string): Promise<UserRecord | null> {
    const doc = await this.model.findOne({ stripeCustomerId: customerId }).exec();
    return doc ? toRecord(doc) : null;
  }

  async linkStripeCustomer(
    googleSub: string,
    ids: { customerId?: string | null; subscriptionId?: string | null },
  ): Promise<UserRecord | null> {
    const set: Record<string, string> = {};
    if (ids.customerId) set['stripeCustomerId'] = ids.customerId;
    if (ids.subscriptionId) set['stripeSubscriptionId'] = ids.subscriptionId;
    if (Object.keys(set).length === 0) return this.findByGoogleSub(googleSub);
    const doc = await this.model
      .findOneAndUpdate({ googleSub }, { $set: set }, { new: true, upsert: false })
      .exec();
    return doc ? toRecord(doc) : null;
  }

  async isAdmin(googleSub: string): Promise<boolean> {
    const found = await this.model.exists({ googleSub, isAdmin: true }).exec();
    return found !== null;
  }

  async listRecent(limit: number, offset = 0): Promise<UserRecord[]> {
    const docs = await this.model
      .find()
      .sort({ createdAt: -1 })
      .skip(Math.max(0, Math.floor(offset)))
      .limit(Math.max(0, Math.floor(limit)))
      .exec();
    return docs.map(toRecord);
  }

  async count(): Promise<number> {
    return this.model.countDocuments().exec();
  }

  async countAdmins(): Promise<number> {
    return this.model.countDocuments({ isAdmin: true }).exec();
  }

  async grantEntitlement(
    googleSub: string,
    source: PremiumSource,
    expiresAt: Date | null,
  ): Promise<UserRecord> {
    const doc = await this.model
      .findOneAndUpdate(
        { googleSub },
        {
          $set: {
            premium: { expiresAt, source, status: 'active', updatedAt: new Date() },
          },
        },
        { new: true, setDefaultsOnInsert: true, upsert: true },
      )
      .exec();
    return toRecord(doc);
  }

  async expireEntitlement(
    googleSub: string,
    source: PremiumSource,
  ): Promise<UserRecord | null> {
    const doc = await this.model
      .findOneAndUpdate(
        { googleSub, 'premium.source': source, 'premium.status': 'active' },
        { $set: { 'premium.status': 'expired', 'premium.updatedAt': new Date() } },
        { new: true },
      )
      .exec();
    return doc ? toRecord(doc) : null;
  }
}

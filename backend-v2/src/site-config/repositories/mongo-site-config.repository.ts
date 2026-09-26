import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SiteConfig, SiteConfigDocument } from '../site-config.schema';
import {
  SiteConfigRecord,
  SiteConfigRepository,
} from './site-config-repository.interface';

function toRecord(doc: SiteConfigDocument): SiteConfigRecord {
  return {
    key: doc.key,
    secret: doc.secret,
    updatedAt: doc.updatedAt,
    value: doc.value,
  };
}

@Injectable()
export class MongoSiteConfigRepository extends SiteConfigRepository {
  constructor(
    @InjectModel(SiteConfig.name) private readonly model: Model<SiteConfigDocument>,
  ) {
    super();
  }

  async findByKey(key: string): Promise<SiteConfigRecord | null> {
    const doc = await this.model.findOne({ key }).exec();
    return doc ? toRecord(doc) : null;
  }

  async upsert(key: string, value: string, secret: boolean): Promise<void> {
    await this.model
      .findOneAndUpdate({ key }, { $set: { secret, value } }, { new: true, upsert: true })
      .exec();
  }

  async findAll(): Promise<SiteConfigRecord[]> {
    const docs = await this.model.find().exec();
    return docs.map(toRecord);
  }
}

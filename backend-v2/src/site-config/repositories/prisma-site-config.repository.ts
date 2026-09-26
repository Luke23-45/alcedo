import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import {
  SiteConfigRecord,
  SiteConfigRepository,
} from './site-config-repository.interface';

type SiteConfigRow = Prisma.SiteConfigGetPayload<object>;

function toRecord(row: SiteConfigRow): SiteConfigRecord {
  return {
    key: row.key,
    secret: row.secret,
    updatedAt: row.updatedAt,
    value: row.value,
  };
}

@Injectable()
export class PrismaSiteConfigRepository extends SiteConfigRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findByKey(key: string): Promise<SiteConfigRecord | null> {
    const row = await this.prisma.siteConfig.findUnique({ where: { key } });
    return row ? toRecord(row) : null;
  }

  async upsert(key: string, value: string, secret: boolean): Promise<void> {
    await this.prisma.siteConfig.upsert({
      create: { key, secret, value },
      update: { secret, value },
      where: { key },
    });
  }

  async findAll(): Promise<SiteConfigRecord[]> {
    const rows = await this.prisma.siteConfig.findMany();
    return rows.map(toRecord);
  }
}

import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

/**
 * Prisma client for the PostgreSQL backend.
 *
 * Always provided (so the DI graph is identical under both providers), but it
 * only connects — and is only ever injected into a live repository — when
 * `DB_PROVIDER=postgres`. Under `DB_PROVIDER=mongodb` the pool points at a
 * non-routable address and never connects (pg pools connect lazily), so
 * instantiating it is harmless; any accidental query would fail loudly with
 * a connection error rather than touching the wrong database.
 *
 * Prisma 7 connects through a driver adapter rather than a `datasources`
 * URL override; the connection string here is the single source of truth.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly isPostgres: boolean;

  constructor(private readonly config: ConfigService) {
    const provider = config.get<string>('DB_PROVIDER', 'mongodb');
    const isPostgres = provider === 'postgres';
    const pool = new Pool({
      // When mongodb is active there is intentionally no real URL: the
      // client must never connect in that mode.
      connectionString: isPostgres
        ? config.getOrThrow<string>('DATABASE_URL')
        : 'postgresql://127.0.0.1:1/unused',
    });
    super({ adapter: new PrismaPg(pool) });
    this.isPostgres = isPostgres;
  }

  async onModuleInit(): Promise<void> {
    if (this.isPostgres) {
      await this.$connect();
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.isPostgres) {
      await this.$disconnect();
    }
  }
}

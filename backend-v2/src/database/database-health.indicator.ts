import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { PrismaService } from './prisma.service';

/**
 * Provider-aware database health check. Under `DB_PROVIDER=postgres` it runs
 * `SELECT 1` through Prisma; under `DB_PROVIDER=mongodb` it pings the Mongoose
 * connection. Exactly one branch can execute per deployment, matching the
 * single active persistence backend.
 */
@Injectable()
export class DatabaseHealthIndicator extends HealthIndicator {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly moduleRef: ModuleRef,
  ) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      if (this.config.get<string>('DB_PROVIDER', 'mongodb') === 'postgres') {
        await this.prisma.$queryRaw`SELECT 1`;
      } else {
        const connection = this.moduleRef.get<Connection>(getConnectionToken(), {
          strict: false,
        });
        await connection.db?.admin().ping();
      }
      return this.getStatus(key, true);
    } catch (error) {
      throw new HealthCheckError(
        'Database check failed',
        this.getStatus(key, false, {
          message: error instanceof Error ? error.message : String(error),
        }),
      );
    }
  }
}

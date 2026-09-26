import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';

/**
 * Provides the Prisma client. Imported unconditionally by PersistenceModule —
 * the service itself decides whether to connect based on DB_PROVIDER, so the
 * module graph is the same under both database backends.
 */
@Module({
  imports: [ConfigModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

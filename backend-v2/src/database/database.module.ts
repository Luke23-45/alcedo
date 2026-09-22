import { Logger, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import mongoose, { Connection } from 'mongoose';

const MAX_CONNECT_ATTEMPTS = 6;
const BASE_CONNECT_DELAY_MS = 1000;
const MAX_POOL_SIZE = 20;
/** How long one probe waits for server selection before it counts as a failed attempt. */
const PROBE_SERVER_SELECTION_TIMEOUT_MS = 5000;

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * The factory waits for MongoDB with exponential backoff before Nest creates
 * its connection, so a slow-starting database (docker-compose cold start)
 * does not crash the boot. @nestjs/mongoose's own retryDelay is a fixed
 * delay, which is why the backoff lives here instead.
 */
async function waitForMongo(uri: string, logger: Logger): Promise<void> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_CONNECT_ATTEMPTS; attempt++) {
    const probe = mongoose.createConnection(uri, {
      serverSelectionTimeoutMS: PROBE_SERVER_SELECTION_TIMEOUT_MS,
    });
    try {
      await probe.asPromise();
      await probe.close();
      logger.log(`MongoDB reachable (attempt ${attempt}/${MAX_CONNECT_ATTEMPTS})`);
      return;
    } catch (error) {
      lastError = error;
      await probe.close().catch(() => undefined);
      if (attempt === MAX_CONNECT_ATTEMPTS) break;
      // 1s, 2s, 4s, 8s, 16s
      const delayMs = BASE_CONNECT_DELAY_MS * 2 ** (attempt - 1);
      logger.warn(
        `MongoDB connection attempt ${attempt}/${MAX_CONNECT_ATTEMPTS} failed; ` +
          `retrying in ${delayMs}ms`,
      );
      await sleep(delayMs);
    }
  }
  throw lastError;
}

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        // getOrThrow: the URI always comes from validated env, never hardcoded.
        const uri = config.getOrThrow<string>('MONGODB_URI');
        await waitForMongo(uri, new Logger('DatabaseModule'));
        return {
          uri,
          maxPoolSize: MAX_POOL_SIZE,
        };
      },
    }),
  ],
})
export class DatabaseModule implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('DatabaseModule');

  constructor(@InjectConnection() private readonly connection: Connection) {}

  onModuleInit(): void {
    this.connection.on('connected', () => this.logger.log('Connected to MongoDB'));
    this.connection.on('disconnected', () => this.logger.warn('Disconnected from MongoDB'));
    this.connection.on('error', (error: unknown) =>
      this.logger.error(
        'MongoDB connection error',
        error instanceof Error ? error.stack : String(error),
      ),
    );
  }

  async onModuleDestroy(): Promise<void> {
    // Fired on SIGTERM/SIGINT via app.enableShutdownHooks() in main.ts.
    if (this.connection.readyState !== 0) {
      await this.connection.close();
      this.logger.log('MongoDB connection closed');
    }
  }
}

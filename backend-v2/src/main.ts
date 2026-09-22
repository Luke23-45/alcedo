import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { requestIdMiddleware } from './common/middleware/request-id.middleware';

async function bootstrap(): Promise<void> {
  // rawBody: true keeps the raw request buffer for HMAC-signed webhooks.
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    rawBody: true,
  });

  app.enableShutdownHooks();
  app.use(requestIdMiddleware);
  app.use(helmet());
  app.use(compression());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
  app.enableCors({
    // The native app talks to this API directly; browser origins are not expected.
    // Tighten this when the marketing/web app ships.
    origin: process.env.CORS_ORIGINS?.split(',') ?? [],
    credentials: true,
  });

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT', 3000);
  await app.listen(port);

  // Non-secret config summary for the deploy logs.
  Logger.log(
    `Alcedo backend v2 listening on :${port} | litellm=${config.get<string>('LITELLM_URL')} ` +
      `model=${config.get<string>('LITELLM_MODEL_ALIAS')} ` +
      `aiQuotas=${config.get<number>('AI_FREE_DAILY_QUOTA')}/` +
      `${config.get<number>('AI_PREMIUM_DAILY_QUOTA')} ` +
      `moderation=${config.get<boolean>('MODERATION_ENABLED') ? 'on' : 'off'}`,
    'Bootstrap',
  );
}

// Env validation (ConfigModule) and other startup failures fail fast with a
// clear message instead of a hanging process.
bootstrap().catch((error: unknown) => {
  Logger.error(
    `Startup failed: ${error instanceof Error ? error.message : String(error)}`,
    undefined,
    'Bootstrap',
  );
  process.exit(1);
});

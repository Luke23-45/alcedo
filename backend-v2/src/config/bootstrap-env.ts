import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'dotenv';
import { validateEnv } from './env.validation';

/**
 * Earliest-run environment bootstrap.
 *
 * NestJS evaluates module decorators (including `MongooseModule.forRootAsync`
 * and any conditional provider selection) while the module graph is being
 * built. `@nestjs/config`'s own dotenv loading happens *inside* that graph,
 * so anything that needs env vars at decoration time — notably the choice of
 * database provider — would see an empty `process.env`.
 *
 * This module runs first (imported as a side effect at the top of
 * `app.module.ts`, before every other import) and mirrors `@nestjs/config`'s
 * dotenv cascade exactly: `.env.local` wins over `.env`, and anything already
 * in `process.env` (real shell environment) wins over both. It then runs the
 * same `validateEnv` the ConfigModule uses, so a bad `DB_PROVIDER` or a
 * missing provider-specific URI fails fast with one clear message instead of
 * a mysterious DI error three modules deep.
 *
 * Because the values are written into `process.env`, the later
 * `ConfigModule.forRoot({ validate: validateEnv })` pass is a no-op for them
 * and both layers always agree.
 */
const DOTENV_FILES = ['.env.local', '.env'] as const;

function loadDotenvCascade(): void {
  const cwd = process.cwd();
  // First file wins, matching @nestjs/config's envFilePath precedence.
  for (const file of DOTENV_FILES) {
    const fullPath = path.resolve(cwd, file);
    if (!fs.existsSync(fullPath)) continue;
    const parsed = parse(fs.readFileSync(fullPath, 'utf8'));
    for (const key of Object.keys(parsed)) {
      if (!(key in process.env)) {
        process.env[key] = parsed[key];
      }
    }
  }
}

loadDotenvCascade();

// Fail fast on invalid environment — this is the single source of truth for
// env validation; ConfigModule's `validate` re-runs it harmlessly later.
validateEnv(process.env as Record<string, unknown>);

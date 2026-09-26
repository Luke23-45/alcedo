import { defineConfig, env } from 'prisma/config';

// Prisma 7 moved the datasource URL out of schema.prisma and into this file.
// The client itself receives its URL at runtime from PrismaService, so this
// only governs CLI commands (migrate, db push, studio).
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});

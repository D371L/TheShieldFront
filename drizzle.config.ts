import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/server/db/schema.ts',
  out: './drizzle',
  casing: 'snake_case',
  migrations: {
    schema: 'public',
    table: 'migrations',
  },
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/theshieldfront',
  },
});

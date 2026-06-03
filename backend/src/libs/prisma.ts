import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const isDev = process.env.NODE_ENV !== 'production';

function safeDbUrl(url: string | undefined): string {
  if (!url) return '(not set)';
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.username}@${u.host}${u.pathname}`;
  } catch {
    return '(invalid url)';
  }
}

const dbUrl = process.env.DATABASE_URL;
console.log(`\x1b[35m[Prisma]\x1b[0m Connecting to ${safeDbUrl(dbUrl)}`);

if (!dbUrl) throw new Error('DATABASE_URL is not set');

const adapter = new PrismaPg({ connectionString: dbUrl });

const base = new PrismaClient({ adapter });

base
  .$connect()
  .then(() => console.log('\x1b[35m[Prisma]\x1b[0m \x1b[32mDatabase connected\x1b[0m'))
  .catch((err: Error) =>
    console.error('\x1b[35m[Prisma]\x1b[0m \x1b[31mConnection failed:\x1b[0m', err.message),
  );

export const prisma = base.$extends({
  query: {
    async $allOperations({ operation, model, args, query }) {
      const start = Date.now();
      try {
        const result = await query(args);
        if (isDev) {
          const ms = Date.now() - start;
          const label = model ? `${model}.${operation}` : operation;
          console.log(`\x1b[35m[Prisma]\x1b[0m ${label} \x1b[2m+${ms}ms\x1b[0m`);
        }
        return result;
      } catch (err: unknown) {
        const ms = Date.now() - start;
        const label = model ? `${model}.${operation}` : operation;
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`\x1b[35m[Prisma]\x1b[0m \x1b[31m${label} failed +${ms}ms:\x1b[0m ${msg}`);
        throw err;
      }
    },
  },
});

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';

// Explicitly load .env in all server environments & worker threads
dotenv.config();

const DEFAULT_POSTGRES_URL =
  'postgresql://postgres.qzmgknrihohlyxpzuwyk:tawakal%40usman%40bbq@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true';

function getConnectionString(): string {
  const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (url && (url.startsWith('postgres://') || url.startsWith('postgresql://'))) {
    return url;
  }
  return DEFAULT_POSTGRES_URL;
}

function createPrismaAdapter() {
  const conn = getConnectionString();
  const host = conn.split('@')[1] || 'PostgreSQL Host';

  console.log('--------------------------------------------------');
  console.log('[DB RUNTIME DIAGNOSTIC]');
  console.log('DATABASE_RUNTIME_PATH:', `postgresql://${host}`);
  console.log('DATABASE_RUNTIME:', process.env.NODE_ENV || 'development');
  console.log('--------------------------------------------------');

  const pool = new Pool({ connectionString: conn });
  return new PrismaPg(pool);
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: createPrismaAdapter(),
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

export const prisma = db;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

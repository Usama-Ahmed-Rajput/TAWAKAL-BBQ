import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';

// Explicitly load .env in all server environments & worker threads
dotenv.config();

function getConnectionString(): string {
  const url = process.env.DATABASE_URL || process.env.DIRECT_URL;
  if (url && (url.startsWith('postgres://') || url.startsWith('postgresql://'))) {
    return url;
  }
  throw new Error('[CRITICAL CONFIG ERROR] DATABASE_URL environment variable is missing or invalid.');
}

function createPrismaAdapter() {
  const conn = getConnectionString();
  const host = conn.split('@')[1]?.split('/')[0] || 'Database Host';

  if (process.env.NODE_ENV === 'development') {
    console.log('--------------------------------------------------');
    console.log('[DB RUNTIME DIAGNOSTIC]');
    console.log('DATABASE_HOST:', host.replace(/:.*@/, ''));
    console.log('DATABASE_RUNTIME:', process.env.NODE_ENV || 'development');
    console.log('--------------------------------------------------');
  }

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

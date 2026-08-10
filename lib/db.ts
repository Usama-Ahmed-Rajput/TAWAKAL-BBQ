import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';
import fs from 'fs';

let rawDbPath = path.resolve(process.cwd(), 'dev.db');
if (!fs.existsSync(rawDbPath)) {
  rawDbPath = path.resolve(process.cwd(), 'prisma', 'dev.db');
}

const connectionUrl = process.env.DATABASE_URL || `file:${rawDbPath.replace(/\\/g, '/')}`;

const adapter = new PrismaBetterSqlite3({ url: connectionUrl });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

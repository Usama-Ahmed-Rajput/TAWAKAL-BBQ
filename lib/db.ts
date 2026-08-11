import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { Pool } from 'pg';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Explicitly load .env in all server environments & worker threads
dotenv.config();

function getConnectionString(): string {
  return process.env.DIRECT_URL || process.env.DATABASE_URL || '';
}

function getResolvedDbInfo() {
  const conn = getConnectionString();
  const isPostgres = conn.startsWith('postgres://') || conn.startsWith('postgresql://');

  if (isPostgres) {
    const host = conn.split('@')[1] || 'PostgreSQL Host';
    return {
      isPostgres: true,
      runtimePath: `postgresql://${host}`,
      parentDir: 'N/A (Hosted PostgreSQL)',
      dirExists: true,
      fileExists: true,
    };
  } else {
    let dbPath = conn.replace(/^file:/, '');
    if (!dbPath || dbPath.includes('dev.db')) {
      dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    } else if (!path.isAbsolute(dbPath)) {
      dbPath = path.join(process.cwd(), dbPath);
    }
    const parentDir = path.dirname(dbPath);
    const dirExists = fs.existsSync(parentDir);
    const fileExists = fs.existsSync(dbPath);

    return {
      isPostgres: false,
      runtimePath: dbPath,
      parentDir,
      dirExists,
      fileExists,
    };
  }
}

function createPrismaAdapter() {
  const conn = getConnectionString();
  const info = getResolvedDbInfo();

  console.log('--------------------------------------------------');
  console.log('[DB RUNTIME DIAGNOSTIC]');
  console.log('DATABASE_RUNTIME_PATH:', info.runtimePath);
  console.log('DATABASE_PARENT_DIRECTORY:', info.parentDir);
  console.log('DATABASE_DIRECTORY_EXISTS:', info.dirExists);
  console.log('DATABASE_FILE_EXISTS:', info.fileExists);
  console.log('DATABASE_RUNTIME:', process.env.NODE_ENV || 'development');
  console.log('--------------------------------------------------');

  if (info.isPostgres) {
    const pool = new Pool({ connectionString: conn });
    return new PrismaPg(pool);
  } else {
    // Ensure parent directory exists recursively BEFORE SQLite client initialization
    if (!info.dirExists) {
      console.log(`[DB INIT] Creating missing SQLite parent directory: ${info.parentDir}`);
      fs.mkdirSync(info.parentDir, { recursive: true });
    }
    const normalizedUrl = `file:${info.runtimePath.replace(/\\/g, '/')}`;
    return new PrismaBetterSqlite3({ url: normalizedUrl });
  }
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

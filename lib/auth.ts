import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { db } from './db';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'tawakal_bbq_super_secret_jwt_key_2026_production'
);

export interface AdminUserSession {
  id: string;
  name: string;
  email: string;
  roleId: string;
  roleName: string;
  permissions: string[];
}

export async function createAdminToken(session: AdminUserSession): Promise<string> {
  return await new SignJWT({ ...session })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyAdminToken(token: string): Promise<AdminUserSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AdminUserSession;
  } catch (error) {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminUserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token) return null;
  return await verifyAdminToken(token);
}

export async function requireAdminPermission(permissionKey?: string): Promise<AdminUserSession> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error('UNAUTHORIZED: Admin login required');
  }

  if (permissionKey && session.roleName !== 'SUPER_ADMIN') {
    if (!session.permissions.includes(permissionKey)) {
      throw new Error(`FORBIDDEN: Missing required permission: ${permissionKey}`);
    }
  }

  return session;
}

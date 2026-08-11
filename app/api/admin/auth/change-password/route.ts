import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'UNAUTHORIZED: Admin session required' },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword, confirmPassword } = await request.json();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'All fields are required.' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'New passwords do not match.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters.' },
        { status: 400 }
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { success: false, error: 'New password cannot be the same as your current password.' },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: session.id },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User account not found.' },
        { status: 404 }
      );
    }

    const isValidCurrentPassword = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValidCurrentPassword) {
      return NextResponse.json(
        { success: false, error: 'Current password is incorrect.' },
        { status: 400 }
      );
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await db.user.update({
      where: { id: session.id },
      data: { passwordHash: newPasswordHash },
    });

    // Create Audit Log
    await db.auditLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        action: 'ADMIN_PASSWORD_CHANGE',
        entityType: 'User',
        entityId: user.id,
      },
    });

    const response = NextResponse.json({
      success: true,
      message: 'Password changed successfully. Please log in again.',
    });

    // Invalidate session cookie immediately
    response.cookies.set('admin_token', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Password change error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while updating password.' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { getDeliveryDiagnostics } from '@/lib/push';

export async function GET(req: Request) {
  try {
    const session = await getAdminSession();
    console.log('[SERVER PWA DIAGNOSTIC] GET /api/admin/push-subscriptions - Admin ID:', session?.id || 'UNAUTHENTICATED');

    if (!session) {
      return NextResponse.json({ error: 'UNAUTHORIZED: Admin login required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const endpoint = searchParams.get('endpoint');

    const userSubscriptions = await prisma.pushSubscription.findMany({
      where: { userId: session.id },
      select: {
        id: true,
        endpoint: true,
        userAgent: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const isCurrentActive = endpoint
      ? userSubscriptions.some((sub) => sub.endpoint === endpoint)
      : userSubscriptions.length > 0;

    const safeDevices = userSubscriptions.map((sub) => ({
      id: sub.id,
      userAgent: sub.userAgent || 'Unknown Device',
      createdAt: sub.createdAt,
      isCurrentDevice: endpoint ? sub.endpoint === endpoint : false,
    }));

    const deliveryDiag = getDeliveryDiagnostics();

    return NextResponse.json({
      active: isCurrentActive,
      count: userSubscriptions.length,
      devices: safeDevices,
      deliveryDiagnostics: {
        ...deliveryDiag,
        activeSubscriptionsCount: userSubscriptions.length,
      },
    });
  } catch (error: any) {
    console.error('[SERVER PWA DIAGNOSTIC] GET failed:', error.message || error);
    return NextResponse.json({ error: 'Failed to fetch push subscriptions' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    console.log('[SERVER PWA DIAGNOSTIC] POST /api/admin/push-subscriptions - Admin ID:', session?.id || 'UNAUTHENTICATED');

    if (!session) {
      return NextResponse.json({ error: 'UNAUTHORIZED: Admin login required' }, { status: 401 });
    }

    const body = await req.json();
    const { endpoint, keys, userAgent } = body;

    if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
      return NextResponse.json({ error: 'Invalid push subscription payload' }, { status: 400 });
    }

    // Upsert subscription tied to this admin's userId
    const pushSubscription = await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: {
        userId: session.id,
        p256dh: keys.p256dh,
        auth: keys.auth,
        userAgent: userAgent || null,
      },
      create: {
        userId: session.id,
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        userAgent: userAgent || null,
      },
    });

    console.log('[SERVER PWA DIAGNOSTIC] Prisma upsert succeeded. Subscription ID:', pushSubscription.id);

    return NextResponse.json({ success: true, id: pushSubscription.id });
  } catch (error: any) {
    console.error('[SERVER PWA DIAGNOSTIC] Prisma upsert failed:', error.message || error);
    return NextResponse.json({ error: 'Failed to save push subscription' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getAdminSession();
    console.log('[SERVER PWA DIAGNOSTIC] DELETE /api/admin/push-subscriptions - Admin ID:', session?.id || 'UNAUTHENTICATED');

    if (!session) {
      return NextResponse.json({ error: 'UNAUTHORIZED: Admin login required' }, { status: 401 });
    }

    const body = await req.json();
    const { endpoint, id } = body;

    if (id) {
      const deleted = await prisma.pushSubscription.deleteMany({
        where: {
          id,
          userId: session.id,
        },
      });
      return NextResponse.json({ success: true, count: deleted.count });
    }

    if (endpoint) {
      const deleted = await prisma.pushSubscription.deleteMany({
        where: {
          endpoint,
          userId: session.id,
        },
      });
      return NextResponse.json({ success: true, count: deleted.count });
    }

    return NextResponse.json({ error: 'Subscription ID or endpoint is required to remove device' }, { status: 400 });
  } catch (error: any) {
    console.error('[SERVER PWA DIAGNOSTIC] DELETE failed:', error.message || error);
    return NextResponse.json({ error: 'Failed to delete push subscription' }, { status: 500 });
  }
}

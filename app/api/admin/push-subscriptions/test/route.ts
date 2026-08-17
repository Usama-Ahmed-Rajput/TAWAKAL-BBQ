import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

function initVapid() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || 'mailto:admin@tawakalbbq.com';

  if (!publicKey || !privateKey) {
    return false;
  }

  try {
    webpush.setVapidDetails(subject, publicKey, privateKey);
    return true;
  } catch (err) {
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'UNAUTHORIZED: Admin login required' }, { status: 401 });
    }

    if (!initVapid()) {
      return NextResponse.json(
        { error: 'VAPID credentials are not configured on the server.' },
        { status: 500 }
      );
    }

    const { endpoint } = (await req.json().catch(() => ({}))) || {};

    const subscriptions = await prisma.pushSubscription.findMany({
      where: endpoint
        ? { userId: session.id, endpoint }
        : { userId: session.id },
    });

    if (subscriptions.length === 0) {
      return NextResponse.json(
        { error: 'No active push subscriptions found for your account on this device. Please enable notifications first.' },
        { status: 404 }
      );
    }

    const testPayload = JSON.stringify({
      title: '🔔 Tawakal BBQ Test Notification',
      body: 'Your order notifications are working correctly.',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      url: '/admin/orders',
      tag: 'test-notification',
    });

    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth,
              },
            },
            testPayload
          );
        } catch (error: any) {
          if (error.statusCode === 404 || error.statusCode === 410) {
            await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
          }
          throw error;
        }
      })
    );

    const sentCount = results.filter((r) => r.status === 'fulfilled').length;
    const failedCount = results.filter((r) => r.status === 'rejected').length;

    return NextResponse.json({
      success: true,
      message: `Test notification sent (${sentCount} delivered, ${failedCount} failed)`,
      sentCount,
    });
  } catch (error: any) {
    console.error('[TEST PUSH ERROR]:', error);
    return NextResponse.json({ error: 'Failed to send test notification' }, { status: 500 });
  }
}

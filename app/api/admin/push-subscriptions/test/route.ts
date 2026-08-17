import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { initVapid, updateDeliveryDiagnostics } from '@/lib/push';

export async function POST(req: Request) {
  const timestamp = new Date().toLocaleTimeString();
  try {
    const session = await getAdminSession();
    console.log('[PUSH TEST] Incoming request - Admin session ID:', session?.id || 'UNAUTHENTICATED');

    if (!session) {
      updateDeliveryDiagnostics({
        lastTestAttempt: 'Admin Test Push',
        providerAccepted: 'NO',
        providerStatusCode: 401,
        lastErrorName: 'Unauthorized',
        lastErrorMessage: 'Admin login required',
        lastPushTimestamp: timestamp,
      });
      return NextResponse.json({ error: 'UNAUTHORIZED: Admin login required' }, { status: 401 });
    }

    if (!initVapid()) {
      updateDeliveryDiagnostics({
        lastTestAttempt: 'Admin Test Push',
        providerAccepted: 'NO',
        providerStatusCode: 500,
        lastErrorName: 'VapidConfigError',
        lastErrorMessage: 'VAPID credentials are not configured on server',
        lastPushTimestamp: timestamp,
      });
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

    console.log(`[PUSH TEST] Subscriptions found in DB for admin ${session.id}: ${subscriptions.length}`);

    updateDeliveryDiagnostics({
      activeSubscriptionsCount: subscriptions.length,
      lastPushTimestamp: timestamp,
    });

    if (subscriptions.length === 0) {
      updateDeliveryDiagnostics({
        lastTestAttempt: 'Admin Test Push',
        providerAccepted: 'NO',
        providerStatusCode: 404,
        lastErrorName: 'NoSubscriptions',
        lastErrorMessage: 'No active device subscriptions found for admin',
        lastPushTimestamp: timestamp,
      });
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

    let sentCount = 0;
    let failedCount = 0;
    let lastErrorName = 'None';
    let lastErrorMessage = 'None';
    let providerStatusCode: number | string = 201;
    let lastEndpointHost = 'None';

    console.log(`[PUSH TEST] Dispatching Web Push to ${subscriptions.length} device(s)...`);

    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        let endpointHost = 'unknown';
        try {
          endpointHost = new URL(sub.endpoint).host;
        } catch {}
        lastEndpointHost = endpointHost;

        try {
          console.log(`[PUSH TEST] Sending Web Push request to endpoint host: ${endpointHost}`);
          const res = await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth,
              },
            },
            testPayload,
            {
              TTL: 86400,
              urgency: 'high',
            }
          );

          sentCount++;
          providerStatusCode = res.statusCode || 201;

          // Extract safe headers for logging
          const safeHeaders = {
            location: res.headers?.location || undefined,
            contentType: res.headers?.['content-type'] || undefined,
            date: res.headers?.date || undefined,
          };

          console.log(`[PUSH TEST] Web Push ACCEPTED by provider! Endpoint Host: ${endpointHost}, StatusCode: ${res.statusCode}, Safe Headers:`, safeHeaders);
        } catch (error: any) {
          failedCount++;
          providerStatusCode = error.statusCode || 500;
          lastErrorName = error.name || 'WebPushError';
          lastErrorMessage = error.body || error.message || String(error);

          console.error(`[PUSH TEST] Web Push REJECTED by provider! Endpoint Host: ${endpointHost}, StatusCode: ${error.statusCode}, ErrorBody: ${error.body || 'N/A'}, Message: ${error.message}`);

          if (error.statusCode === 404 || error.statusCode === 410) {
            console.log(`[PUSH TEST] Subscription expired (${error.statusCode}). Cleaning up endpoint from database...`);
            await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
          }
          throw error;
        }
      })
    );

    updateDeliveryDiagnostics({
      lastTestAttempt: 'Admin Test Push',
      providerAccepted: sentCount > 0 ? 'YES' : 'NO',
      providerStatusCode: providerStatusCode,
      lastErrorName: sentCount > 0 ? 'None' : lastErrorName,
      lastErrorMessage: sentCount > 0 ? 'None' : lastErrorMessage,
      lastPushTimestamp: timestamp,
      successfulSends: sentCount,
      failedSends: failedCount,
      endpointHost: lastEndpointHost,
    });

    if (sentCount === 0) {
      return NextResponse.json(
        {
          error: `Web Push provider rejected payload (${lastErrorName}: ${lastErrorMessage}). Provider status: ${providerStatusCode}`,
          sentCount: 0,
          failedCount,
          providerStatusCode,
          lastErrorName,
          lastErrorMessage,
          endpointHost: lastEndpointHost,
        },
        { status: typeof providerStatusCode === 'number' ? providerStatusCode : 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Test notification accepted by Web Push provider (${sentCount} delivered, ${failedCount} failed)`,
      sentCount,
      failedCount,
      providerStatusCode,
      endpointHost: lastEndpointHost,
    });
  } catch (error: any) {
    console.error('[PUSH TEST ERROR]:', error);
    updateDeliveryDiagnostics({
      lastTestAttempt: 'Admin Test Push',
      providerAccepted: 'NO',
      providerStatusCode: 500,
      lastErrorName: error.name || 'ServerError',
      lastErrorMessage: error.message || String(error),
      lastPushTimestamp: timestamp,
    });
    return NextResponse.json({ error: error.message || 'Failed to send test notification' }, { status: 500 });
  }
}

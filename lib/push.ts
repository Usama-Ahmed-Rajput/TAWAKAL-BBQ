import webpush from 'web-push';
import { prisma } from './db';

export interface DeliveryDiagnostics {
  lastTestAttempt: string;
  providerAccepted: 'YES' | 'NO' | 'N/A';
  providerStatusCode: number | string;
  lastErrorName: string;
  lastErrorMessage: string;
  lastPushTimestamp: string | null;
  successfulSends: number;
  failedSends: number;
  activeSubscriptionsCount: number;
  endpointHost?: string;
}

let lastDeliveryDiagnostics: DeliveryDiagnostics = {
  lastTestAttempt: 'None',
  providerAccepted: 'N/A',
  providerStatusCode: 'None',
  lastErrorName: 'None',
  lastErrorMessage: 'None',
  lastPushTimestamp: null,
  successfulSends: 0,
  failedSends: 0,
  activeSubscriptionsCount: 0,
  endpointHost: 'None',
};

export function getDeliveryDiagnostics(): DeliveryDiagnostics {
  return lastDeliveryDiagnostics;
}

export function updateDeliveryDiagnostics(update: Partial<DeliveryDiagnostics>) {
  lastDeliveryDiagnostics = { ...lastDeliveryDiagnostics, ...update };
}

function getVapidDetails() {
  const publicKey = (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '').trim();
  const privateKey = (process.env.VAPID_PRIVATE_KEY || '').trim();
  const subject = (process.env.VAPID_SUBJECT || 'mailto:admin@tawakalbbq.com').trim();

  if (!publicKey || !privateKey) {
    return null;
  }

  return { publicKey, privateKey, subject };
}

let vapidInitialized = false;

export function initVapid() {
  if (vapidInitialized) return true;

  const details = getVapidDetails();
  if (!details) {
    console.warn('[PUSH] VAPID environment variables not fully configured. Push notifications disabled.');
    updateDeliveryDiagnostics({
      lastTestAttempt: 'VAPID credentials missing',
      providerAccepted: 'NO',
    });
    return false;
  }

  try {
    webpush.setVapidDetails(details.subject, details.publicKey, details.privateKey);
    vapidInitialized = true;
    console.log('[PUSH] VAPID details initialized successfully.');
    return true;
  } catch (err: any) {
    console.error('[PUSH] Failed to initialize VAPID details:', err);
    updateDeliveryDiagnostics({
      lastTestAttempt: 'VAPID Init Error',
      providerAccepted: 'NO',
      lastErrorName: err.name || 'VapidInitError',
      lastErrorMessage: err.message || String(err),
      providerStatusCode: 500,
    });
    return false;
  }
}

export async function sendAdminOrderNotification(order: { orderNumber: string; totalAmount: number }) {
  const timestamp = new Date().toLocaleTimeString();
  try {
    if (!initVapid()) return;

    // Fetch all registered admin push subscriptions
    const subscriptions = await prisma.pushSubscription.findMany();
    updateDeliveryDiagnostics({
      activeSubscriptionsCount: subscriptions.length,
      lastPushTimestamp: timestamp,
    });

    if (subscriptions.length === 0) {
      console.log('[PUSH ORDER ALERT] No admin devices registered for push alerts.');
      updateDeliveryDiagnostics({
        lastTestAttempt: 'Order Alert Skipped: No Active Subscriptions',
        providerAccepted: 'N/A',
      });
      return;
    }

    console.log(`[PUSH ORDER ALERT] Triggering push for order #${order.orderNumber} to ${subscriptions.length} admin subscription(s)...`);

    const payload = JSON.stringify({
      title: '🔔 New Order Received',
      body: `Order #${order.orderNumber} has been placed (Rs. ${order.totalAmount.toLocaleString()})`,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      url: '/admin/orders',
      tag: `new-order-${order.orderNumber}`,
    });

    let sentCount = 0;
    let failCount = 0;
    let lastErrName = 'None';
    let lastErrMsg = 'None';
    let lastCode: string | number = 201;

    const sendPromises = subscriptions.map(async (sub) => {
      let host = 'unknown';
      try {
        host = new URL(sub.endpoint).host;
      } catch {}

      const pushSub = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      };

      try {
        console.log(`[PUSH ORDER ALERT] Sending Web Push to endpoint host: ${host}`);
        const response = await webpush.sendNotification(pushSub, payload, {
          TTL: 86400,
          urgency: 'high',
        });

        sentCount++;
        lastCode = response.statusCode || 201;
        console.log(`[PUSH ORDER ALERT] Provider response: statusCode ${response.statusCode || 201}, host: ${host}`);
      } catch (error: any) {
        failCount++;
        lastCode = error.statusCode || 500;
        lastErrName = error.name || 'WebPushError';
        lastErrMsg = error.message || String(error);

        console.error(`[PUSH ORDER ALERT] Web Push send FAILED to host ${host}: statusCode=${error.statusCode}, body=${error.body || ''}, message=${error.message}`);

        if (error.statusCode === 404 || error.statusCode === 410) {
          console.log(`[PUSH ORDER ALERT] Subscription expired (${error.statusCode}). Cleaning up database endpoint.`);
          await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
        }
      }
    });

    await Promise.allSettled(sendPromises);

    updateDeliveryDiagnostics({
      lastTestAttempt: `Order #${order.orderNumber} Alert`,
      providerAccepted: sentCount > 0 ? 'YES' : 'NO',
      providerStatusCode: lastCode,
      lastErrorName: lastErrName,
      lastErrorMessage: lastErrMsg,
      lastPushTimestamp: timestamp,
      successfulSends: sentCount,
      failedSends: failCount,
    });
  } catch (err: any) {
    console.error('[PUSH ORDER ALERT] Fail-safe caught error:', err);
    updateDeliveryDiagnostics({
      lastTestAttempt: 'Fail-safe exception',
      providerAccepted: 'NO',
      lastErrorName: err.name || 'Exception',
      lastErrorMessage: err.message || String(err),
      providerStatusCode: 500,
      lastPushTimestamp: timestamp,
    });
  }
}

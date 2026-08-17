import webpush from 'web-push';
import { prisma } from './db';

function getVapidDetails() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || 'mailto:admin@tawakalbbq.com';

  if (!publicKey || !privateKey) {
    return null;
  }

  return { publicKey, privateKey, subject };
}

let vapidInitialized = false;

function initVapid() {
  if (vapidInitialized) return true;

  const details = getVapidDetails();
  if (!details) {
    console.warn('[PUSH] VAPID environment variables not fully configured. Push notifications disabled.');
    return false;
  }

  try {
    webpush.setVapidDetails(details.subject, details.publicKey, details.privateKey);
    vapidInitialized = true;
    return true;
  } catch (err) {
    console.error('[PUSH] Failed to initialize VAPID details:', err);
    return false;
  }
}

export async function sendAdminOrderNotification(order: { orderNumber: string; totalAmount: number }) {
  try {
    if (!initVapid()) return;

    // Fetch all registered admin push subscriptions
    const subscriptions = await prisma.pushSubscription.findMany();

    if (subscriptions.length === 0) {
      console.log('[PUSH] No admin devices subscribed to push notifications.');
      return;
    }

    const payload = JSON.stringify({
      title: '🔔 New Order Received',
      body: `Order #${order.orderNumber} has been placed (Rs. ${order.totalAmount.toLocaleString()})`,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      url: '/admin/orders',
      tag: `new-order-${order.orderNumber}`,
    });

    const sendPromises = subscriptions.map(async (sub) => {
      const pushSub = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      };

      try {
        await webpush.sendNotification(pushSub, payload);
      } catch (error: any) {
        // HTTP 404 / 410 indicates the subscription is expired or unsubscribed by the browser
        if (error.statusCode === 404 || error.statusCode === 410) {
          console.log(`[PUSH] Subscription expired (${error.statusCode}). Cleaning up endpoint.`);
          await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
        } else {
          console.error(`[PUSH] Error sending notification to subscription (Status: ${error.statusCode || 'Unknown'}):`, error.message || error);
        }
      }
    });

    await Promise.allSettled(sendPromises);
  } catch (err) {
    console.error('[PUSH] Fail-safe caught error in sendAdminOrderNotification:', err);
  }
}

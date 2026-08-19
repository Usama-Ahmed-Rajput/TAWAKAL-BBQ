import type { Metadata } from 'next';
import { OrderTrackingClient } from './OrderTrackingClient';

export const metadata: Metadata = {
  title: 'Order Confirmation',
  description: 'View your order confirmation details and WhatsApp tracking status.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function OrderPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  return <OrderTrackingClient orderNumber={orderNumber} />;
}

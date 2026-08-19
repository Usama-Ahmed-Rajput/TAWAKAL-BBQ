import type { Metadata } from 'next';
import { PublicCheckoutClient } from './PublicCheckoutClient';

export const metadata: Metadata = {
  title: 'Order Checkout',
  description: 'Complete your food order with Cash on Delivery or Pickup at Tawakal BBQ Karachi.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PublicCheckoutPage() {
  return <PublicCheckoutClient />;
}

import type { Metadata } from 'next';
import { PublicTrackOrderClient } from './PublicTrackOrderClient';

export const metadata: Metadata = {
  title: 'Track Your Order',
  description: 'Track your live order status and preparation progress at Tawakal BBQ.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function TrackOrderPage() {
  return <PublicTrackOrderClient />;
}

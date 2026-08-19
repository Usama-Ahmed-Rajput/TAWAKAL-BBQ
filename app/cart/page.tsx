import type { Metadata } from 'next';
import { PublicCartClient } from './PublicCartClient';

export const metadata: Metadata = {
  title: 'Shopping Cart',
  description: 'Review your food items and deals before checkout at Tawakal BBQ.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PublicCartPage() {
  return <PublicCartClient />;
}

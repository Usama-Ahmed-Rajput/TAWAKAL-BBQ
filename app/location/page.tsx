import type { Metadata } from 'next';
import { PublicLocationClient } from './PublicLocationClient';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://tawakalbbq.com';

export const metadata: Metadata = {
  title: 'Restaurant Branches & Outlet Location',
  description:
    'Find Tawakal BBQ restaurant branches in Karachi. Get directions to our Akhtar Colony main outlet, check opening hours, or place direct phone/WhatsApp orders.',
  alternates: {
    canonical: '/location',
  },
  openGraph: {
    title: 'Restaurant Branches & Outlet Location',
    description:
      'Find Tawakal BBQ restaurant branches in Karachi. Get directions to our Akhtar Colony main outlet, check opening hours, or place direct phone/WhatsApp orders.',
    url: `${BASE_URL}/location`,
    siteName: 'Tawakal BBQ',
    locale: 'en_PK',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Tawakal BBQ Restaurant Branches',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Restaurant Branches & Outlet Location',
    description:
      'Find Tawakal BBQ restaurant branches in Karachi. Get directions to our Akhtar Colony main outlet, check opening hours, or place direct phone/WhatsApp orders.',
    images: ['/logo.png'],
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: BASE_URL,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Locations',
      item: `${BASE_URL}/location`,
    },
  ],
};

export default function PublicLocationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PublicLocationClient />
    </>
  );
}

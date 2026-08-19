import type { Metadata } from 'next';
import { PublicContactClient } from './PublicContactClient';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://tawakalbbq.com';

export const metadata: Metadata = {
  title: 'Contact Us | Location, Phone & WhatsApp Orders',
  description:
    'Contact Tawakal BBQ & Restaurant in Akhtar Colony Karachi. Call +92-343-1265090, message on WhatsApp +92-348-5650906, or get exact Google Maps directions.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Us | Location, Phone & WhatsApp Orders',
    description:
      'Contact Tawakal BBQ & Restaurant in Akhtar Colony Karachi. Call +92-343-1265090, message on WhatsApp +92-348-5650906, or get exact Google Maps directions.',
    url: `${BASE_URL}/contact`,
    siteName: 'Tawakal BBQ',
    locale: 'en_PK',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Contact Tawakal Bar B.Q & Restaurant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | Location, Phone & WhatsApp Orders',
    description:
      'Contact Tawakal BBQ & Restaurant in Akhtar Colony Karachi. Call +92-343-1265090, message on WhatsApp +92-348-5650906, or get exact Google Maps directions.',
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
      name: 'Contact Us',
      item: `${BASE_URL}/contact`,
    },
  ],
};

export default function PublicContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PublicContactClient />
    </>
  );
}

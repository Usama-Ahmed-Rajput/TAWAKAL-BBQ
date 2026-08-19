import type { Metadata } from 'next';
import { PublicMenuClient } from './PublicMenuClient';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://tawakalbbq.com';

export const metadata: Metadata = {
  title: 'Digital Menu | Authentic Fire-Grilled BBQ Dishes',
  description:
    'Browse the full digital menu of Tawakal BBQ Karachi. Explore live charcoal chicken tikkas, seekh kebabs, malai boti, crispy rolls, fast food & extra sides.',
  alternates: {
    canonical: '/menu',
  },
  openGraph: {
    title: 'Digital Menu | Authentic Fire-Grilled BBQ Dishes',
    description:
      'Browse the full digital menu of Tawakal BBQ Karachi. Explore live charcoal chicken tikkas, seekh kebabs, malai boti, crispy rolls, fast food & extra sides.',
    url: `${BASE_URL}/menu`,
    siteName: 'Tawakal BBQ',
    locale: 'en_PK',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Tawakal BBQ Digital Menu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Menu | Authentic Fire-Grilled BBQ Dishes',
    description:
      'Browse the full digital menu of Tawakal BBQ Karachi. Explore live charcoal chicken tikkas, seekh kebabs, malai boti, crispy rolls, fast food & extra sides.',
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
      name: 'Menu',
      item: `${BASE_URL}/menu`,
    },
  ],
};

export default function PublicMenuPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PublicMenuClient />
    </>
  );
}

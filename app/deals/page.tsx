import type { Metadata } from 'next';
import { PublicDealsClient } from './PublicDealsClient';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://tawakalbbq.com';

export const metadata: Metadata = {
  title: 'Special BBQ Deals & Combos | Exclusive Offers',
  description:
    'Order exclusive Pakistani BBQ combos & deals from Tawakal Restaurant Karachi. Includes live charcoal tikkas, kebabs, puri parathas, drinks & compulsory raita.',
  alternates: {
    canonical: '/deals',
  },
  openGraph: {
    title: 'Special BBQ Deals & Combos | Exclusive Offers',
    description:
      'Order exclusive Pakistani BBQ combos & deals from Tawakal Restaurant Karachi. Includes live charcoal tikkas, kebabs, puri parathas, drinks & compulsory raita.',
    url: `${BASE_URL}/deals`,
    siteName: 'Tawakal BBQ',
    locale: 'en_PK',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Tawakal BBQ Deals & Combos',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Special BBQ Deals & Combos | Exclusive Offers',
    description:
      'Order exclusive Pakistani BBQ combos & deals from Tawakal Restaurant Karachi. Includes live charcoal tikkas, kebabs, puri parathas, drinks & compulsory raita.',
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
      name: 'Deals',
      item: `${BASE_URL}/deals`,
    },
  ],
};

export default function PublicDealsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PublicDealsClient />
    </>
  );
}

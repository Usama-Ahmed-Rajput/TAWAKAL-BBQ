import type { Metadata } from 'next';
import { PublicAboutClient } from './PublicAboutClient';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://tawakalbbq.com';

export const metadata: Metadata = {
  title: 'About Us | Authentic Pakistani BBQ Story',
  description:
    'Learn about Tawakal Bar B.Q & Restaurant in Karachi. Discover our passion for live charcoal grilling, fresh ingredients, and authentic Pakistani hospitality.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Us | Authentic Pakistani BBQ Story',
    description:
      'Learn about Tawakal Bar B.Q & Restaurant in Karachi. Discover our passion for live charcoal grilling, fresh ingredients, and authentic Pakistani hospitality.',
    url: `${BASE_URL}/about`,
    siteName: 'Tawakal BBQ',
    locale: 'en_PK',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'About Tawakal Bar B.Q & Restaurant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Authentic Pakistani BBQ Story',
    description:
      'Learn about Tawakal Bar B.Q & Restaurant in Karachi. Discover our passion for live charcoal grilling, fresh ingredients, and authentic Pakistani hospitality.',
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
      name: 'About Us',
      item: `${BASE_URL}/about`,
    },
  ],
};

export default function PublicAboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PublicAboutClient />
    </>
  );
}

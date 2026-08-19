import type { Metadata } from 'next';
import { PublicReservationClient } from './PublicReservationClient';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://tawakalbbq.com';

export const metadata: Metadata = {
  title: 'Table Reservation & Event Bookings',
  description:
    'Book a dining table or reserve party catering at Tawakal BBQ Karachi. Enjoy live charcoal grilling atmosphere with family & friends. Reserve your table online.',
  alternates: {
    canonical: '/reservation',
  },
  openGraph: {
    title: 'Table Reservation & Event Bookings',
    description:
      'Book a dining table or reserve party catering at Tawakal BBQ Karachi. Enjoy live charcoal grilling atmosphere with family & friends. Reserve your table online.',
    url: `${BASE_URL}/reservation`,
    siteName: 'Tawakal BBQ',
    locale: 'en_PK',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Tawakal BBQ Table Reservation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Table Reservation & Event Bookings',
    description:
      'Book a dining table or reserve party catering at Tawakal BBQ Karachi. Enjoy live charcoal grilling atmosphere with family & friends. Reserve your table online.',
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
      name: 'Table Reservation',
      item: `${BASE_URL}/reservation`,
    },
  ],
};

export default function PublicReservationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PublicReservationClient />
    </>
  );
}

import type { Metadata, Viewport } from 'next';
import { Bebas_Neue, DM_Serif_Display, Inter, Noto_Nastaliq_Urdu } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import { CartDrawer } from '@/components/CartDrawer';
import { StickyMobileCart } from '@/components/StickyMobileCart';
import { PWARegister } from '@/components/PWARegister';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { OfflineBanner } from '@/components/OfflineBanner';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://tawakalbbq.com';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

const dmSerifDisplay = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-dm-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoUrdu = Noto_Nastaliq_Urdu({
  weight: ['400', '700'],
  subsets: ['arabic'],
  variable: '--font-urdu',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#11100E',
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Tawakal BBQ | Authentic Fire-Grilled BBQ in Karachi',
    template: '%s | Tawakal BBQ',
  },
  description:
    'Order authentic Pakistani BBQ online at Tawakal Restaurant in Karachi. Enjoy live charcoal tikkas, malai boti, roll & premium deals with fast delivery.',
  manifest: '/manifest.webmanifest',
  alternates: {
    canonical: '/',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Tawakal BBQ',
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  keywords: [
    'Tawakal BBQ',
    'Tawakal Restaurant',
    'Pakistani BBQ Karachi',
    'Akhtar Colony BBQ',
    'Live Charcoal BBQ',
    'Seekh Kebab Karachi',
    'Chicken Tikka',
    'Malai Boti',
    'Puri Paratha Rolls',
    'Online Food Delivery Karachi',
  ],
  authors: [{ name: 'Tawakal BBQ' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Tawakal BBQ | Authentic Fire-Grilled BBQ in Karachi',
    description:
      'Order authentic Pakistani BBQ online at Tawakal Restaurant in Karachi. Enjoy live charcoal tikkas, seekh kebabs, malai boti, rolls & premium deals with fast delivery.',
    url: BASE_URL,
    siteName: 'Tawakal BBQ',
    locale: 'en_PK',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Tawakal Bar B.Q & Restaurant Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tawakal BBQ | Authentic Fire-Grilled BBQ in Karachi',
    description:
      'Order authentic Pakistani BBQ online at Tawakal Restaurant in Karachi. Enjoy live charcoal tikkas, seekh kebabs, malai boti, rolls & premium deals.',
    images: ['/logo.png'],
  },
};

const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Restaurant',
      '@id': `${BASE_URL}/#restaurant`,
      name: 'Tawakal Bar B.Q & Restaurant',
      alternateName: 'Tawakal BBQ',
      description:
        'Authentic Pakistani live charcoal BBQ, seekh kebabs, chicken tikka, malai boti, crispy rolls, fast food and premium deals in Karachi.',
      url: BASE_URL,
      logo: `${BASE_URL}/logo.png`,
      image: `${BASE_URL}/logo.png`,
      telephone: '+92-343-1265090',
      servesCuisine: ['Pakistani', 'BBQ', 'Fast Food'],
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Plot No. 358, Street 5, Sector B, Main Road Akhter Colony, Opposite Saddique Medical Store',
        addressLocality: 'Karachi',
        addressRegion: 'Sindh',
        postalCode: '75500',
        addressCountry: 'PK',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '24.8415',
        longitude: '67.0782',
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '12:00',
          closes: '01:00',
        },
      ],
      sameAs: ['https://wa.me/923485650906'],
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: BASE_URL,
      name: 'Tawakal BBQ',
      publisher: {
        '@id': `${BASE_URL}/#restaurant`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${dmSerifDisplay.variable} ${inter.variable} ${notoUrdu.variable} dark scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body
        className="bg-[#11100E] text-[#F4EBDD] font-sans antialiased selection:bg-[#C83B22] selection:text-white"
        suppressHydrationWarning
      >
        <ToastProvider>
          <CartProvider>
            <PWARegister />
            <OfflineBanner />
            {children}
            <CartDrawer />
            <StickyMobileCart />
            <PWAInstallPrompt />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from 'next';
import { Outfit, Cinzel, Bebas_Neue } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#070707',
};

export const metadata: Metadata = {
  title: 'Tawakal BBQ | Authentic Fire-Grilled BBQ',
  description:
    'Experience authentic Pakistani BBQ at Tawakal BBQ — premium fire-grilled flavors, signature platters and an unforgettable dining experience.',
  keywords: [
    'Tawakal BBQ',
    'Pakistani BBQ',
    'Seekh Kebab',
    'Chicken Tikka',
    'Malai Boti',
    'Fire Grilled',
    'Charcoal BBQ',
    'Signature Platter',
    'Authentic Pakistani Restaurant',
  ],
  authors: [{ name: 'Tawakal BBQ' }],
  openGraph: {
    title: 'Tawakal BBQ | Authentic Fire-Grilled BBQ',
    description:
      'Where Fire Meets Flavor. Discover authentic charcoal-grilled delicacies, signature platters and a luxury dining atmosphere.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Tawakal BBQ',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tawakal BBQ | Authentic Fire-Grilled BBQ',
    description:
      'Experience authentic Pakistani BBQ at Tawakal BBQ — premium fire-grilled flavors & signature platters.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${cinzel.variable} ${bebasNeue.variable} dark scroll-smooth`}
    >
      <body className="bg-[#070707] text-[#F5F1EA] antialiased selection:bg-[#FF6A00] selection:text-black">
        {children}
      </body>
    </html>
  );
}

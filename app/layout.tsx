import type { Metadata, Viewport } from 'next';
import { Bebas_Neue, DM_Serif_Display, Inter, Noto_Nastaliq_Urdu } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { CartDrawer } from '@/components/CartDrawer';
import { StickyMobileCart } from '@/components/StickyMobileCart';

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
  title: 'Tawakal BBQ & Restaurant | Authentic Fire-Grilled BBQ & Online Ordering',
  description:
    'Order authentic Pakistani BBQ online at Tawakal Restaurant. Live charcoal tikkas, seekh kebabs, malai boti, rolls, fast food & premium deals.',
  keywords: [
    'Tawakal BBQ',
    'Tawakal Restaurant',
    'Pakistani BBQ',
    'Seekh Kebab',
    'Chicken Tikka',
    'Malai Boti',
    'Fire Grilled',
    'Akhtar Colony Karachi',
    'Online Food Delivery Karachi',
  ],
  authors: [{ name: 'Tawakal BBQ' }],
  openGraph: {
    title: 'Tawakal BBQ & Restaurant | Authentic Fire-Grilled BBQ',
    description:
      'Where Fire Meets Flavor. Discover authentic charcoal-grilled delicacies, signature platters and order online.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Tawakal BBQ',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tawakal BBQ & Restaurant',
    description:
      'Experience authentic Pakistani BBQ at Tawakal Restaurant — live charcoal-grilled flavors & fast online ordering.',
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
      className={`${bebasNeue.variable} ${dmSerifDisplay.variable} ${inter.variable} ${notoUrdu.variable} dark scroll-smooth`}
      suppressHydrationWarning
    >
      <body
        className="bg-[#11100E] text-[#F4EBDD] font-sans antialiased selection:bg-[#C83B22] selection:text-white"
        suppressHydrationWarning
      >
        <CartProvider>
          {children}
          <CartDrawer />
          <StickyMobileCart />
        </CartProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { ProductDetailClient } from './ProductDetailClient';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://tawakalbbq.com';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const item = await prisma.menuItem.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
      },
    });

    if (item) {
      const title = `${item.name} | Live Charcoal BBQ`;
      const description =
        item.description ||
        item.shortDescription ||
        `Order authentic ${item.name} online from Tawakal BBQ Karachi. Char-grilled over live wood embers for smoky Pakistani taste.`;

      return {
        title,
        description: description.slice(0, 160),
        alternates: {
          canonical: `/menu/${item.slug}`,
        },
        openGraph: {
          title,
          description: description.slice(0, 160),
          url: `${BASE_URL}/menu/${item.slug}`,
          siteName: 'Tawakal BBQ',
          images: [{ url: item.image || '/logo.png', alt: item.name }],
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description: description.slice(0, 160),
          images: [item.image || '/logo.png'],
        },
      };
    }
  } catch (e) {
    console.error('generateMetadata error for menu item:', e);
  }

  const formattedName = slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return {
    title: `${formattedName} | Live Charcoal BBQ`,
    description: `Order authentic ${formattedName} online from Tawakal Bar B.Q Karachi. Live charcoal grilled Pakistani delicacies.`,
    alternates: {
      canonical: `/menu/${slug}`,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  let itemData: any = null;

  try {
    itemData = await prisma.menuItem.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
      },
      include: { category: true },
    });
  } catch (e) {
    console.error('Error fetching item for JSON-LD:', e);
  }

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
      {
        '@type': 'ListItem',
        position: 3,
        name: itemData?.name || slug,
        item: `${BASE_URL}/menu/${slug}`,
      },
    ],
  };

  const productJsonLd = itemData
    ? {
        '@context': 'https://schema.org',
        '@type': 'MenuItem',
        name: itemData.name,
        description: itemData.description || itemData.shortDescription,
        image: itemData.image,
        offers: {
          '@type': 'Offer',
          price: itemData.price,
          priceCurrency: 'PKR',
          availability: itemData.isAvailable
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        },
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      <ProductDetailClient slug={slug} />
    </>
  );
}

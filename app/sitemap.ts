import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://tawakalbbq.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/menu`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/deals`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/location`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/reservation`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  try {
    const items = await prisma.menuItem.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });

    const itemRoutes: MetadataRoute.Sitemap = items.map((item) => ({
      url: `${BASE_URL}/menu/${item.slug}`,
      lastModified: item.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    return [...staticRoutes, ...itemRoutes];
  } catch (error) {
    console.error('Sitemap dynamic items fetch error:', error);
    return staticRoutes;
  }
}

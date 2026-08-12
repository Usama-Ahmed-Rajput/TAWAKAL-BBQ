import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const categories = await prisma.menuCategory.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    const items = await prisma.menuItem.findMany({
      include: { category: true },
      orderBy: [
        { category: { sortOrder: 'asc' } },
        { sortOrder: 'asc' },
      ],
    });

    return NextResponse.json({ categories, items });
  } catch (error) {
    console.error('Failed to fetch menu:', error);
    return NextResponse.json({ error: 'Failed to fetch menu data', categories: [], items: [] }, { status: 500 });
  }
}

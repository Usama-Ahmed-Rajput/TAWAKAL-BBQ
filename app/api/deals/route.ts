import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const deals = await prisma.deal.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ deals });
  } catch (error) {
    console.error('Failed to fetch deals:', error);
    return NextResponse.json({ error: 'Failed to fetch deals', deals: [] }, { status: 500 });
  }
}

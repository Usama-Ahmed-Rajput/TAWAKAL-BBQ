import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const branches = await prisma.branch.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json({ branches });
  } catch (error) {
    console.error('Failed to fetch branches', error);
    return NextResponse.json({ error: 'Failed to fetch branches' }, { status: 500 });
  }
}

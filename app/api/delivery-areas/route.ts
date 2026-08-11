import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const branchId = searchParams.get('branchId');

    const whereCondition: any = { isActive: true };
    if (branchId) {
      whereCondition.OR = [{ branchId }, { branchId: null }];
    }

    const areas = await prisma.deliveryArea.findMany({
      where: whereCondition,
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json({ areas });
  } catch (error) {
    console.error('Failed to fetch delivery areas', error);
    return NextResponse.json({ error: 'Failed to fetch delivery areas' }, { status: 500 });
  }
}
